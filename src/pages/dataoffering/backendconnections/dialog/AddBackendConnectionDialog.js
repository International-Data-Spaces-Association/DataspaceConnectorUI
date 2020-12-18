import Axios from "axios";

export default {
    components: {},
    data() {
        return {
            dialog: false,
            currentAppRoute: null,
            title: "",
            url: null,
            username: null,
            password: null,
            showPassword: false
        };
    },
    mounted: function () {},
    methods: {
        addButtonClicked() {
            this.$data.title = "Add Backend Connection";
            this.$data.currentAppRoute = null;
            this.$data.url = "";
            this.$data.username = "";
            this.$data.password = "";
        },
        saveBackendConnection() {
            if (this.$data.currentAppRoute == null) {
                this.$root.$emit('showBusyIndicator', true);
                this.$data.dialog = false;
                Axios.post("http://localhost:80/approute?accessUrl=" + this.$data.url + "&username=" + this.$data.username + "&password=" + this.$data.password, ).then(() => {
                    this.$emit('backendConnectionSaved');
                }).catch(error => {
                    console.log("Error in saveBackendConnection(): ", error);
                });
            } else {
                this.$root.$emit('showBusyIndicator', true);
                this.$data.dialog = false;
                Axios.put("http://localhost:80/approute?routeId=" + this.$data.currentAppRoute["@id"] + "&endpointId=" + this.$data.currentAppRoute["ids:appRouteStart"][0]["@id"] + "&accessUrl=" + this.$data.url + "&username=" + this.$data.username + "&password=" + this.$data.password, ).then(() => {
                    this.$emit('backendConnectionSaved');
                }).catch(error => {
                    console.log("Error in saveBackendConnection(): ", error);
                });
            }
        },
        edit(appRoute) {
            this.$data.title = "Edit Backend Connection"
            this.$data.currentAppRoute = appRoute;
            this.$data.url = appRoute["ids:appRouteStart"][0]["ids:accessURL"]["@id"];
            this.$data.username = appRoute["ids:appRouteStart"][0]["ids:genericEndpointAuthentication"]["ids:authUsername"];
            this.$data.password = appRoute["ids:appRouteStart"][0]["ids:genericEndpointAuthentication"]["ids:authPassword"];
            this.$data.dialog = true;
        }
    }
}
