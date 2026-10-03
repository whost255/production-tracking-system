const App = {

    init() {

        this.setupNavigation();

        this.setupMobileMenu();

        this.hideLoader();

        console.log(
            "Production Tracking System initialized."
        );

    },


    setupNavigation() {

        const navItems =
            document.querySelectorAll(".nav-item");

        const pages =
            document.querySelectorAll(".page");


        navItems.forEach(item => {

            item.addEventListener("click", () => {

                const pageName =
                    item.dataset.page;


                navItems.forEach(nav => {

                    nav.classList.remove("active");

                });


                item.classList.add("active");


                pages.forEach(page => {

                    page.classList.remove("active");

                });


                const targetPage =
                    document.getElementById(
                        `${pageName}Page`
                    );


                if (targetPage) {

                    targetPage.classList.add("active");

                }

            });

        });

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
