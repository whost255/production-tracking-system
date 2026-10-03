const DataStore = {

    projects: [],
    sets: [],
    panels: [],
    stages: [],
    production: [],
    history: [],


    async loadJSON(file) {

        const response =
            await fetch(file);

        if (!response.ok) {

            throw new Error(
                `Failed to load ${file}`
            );

        }

        return await response.json();

    },


    async loadAll() {

        try {

            const [
                projectsData,
                setsData,
                panelsData,
                stagesData,
                productionData,
                historyData
            ] = await Promise.all([

                this.loadJSON(
                    "data/projects.json"
                ),

                this.loadJSON(
                    "data/sets.json"
                ),

                this.loadJSON(
                    "data/panels.json"
                ),

                this.loadJSON(
                    "data/stages.json"
                ),

                this.loadJSON(
                    "data/production.json"
                ),

                this.loadJSON(
                    "data/history.json"
                )

            ]);


            this.projects =
                projectsData.projects || [];

            this.sets =
                setsData.sets || [];

            this.panels =
                panelsData.panels || [];

            this.stages =
                stagesData.stages || [];

            this.production =
                productionData.production || [];

            this.history =
                historyData.history || [];


            console.log(
                "Production data loaded successfully."
            );


            return true;

        } catch (error) {

            console.error(
                "Data loading error:",
                error
            );

            return false;

        }

    },


    getProjectById(projectId) {

        return this.projects.find(
            project => project.id === projectId
        );

    },


    getSetById(setId) {

        return this.sets.find(
            set => set.id === setId
        );

    },


    getPanelById(panelId) {

        return this.panels.find(
            panel => panel.id === panelId
        );

    },


    getStageById(stageId) {

        return this.stages.find(
            stage => stage.id === stageId
        );

    },


    getSetsByProject(projectId) {

        return this.sets.filter(
            set => set.projectId === projectId
        );

    },


    getPanelsBySet(setId) {

        return this.panels.filter(
            panel => panel.setId === setId
        );

    },


    getPanelsByProject(projectId) {

        return this.panels.filter(
            panel => panel.projectId === projectId
        );

    },


    getProductionByPanel(panelId) {

        return this.production.filter(
            record => record.panelId === panelId
        );

    },


    getProductionByStage(stageId) {

        return this.production.filter(
            record => record.stageId === stageId
        );

    },


    getProductionByProject(projectId) {

        return this.production.filter(
            record => record.projectId === projectId
        );

    },
        getProductionRecord(
        panelId,
        stageId
    ) {

        return this.production.find(
            record =>
                record.panelId === panelId &&
                record.stageId === stageId
        );

    },


    getProductionBySet(setId) {

        return this.production.filter(
            record => record.setId === setId
        );

    },


    getHistoryByPanel(panelId) {

        return this.history.filter(
            record => record.panelId === panelId
        );

    },


    getHistoryByStage(stageId) {

        return this.history.filter(
            record => record.stageId === stageId
        );

    }
    generateProductionRecords(
        projectId,
        setId,
        panelId
    ) {

        const panelStages =
            this.stages.filter(
                stage => stage.active === true
            );


        const existingRecords =
            this.getProductionByPanel(
                panelId
            );


        panelStages.forEach(stage => {

            const exists =
                existingRecords.some(
                    record =>
                        record.stageId === stage.id
                );


            if (!exists) {

                this.production.push({

                    id:
                        `PROD-${String(
                            this.production.length + 1
                        ).padStart(3, "0")}`,

                    projectId:
                        projectId,

                    setId:
                        setId,

                    panelId:
                        panelId,

                    stageId:
                        stage.id,

                    status:
                        "Pending",

                    remarks:
                        "",

                    updatedAt:
                        "",

                    updatedBy:
                        "System"

                });

            }

        });


        return this.getProductionByPanel(
            panelId
        );

    }
};
