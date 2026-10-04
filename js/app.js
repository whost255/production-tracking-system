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


        this.hideLoader();


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
