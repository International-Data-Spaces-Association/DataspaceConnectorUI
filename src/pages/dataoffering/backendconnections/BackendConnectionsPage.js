import Axios from "axios";
import AddBackendConnectionDialog from "@/pages/dataoffering/backendconnections/dialog/AddBackendConnectionDialog.vue";
import ConfirmationDialog from "@/components/confirmationdialog/ConfirmationDialog.vue";
import dataUtils from "../../../utils/dataUtils";


export default {
    components: {
        AddBackendConnectionDialog,
        ConfirmationDialog
    },
    data() {
        return {
            search: '',
            headers: [{
                    text: 'URL',
                    value: 'url'
                },
                {
                    text: '',
                    value: 'actions',
                    sortable: false,
                    align: 'right'
                }
            ],
            backendConnections: [],
            selected: []
        };
    },
    mounted: function () {
        this.getAppRoutes();
    },
    methods: {
        getAppRoutes() {
            dataUtils.getBackendConnections(backendConnections => {
                this.$data.backendConnections = backendConnections;
                if (this.$parent.$parent.$parent.$parent.currentResource != null) {
                    this.loadResource(this.$parent.$parent.$parent.$parent.currentResource);
                }
                this.$forceUpdate();
                this.$root.$emit('showBusyIndicator', false);
            });
        },
        backendConnectionSaved() {
            this.getAppRoutes();
        },
        deleteItem(item) {
            this.$refs.confirmationDialog.title = "Delete Backend Connection";
            this.$refs.confirmationDialog.text = "Are you sure you want to delete the Backend Connection '" + item.url + "'?";
            this.$refs.confirmationDialog.callbackData = {
                item: item
            };
            this.$refs.confirmationDialog.callback = this.deleteCallback;
            this.$refs.confirmationDialog.dialog = true;
        },
        deleteCallback(choice, callbackData) {
            if (choice == "yes") {
                this.$root.$emit('showBusyIndicator', true);
                let appRouteOutputId = null;
                if (callbackData.item.route["ids:appRouteOutput"].length > 0) {
                    appRouteOutputId = callbackData.item.route["ids:appRouteOutput"][0]["@id"];
                }
                console.log(callbackData.item.route["ids:appRouteStart"][0], callbackData.item.route["ids:appRouteEnd"][0]);
                this.deleteBackendConnection(callbackData.item.routeId, callbackData.item.route["ids:appRouteStart"][0]["@id"],
                    callbackData.item.route["ids:appRouteEnd"][0]["@id"], appRouteOutputId);
            }
        },
        deleteBackendConnection(routeId, endpointId, appRouteEndId, appRouteOutputId) {
            Axios.delete("http://localhost:80/approute?routeId=" + routeId + "&endpointId=" + endpointId +
                "&appRouteEndId=" + appRouteEndId +
                "&appRouteOutputId=" + appRouteOutputId).then(() => {

                Axios.delete("http://localhost:80/approute?routeId=" + routeId).then(() => {
                    this.getAppRoutes();
                }).catch(error => {
                    console.log(error);
                    this.$root.$emit('showBusyIndicator', false);
                });

            }).catch(error => {
                console.log(error);
                this.$root.$emit('showBusyIndicator', false);
            });

        },
        editItem(item) {
            this.$refs.addBackendConnectionDialog.edit(item.route);
        }
    }
};
