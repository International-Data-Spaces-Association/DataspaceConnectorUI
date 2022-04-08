// import dataUtils from "@/utils/dataUtils";
import ConfirmationDialog from "@/components/confirmationdialog/ConfirmationDialog.vue";
import dataUtils from "../../../utils/dataUtils";
import errorUtils from "../../../utils/errorUtils";



export default {
    components: {
        ConfirmationDialog
    },
    data() {
        return {
            search: '',
            headers: [{
                text: 'Description',
                value: 'description'
            }, {
                text: '',
                value: 'actions',
                sortable: false,
                align: 'right'
            }],
            errorHeaders: [{
                text: 'Time',
                value: 'timestamp',
                width: 135
            }, {
                text: 'Route ID',
                value: 'routeId',
            }, {
                text: 'Error',
                value: 'message'
            }, {
                text: 'Endpoint',
                value: 'endpoint'
            }],
            sortBy: 'description',
            errorSortBy: 'timestamp',
            sortDesc: true,
            routes: [],
            routeErrors: [],
            isOffering: true,
            addRouteButtonTo: ""
        };
    },
    watch: {
        $route() {
            this.init();
        }
    },
    mounted: function () {
        this.init();
    },
    methods: {
        async init() {
            this.$data.isOffering = this.$route.path.includes("offering");
            if (this.$data.isOffering) {
                this.$data.addRouteButtonTo = "/addrouteoffering";
            } else {
                this.$data.addRouteButtonTo = "/addrouteconsumption";
            }
            this.getRoutes();
        },
        async getRoutes() {
            this.$root.$emit('showBusyIndicator', true);
            await this.getRouteErrors();
            try {
                let response = await dataUtils.getRoutes();
                this.$data.routes = [];
                for (let route of response) {
                    let showInList = false;
                    if (route.deploy == "Camel") {
                        if (this.$data.isOffering && route.start !== undefined && route.start != null) {
                            showInList = true;
                        } else if (!this.$data.isOffering && (route.start === undefined || route.start == null)) {
                            showInList = true;
                        }
                    }
                    if (showInList) {
                        this.$data.routes.push({
                            id: dataUtils.getIdOfConnectorResponse(route),
                            description: route.description
                        });
                    }
                }
            } catch (error) {
                errorUtils.showError(error, "Get routes");
            }
            this.$root.$emit('showBusyIndicator', false);

        },
        async getRouteErrors() {
            try {
                let response = await dataUtils.getRouteErrors();
                let routeErrors = response.reverse();
                for (let routeError of routeErrors) {
                    routeError.timestamp = routeError.timestamp.substring(0, 19).replace("T", " ");
                }
                this.$data.routeErrors = routeErrors;
            } catch (error) {
                errorUtils.showError(error, "Get route errors");
            }
        },
        deleteItem(item) {
            this.$refs.confirmationDialog.title = "Delete Route";
            this.$refs.confirmationDialog.text = "Are you sure you want to delete the route '" + item.description + "'? (The linked artifact will also be deleted)";
            this.$refs.confirmationDialog.callbackData = {
                item: item
            };
            this.$refs.confirmationDialog.callback = this.deleteCallback;
            this.$refs.confirmationDialog.dialog = true;
        },
        async deleteCallback(choice, callbackData) {
            if (choice == "yes") {
                this.$root.$emit('showBusyIndicator', true);
                try {
                    await dataUtils.deleteRoute(callbackData.item.id);
                } catch (error) {
                    errorUtils.showError(error, "Delete route");
                }
                this.getRoutes();
            }
        },
        editItem(item) {
            if (this.$data.isOffering) {
                this.$router.push('showrouteoffering?routeId=' + item.id);
            } else {
                this.$router.push('showrouteconsumption?routeId=' + item.id);
            }
        }
    }
};
