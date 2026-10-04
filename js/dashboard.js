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

},

};
