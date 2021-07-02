import AddBackendConnectionDialog from "@/pages/dataoffering/backendconnections/dialog/AddBackendConnectionDialog.vue";
import ConfirmationDialog from "@/components/confirmationdialog/ConfirmationDialog.vue";
import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";


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
        this.getBackendConnections();
    },
    methods: {
        async getBackendConnections() {
            try {
                let response = await dataUtils.getBackendConnections();
                this.$data.backendConnections = response;
                this.$forceUpdate();
                this.$root.$emit('showBusyIndicator', false);
            } catch (error) {
                errorUtils.showError(error, "Get backend connections");
            }
        },
        backendConnectionSaved() {
            this.getBackendConnections();
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
                this.deleteBackendConnection(callbackData.item.endpoint["@id"]);
            }
        },
        async deleteBackendConnection(id) {
            try {
                let response = (await dataUtils.deleteBackendConnection(id));
                if (response.name !== undefined && response.name == "Error") {
                    this.$root.$emit('error', "Delete backend connection failed.");
                }
            }
            catch (error) {
                console.log("Error on deleteBackendConnection(): ", error);
                this.$root.$emit('error', "Delete backend connection failed.");
            }
            this.getBackendConnections();
        },
        editItem(item) {
            this.$refs.addBackendConnectionDialog.edit(item.endpoint);
        }
    }
};
