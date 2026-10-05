const Production = {

    /*
     * ============================================================
     * PRODUCTION MONITORING
     * ============================================================
     *
     * Project → Set → Panel → Stage → Status
     *
     * Current features:
     * - Production record loading
     * - Project filter
     * - Set filter
     * - Panel filter
     * - Stage filter
     * - Reset filters
     * - Production table rendering
     * - Status badges
     *
     * ============================================================
     */


    /*
     * ------------------------------------------------------------
     * FILTER STATE
     * ------------------------------------------------------------
     */

    filters: {
        projectId: "",
        setId: "",
        panelId: "",
        stageId: ""
    },


    /*
     * ------------------------------------------------------------
     * GET PRODUCTION RECORDS
     * ------------------------------------------------------------
     */

    getRecords() {

        let records =
            DataStore.production || [];


        if (this.filters.projectId) {

            records =
                records.filter(
                    record =>
                        record.projectId ===
                        this.filters.projectId
                );

        }


        if (this.filters.setId) {

            records =
                records.filter(
                    record =>
                        record.setId ===
                        this.filters.setId
                );

        }


        if (this.filters.panelId) {

            records =
                records.filter(
                    record =>
                        record.panelId ===
                        this.filters.panelId
                );

        }


        if (this.filters.stageId) {

            records =
                records.filter(
                    record =>
                        record.stageId ===
                        this.filters.stageId
                );

        }


        return records;

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

        return (
            '<span class="status-badge ' +
                this.getStatusClass(status) +
            '">' +
                status +
            '</span>'
        );

    },


    /*
     * ------------------------------------------------------------
     * GET FILTERED PROJECTS
     * ------------------------------------------------------------
     */

    getFilterProjects() {

        return DataStore.projects || [];

    },


    /*
     * ------------------------------------------------------------
     * GET FILTERED SETS
     * ------------------------------------------------------------
     */

    getFilterSets() {

        let sets =
            DataStore.sets || [];


        if (this.filters.projectId) {

            sets =
                sets.filter(
                    set =>
                        set.projectId ===
                        this.filters.projectId
                );

        }


        return sets;

    },


    /*
     * ------------------------------------------------------------
     * GET FILTERED PANELS
     * ------------------------------------------------------------
     */

    getFilterPanels() {

        let panels =
            DataStore.panels || [];


        if (this.filters.projectId) {

            panels =
                panels.filter(
                    panel =>
                        panel.projectId ===
                        this.filters.projectId
                );

        }


        if (this.filters.setId) {

            panels =
                panels.filter(
                    panel =>
                        panel.setId ===
                        this.filters.setId
                );

        }


        return panels;

    },


    /*
     * ------------------------------------------------------------
     * GET FILTER STAGES
     * ------------------------------------------------------------
     */

    getFilterStages() {

        return (
            DataStore.stages || []
        )
        .filter(stage =>
            stage.active !== false
        )
        .sort(
            (a, b) =>
                a.sequence - b.sequence
        );

    },


    /*
     * ------------------------------------------------------------
     * RENDER FILTER OPTIONS
     * ------------------------------------------------------------
     */

    renderFilterOptions() {

        const projectSelect =
            document.getElementById(
                "productionProjectFilter"
            );

        const setSelect =
            document.getElementById(
                "productionSetFilter"
            );

        const panelSelect =
            document.getElementById(
                "productionPanelFilter"
            );

        const stageSelect =
            document.getElementById(
                "productionStageFilter"
            );


        if (
            !projectSelect ||
            !setSelect ||
            !panelSelect ||
            !stageSelect
        ) {

            return;

        }


        /*
         * PROJECT
         */

        projectSelect.innerHTML =
            '<option value="">All Projects</option>' +

            this.getFilterProjects()
                .map(project =>

                    '<option value="' +
                        project.id +
                    '">' +

                        project.projectCode +
                        ' - ' +
                        project.projectName +

                    '</option>'

                )
                .join("");


        projectSelect.value =
            this.filters.projectId;


        /*
         * SET
         */

        setSelect.innerHTML =
            '<option value="">All Sets</option>' +

            this.getFilterSets()
                .map(set =>

                    '<option value="' +
                        set.id +
                    '">' +

                        set.setName +

                    '</option>'

                )
                .join("");


        setSelect.value =
            this.filters.setId;


        /*
         * PANEL
         */

        panelSelect.innerHTML =
            '<option value="">All Panels</option>' +

            this.getFilterPanels()
                .map(panel =>

                    '<option value="' +
                        panel.id +
                    '">' +

                        panel.panelCode +
                        ' - ' +
                        panel.panelName +

                    '</option>'

                )
                .join("");


        panelSelect.value =
            this.filters.panelId;


        /*
         * STAGE
         */

        stageSelect.innerHTML =
            '<option value="">All Stages</option>' +

            this.getFilterStages()
                .map(stage =>

                    '<option value="' +
                        stage.id +
                    '">' +

                        stage.sequence +
                        '. ' +
                        stage.name +

                    '</option>'

                )
                .join("");


        stageSelect.value =
            this.filters.stageId;

    },


    /*
     * ------------------------------------------------------------
     * SETUP FILTER EVENTS
     * ------------------------------------------------------------
     */

    setupFilters() {

        const projectSelect =
            document.getElementById(
                "productionProjectFilter"
            );

        const setSelect =
            document.getElementById(
                "productionSetFilter"
            );

        const panelSelect =
            document.getElementById(
                "productionPanelFilter"
            );

        const stageSelect =
            document.getElementById(
                "productionStageFilter"
            );

        const resetButton =
            document.getElementById(
                "productionResetFilters"
            );


        if (
            !projectSelect ||
            !setSelect ||
            !panelSelect ||
            !stageSelect
        ) {

            return;

        }


        /*
         * PROJECT CHANGE
         */

        projectSelect.onchange = () => {

            this.filters.projectId =
                projectSelect.value;

            this.filters.setId = "";
            this.filters.panelId = "";

            this.renderFilterOptions();

            this.renderTable();

            this.updateRecordCount();

        };


        /*
         * SET CHANGE
         */

        setSelect.onchange = () => {

            this.filters.setId =
                setSelect.value;

            this.filters.panelId = "";

            this.renderFilterOptions();

            this.renderTable();

            this.updateRecordCount();

        };


        /*
         * PANEL CHANGE
         */

        panelSelect.onchange = () => {

            this.filters.panelId =
                panelSelect.value;

            this.renderTable();

            this.updateRecordCount();

        };


        /*
         * STAGE CHANGE
         */

        stageSelect.onchange = () => {

            this.filters.stageId =
                stageSelect.value;

            this.renderTable();

            this.updateRecordCount();

        };


        /*
         * RESET
         */

        if (resetButton) {

            resetButton.onclick = () => {

                this.resetFilters();

            };

        }

    },


    /*
     * ------------------------------------------------------------
     * RESET FILTERS
     * ------------------------------------------------------------
     */

    resetFilters() {

        this.filters = {

            projectId: "",
            setId: "",
            panelId: "",
            stageId: ""

        };


        this.renderFilterOptions();

        this.renderTable();

        this.updateRecordCount();

    },


    /*
     * ------------------------------------------------------------
     * UPDATE RECORD COUNT
     * ------------------------------------------------------------
     */

    updateRecordCount() {

        const countElement =
            document.getElementById(
                "productionRecordCount"
            );

        if (!countElement) {

            return;

        }


        const count =
            this.getRecords().length;


        countElement.textContent =
            count +
            (
                count === 1
                    ? " record"
                    : " records"
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

                        'No production records match the selected filters.' +

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


        /*
         * PAGE HEADER
         */

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


        /*
         * FILTER CARD
         */

        html +=

            '<div class="card production-filter-card">' +

                '<div class="card-header">' +

                    '<div>' +

                        '<h2 class="card-title">' +
                            'Production Filters' +
                        '</h2>' +

                        '<p class="card-subtitle">' +
                            'Filter production records by project, set, panel or stage.' +
                        '</p>' +

                    '</div>' +

                '</div>' +


                '<div class="filter-grid">' +


                    /*
                     * PROJECT
                     */

                    '<div class="form-group">' +

                        '<label class="form-label">' +
                            'Project' +
                        '</label>' +

                        '<select ' +
                            'id="productionProjectFilter" ' +
                            'class="form-control"' +
                        '>' +

                            '<option value="">' +
                                'All Projects' +
                            '</option>' +

                        '</select>' +

                    '</div>' +


                    /*
                     * SET
                     */

                    '<div class="form-group">' +

                        '<label class="form-label">' +
                            'Set' +
                        '</label>' +

                        '<select ' +
                            'id="productionSetFilter" ' +
                            'class="form-control"' +
                        '>' +

                            '<option value="">' +
                                'All Sets' +
                            '</option>' +

                        '</select>' +

                    '</div>' +


                    /*
                     * PANEL
                     */

                    '<div class="form-group">' +

                        '<label class="form-label">' +
                            'Panel' +
                        '</label>' +

                        '<select ' +
                            'id="productionPanelFilter" ' +
                            'class="form-control"' +
                        '>' +

                            '<option value="">' +
                                'All Panels' +
                            '</option>' +

                        '</select>' +

                    '</div>' +


                    /*
                     * STAGE
                     */

                    '<div class="form-group">' +

                        '<label class="form-label">' +
                            'Stage' +
                        '</label>' +

                        '<select ' +
                            'id="productionStageFilter" ' +
                            'class="form-control"' +
                        '>' +

                            '<option value="">' +
                                'All Stages' +
                            '</option>' +

                        '</select>' +

                    '</div>' +


                    /*
                     * RESET
                     */

                    '<div class="form-group filter-action">' +

                        '<label class="form-label">' +
                            '&nbsp;' +
                        '</label>' +

                        '<button ' +
                            'type="button" ' +
                            'id="productionResetFilters" ' +
                            'class="btn btn-secondary"' +
                        '>' +

                            'Reset Filters' +

                        '</button>' +

                    '</div>' +


                '</div>' +

            '</div>';


        /*
         * PRODUCTION TABLE
         */

        html +=

            '<div class="card">' +

                '<div class="card-header">' +

                    '<div>' +

                        '<h2 class="card-title">' +
                            'Production Records' +
                        '</h2>' +

                        '<p ' +
                            'class="card-subtitle" ' +
                            'id="productionRecordCount"' +
                        '>' +

                            records.length +
                            (
                                records.length === 1
                                    ? ' record'
                                    : ' records'
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


        /*
         * INITIALIZE FILTERS
         */

        this.renderFilterOptions();

        this.setupFilters();

        this.renderTable();

        this.updateRecordCount();

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
