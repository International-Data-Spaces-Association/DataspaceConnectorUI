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
                        title: "",
                        keywords: app.keywords,
                        appStore: appStore
                    });
                }
            } catch (error) {
                errorUtils.showError(error, "Get Apps");
            }
            this.$forceUpdate();
            this.$root.$emit('showBusyIndicator', false);

        }
    }
};
