import dataUtils from "@/utils/dataUtils";
import validationUtils from "../../utils/validationUtils";

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
            deployMethods: [],
            logLevels: [],
            logLevel: "",
            connectorStatuses: [],
            connectorStatus: "",
            connectorDeployModes: [],
            connectorDeployMode: "",
            trustStoreUrl: "",
            trustStorePassword: "",
            keyStoreUrl: "",
            keyStorePassword: "",
            showPasswordTrustStore: false,
            showPasswordKeyStore: false,
            valid: false,
            urlRule: validationUtils.getUrlNotRequiredRule(),
            urlListRule: validationUtils.getUrlListRule(),
            saveMessage: ""
        };
    },
    mounted: function () {
        this.getSettings();
    },
    methods: {
        getSettings() {
            this.$root.$emit('showBusyIndicator', true);
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

            dataUtils.getConfigModel().then(configModel => {
                console.log(">>> getConfigModel: ", configModel);
                this.$data.proxyUrl = configModel.proxyUrl;
                let username = configModel.username;
                let password = configModel.password;
                let noProxyArray = configModel.noProxyArray;
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
                this.$data.logLevel = configModel.logLevel;
                this.$data.connectorStatus = configModel.connectorStatus;
                this.$data.connectorDeployMode = configModel.connectorDeployMode;
                this.$data.trustStoreUrl = configModel.trustStoreUrl;
                this.$data.trustStorePassword = configModel.trustStorePassword;
                this.$data.keyStoreUrl = configModel.keyStoreUrl;
                this.$data.keyStorePassword = configModel.keyStorePassword;
                this.$root.$emit('showBusyIndicator', false);
            });

            dataUtils.getLogLevels(response => {
                console.log(">>> getLogLevels: ", response);
                this.$data.logLevels = response;
            });

            dataUtils.getConnectorStatuses(response => {
                console.log(">>> getConnectorStatuses: ", response);
                this.$data.connectorStatuses = response;
            });

            dataUtils.getConnectorDeployModes(response => {
                console.log(">>> getConnectorDeployModes: ", response);
                this.$data.connectorDeployModes = response;
            });
        },
        async saveSettings() {
            let savePromises = [];
            this.$data.saveMessage = "";
            this.$root.$emit('showBusyIndicator', true);
            let proxyUrl = null;
            if (this.$data.proxyUrl != "") {
                proxyUrl = this.$data.proxyUrl;
            }
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
            savePromises.push(await dataUtils.changeProxySettings(proxyUrl, this.$data.proxyNoProxy, username, password));
            savePromises.push(await dataUtils.changeDeployMethod(this.$data.deployMethod));
            savePromises.push(await dataUtils.changeConfigModel(this.$data.logLevel, this.$data.connectorDeployMode,
                this.$data.trustStoreUrl, this.$data.trustStorePassword, this.$data.keyStoreUrl, this.$data.keyStorePassword));
            Promise.all(savePromises).then(() => {
                this.$root.$emit('showBusyIndicator', false);
                this.$data.saveMessage = "Successfully saved.";
            });
        }
    }
};
