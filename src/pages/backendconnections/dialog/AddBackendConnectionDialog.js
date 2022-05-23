import dataUtils from "@/utils/dataUtils";
import validationUtils from "@/utils/validationUtils";

export default {
    components: {},
    data() {
        return {
            dialog: false,
            active_tab: 0,
            currentEndpoint: null,
            title: "",
            name:"",
            desc:"",
            url: null,
            sourceType: "REST",
            sourceTypes: ["REST", "Database", "Other"],
            driverClassName: null,
            camelSqlUri: null,
            username: null,
            password: null,
            authHeaderName: null,
            authHeaderValue: null,
            showPassword: false,
            valid: false,
            requiredRule: validationUtils.getRequiredRule(),
            urlRule: validationUtils.getUrlRequiredRule(),
            editMode: false,
        };
    },
    mounted: function () {
    },
    methods: {
        addButtonClicked() {
            this.$data.editMode = false;
            this.$data.title = "Add Data Source";
            this.$data.currentEndpoint = null;
            this.$data.name="";
            this.$data.desc="";
            this.$data.url = "";
            this.$data.sourceType = this.$data.sourceTypes[0];
            this.$data.driverClassName = "";
            this.$data.username = "";
            this.$data.password = "";
            this.$data.authHeaderName = "";
            this.$data.authHeaderValue = "";
            this.$nextTick(() => {
                this.$refs.form.resetValidation();
            });
        },
        cancelBackendConnection() {
            this.$data.dialog = false;
        },
        async saveBackendConnection() {
            this.$root.$emit('showBusyIndicator', true);
            this.$data.dialog = false;
            if (this.$data.active_tab === 0) { //Basic Auth
                this.$data.authHeaderName = null;
                this.$data.authHeaderValue = null;
            } else if (this.$data.active_tab === 1) { //API Key
                this.$data.username = null;
                this.$data.password = null;
            } else if(this.$data.active_tab === 2) { //None
                this.$data.authHeaderName = null;
                this.$data.authHeaderValue = null;
                this.$data.username = null;
                this.$data.password = null;
            }
            if (this.$data.currentEndpoint == null) {
                try {
                    await dataUtils.createGenericEndpoint(this.$data.name, this.$data.desc, this.$data.url, this.$data.username, this.$data.password, this.$data.authHeaderName,
                        this.$data.authHeaderValue, this.$data.sourceType.toUpperCase(), this.$data.driverClassName, this.$data.camelSqlUri);
                } catch (error) {
                    console.log("Error on saveBackendConnection(): ", error);
                    this.$root.$emit('error', "Create backend connection failed.");
                }
                this.$emit('backendConnectionSaved');
            } else {
                try {
                    await dataUtils.updateGenericEndpoint(this.$data.name, this.$data.desc, this.currentEndpoint.id, this.currentEndpoint.dataSource.id, this.$data.url,
                        this.$data.username, this.$data.password, this.$data.authHeaderName,
                        this.$data.authHeaderValue, this.$data.sourceType.toUpperCase(), this.$data.driverClassName, this.$data.camelSqlUri);
                } catch (error) {
                    console.log("Error on saveBackendConnection(): ", error);
                    this.$root.$emit('error', "Update backend connection failed.");
                }
                this.$emit('backendConnectionSaved');
            }
        },
        async edit(endpoint) {
            this.$data.editMode = true;
            this.$data.title = "Edit Backend Connection";
            this.$data.currentEndpoint = endpoint;
            this.$data.name = endpoint.title;
            this.$data.desc = endpoint.description;
            this.$data.url = endpoint.accessUrl;
            let dataSource;
            if (endpoint.dataSource.id === undefined) {
                dataSource = {
                    "type": "Other"
                }
            } else {
                dataSource = await dataUtils.getDataSource(endpoint.dataSource.id);
            }
            this.$data.sourceType = dataSource.type;
            console.log(dataSource.type.toUpperCase());
            console.log(endpoint);
            if (dataSource.type.toUpperCase() === "DATABASE") {
                this.$data.driverClassName = endpoint.driverClassName;
                this.$data.camelSqlUri = endpoint.camelSqlUri;
            } else if (dataSource.type.toUpperCase() === "OTHER") {
                this.$data.driverClassName = "";
                this.$data.camelSqlUri = endpoint.accessUrl;
            } else {
                this.$data.driverClassName = "";
                this.$data.camelSqlUri = "";
            }
            this.$data.username = endpoint.username;
            this.$data.password = endpoint.password;
            this.$data.authHeaderName = "";
            this.$data.authHeaderValue = "";
            this.$data.dialog = true;
        }
    }
}
