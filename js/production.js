const Production = {

    /*
     * ============================================================
     * PRODUCTION MONITORING
     * ============================================================
     *
     * Structure:
     * Project → Set → Panel → Stage → Status
     *
     * This module is responsible for:
     * - Production data filtering
     * - Production table rendering
     * - Status display
     * - Production record lookup
     *
     * Stage editing, history, search, filters and export
     * will be added in later phases.
     *
     * ============================================================
     */


    /*
     * ------------------------------------------------------------
     * GET PRODUCTION RECORDS
     * ------------------------------------------------------------
     */

    getRecords() {

        const selectedProjectId =
            App.currentProjectId;

        if (selectedProjectId) {

            return DataStore.production.filter(
                record =>
                    record.projectId ===
                    selectedProjectId
            );

        }

        return DataStore.production || [];
    },


    /*
     * ------------------------------------------------------------
     * GET PROJECT
     * ------------------------------------------------------------
     */

    getProject(projectId) {

        return DataStore.getProjectById(
            projectId
        );

    },


    /*
     * ------------------------------------------------------------
     * GET SET
     * ------------------------------------------------------------
     */

    getSet(setId) {

        return DataStore.getSetById(
            setId
        );

    },


    /*
     * ------------------------------------------------------------
     * GET PANEL
     * ------------------------------------------------------------
     */

    getPanel(panelId) {

        return DataStore.getPanelById(
            panelId
        );

    },


    /*
     * ------------------------------------------------------------
     * GET STAGE
     * ------------------------------------------------------------
     */

    getStage(stageId) {

        return DataStore.getStageById(
            stageId
        );

    },


    /*
     * ------------------------------------------------------------
     * GET STATUS CLASS
     * ------------------------------------------------------------
     */

    getStatusClass(status) {

        const statusClasses = {

            "Pending":
                "status-pending",

            "WIP":
                "status-wip",

            "Completed":
                "status-completed",

            "Quality Offer":
                "status-quality-offer",

            "Quality Approved":
                "status-approved",

            "Quality Rejected":
                "status-rejected",

            "Rework":
                "status-rework",

            "Hold":
                "status-hold"

        };

        return (
            statusClasses[status] ||
            "status-pending"
        );

    },


    /*
     * ------------------------------------------------------------
     * CREATE STATUS BADGE
     * ------------------------------------------------------------
     */

    createStatusBadge(status) {

        if (!status) {

            return (
                '<span class="status-badge status-pending">' +
                    'Unknown' +
                '</span>'
            );

        }

        const statusClass =
            this.getStatusClass(status);

        return (
            '<span class="status-badge ' +
                statusClass +
            '">' +
                status +
            '</span>'
        );

    },


    /*
     * ------------------------------------------------------------
     * CREATE PRODUCTION ROW
     * ------------------------------------------------------------
     */

    createRow(record) {

        const project =
            this.getProject(
                record.projectId
            );

        const set =
            this.getSet(
                record.setId
            );

        const panel =
            this.getPanel(
                record.panelId
            );

        const stage =
            this.getStage(
                record.stageId
            );

        return (
            '<tr>' +

                '<td>' +
                    (
                        project
                            ? project.projectCode
                            : '-'
                    ) +
                '</td>' +

                '<td>' +
                    (
                        set
                            ? set.setName
                            : '-'
                    ) +
                '</td>' +

                '<td>' +
                    (
                        panel
                            ? panel.panelName
                            : '-'
                    ) +
                '</td>' +

                '<td>' +
                    (
                        stage
                            ? stage.name
                            : '-'
                    ) +
                '</td>' +

                '<td>' +
                    this.createStatusBadge(
                        record.status
                    ) +
                '</td>' +

                '<td>' +
                    (
                        record.remarks ||
                        '-'
                    ) +
                '</td>' +

                '<td>' +
                    (
                        record.updatedAt ||
                        '-'
                    ) +
                '</td>' +

            '</tr>'
        );

    },


    /*
     * ------------------------------------------------------------
     * RENDER PRODUCTION TABLE
     * ------------------------------------------------------------
     */

    renderTable() {

        const tbody =
            document.getElementById(
                "productionTableBody"
            );

        if (!tbody) {

            return;

        }

        const records =
            this.getRecords();

        if (records.length === 0) {

            tbody.innerHTML =
                '<tr>' +

                    '<td ' +
                        'colspan="7" ' +
                        'class="text-center"' +
                    '>' +

                        'No production records available.' +

                    '</td>' +

                '</tr>';

            return;

        }

        tbody.innerHTML =
            records
                .map(record =>
                    this.createRow(record)
                )
                .join("");

    },


    /*
     * ------------------------------------------------------------
     * RENDER PRODUCTION PAGE
     * ------------------------------------------------------------
     */

    render() {

        const container =
            document.getElementById(
                "productionPage"
            );

        if (!container) {

            return;

        }

        const records =
            this.getRecords();

        let html = '';

        html +=
            '<div class="page-header">' +

                '<div>' +

                    '<h1 class="page-title">' +
                        'Production Monitoring' +
                    '</h1>' +

                    '<p class="page-subtitle">' +
                        'Monitor production progress by project, set, panel and stage.' +
                    '</p>' +

                '</div>' +

            '</div>';


        html +=
            '<div class="card">' +

                '<div class="card-header">' +

                    '<div>' +

                        '<h2 class="card-title">' +
                            'Production Records' +
                        '</h2>' +

                        '<p class="card-subtitle">' +

                            records.length +
                            ' production record' +
                            (
                                records.length === 1
                                    ? ''
                                    : 's'
                            ) +

                        '</p>' +

                    '</div>' +

                '</div>' +


                '<div class="table-container">' +

                    '<table class="data-table">' +

                        '<thead>' +

                            '<tr>' +

                                '<th>Project</th>' +

                                '<th>Set</th>' +

                                '<th>Panel</th>' +

                                '<th>Stage</th>' +

                                '<th>Status</th>' +

                                '<th>Remarks</th>' +

                                '<th>Last Updated</th>' +

                            '</tr>' +

                        '</thead>' +

                        '<tbody id="productionTableBody">' +
                        '</tbody>' +

                    '</table>' +

                '</div>' +

            '</div>';


        container.innerHTML =
            html;


        this.renderTable();

    },


    /*
     * ------------------------------------------------------------
     * REFRESH
     * ------------------------------------------------------------
     */

    refresh() {

        this.render();

    }

};
