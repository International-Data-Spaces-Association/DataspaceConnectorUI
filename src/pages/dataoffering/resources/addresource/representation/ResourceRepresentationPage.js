import AddResourceFilePage from "@/pages/dataoffering/resources/addresource/file/AddResourceFilePage.vue";
import AddResourceDatabasePage from "@/pages/dataoffering/resources/addresource/database/AddResourceDatabasePage.vue";
import AddBackendConnectionDialog from "@/pages/dataoffering/backendconnections/dialog/AddBackendConnectionDialog.vue";
import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";
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
                value: 'accessUrl'
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
        this.getGenericEndpoints();
    },
    methods: {
        gotVisible() {
            this.getGenericEndpoints();
        },
        previousPage() {
            this.$emit('previousPage')
        },
        nextPage() {
            this.$emit('nextPage');
        },
        backendConnectionSaved() {
            this.$data.newBackendConnection = true;
            this.getGenericEndpoints();
        },
        async getGenericEndpoints() {
            try {
                let response = await dataUtils.getGenericEndpoints();
                this.$data.backendConnections = response;
                this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
                this.$forceUpdate();
                if (this.$data.newBackendConnection) {
                    this.$data.newBackendConnection = false;
                    this.$root.$emit('showBusyIndicator', false);
                }
            } catch (error) {
                errorUtils.showError(error, "Get backend connections");
            }
        },
        async loadResource(resource) {
            if (resource.fileType === undefined) {
                this.$refs.form.reset();
            } else {
                if (resource.fileType !== undefined) {
                    this.$data.filetype = resource.fileType;
                }
            }

            this.$data.selected = [];
            try {
                let response = await dataUtils.getRoutes();
                for (let route of response) {
                    if (route["ids:hasSubRoute"] !== undefined) {
                        for (let step of route["ids:hasSubRoute"]) {
                            if (step["ids:appRouteOutput"] !== undefined) {
                                console.log(step["ids:appRouteOutput"][0]["@id"], " == ", resource.id);
                                if (step["ids:appRouteOutput"][0]["@id"] == resource.id) {
                                    this.$data.selected.push(dataUtils.genericEndpointToBackendConnection(route["ids:appRouteStart"][0]));
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                errorUtils.showError(error, "Get resource route");
            }
        }
    }
};
