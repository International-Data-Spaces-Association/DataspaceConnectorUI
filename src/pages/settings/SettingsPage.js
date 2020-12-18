import Axios from "axios";

export default {
    components: {},
    data() {
        return {
            proxyAuthenticationNeeded: false,
            proxyUrl: "",
            proxyUsername: "",
            proxyPassword: "",
            proxyNoProxy: "",
            showPassword: false
        };
    },
    mounted: function () {
        this.getSettings();
    },
    methods: {
        getSettings() {
            this.$root.$emit('showBusyIndicator', true);
            Axios.get("http://localhost:80/proxy").then((response) => {
                let proxy = response.data;
                if (proxy.length > 0) {
                    this.$data.proxyUrl = proxy[0]["ids:proxyURI"]["@id"];
                }
                let username = proxy[0]["ids:proxyAuthentication"]["ids:authUsername"];
                if (username == "null") {
                    username = "";
                }
                let password = proxy[0]["ids:proxyAuthentication"]["ids:authPassword"];
                if (password == "null") {
                    password = "";
                }
                let noProxyArray = proxy[0]["ids:noProxy"];
                this.$data.proxyAuthenticationNeeded = username != "" || password != "";
                this.$data.proxyUsername = username;
                this.$data.proxyPassword = password;
                let noProxy = "";
                let count = 0;
                for (let el of noProxyArray) {
                    if (count > 0) {
                        noProxy += ", ";
                    }
                    noProxy += el["@id"];
                    count++;
                }
                this.$data.proxyNoProxy = noProxy;
                this.$root.$emit('showBusyIndicator', false);
            }).catch(error => {
                console.log("Error in saveSettings(): ", error);
                this.$root.$emit('showBusyIndicator', false);
            });
        },
        saveSettings() {
            this.$root.$emit('showBusyIndicator', true);
            let username = null;
            let password = null;
            if (this.$data.proxyAuthenticationNeeded) {
                if (this.$data.proxyUsername.trim() != "") {
                    username = this.$data.proxyUsername;
                }
                if (this.$data.proxyPassword.trim() != "") {
                    password = this.$data.proxyPassword;
                }
            }
            let params = "?proxyUri=" + this.$data.proxyUrl + "&noProxyUri=" + this.$data.proxyNoProxy + "&username=" +
                username + "&password=" + password;
            Axios.put("http://localhost:80/proxy" + params).then(() => {
                this.$root.$emit('showBusyIndicator', false);
            }).catch(error => {
                console.log("Error in saveSettings(): ", error);
                this.$root.$emit('showBusyIndicator', false);
            });
        }
    }
};
