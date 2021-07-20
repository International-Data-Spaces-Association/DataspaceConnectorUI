import dataUtils from "@/utils/dataUtils";
import validationUtils from "../../../../utils/validationUtils";

export default {
    components: {},
    data() {
        return {
            dialog: false,
            currentEndpoint: null,
            title: "",
            url: null,
            sourceType: "Database",
            sourceTypes: ["Database", "REST"],
            username: null,
            password: null,
            showPassword: false,
            valid: false,
            urlRule: validationUtils.getUrlRequiredRule()
        };
    },
    mounted: function () { },
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
            this.$data.title = "Add Backend Connection";
            this.$data.currentEndpoint = null;
            this.$data.url = "";
            this.$data.sourceType = this.$data.sourceTypes[0];
            this.$data.username = "";
            this.$data.password = "";
        },
        cancelBackendConnection() {
            this.$data.dialog = false;
        },
        async saveBackendConnection() {
            if (this.$data.currentEndpoint == null) {
                this.$root.$emit('showBusyIndicator', true);
                this.$data.dialog = false;
                try {
                    await dataUtils.createGenericEndpoint(this.$data.url, this.$data.username, this.$data.password, this.$data.sourceType);
                } catch (error) {
                    console.log("Error on saveBackendConnection(): ", error);
                    this.$root.$emit('error', "Create backend connection failed.");
                }
                this.$emit('backendConnectionSaved');
            } else {
                this.$root.$emit('showBusyIndicator', true);
                this.$data.dialog = false;
                try {
                    await dataUtils.updateGenericEndpoint(this.currentEndpoint.id, this.currentEndpoint.dataSourceId, this.$data.url,
                        this.$data.username, this.$data.password, this.$data.sourceType);
                } catch (error) {
                    console.log("Error on saveBackendConnection(): ", error);
                    this.$root.$emit('error', "Update backend connection failed.");
                }
                this.$emit('backendConnectionSaved');
            }
        },
        async edit(endpoint) {
            this.$data.title = "Edit Backend Connection"
            this.$data.currentEndpoint = endpoint;
            this.$data.url = endpoint.accessUrl;
            this.$data.sourceType = (await dataUtils.getDataSource(endpoint.dataSourceId)).type;
            this.$data.username = endpoint.username;
            this.$data.password = endpoint.password;
            this.$data.dialog = true;
        }
    }
}
