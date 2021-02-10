import dataUtils from "@/utils/dataUtils";

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
            urlRule: [
                v => !!v || 'This data is required',
                v => /^[a-z]+[:][/][/][a-z.]+$/.test(v) || 'Only URLs (xyz://xyz) allowed',
            ]
        };
    },
    mounted: function () {},
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
        saveBackendConnection() {
            if (this.$data.currentEndpoint == null) {
                this.$root.$emit('showBusyIndicator', true);
                this.$data.dialog = false;
                dataUtils.createBackendConnection(this.$data.url, this.$data.username, this.$data.password, () => {
                    this.$emit('backendConnectionSaved');
                });
            } else {
                this.$root.$emit('showBusyIndicator', true);
                this.$data.dialog = false;
                dataUtils.updateBackendConnection(this.currentEndpoint["@id"], this.$data.url, this.$data.username, this.$data.password, () => {
                    this.$emit('backendConnectionSaved');
                });
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
