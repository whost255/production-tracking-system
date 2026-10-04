const App = {

    currentPage: "dashboard",

    currentProjectId: null,

    currentSetId: null,

    currentPanelId: null,

    selectedStageId: null,

    initialized: false,


    async init() {

        this.setupNavigation();

        this.setupMobileMenu();

        const dataLoaded =
            await DataStore.loadAll();

        if (!dataLoaded) {

            console.error(
                "Application data could not be loaded."
            );

        }

        this.showPage("dashboard");

        Dashboard.render();

        this.hideLoader();

        this.initialized = true;

        console.log(
            "Production Tracking System initialized."
        );

    },


    setupNavigation() {

        const navItems =
            document.querySelectorAll(
                ".nav-item"
            );

        navItems.forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    const pageName =
                        item.dataset.page;

                    this.showPage(
                        pageName
                    );

                }
            );

        });

    },


    showPage(pageName) {

        const navItems =
            document.querySelectorAll(
                ".nav-item"
            );

        const pages =
            document.querySelectorAll(
                ".page"
            );

        navItems.forEach(item => {

            item.classList.remove(
                "active"
            );

        });

        pages.forEach(page => {

            page.classList.remove(
                "active"
            );

        });

        const selectedNav =
            document.querySelector(
                `.nav-item[data-page="${pageName}"]`
            );

        const selectedPage =
            document.getElementById(
                `${pageName}Page`
            );

        if (!selectedPage) {

            console.warn(
                `Page not found: ${pageName}`
            );

            return;

        }

        if (selectedNav) {

            selectedNav.classList.add(
                "active"
            );

        }

        selectedPage.classList.add(
            "active"
        );

        this.currentPage =
            pageName;

        switch (pageName) {

            case "dashboard":

                if (
                    typeof Dashboard !==
                    "undefined" &&
                    typeof Dashboard.render ===
                    "function"
                ) {

                    Dashboard.render();

                }

                break;


            case "projects":

                if (
                    typeof Projects !==
                    "undefined" &&
                    typeof Projects.render ===
                    "function"
                ) {

                    Projects.render();

                }

                break;


            case "production":

                if (
                    typeof Production !==
                    "undefined" &&
                    typeof Production.render ===
                    "function"
                ) {

                    Production.render();

                }

                break;


            case "history":

                if (
                    typeof History !==
                    "undefined" &&
                    typeof History.render ===
                    "function"
                ) {

                    History.render();

                }

                break;


            default:

                console.warn(
                    `No renderer configured for page: ${pageName}`
                );

        }

    },


    setupMobileMenu() {

        const menuButton =
            document.getElementById(
                "mobileMenuBtn"
            );

        const sidebar =
            document.getElementById(
                "sidebar"
            );

        if (!menuButton || !sidebar) {

            return;

        }

        menuButton.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle(
                    "open"
                );

            }
        );

        const navItems =
            document.querySelectorAll(
                ".nav-item"
            );

        navItems.forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    sidebar.classList.remove(
                        "open"
                    );

                }
            );

        });

    },


    hideLoader() {

        const loader =
            document.getElementById(
                "appLoader"
            );

        if (!loader) {

            return;

        }

        setTimeout(() => {

            loader.classList.add(
                "hidden"
            );

        }, 300);

    }

};


document.addEventListener(
    "DOMContentLoaded",
    () => {

        App.init();

    }
);
```
