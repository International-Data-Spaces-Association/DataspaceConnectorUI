import dataUtils from "@/utils/dataUtils";
// import errorUtils from "../../utils/errorUtils";
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
            connectorStatus: "",
            connectorDeployModes: [],
            connectorDeployMode: "",
            trustStoreUrl: "",
            trustStorePassword: "",
            keyStoreUrl: "",
            keyStorePassword: "",
            showPasswordTrustStore: false,
            showPasswordKeyStore: false,
            connectorTitle: "",
            connectorDescription: "",
            connectorEndpoint: "",
            connectorVersion: "",
            connectorCurator: "",
            connectorMaintainer: "",
            connectorInboundModelVersion: "",
            connectorOutboundModelVersion: "",
            valid: false,
            urlRule: validationUtils.getUrlNotRequiredRule(),
            urlListRule: validationUtils.getUrlListRule(),
            versionRule: validationUtils.getVersionRule(),
            saveMessage: ""
        };
    },
    mounted: function () {
        this.getSettings();
    },
    methods: {
        async getSettings() {
            dataUtils.test();

            // TODO Multi line comment for testing above code.
            /*
            this.$root.$emit('showBusyIndicator', true);
            try {
                let response = await dataUtils.getDeployMethods();
                this.$data.deployMethods = response;

                response = await dataUtils.getLogLevels()
                this.$data.logLevels = response;

                response = await dataUtils.getConnectorDeployModes();
                this.$data.connectorDeployModes = response;
            }
            catch (error) {
                errorUtils.showError(error, "Get enum values");
            }

            try {
                let response = await dataUtils.getDeployMethod();
                if (response != null && response != "") {
                    this.$data.deployMethod = response[0][1].routeDeployMethod;
                }
            }
            catch (error) {
                errorUtils.showError(error, "Get deploy method");
            }

            try {
                let response = await dataUtils.getConnectorSettings();
                console.log("CONN SETTINGS: ", response);
            }
            catch (error) {
                errorUtils.showError(error, "Get connector settings");
            }*/

            // response = await dataUtils.getConfigModel();
            // if (response.name !== undefined && response.name == "Error") {
            //     this.$root.$emit('error', "Get config model failed.");
            // } else {
            //     let configModel = response;
            //     this.$data.proxyUrl = configModel.proxyUrl;
            //     let username = configModel.username;
            //     let password = configModel.password;
            //     let noProxyArray = configModel.noProxyArray;
            //     this.$data.proxyAuthenticationNeeded = username != "" || password != "";
            //     this.$data.proxyUsername = username;
            //     this.$data.proxyPassword = password;
            //     let noProxy = "";
            //     let count = 0;
            //     for (let el of noProxyArray) {
            //         if (count > 0) {
            //             noProxy += ", ";
            //         }
            //         noProxy += el["@id"];
            //         count++;
            //     }
            //     this.$data.proxyNoProxy = noProxy;
            //     const loglevelTmp = configModel.logLevel;
            //     this.$data.logLevel = loglevelTmp.substring(loglevelTmp.lastIndexOf("/") +1);
            //     const connectorStatusTmp = configModel.connectorStatus;
            //     this.$data.connectorStatus = connectorStatusTmp.substring(connectorStatusTmp.lastIndexOf("/")+1);
            //     const connectorDeployModeTmp = configModel.connectorDeployMode;
            //     this.$data.connectorDeployMode = connectorDeployModeTmp.substring(connectorDeployModeTmp.lastIndexOf("/")+1);
            //     this.$data.trustStoreUrl = configModel.trustStoreUrl;
            //     this.$data.trustStorePassword = configModel.trustStorePassword;
            //     this.$data.keyStoreUrl = configModel.keyStoreUrl;
            //     this.$data.keyStorePassword = configModel.keyStorePassword;
            // }

            // response = await dataUtils.getConnectorSettings();
            // if (response.name !== undefined && response.name == "Error") {
            //     this.$root.$emit('error', "Get connector settings failed.");
            // } else {
            //     let connector = response;
            //     this.$data.connectorTitle = connector.title;
            //     this.$data.connectorDescription = connector.description;
            //     this.$data.connectorEndpoint = connector.endpoint;
            //     this.$data.connectorVersion = connector.version;
            //     this.$data.connectorCurator = connector.curator;
            //     this.$data.connectorMaintainer = connector.maintainer;
            //     this.$data.connectorInboundModelVersion = connector.inboundModelVersion;
            //     this.$data.connectorOutboundModelVersion = connector.outboundModelVersion;
            // }

            this.$root.$emit('showBusyIndicator', false);
        },
        async saveSettings() {
            // let error = false;
            // this.$data.saveMessage = "";
            // this.$root.$emit('showBusyIndicator', true);
            // let proxyUrl = null;
            // if (this.$data.proxyUrl.trim() != "") {
            //     proxyUrl = this.$data.proxyUrl;
            // }
            // let username = null;
            // let password = null;
            // if (this.$data.proxyAuthenticationNeeded) {
            //     if (this.$data.proxyUsername.trim() != "") {
            //         username = this.$data.proxyUsername;
            //     }
            //     if (this.$data.proxyPassword.trim() != "") {
            //         password = this.$data.proxyPassword;
            //     }
            // }
            // let response = await dataUtils.changeDeployMethod(this.$data.deployMethod);
            // if (response.name !== undefined && response.name == "Error") {
            //     this.$root.$emit('error', "Save deploy method failed.");
            //     error = true;
            // }

            // response = await dataUtils.changeConfigModel(this.$data.logLevel, this.$data.connectorDeployMode,
            //     this.$data.trustStoreUrl, this.$data.trustStorePassword, this.$data.keyStoreUrl, this.$data.keyStorePassword,
            //     proxyUrl, this.$data.proxyNoProxy, username, password);
            // if (response.name !== undefined && response.name == "Error") {
            //     this.$root.$emit('error', "Save config model failed.");
            //     error = true;
            // }

            // response = await dataUtils.changeConnectorSettings(this.$data.connectorTitle, this.$data.connectorDescription,
            //     this.$data.connectorEndpoint, "v" + this.$data.connectorVersion, this.$data.connectorCurator,
            //     this.$data.connectorMaintainer, this.$data.connectorInboundModelVersion, this.$data.connectorOutboundModelVersion);
            // if (response.name !== undefined && response.name == "Error") {
            //     this.$root.$emit('error', "Save connector settings failed.");
            //     error = true;
            // }

            // this.$root.$emit('showBusyIndicator', false);
            // if (!error) {
            //     this.$data.saveMessage = "Successfully saved.";
            // }
        }
    }
};
