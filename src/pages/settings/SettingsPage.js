import dataUtils from "@/utils/dataUtils";
import errorUtils from "../../utils/errorUtils";
// import errorUtils from "../../utils/errorUtils";
import validationUtils from "../../utils/validationUtils";

export default {
    components: {},
    data() {
        return {
            configId: "",
            proxyAuthenticationNeeded: false,
            useProxy: "false",
            proxyUrl: "",
            proxyUsername: "",
            proxyPassword: "",
            proxyNoProxy: "",
            showPassword: false,
            logLevels: [],
            logLevel: "",
            connectorStatus: "",
            connectorDeployModes: [],
            connectorDeployMode: "",
            trustStoreUrl: "",
            trustStorePassword: "",
            trustStoreAlias: "",
            keyStoreUrl: "",
            keyStorePassword: "",
            keyStoreAlias: "",
            showPasswordTrustStore: false,
            showPasswordKeyStore: false,
            connectorId: "",
            connectorTitle: "",
            connectorDescription: "",
            defaultEndpoint: "",
            connectorVersion: "",
            connectorCurator: "",
            connectorMaintainer: "",
            connectorInboundModelVersion: "",
            connectorOutboundModelVersion: "",
            valid: false,
            urlRule: validationUtils.getUrlNotRequiredRule(),
            urlListRule: validationUtils.getUrlListRule(),
            versionRule: validationUtils.getVersionRule(),
            saveMessage: "",
            trustStorePasswordOriginal: "",
            keyStorePasswordOriginal: "",
            proxyUsernameOriginal: "",
            proxyPasswordOriginal: "",
            updateAvailable: false,
            updateVersion: null
        };
    },
    mounted: function () {
        this.getSettings();
    },
    methods: {
        async getSettings() {
            this.$root.$emit('showBusyIndicator', true);
            try {
                let response = await dataUtils.getDeployMethods();
                this.$data.deployMethods = response;
                this.$data.logLevels = await dataUtils.getLogLevels();

                response = await dataUtils.getConnectorDeployModes();
                this.$data.connectorDeployModes = response;
            }
            catch (error) {
                errorUtils.showError(error, "Get enum values");
            }

            try {
                let configuration = await dataUtils.getConnectorConfiguration();
                this.$data.configId = configuration.id;
                this.$data.connectorId = configuration.connectorId;
                this.$data.connectorTitle = configuration.title;
                this.$data.connectorDescription = configuration.description;
                this.$data.connectorCurator = configuration.curator;
                this.$data.connectorMaintainer = configuration.maintainer;
                this.$data.defaultEndpoint = configuration.endpoint;
                this.$data.connectorInboundModelVersion = configuration.inboundModelVersion;
                this.$data.connectorOutboundModelVersion = configuration.outboundModelVersion;
                this.$data.connectorVersion = configuration.version;
                this.$data.useProxy = configuration.useProxy.toString();
                this.$data.proxyUrl = configuration.proxyUrl;
                let username = configuration.proxyUsername;
                let password = configuration.proxyPassword;
                let noProxyArray = configuration.noProxyArray;
                this.$data.proxyAuthenticationNeeded = username != "" || password != "";
                this.$data.proxyUsername = username;
                this.$data.proxyUsernameOriginal = username;
                this.$data.proxyPassword = password;
                this.$data.proxyPasswordOriginal = password;
                let noProxy = dataUtils.arrayToCommaSeperatedString(noProxyArray);
                this.$data.proxyNoProxy = noProxy;
                this.$data.logLevel = configuration.logLevel;
                this.$data.connectorStatus = configuration.connectorStatus;
                this.$data.connectorDeployMode = configuration.connectorDeployMode;
                this.$data.trustStoreUrl = configuration.trustStoreUrl;
                this.$data.trustStoreAlias = configuration.trustStoreAlias;
                this.$data.trustStorePassword = configuration.trustStorePassword;
                this.$data.trustStorePasswordOriginal = configuration.trustStorePassword;
                this.$data.keyStoreUrl = configuration.keyStoreUrl;
                this.$data.keyStorePassword = configuration.keyStorePassword;
                this.$data.keyStorePasswordOriginal = configuration.keyStorePassword;
                this.$data.keyStoreAlias = configuration.keyStoreAlias;
            }
            catch (error) {
                errorUtils.showError(error, "Get connector settings");
            }

            try {
                let updateInfo = await dataUtils.getConnectorUpdateInfo();
                if (updateInfo.update !== undefined) {
                    this.$data.updateAvailable = updateInfo.update.available;
                    this.$data.updateVersion = updateInfo.update.version;
                } else {
                    this.$data.updateAvailable = false;
                }
            }
            catch (error) {
                errorUtils.showError(error, "Get connector update info");
            }

            this.$root.$emit('showBusyIndicator', false);
        },
        async saveSettings() {
            let hasError = false;
            this.$data.saveMessage = "";
            this.$root.$emit('showBusyIndicator', true);

            let useAuthentication = this.$data.proxyAuthenticationNeeded;
            let proxyUsername = "";
            let proxyPassword = "";
            if (this.$data.proxyAuthenticationNeeded) {
                if (this.$data.proxyUsername.trim() != "") {
                    proxyUsername = this.$data.proxyUsername;
                }
                if (this.$data.proxyPassword.trim() != "") {
                    proxyPassword = this.$data.proxyPassword;
                }
            }
            if (proxyUsername.trim() == this.$data.proxyUsernameOriginal.trim() || proxyUsername.includes("•")) {
                proxyUsername = null;
            }
            if (proxyPassword.trim() == this.$data.proxyPasswordOriginal.trim() || proxyPassword.includes("•")) {
                proxyPassword = null;
            }
            let noProxy = [];
            if (this.$data.proxyNoProxy != null && this.$data.proxyNoProxy.trim() != "") {
                noProxy = this.$data.proxyNoProxy.replace(/ /g, "").split(",");
            }

            let trustStorePassword = this.$data.trustStorePassword;
            if (trustStorePassword.trim() == this.$data.trustStorePasswordOriginal.trim()) {
                trustStorePassword = null;
            }

            let keyStorePassword = this.$data.keyStorePassword;
            if (keyStorePassword.trim() == this.$data.keyStorePasswordOriginal.trim()) {
                keyStorePassword = null;
            }

            try {
                await dataUtils.changeConnectorConfiguration(this.$data.configId, this.$data.connectorId, this.$data.connectorTitle,
                    this.$data.connectorDescription, this.$data.connectorCurator, this.$data.connectorMaintainer, this.$data.useProxy === 'true',
                    this.$data.proxyUrl, noProxy, useAuthentication, proxyUsername, proxyPassword, this.$data.logLevel, this.$data.connectorDeployMode,
                    this.$data.trustStoreUrl, trustStorePassword, this.$data.trustStoreAlias, this.$data.keyStoreUrl, keyStorePassword, this.$data.keyStoreAlias);
            }
            catch (error) {
                errorUtils.showError(error, "Save connector settings");
                hasError = true;
            }

            this.getSettings();
            if (!hasError) {
                this.$data.saveMessage = "Successfully saved.";
            }
        }
    }
};
