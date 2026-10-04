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

        console.log(
            "Dashboard KPI Data:",
            kpiData
        );

    }

};
