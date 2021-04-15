import AddResourceFilePage from "@/pages/dataoffering/resources/addresource/file/AddResourceFilePage.vue";
import AddResourceDatabasePage from "@/pages/dataoffering/resources/addresource/database/AddResourceDatabasePage.vue";
import AddBackendConnectionDialog from "@/pages/dataoffering/backendconnections/dialog/AddBackendConnectionDialog.vue";
import dataUtils from "@/utils/dataUtils";
import validationUtils from "../../../../../utils/validationUtils";

export default {
    components: {
        AddResourceFilePage,
        AddResourceDatabasePage,
        AddBackendConnectionDialog
    },
    props: ['fromRoutePage'],
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
            defaultRule: validationUtils.getRequiredRule(),
            numberRule: validationUtils.getNumberRequiredRule(),
            allValid: false,
            readonly: false,
            newBackendConnection: false,
            filetype: "",
            bytesize: ""
        };
    },
    watch: {
        valid: function () {
            this.$data.allValid = this.$data.valid && (this.fromRoutePage == 'true' || this.$data.selected.length > 0);
        },
        selected: function () {
            this.$data.allValid = this.$data.valid && (this.fromRoutePage == 'true' || this.$data.selected.length > 0);
        }
    },
    mounted: function () {
        this.getBackendConnections();
        this.loadSourceTypes();
    },
    methods: {
        gotVisible() {
            this.getBackendConnections();
        },
        async loadSourceTypes() {
            dataUtils.getSourceTypes(sourceTypes => {
                this.$data.sourceTypeItems = sourceTypes;
            });
        },
        previousPage() {
            this.$emit('previousPage')
        },
        nextPage() {
            this.$emit('nextPage');
        },
        backendConnectionSaved() {
            this.$data.newBackendConnection = true;
            this.getBackendConnections();
        },
        async getBackendConnections() {
            let response = await dataUtils.getBackendConnections();
            if (response.name !== undefined && response.name == "Error") {
                this.$root.$emit('error', "Get backend connections failed.");
            } else {
                this.$data.backendConnections = response;
                this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
                this.$forceUpdate();
                if (this.$data.newBackendConnection) {
                    this.$data.newBackendConnection = false;
                    this.$root.$emit('showBusyIndicator', false);
                }
            }
        },
        async loadResource(resource) {
            if (resource.fileType === undefined && resource.bytesize === undefined) {
                this.$refs.form.reset();
            } else {
                if (resource.fileType !== undefined) {
                    this.$data.filetype = resource.fileType;
                }
                if (resource.bytesize !== undefined) {
                    this.$data.bytesize = resource.bytesize;
                }
            }

            this.$data.selected = [];
            let response = await dataUtils.getRoutes();
            if (response.name !== undefined && response.name == "Error") {
                this.$root.$emit('error', "Get routes failed.");
            } else {
                for (let route of response) {
                    if (route["ids:hasSubRoute"] !== undefined) {
                        for (let step of route["ids:hasSubRoute"]) {
                            if (step["ids:appRouteOutput"] !== undefined) {
                                if (step["ids:appRouteOutput"][0]["@id"] == resource.id) {
                                    this.$data.selected.push(dataUtils.genericEndpointToBackendConnection(route["ids:appRouteStart"][0]));
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
