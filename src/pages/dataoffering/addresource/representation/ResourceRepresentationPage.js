import AddResourceFilePage from "@/pages/dataoffering/addresource/file/AddResourceFilePage.vue";
import AddResourceDatabasePage from "@/pages/dataoffering/addresource/database/AddResourceDatabasePage.vue";
import AddBackendConnectionDialog from "@/pages/dataoffering/backendconnections/dialog/AddBackendConnectionDialog.vue";
import Axios from "axios";
import DataUtils from "@/utils/dataUtils";

export default {
    components: {
        AddResourceFilePage,
        AddResourceDatabasePage,
        AddBackendConnectionDialog
    },
    data() {
        return {
            search: '',
            headers: [{
                text: 'URL',
                value: 'url'
            }],
            backendConnections: [],
            sourceType: "",
            sourceTypeItems: [],
            selected: [],
            valid: false,
            defaultRule: [
                v => !!v || 'This data is required'
            ],
            allValid: false
        };
    },
    watch: {
        valid: function () {
            this.$data.allValid = this.$data.valid && this.$data.selected.length > 0;
        },
        selected: function () {
            this.$data.allValid = this.$data.valid && this.$data.selected.length > 0;
        }
    },
    mounted: function () {
        this.getAppRoutes();
        this.loadSourceTypes();
    },
    methods: {
        async loadSourceTypes() {
            DataUtils.getSourceTypes(sourceTypes => {
                this.$data.sourceTypeItems = sourceTypes;
            });
        },
        previousPage() {
            this.$emit('previousPage')
        },
        save() {
            this.$emit('save')
        },
        backendConnectionSaved() {
            this.getAppRoutes();
        },
        getAppRoutes() {
            Axios.get("http://localhost:80/approutes").then(response => {
                var appRoutes = response.data;
                this.$data.backendConnections = [];

                for (var appRoute of appRoutes) {
                    if (appRoute["ids:appRouteStart"] !== undefined && appRoute["ids:appRouteStart"].length > 0) {
                        this.$data.backendConnections.push({
                            routeId: appRoute["@id"],
                            url: appRoute["ids:appRouteStart"][0]["ids:accessURL"]["@id"],
                            appRouteOutput: appRoute["ids:appRouteOutput"]
                        });
                    }
                }

                if (this.$parent.$parent.$parent.$parent.currentResource != null) {
                    this.loadResource(this.$parent.$parent.$parent.$parent.currentResource);
                }

                this.$forceUpdate();
                this.$root.$emit('showBusyIndicator', false);
            }).catch(error => {
                console.log("Error in getAppRoutes(): ", error);
                this.$root.$emit('showBusyIndicator', false);
            });


        },
        loadResource(resource) {
            if (resource["ids:representation"] !== undefined && resource["ids:representation"].length > 0) {
                this.$data.sourceType = resource["ids:representation"][0]["ids:sourceType"];
            }
            this.$data.selected = [];
            for (var backendConnection of this.$data.backendConnections) {
                for (var res of backendConnection.appRouteOutput) {
                    if (res["@id"] == resource["@id"]) {
                        this.$data.selected.push(backendConnection);
                    }
                }
            }
        }
    }
};
