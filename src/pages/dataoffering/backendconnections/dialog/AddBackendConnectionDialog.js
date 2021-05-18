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
            sourceType: "LOCAL",
            sourceTypes: ["LOCAL", "HTTP_GET", "HTTPS_GET", "HTTPS_GET_BASICAUTH"],
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
            this.$data.sourceType = "LOCAL";
            this.$data.username = "";
            this.$data.password = "";
        },
        cancelBackendConnection(){
          this.$data.dialog = false;
        },
        async saveBackendConnection() {
            if (this.$data.currentEndpoint == null) {
                this.$root.$emit('showBusyIndicator', true);
                this.$data.dialog = false;
                try {
                    let response = (await dataUtils.createBackendConnection(this.$data.url, this.$data.username, this.$data.password, this.$data.sourceType));
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
                    let response = (await dataUtils.updateBackendConnection(this.currentEndpoint["@id"], this.$data.url, this.$data.username, this.$data.password, this.$data.sourceType));
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
            console.log("edit Endpoint");
            this.$data.title = "Edit Backend Connection"
            this.$data.currentEndpoint = endpoint;
            this.$data.url = endpoint["ids:accessURL"]["@id"];
            let sourceTypeField = endpoint["@context"].ids+"sourceType";
            let sourceType = endpoint[sourceTypeField];
            this.$data.sourceType = sourceType["@value"];
            this.$data.username = endpoint["ids:genericEndpointAuthentication"]["ids:authUsername"];
            this.$data.password = endpoint["ids:genericEndpointAuthentication"]["ids:authPassword"];
            this.$data.dialog = true;
        }
    }
}
