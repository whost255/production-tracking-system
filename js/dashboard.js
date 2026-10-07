const Dashboard = {


        /*
     * ============================================================
     * PRODUCTION PROGRESS ENGINE
     * ============================================================
     */

    getProgressEngine(projectId = null) {

        let panels =
            DataStore.panels || [];

        let stages =
            (DataStore.stages || [])
                .filter(stage => stage.active !== false)
                .sort(
                    (a, b) =>
                        a.sequence - b.sequence
                );


        if (projectId) {

            panels =
                panels.filter(
                    panel =>
                        panel.projectId === projectId
                );

        }


        const totalPanels =
            panels.length;

        const totalStagesPerPanel =
            stages.length;

        const totalStageRecords =
            totalPanels *
            totalStagesPerPanel;


        let completedStages = 0;
        let wipStages = 0;
        let pendingStages = 0;
        let reworkStages = 0;
        let holdStages = 0;
        let qualityOfferStages = 0;


        panels.forEach(panel => {

            stages.forEach(stage => {

                const record =
                    DataStore.getProductionRecord(
                        panel.id,
                        stage.id
                    );


                const status =
                    record
                        ? record.status
                        : "Pending";


                switch (status) {

                    case "Completed":
                    case "Quality Approved":

                        completedStages++;

                        break;


                    case "WIP":

                        wipStages++;

                        break;


                    case "Rework":

                        reworkStages++;

                        break;


                    case "Hold":

                        holdStages++;

                        break;


                    case "Quality Offer":
                    case "Quality Rejected":

                        qualityOfferStages++;

                        break;


                    case "Pending":

                    default:

                        pendingStages++;

                        break;

                }

            });

        });


        const overallProgress =
            totalStageRecords > 0
                ? Math.round(
                    (
                        completedStages /
                        totalStageRecords
                    ) * 100
                )
                : 0;


        return {

            totalPanels,

            totalStagesPerPanel,

            totalStageRecords,

            completedStages,

            wipStages,

            pendingStages,

            reworkStages,

            holdStages,

            qualityOfferStages,

            overallProgress

        };

    },
    
    getKPIData() {

        const selectedProjectId = App.currentProjectId;

        const filteredProjects = selectedProjectId
            ? DataStore.projects.filter(
                project => project.id === selectedProjectId
            )
            : DataStore.projects;

        const filteredSets = selectedProjectId
            ? DataStore.sets.filter(
                set => set.projectId === selectedProjectId
            )
            : DataStore.sets;

        const filteredPanels = selectedProjectId
            ? DataStore.panels.filter(
                panel => panel.projectId === selectedProjectId
            )
            : DataStore.panels;

        const filteredProduction = selectedProjectId
            ? DataStore.production.filter(
                record => record.projectId === selectedProjectId
            )
            : DataStore.production;

        const totalProjects = filteredProjects.length;

        const totalSets = filteredSets.length;

        const totalPanels = filteredPanels.length;

        const totalProductionRecords =
            filteredProduction.length;

      const progressData =
    this.getProgressEngine(
        selectedProjectId
    );

const completedProductionRecords =
    progressData.completedStages;

const overallProgress =
    progressData.overallProgress;

        return {
            totalProjects: totalProjects,
            totalSets: totalSets,
            totalPanels: totalPanels,
            totalProductionRecords: totalProductionRecords,
            completedProductionRecords: completedProductionRecords,
            overallProgress: overallProgress
        };
    },


    refresh() {

        this.render();

    },


    getStatusSummary() {

        const selectedProjectId = App.currentProjectId;

        const records = selectedProjectId
            ? DataStore.production.filter(
                record => record.projectId === selectedProjectId
            )
            : DataStore.production;

        const summary = {};

        records.forEach(record => {

            const status = record.status || "Unknown";

            if (!summary[status]) {

                summary[status] = 0;

            }

            summary[status]++;

        });

        return summary;
    },


    getStageSummary() {

        const selectedProjectId = App.currentProjectId;

        const records = selectedProjectId
            ? DataStore.production.filter(
                record => record.projectId === selectedProjectId
            )
            : DataStore.production;

        const summary = {};

        records.forEach(record => {

            const stage =
                DataStore.getStageById(record.stageId);

            if (!stage) {

                return;

            }

            if (!summary[stage.id]) {

                summary[stage.id] = {

                    stageId: stage.id,

                    stageName: stage.name,

                    total: 0,

                    completed: 0,

                    progress: 0

                };

            }

            summary[stage.id].total++;

            if (record.status === "Completed") {

                summary[stage.id].completed++;

            }

        });

        Object.values(summary).forEach(stage => {

            stage.progress =
                stage.total > 0
                    ? Math.round(
                        (
                            stage.completed /
                            stage.total
                        ) * 100
                    )
                    : 0;

        });

        return summary;
    },


    getProjectProgress(projectId) {

        const records =
            DataStore.getProductionByProject(projectId);

        if (records.length === 0) {

            return 0;

        }

        const completedRecords =
            records.filter(
                record => record.status === "Completed"
            ).length;

        return Math.round(
            (
                completedRecords /
                records.length
            ) * 100
        );
    },


    getProductionOverview() {

        let records =
            DataStore.production || [];

        if (App.currentProjectId) {

            records =
                records.filter(
                    record =>
                        record.projectId ===
                        App.currentProjectId
                );

        }

        const overview = {

            Pending: 0,

            WIP: 0,

            Completed: 0,

            Rework: 0,

            Hold: 0,

            "Quality Offer": 0

        };

        records.forEach(record => {

            if (
                Object.prototype.hasOwnProperty.call(
                    overview,
                    record.status
                )
            ) {

                overview[record.status]++;

            }

        });

        return overview;
    },


    renderProductionOverview() {

        const overview =
            this.getProductionOverview();

        const elements = {

            Pending:
                document.getElementById(
                    "productionPendingCount"
                ),

            WIP:
                document.getElementById(
                    "productionWipCount"
                ),

            Completed:
                document.getElementById(
                    "productionCompletedCount"
                ),

            Rework:
                document.getElementById(
                    "productionReworkCount"
                ),

            Hold:
                document.getElementById(
                    "productionHoldCount"
                ),

            "Quality Offer":
                document.getElementById(
                    "productionQualityOfferCount"
                )

        };

        Object.keys(elements).forEach(status => {

            if (elements[status]) {

                elements[status].textContent =
                    overview[status];

            }

        });

    },


    renderStatusDistribution() {

        const container =
            document.getElementById(
                "statusDistribution"
            );

        if (!container) {

            return;

        }

        const summary =
            this.getStatusSummary();

        const statuses =
            Object.keys(summary);

        if (statuses.length === 0) {

            container.innerHTML =
                '<div class="empty-state">' +
                    '<div class="empty-state-title">' +
                        'No production data' +
                    '</div>' +
                    '<div class="empty-state-text">' +
                        'No production status records are available.' +
                    '</div>' +
                '</div>';

            return;

        }

        container.innerHTML =
            statuses.map(status => {

                return (
                    '<div class="status-summary-row">' +

                        '<div class="status-summary-name">' +
                            status +
                        '</div>' +

                        '<div class="status-summary-count">' +
                            summary[status] +
                        '</div>' +

                    '</div>'
                );

            }).join("");

    },


    renderStageSummary() {

        const container =
            document.getElementById(
                "stageSummary"
            );

        if (!container) {

            return;

        }

        const summary =
            this.getStageSummary();

        const stageList =
            Object.values(summary);

        if (stageList.length === 0) {

            container.innerHTML =
                '<div class="empty-state">' +
                    '<div class="empty-state-title">' +
                        'No production data' +
                    '</div>' +
                    '<div class="empty-state-text">' +
                        'No production stage records are available.' +
                    '</div>' +
                '</div>';

            return;

        }

        container.innerHTML =
            stageList.map(stage => {

                return (
                    '<div class="stage-summary-row">' +

                        '<div class="stage-summary-name">' +
                            stage.stageName +
                        '</div>' +

                        '<div class="stage-summary-total">' +
                            'Total: ' + stage.total +
                        '</div>' +

                        '<div class="stage-summary-completed">' +
                            'Completed: ' + stage.completed +
                        '</div>' +

                        '<div class="stage-summary-progress">' +
                            'Progress: ' + stage.progress + '%' +
                        '</div>' +

                    '</div>'
                );

            }).join("");

    },


    renderProjectProgress() {

        const container =
            document.getElementById(
                "projectProgress"
            );

        if (!container) {

            return;

        }

        const selectedProjectId =
            App.currentProjectId;

        const projectList =
            selectedProjectId
                ? DataStore.projects.filter(
                    project =>
                        project.id === selectedProjectId
                )
                : DataStore.projects;

        if (projectList.length === 0) {

            container.innerHTML =
                '<div class="empty-state">' +
                    '<div class="empty-state-title">' +
                        'No projects' +
                    '</div>' +
                    '<div class="empty-state-text">' +
                        'No projects are available.' +
                    '</div>' +
                '</div>';

            return;

        }

        container.innerHTML =
            projectList.map(project => {

                const progress =
                    this.getProjectProgress(
                        project.id
                    );

                return (
                    '<div class="project-progress-row">' +

                        '<div class="project-progress-info">' +

                            '<div class="project-progress-name">' +
                                project.projectName +
                            '</div>' +

                            '<div class="project-progress-code">' +
                                project.projectCode +
                            '</div>' +

                        '</div>' +

                        '<div class="project-progress-bar-container">' +

                            '<div ' +
                                'class="project-progress-bar" ' +
                                'style="width: ' + progress + '%"' +
                            '></div>' +

                        '</div>' +

                        '<div class="project-progress-value">' +
                            progress + '%' +
                        '</div>' +

                    '</div>'
                );

            }).join("");

    },


    renderProjectFilter() {

        const select =
            document.getElementById(
                "dashboardProjectSelect"
            );

        if (!select) {

            return;

        }

        const currentValue =
            App.currentProjectId || "all";

        const projectList =
            DataStore.projects;

        select.innerHTML =
            '<option value="all">' +
                'All Projects' +
            '</option>';

        projectList.forEach(project => {

            const option =
                document.createElement("option");

            option.value =
                project.id;

            option.textContent =
                project.projectCode +
                " - " +
                project.projectName;

            select.appendChild(option);

        });

        select.value =
            currentValue;

    },


    setupProjectFilter() {

        const select =
            document.getElementById(
                "dashboardProjectSelect"
            );

        if (!select) {

            return;

        }

        if (
            select.dataset.listenerAttached ===
            "true"
        ) {

            return;

        }

        select.addEventListener(
            "change",
            () => {

                const projectId =
                    select.value;

                if (projectId === "all") {

                    App.currentProjectId =
                        null;

                } else {

                    App.currentProjectId =
                        projectId;

                }

                this.render();

            }
        );

        select.dataset.listenerAttached =
            "true";

    },


    render() {

        const kpiData =
            this.getKPIData();

        const totalProjects =
            document.getElementById(
                "kpiTotalProjects"
            );

        const totalSets =
            document.getElementById(
                "kpiTotalSets"
            );

        const totalPanels =
            document.getElementById(
                "kpiTotalPanels"
            );

        const totalProduction =
            document.getElementById(
                "kpiTotalProduction"
            );

        const completedProduction =
            document.getElementById(
                "kpiCompletedProduction"
            );

        const overallProgress =
            document.getElementById(
                "kpiOverallProgress"
            );

        if (totalProjects) {

            totalProjects.textContent =
                kpiData.totalProjects;

        }

        if (totalSets) {

            totalSets.textContent =
                kpiData.totalSets;

        }

        if (totalPanels) {

            totalPanels.textContent =
                kpiData.totalPanels;

        }

        if (totalProduction) {

            totalProduction.textContent =
                kpiData.totalProductionRecords;

        }

        if (completedProduction) {

            completedProduction.textContent =
                kpiData.completedProductionRecords;

        }

        if (overallProgress) {

            overallProgress.textContent =
                kpiData.overallProgress + "%";

        }

        this.renderStatusDistribution();

        this.renderStageSummary();

        this.renderProjectProgress();

        this.renderProjectFilter();

        this.renderProductionOverview();

        this.setupProjectFilter();

    }

};
