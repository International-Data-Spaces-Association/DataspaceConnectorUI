import dataUtils from "../../../utils/dataUtils";
import validationUtils from "../../../utils/validationUtils";

export default {
    components: {},
    data() {
        return {
            dialog: false,
            currentAppStore: null,
            urlReadOnly: false,
            title: "",
            appstoreTitle: null,
            url: null,
            valid: false,
            defaultRule: validationUtils.getRequiredRule(),
            urlRule: validationUtils.getUrlRequiredRule()
        };
    },
    mounted: function () {
        this.$data.urlReadOnly = false;
    },
    methods: {
        addButtonClicked() {
            this.$data.urlReadOnly = false;
            this.$data.currentAppStore = null;
            this.$data.title = "Add App Store";
            this.$data.appstoreTitle = "";
            this.$data.url = "";
        },
        async saveAppStore() {
            if (this.$data.currentAppStore == null) {
                this.$root.$emit('showBusyIndicator', true);
                this.$data.dialog = false;
                await dataUtils.createAppStore(this.$data.url, this.$data.appstoreTitle);
            } else {
                this.$root.$emit('showBusyIndicator', true);
                this.$data.dialog = false;
                await dataUtils.updateAppStore(dataUtils.getIdOfConnectorResponse(this.$data.currentAppStore), this.$data.url, this.$data.appstoreTitle);
            }
            this.$emit('appstoreSaved');
        },
        edit(appstore) {
            this.$data.title = "Edit App Store"
            this.$data.urlReadOnly = true;
            this.$data.currentAppStore = appstore;
            this.$data.url = appstore.location;
            this.$data.appstoreTitle = appstore.title;
            this.$data.dialog = true;
        }
    }
}

