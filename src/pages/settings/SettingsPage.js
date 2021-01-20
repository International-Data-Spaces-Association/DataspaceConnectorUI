import dataUtils from "../../utils/dataUtils";

export default {
    components: {},
    data() {
        return {
            proxyAuthenticationNeeded: false,
            proxyUrl: "",
            proxyUsername: "",
            proxyPassword: "",
            proxyNoProxy: "",
            showPassword: false,
            deployMethod: "",
            deployMethods: []
        };
    },
    mounted: function () {
        this.getSettings();
    },
    methods: {
        getSettings() {
            this.$root.$emit('showBusyIndicator', true);
            dataUtils.getProxySettings(response => {
                console.log(">>> PROXY RESPONSE: ", response);
                if (response != null && response != "") {
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
                } else {
                    this.$root.$emit('showBusyIndicator', false);
                }
            });

            dataUtils.getDeployMethods(response => {
                console.log(">>> getDeployMethods: ", response);
                this.$data.deployMethods = response;
            });

            dataUtils.getDeployMethod(response => {
                console.log(">>> getDeployMethod: ", response);
                if (response != null && response != "") {
                    this.$data.deployMethod = response[0][1].deployMethod;
                }
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
            dataUtils.changeProxySettings(this.$data.proxyUrl, this.$data.proxyNoProxy, username, password, () => {
                dataUtils.changeDeployMethod(this.$data.deployMethod, () => {
                    this.$root.$emit('showBusyIndicator', false);
                });
            });

        }
    }
};
