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
            this.$data.username = "";
            this.$data.password = "";
        },
        async saveBackendConnection() {
            if (this.$data.currentEndpoint == null) {
                this.$root.$emit('showBusyIndicator', true);
                this.$data.dialog = false;
                try {
                    let response = (await dataUtils.createBackendConnection(this.$data.url, this.$data.username, this.$data.password));
                    if (response.name !== undefined && response.name == "Error") {
                        this.$root.$emit('error', "Update backend connection failed.");
                    }
                } catch (error) {
                    console.log("Error on saveBackendConnection(): ", error);
                    this.$root.$emit('error', "Update backend connection failed.");
                }
                this.$emit('backendConnectionSaved');
            } else {
                this.$root.$emit('showBusyIndicator', true);
                this.$data.dialog = false;
                try {
                    let response = (await dataUtils.updateBackendConnection(this.currentEndpoint["@id"], this.$data.url, this.$data.username, this.$data.password));
                    if (response.name !== undefined && response.name == "Error") {
                        this.$root.$emit('error', "Update backend connection failed.");
                    }
                } catch (error) {
                    console.log("Error on saveBackendConnection(): ", error);
                    this.$root.$emit('error', "Update backend connection failed.");
                }
                this.$emit('backendConnectionSaved');
            }
        },
        edit(endpoint) {
            this.$data.title = "Edit Backend Connection"
            this.$data.currentEndpoint = endpoint;
            this.$data.url = endpoint["ids:accessURL"]["@id"];
            this.$data.username = endpoint["ids:genericEndpointAuthentication"]["ids:authUsername"];
            this.$data.password = endpoint["ids:genericEndpointAuthentication"]["ids:authPassword"];
            this.$data.dialog = true;
        }
    }
}
