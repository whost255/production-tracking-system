const PanelDetail = {

    currentPanelId: null,

    render(panelId) {

        this.currentPanelId = panelId;

        const panel = DataStore.getPanelById(panelId);

        if (!panel) {
            console.error("Panel not found:", panelId);
            return;
        }

        const project = DataStore.getProjectById(panel.projectId);
        const set = DataStore.getSetById(panel.setId);

        // Generate missing production records
        DataStore.generateProductionRecords(
            panel.projectId,
            panel.setId,
            panel.id
        );

        this.renderPanelInformation(
            panel,
            project,
            set
        );

        this.renderStages(panel);

        this.renderHistory(panel);

        this.showPage();

    },


    renderPanelInformation(panel, project, set) {

        const projectElement =
            document.getElementById("panelDetailProject");

        const setElement =
            document.getElementById("panelDetailSet");

        const codeElement =
            document.getElementById("panelDetailCode");

        const nameElement =
            document.getElementById("panelDetailName");

        const typeElement =
            document.getElementById("panelDetailType");

        const quantityElement =
            document.getElementById("panelDetailQuantity");


        if (projectElement) {

            projectElement.textContent =
                project
                    ? `${project.projectCode} - ${project.projectName}`
                    : "-";

        }


        if (setElement) {

            setElement.textContent =
                set
                    ? set.setName
                    : "-";

        }


        if (codeElement) {

            codeElement.textContent =
                panel.panelCode || "-";

        }


        if (nameElement) {

            nameElement.textContent =
                panel.panelName || "-";

        }


        if (typeElement) {

            typeElement.textContent =
                panel.panelType || "-";

        }


        if (quantityElement) {

            quantityElement.textContent =
                panel.quantity ?? "-";

        }

    },


    renderStages(panel) {

        const container =
            document.getElementById("panelDetailStages");

        if (!container) {
            return;
        }


        const productionRecords =
            DataStore.getProductionByPanel(panel.id);


        const activeStages =
            DataStore.stages
                .filter(stage => stage.active)
                .sort(
                    (a, b) =>
                        a.sequence - b.sequence
                );


        if (!activeStages.length) {

            container.innerHTML = `
                <div class="empty-state">

                    <div class="empty-state-title">
                        No stages available
                    </div>

                    <div class="empty-state-text">
                        No active production stages are configured.
                    </div>

                </div>
            `;

            return;
        }


        const completedStatuses = [
            "Completed",
            "Quality Approved"
        ];


        let completedCount = 0;


        const rows = activeStages.map(stage => {

            const record =
                productionRecords.find(
                    item =>
                        item.stageId === stage.id
                );


            const status =
                record
                    ? record.status
                    : "Pending";


            if (completedStatuses.includes(status)) {
                completedCount++;
            }


            const remarks =
                record?.remarks || "-";


            const updatedAt =
                record?.updatedAt
                    ? this.formatDateTime(
                        record.updatedAt
                    )
                    : "-";


            const statusClass =
                this.getStatusClass(status);


            return `

                <div class="production-stage-cell panel-stage-row">

                    <div class="panel-stage-name">

                        <strong>
                            ${this.escapeHtml(
                                stage.name
                            )}
                        </strong>

                        <span>
                            Stage ${stage.sequence}
                        </span>

                    </div>


                    <div>

                        <span
                            class="status-badge ${statusClass}"
                        >
                            ${this.escapeHtml(status)}
                        </span>

                    </div>


                    <div class="panel-stage-remarks">

                        ${this.escapeHtml(
                            remarks
                        )}

                    </div>


                    <div class="panel-stage-updated">

                        ${updatedAt}

                    </div>


                    <div>

                        <button
                            type="button"
                            class="btn btn-secondary btn-small"
                            onclick="PanelDetail.editStage('${panel.id}', '${stage.id}')"
                        >
                            Edit
                        </button>

                    </div>

                </div>

            `;

        }).join("");


        const progress =
            activeStages.length
                ? Math.round(
                    (
                        completedCount /
                        activeStages.length
                    ) * 100
                )
                : 0;


        container.innerHTML = `

            <div class="progress-container">

                <div
                    class="progress-bar"
                    style="width: ${progress}%"
                ></div>

                <div class="progress-value">
                    ${progress}% Complete
                </div>

            </div>


            <div class="panel-stage-list">

                ${rows}

            </div>

        `;

    },


    renderHistory(panel) {

        const tbody =
            document.getElementById(
                "panelDetailHistoryBody"
            );

        const countElement =
            document.getElementById(
                "panelDetailHistoryCount"
            );


        if (!tbody) {
            return;
        }


        const records =
            DataStore.getHistoryByPanel(
                panel.id
            );


        if (countElement) {

            countElement.textContent =
                `${records.length} ${
                    records.length === 1
                        ? "record"
                        : "records"
                }`;

        }


        if (!records.length) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="empty-state"
                    >
                        No history records found.
                    </td>

                </tr>

            `;

            return;
        }


        const sortedRecords =
            [...records].sort(
                (a, b) =>
                    new Date(b.changedAt) -
                    new Date(a.changedAt)
            );


        tbody.innerHTML =
            sortedRecords.map(record => {

                const stage =
                    DataStore.getStageById(
                        record.stageId
                    );


                return `

                    <tr>

                        <td>
                            ${this.escapeHtml(
                                stage
                                    ? stage.name
                                    : "-"
                            )}
                        </td>

                        <td>
                            ${this.escapeHtml(
                                record.previousStatus || "-"
                            )}
                        </td>

                        <td>

                            <span
                                class="status-badge ${this.getStatusClass(record.newStatus)}"
                            >
                                ${this.escapeHtml(
                                    record.newStatus || "-"
                                )}
                            </span>

                        </td>

                        <td>
                            ${this.escapeHtml(
                                record.remarks || "-"
                            )}
                        </td>

                        <td>
                            ${this.formatDateTime(
                                record.changedAt
                            )}
                        </td>

                        <td>
                            ${this.escapeHtml(
                                record.changedBy || "-"
                            )}
                        </td>

                    </tr>

                `;

            }).join("");

    },


    editStage(panelId, stageId) {

        if (
            typeof Production !== "undefined" &&
            typeof Production.openStageEditor === "function"
        ) {

            Production.openStageEditor(
                panelId,
                stageId
            );

        } else {

            console.error(
                "Production.openStageEditor() is not available."
            );

        }

    },


    showPage() {

        document
            .querySelectorAll(".page")
            .forEach(page => {
                page.classList.remove("active");
            });


        const page =
            document.getElementById(
                "panelDetailPage"
            );


        if (page) {

            page.classList.add("active");

        }

    },


    formatDateTime(value) {

        if (!value) {
            return "-";
        }


        const date =
            new Date(value);


        if (Number.isNaN(date.getTime())) {
            return "-";
        }


        return date.toLocaleString();

    },


    getStatusClass(status) {

        if (!status) {
            return "status-pending";
        }


        return `status-${String(status)
            .toLowerCase()
            .replace(/\s+/g, "-")}`;

    },


    escapeHtml(value) {

        if (value === null || value === undefined) {
            return "";
        }


        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }

};
