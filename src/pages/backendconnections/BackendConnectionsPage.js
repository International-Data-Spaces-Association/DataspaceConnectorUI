import AddBackendConnectionDialog from "@/pages/backendconnections/dialog/AddBackendConnectionDialog.vue";
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
                value: 'accessUrl'
            },
            {
                text: 'Type',
                value: 'dataSource.type'
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
        this.getGenericEndpoints();
    },
    methods: {
        async getGenericEndpoints() {
            try {
                this.$data.backendConnections = await dataUtils.getGenericEndpoints();
                this.$forceUpdate();
                this.$root.$emit('showBusyIndicator', false);
            } catch (error) {
                errorUtils.showError(error, "Get backend connections");
            }
        },
        backendConnectionSaved() {
            this.getGenericEndpoints();
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
                this.deleteBackendConnection(callbackData.item.id, callbackData.item.dataSource.id);
            }
        },
        async deleteBackendConnection(id, dataSourceId) {
            try {
                await dataUtils.deleteGenericEndpoint(id, dataSourceId);
            }
            catch (error) {
                console.log("Error on deleteBackendConnection(): ", error);
                this.$root.$emit('error', "Delete backend connection failed.");
            }
            this.getGenericEndpoints();
        },
        editItem(item) {
            this.$refs.addBackendConnectionDialog.edit(item);
        }
    }
};
