import AddResourceFilePage from "@/pages/dataoffering/resources/addresource/file/AddResourceFilePage.vue";
import AddResourceDatabasePage from "@/pages/dataoffering/resources/addresource/database/AddResourceDatabasePage.vue";
import AddBackendConnectionDialog from "@/pages/dataoffering/backendconnections/dialog/AddBackendConnectionDialog.vue";
import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";
import validationUtils from "../../../../../utils/validationUtils";
import clientDataModel from "../../../../../datamodel/clientDataModel";

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
            fileData: null,
            filetype: "",
            hideBackendConnections: false
        };
    },
    watch: {
        valid: function () {
            this.$data.allValid = this.$data.valid;
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
        async loadResource(resource, hideBackendConnections) {
            this.$data.hideBackendConnections = hideBackendConnections;
            if (resource.fileType === undefined) {
                this.$refs.form.reset();
            } else {
                if (resource.fileType !== undefined) {
                    this.$data.filetype = resource.fileType;
                }
            }

            this.$data.selected = [];
            if (!hideBackendConnections && resource.artifactId !== undefined && resource.artifactId != "") {
                try {
                    let route = await dataUtils.getRouteWithEnd(resource.artifactId);
                    if (route != null) {
                        let ge = route.start;
                        let dataSource = ge.dataSource;
                        this.$data.selected.push(clientDataModel.createGenericEndpoint(ge.id, ge.location, dataSource.type,
                            dataSource.id, dataSource.authentication.username, dataSource.authentication.password, ge.type));
                    }
                } catch (error) {
                    errorUtils.showError(error, "Get resource route");
                }
            }
        },
        fileChange(file) {
            let reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = () => {
                let data = reader.result;
                this.$data.fileData = data;
            }
        }
    }
};
