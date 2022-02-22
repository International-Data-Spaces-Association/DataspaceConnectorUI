import dataUtils from "@/utils/dataUtils";
import validationUtils from "../../../../utils/validationUtils";

export default {
    components: {},
    data() {
        return {
            dialog: false,
            active_tab: 0,
            currentEndpoint: null,
            title: "",
            url: null,
            sourceType: "Database",
            sourceTypes: ["Database", "REST", "Other"],
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
            editMode: false
        };
    },
    mounted: function () {
    },
    // watch: {
    //     dialog() {
    //         console.log("SHOW: ", this.$data.dialog);
    //         if (this.$data.dialog) {
    //             setTimeout(() => {
    //                 this.$refs.tfURL.$el.focus();
    //             })
    //         }
    //     }
    // },
    methods: {
        addButtonClicked() {
            this.$data.editMode = false;
            this.$data.title = "Add Backend Connection";
            this.$data.currentEndpoint = null;
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
            if (this.$data.active_tab == 0) {
                this.$data.authHeaderName = null;
                this.$data.authHeaderValue = null;
            } else {
                this.$data.username = null;
                this.$data.password = null;
            }
            if (this.$data.currentEndpoint == null) {
                try {
                    await dataUtils.createGenericEndpoint(this.$data.url, this.$data.username, this.$data.password, this.$data.authHeaderName,
                        this.$data.authHeaderValue, this.$data.sourceType.toUpperCase(), this.$data.driverClassName, this.$data.camelSqlUri);
                } catch (error) {
                    console.log("Error on saveBackendConnection(): ", error);
                    this.$root.$emit('error', "Create backend connection failed.");
                }
                this.$emit('backendConnectionSaved');
            } else {
                try {
                    await dataUtils.updateGenericEndpoint(this.currentEndpoint.id, this.currentEndpoint.dataSource.id, this.$data.url,
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
            this.$data.title = "Edit Backend Connection"
            this.$data.currentEndpoint = endpoint;
            this.$data.url = endpoint.accessUrl;
            let dataSource = await dataUtils.getDataSource(endpoint.dataSource.id);
            this.$data.sourceType = dataSource.type;
            if (dataSource.type.toUpperCase() == "DATABASE") {
                this.$data.driverClassName = endpoint.driverClassName;
                this.$data.camelSqlUri = endpoint.camelSqlUri;
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
