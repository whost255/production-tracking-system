const History = {

    filters: {
        projectId: "",
        setId: "",
        panelId: "",
        stageId: ""
    },

    getRecords() {
        return DataStore.history || [];
    },

    getProject(projectId) {
        return DataStore.getProjectById(projectId);
    },

    getSet(setId) {
        return DataStore.getSetById(setId);
    },

    getPanel(panelId) {
        return DataStore.getPanelById(panelId);
    },

    getStage(stageId) {
        return DataStore.getStageById(stageId);
    },

    formatDateTime(value) {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString();
    },

    getFilteredRecords() {

        return this.getRecords().filter(record => {

            if (
                this.filters.projectId &&
                record.projectId !== this.filters.projectId
            ) {
                return false;
            }

            if (
                this.filters.setId &&
                record.setId !== this.filters.setId
            ) {
                return false;
            }

            if (
                this.filters.panelId &&
                record.panelId !== this.filters.panelId
            ) {
                return false;
            }

            if (
                this.filters.stageId &&
                record.stageId !== this.filters.stageId
            ) {
                return false;
            }

            return true;
        });
    },

    renderFilters() {

        const projectSelect =
            document.getElementById("historyProjectFilter");

        const setSelect =
            document.getElementById("historySetFilter");

        const panelSelect =
            document.getElementById("historyPanelFilter");

        const stageSelect =
            document.getElementById("historyStageFilter");

        if (!projectSelect) {
            return;
        }

        projectSelect.innerHTML =
            `<option value="">All Projects</option>`;

        (DataStore.projects || []).forEach(project => {

            projectSelect.innerHTML += `
                <option value="${project.id}">
                    ${project.projectCode} - ${project.projectName}
                </option>
            `;
        });

        setSelect.innerHTML =
            `<option value="">All Sets</option>`;

        (DataStore.sets || []).forEach(set => {

            setSelect.innerHTML += `
                <option value="${set.id}">
                    ${set.setName}
                </option>
            `;
        });

        panelSelect.innerHTML =
            `<option value="">All Panels</option>`;

        (DataStore.panels || []).forEach(panel => {

            panelSelect.innerHTML += `
                <option value="${panel.id}">
                    ${panel.panelName}
                </option>
            `;
        });

        stageSelect.innerHTML =
            `<option value="">All Stages</option>`;

        (DataStore.stages || []).forEach(stage => {

            stageSelect.innerHTML += `
                <option value="${stage.id}">
                    ${stage.name}
                </option>
            `;
        });

        projectSelect.value = this.filters.projectId;
        setSelect.value = this.filters.setId;
        panelSelect.value = this.filters.panelId;
        stageSelect.value = this.filters.stageId;
    },

    renderTable() {

        const tbody =
            document.getElementById("historyTableBody");

        if (!tbody) {
            return;
        }

        const records = this.getFilteredRecords();

        tbody.innerHTML = "";

        if (!records.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="empty-state">
                        No history records found.
                    </td>
                </tr>
            `;

            return;
        }

        const sortedRecords = [...records].sort((a, b) => {

            const dateA =
                new Date(a.changedAt || 0).getTime();

            const dateB =
                new Date(b.changedAt || 0).getTime();

            return dateB - dateA;
        });

        sortedRecords.forEach(record => {

            const project =
                this.getProject(record.projectId);

            const set =
                this.getSet(record.setId);

            const panel =
                this.getPanel(record.panelId);

            const stage =
                this.getStage(record.stageId);

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>
                    ${project ? project.projectCode : "-"}
                </td>

                <td>
                    ${set ? set.setName : "-"}
                </td>

                <td>
                    ${panel ? panel.panelName : "-"}
                </td>

                <td>
                    ${stage ? stage.name : "-"}
                </td>

                <td>
                    ${record.previousStatus || "-"}
                </td>

                <td>
                    ${record.newStatus || "-"}
                </td>

                <td>
                    ${record.remarks || "-"}
                </td>

                <td>
                    ${this.formatDateTime(record.changedAt)}
                </td>

                <td>
                    ${record.changedBy || "-"}
                </td>
            `;

            tbody.appendChild(row);
        });
    },

    updateRecordCount() {

        const countElement =
            document.getElementById("historyRecordCount");

        if (!countElement) {
            return;
        }

        const count =
            this.getFilteredRecords().length;

        countElement.textContent =
            `${count} record${count === 1 ? "" : "s"}`;
    },

    applyFilters() {

        this.filters.projectId =
            document.getElementById("historyProjectFilter")?.value || "";

        this.filters.setId =
            document.getElementById("historySetFilter")?.value || "";

        this.filters.panelId =
            document.getElementById("historyPanelFilter")?.value || "";

        this.filters.stageId =
            document.getElementById("historyStageFilter")?.value || "";

        this.renderTable();
        this.updateRecordCount();
    },

    resetFilters() {

        this.filters = {
            projectId: "",
            setId: "",
            panelId: "",
            stageId: ""
        };

        this.renderFilters();
        this.renderTable();
        this.updateRecordCount();
    },

    setupEvents() {

        const applyButton =
            document.getElementById("historyApplyFilters");

        const resetButton =
            document.getElementById("historyResetFilters");

        const projectFilter =
            document.getElementById("historyProjectFilter");

        const setFilter =
            document.getElementById("historySetFilter");

        const panelFilter =
            document.getElementById("historyPanelFilter");

        const stageFilter =
            document.getElementById("historyStageFilter");

        applyButton?.addEventListener(
            "click",
            () => this.applyFilters()
        );

        resetButton?.addEventListener(
            "click",
            () => this.resetFilters()
        );

        [
            projectFilter,
            setFilter,
            panelFilter,
            stageFilter
        ].forEach(select => {

            select?.addEventListener(
                "change",
                () => this.applyFilters()
            );
        });
    },

    render() {

        this.renderFilters();
        this.setupEvents();
        this.renderTable();
        this.updateRecordCount();
    },

    refresh() {

        this.render();
    }
};
