import AddAppStoreDialog from "@/pages/appstores/dialog/AddAppStoreDialog.vue";
import ConfirmationDialog from "@/components/confirmationdialog/ConfirmationDialog.vue";
import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";


export default {
    components: {
        AddAppStoreDialog,
        ConfirmationDialog
    },
    data() {
        return {
            search: '',
            headers: [{
                text: 'Title',
                value: 'title'
            }, {
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
            appstores: [],
            selected: []
        };
    },
    mounted: function () {
        this.getAppStores();
    },
    methods: {
        async getAppStores() {
            this.$root.$emit('showBusyIndicator', true);
            try {
                let response = (await dataUtils.getAppStores());
                this.$data.appstores = [];
                for (var appstore of response) {
                    this.$data.appstores.push({
                        appstore: appstore,
                        id: dataUtils.getIdOfConnectorResponse(appstore),
                        title: appstore.title,
                        url: appstore.location,
                        registerStatus: dataUtils.toRegisterStatusClass(appstore.status)
                    });
                }
            } catch (error) {
                errorUtils.showError(error, "Get App Stores");
            }
            this.$forceUpdate();
            this.$root.$emit('showBusyIndicator', false);

        },
        appstoreSaved() {
            this.getAppStores();
        },
        deleteItem(item) {
            this.$refs.confirmationDialog.title = "Delete App Store";
            this.$refs.confirmationDialog.text = "Are you sure you want to delete the App Store?";
            this.$refs.confirmationDialog.callbackData = {
                item: item
            };
            this.$refs.confirmationDialog.callback = this.deleteCallback;
            this.$refs.confirmationDialog.dialog = true;
            // this.$root.$emit('showBusyIndicator', true);
            // this.deleteAppStore(item.appstore["@id"]);
        },
        deleteCallback(choice, callbackData) {
            if (choice == "yes") {
                this.$root.$emit('showBusyIndicator', true);
                this.deleteAppStore(callbackData.item.id);
            }
        },
        async deleteAppStore(appstoreId) {
            try {
                await dataUtils.deleteAppStore(appstoreId);
            } catch (error) {
                errorUtils.showError(error, "Delete App Store");
            }
            this.getAppStores();
        },
        editItem(item) {
            this.$refs.addAppStoreDialog.edit(item.appstore);
        },
        installApps(item) {
            this.$router.push('installapps?id=' + item.id);
        }
    }
};
