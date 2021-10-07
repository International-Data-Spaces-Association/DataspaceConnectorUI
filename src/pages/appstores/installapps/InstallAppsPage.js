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
                text: 'Keywords',
                value: 'keywords'
            },
            {
                text: '',
                value: 'actions',
                sortable: false,
                align: 'right'
            }
            ],
            appStore: "",
            apps: [],
            selected: []
        };
    },
    mounted: function () {
        this.getApps();
    },
    methods: {
        async getApps() {
            this.$root.$emit('showBusyIndicator', true);
            try {
                this.$data.apps = [];
                this.$data.appStore = await dataUtils.getAppStore(this.$route.query.id);
                let idsApps = (await dataUtils.getAppsOfAppStore(this.$data.appStore.location));
                for (let idsApp of idsApps) {
                    let keywords = [];
                    for (let keyword of idsApp["ids:keyword"]) {
                        keywords.push(keyword["@value"]);
                    }
                    this.$data.apps.push({
                        "app": idsApp,
                        "title": idsApp["ids:title"][0]["@value"],
                        "keywords": keywords.join(", ")
                    });
                }
            } catch (error) {
                errorUtils.showError(error, "Get Apps");
            }
            this.$forceUpdate();
            this.$root.$emit('showBusyIndicator', false);
        },
        async installApp(item) {
            this.$root.$emit('showBusyIndicator', true);
            try {
                await dataUtils.installApp(this.$data.appStore.location, item.app["@id"]);
            } catch (error) {
                errorUtils.showError(error, "Install app");
            }
            this.$root.$emit('showBusyIndicator', false);
        }
    }
};
