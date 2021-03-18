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
            this.$root.$emit('showBusyIndicator', true);
            let promises = [];
            promises.push(await dataUtils.getDeployMethods().then(response => {
                this.$data.deployMethods = response;
            }));

            promises.push(await dataUtils.getLogLevels().then(response => {
                this.$data.logLevels = response;
            }));

            promises.push(await dataUtils.getConnectorStatuses().then(response => {
                this.$data.connectorStatuses = response;
            }));

            promises.push(await dataUtils.getConnectorDeployModes().then(response => {
                this.$data.connectorDeployModes = response;
            }));

            promises.push(await dataUtils.getDeployMethod().then(response => {
                if (response != null && response != "") {
                    this.$data.deployMethod = response[0][1].deployMethod;
                }
            }));

            promises.push(await dataUtils.getConfigModel().then(configModel => {
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
            }));

            promises.push(await dataUtils.getConnectorSettings().then(connector => {
                this.$data.connectorTitle = connector.title;
                this.$data.connectorDescription = connector.description;
                this.$data.connectorEndpoint = connector.endpoint;
                this.$data.connectorVersion = connector.version;
                this.$data.connectorCurator = connector.curator;
                this.$data.connectorMaintainer = connector.maintainer;
                this.$data.connectorInboundModelVersion = connector.inboundModelVersion;
                this.$data.connectorOutboundModelVersion = connector.outboundModelVersion;
            }));

            Promise.all(promises).then(() => {
                this.$root.$emit('showBusyIndicator', false);
            });
        },
        async saveSettings() {
            let savePromises = [];
            this.$data.saveMessage = "";
            this.$root.$emit('showBusyIndicator', true);
            let proxyUrl = null;
            if (this.$data.proxyUrl.trim() != "") {
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
            savePromises.push(await dataUtils.changeDeployMethod(this.$data.deployMethod));
            savePromises.push(await dataUtils.changeConfigModel(this.$data.logLevel, this.$data.connectorDeployMode,
                this.$data.trustStoreUrl, this.$data.trustStorePassword, this.$data.keyStoreUrl, this.$data.keyStorePassword,
                proxyUrl, this.$data.proxyNoProxy, username, password));
            savePromises.push(await dataUtils.changeConnectorSettings(this.$data.connectorTitle, this.$data.connectorDescription,
                this.$data.connectorEndpoint, "v" + this.$data.connectorVersion, this.$data.connectorCurator,
                this.$data.connectorMaintainer, this.$data.connectorInboundModelVersion, this.$data.connectorOutboundModelVersion));
            Promise.all(savePromises).then(() => {
                this.$root.$emit('showBusyIndicator', false);
                this.$data.saveMessage = "Successfully saved.";
            });
        }
    }
};
