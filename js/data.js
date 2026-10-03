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

    }

};
