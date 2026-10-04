const Dashboard = {

    getKPIData() {

        const totalProjects =
            DataStore.projects.length;

        const totalSets =
            DataStore.sets.length;

        const totalPanels =
            DataStore.panels.length;

        const totalProductionRecords =
            DataStore.production.length;

        const completedProductionRecords =
            DataStore.production.filter(
                record =>
                    record.status === "Completed"
            ).length;

        const overallProgress =
            totalProductionRecords > 0
                ? Math.round(
                    (
                        completedProductionRecords /
                        totalProductionRecords
                    ) * 100
                )
                : 0;

        return {

            totalProjects,

            totalSets,

            totalPanels,

            totalProductionRecords,

            completedProductionRecords,

            overallProgress

        };

    },


    getStatusSummary() {

        const summary = {};

        DataStore.production.forEach(
            record => {

                const status =
                    record.status || "Unknown";

                if (!summary[status]) {

                    summary[status] = 0;

                }

                summary[status]++;

            }
        );

        return summary;

    },


    getStageSummary() {

        const summary = {};

        DataStore.production.forEach(
            record => {

                const stage =
                    DataStore.getStageById(
                        record.stageId
                    );

                if (!stage) {

                    return;

                }

                if (!summary[stage.id]) {

                    summary[stage.id] = {

                        stageId:
                            stage.id,

                        stageName:
                            stage.name,

                        total: 0,

                        completed: 0,

                        progress: 0

                    };

                }

                summary[stage.id].total++;

                if (
                    record.status === "Completed"
                ) {

                    summary[stage.id].completed++;

                }

            }
        );


        Object.values(summary).forEach(
            stage => {

                stage.progress =
                    stage.total > 0
                        ? Math.round(
                            (
                                stage.completed /
                                stage.total
                            ) * 100
                        )
                        : 0;

            }
        );


        return summary;

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

            container.innerHTML = `
                <div class="empty-state">

                    <div class="empty-state-title">
                        No production data
                    </div>

                    <div class="empty-state-text">
                        No production status records are available.
                    </div>

                </div>
            `;

            return;

        }

        container.innerHTML =
            statuses.map(status => {

                return `
                    <div class="status-summary-row">

                        <div class="status-summary-name">
                            ${status}
                        </div>

                        <div class="status-summary-count">
                            ${summary[status]}
                        </div>

                    </div>
                `;

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

        const stages =
            Object.values(summary);

        if (stages.length === 0) {

            container.innerHTML = `
                <div class="empty-state">

                    <div class="empty-state-title">
                        No production data
                    </div>

                    <div class="empty-state-text">
                        No production stage records are available.
                    </div>

                </div>
            `;

            return;

        }

        container.innerHTML =
            stages.map(stage => {

                return `
                    <div class="stage-summary-row">

                        <div class="stage-summary-name">
                            ${stage.stageName}
                        </div>

                        <div class="stage-summary-total">
                            Total: ${stage.total}
                        </div>

                       <div class="stage-summary-completed">
    Completed: ${stage.completed}
</div>

<div class="stage-summary-progress">
    Progress: ${stage.progress}%
</div>

                    </div>
                `;

            }).join("");

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
                `${kpiData.overallProgress}%`;

        }


        this.renderStatusDistribution();

        this.renderStageSummary();

    }

};
