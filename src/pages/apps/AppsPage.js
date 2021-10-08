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
                text: 'ID',
                value: 'id'
            },
            {
                text: 'Keywords',
                value: 'keywords'
            }, {
                text: 'Publisher',
                value: 'publisher'
            },
            {
                text: 'App Store',
                value: 'appStore'
            },
            {
                text: '',
                value: 'actions',
                sortable: false,
                align: 'right',
                width: 170
            }
            ],
            apps: [],
            appToAppStoreMap: [],
            selected: []
        };
    },
    mounted: async function () {
        await this.getAppsOfAppStores();
        await this.getApps();
    },
    methods: {
        async getAppsOfAppStores() {
            this.$root.$emit('showBusyIndicator', true);
            try {
                this.$data.appToAppStoreMap = (await dataUtils.getAppToAppStoreMap());
            } catch (error) {
                errorUtils.showError(error, "Get Apps of App Stores");
            }
            this.$forceUpdate();
            this.$root.$emit('showBusyIndicator', false);

        },
        async getApps() {
            this.$root.$emit('showBusyIndicator', true);
            try {
                let response = (await dataUtils.getApps());
                this.$data.apps = [];
                for (var app of response) {
                    let appID = dataUtils.getIdOfConnectorResponse(app);
                    let appStore;
                    if (this.$data.appToAppStoreMap[appID] === undefined) {
                        appStore = "";
                    } else {
                        appStore = this.$data.appToAppStoreMap[appID].title;
                    }
                    this.$data.apps.push({
                        app: app,
                        id: appID,
                        keywords: app.keywords.join(", "),
                        publisher: app.publisher,
                        appStore: appStore
                    });
                }
            } catch (error) {
                errorUtils.showError(error, "Get Apps");
            }
            this.$forceUpdate();
            this.$root.$emit('showBusyIndicator', false);
        },
        deleteItem(item) {
            this.$refs.confirmationDialog.title = "Delete App";
            this.$refs.confirmationDialog.text = "Are you sure you want to delete the App?";
            this.$refs.confirmationDialog.callbackData = {
                item: item
            };
            this.$refs.confirmationDialog.callback = this.deleteCallback;
            this.$refs.confirmationDialog.dialog = true;
        },
        deleteCallback(choice, callbackData) {
            if (choice == "yes") {
                this.$root.$emit('showBusyIndicator', true);
                this.deleteApp(callbackData.item.id);
            }
        },
        async deleteApp(appId) {
            try {
                await dataUtils.deleteApp(appId);
            } catch (error) {
                errorUtils.showError(error, "Delete App");
            }
            this.getApps();
        },
    }
};
