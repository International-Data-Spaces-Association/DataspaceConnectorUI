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
            sortBy: 'title',
            sortDesc: false,
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
                    let isAppRunning = await dataUtils.isAppRunning(appID);
                    let appStore;
                    if (this.$data.appToAppStoreMap[appID] === undefined) {
                        appStore = "";
                    } else {
                        appStore = this.$data.appToAppStoreMap[appID].title;
                    }
                    this.$data.apps.push({
                        app: app,
                        id: appID,
                        title: app.title,
                        keywords: app.keywords.join(", "),
                        publisher: app.publisher,
                        appStore: appStore,
                        isAppRunning: isAppRunning
                    });
                }
            } catch (error) {
                errorUtils.showError(error, "Get Apps");
            }
            this.$forceUpdate();
            this.$root.$emit('showBusyIndicator', false);
        },
        async startApp(item) {
            this.$root.$emit('showBusyIndicator', true);
            await dataUtils.startApp(item.id);
            this.$root.$emit('showBusyIndicator', false);
            this.getApps();
        },
        async stopApp(item) {
            this.$root.$emit('showBusyIndicator', true);
            await dataUtils.stopApp(item.id);
            this.$root.$emit('showBusyIndicator', false);
            this.getApps();
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
