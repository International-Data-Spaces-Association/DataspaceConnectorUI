import dataUtils from "@/utils/dataUtils";

export default {
    createResource(id, title, description, language, keywords, version, standardLicense, publisher, contract, sourceType, representationId) {
        let resource = {};
        if (id === undefined) {
            resource.id = "";
        } else {
            resource.id = id;
        }
        if (title === undefined) {
            resource.title = "";
        } else {
            resource.title = title;
        }
        if (description === undefined) {
            resource.description = "";
        } else {
            resource.description = description;
        }
        if (language === undefined) {
            resource.language = "";
        } else {
            resource.language = language;
        }
        resource.keywords = "";
        if (keywords !== undefined) {
            let count = 0;
            for (let keyword of keywords) {
                if (count > 0) {
                    resource.keywords += ", ";
                }
                resource.keywords += keyword["@value"];
                count++;
            }
        }
        if (version === undefined) {
            resource.version = "";
        } else {
            resource.version = version;
        }
        if (standardLicense === undefined) {
            resource.standardLicense = "";
        } else {
            resource.standardLicense = standardLicense;
        }
        if (publisher === undefined) {
            resource.publisher = "";
        } else {
            resource.publisher = publisher;
        }
        if (contract === undefined) {
            resource.contract = "";
            resource.policyName = "";
        } else {
            resource.contract = contract;
            let type;
            if (contract["ids:permission"] !== undefined) {
                type = contract["ids:permission"][0]["ids:description"][0]["@value"];
            } else if (contract["ids:prohibition"] !== undefined) {
                type = contract["ids:prohibition"][0]["ids:description"][0]["@value"];
            }
            resource.policyName = dataUtils.convertDescriptionToPolicyName(type);
        }
        if (sourceType === undefined) {
            resource.sourceType = "";
        } else {
            resource.sourceType = sourceType;
        }
        if (representationId === undefined) {
            resource.representationId = null;
        } else {
            resource.representationId = representationId;
        }
        return resource;
    },

    createConfigModel(proxyUrl, username, password, noProxyArray, logLevel, connectorStatus, connectorDeployMode,
        trustStoreUrl, trustStorePassword, keyStoreUrl, keyStorePassword) {
        let configModel = {};
        if (proxyUrl === undefined) {
            configModel.proxyUrl = "";
        } else {
            configModel.proxyUrl = proxyUrl;
        }
        if (username === undefined || username == "null") {
            configModel.username = "";
        } else {
            configModel.username = username;
        }
        if (password === undefined || password == "null") {
            configModel.password = "";
        } else {
            configModel.password = password;
        }
        if (noProxyArray === undefined) {
            configModel.noProxyArray = [];
        } else {
            configModel.noProxyArray = noProxyArray;
        }
        if (logLevel === undefined) {
            configModel.logLevel = "";
        } else {
            configModel.logLevel = logLevel;
        }
        if (connectorStatus === undefined) {
            configModel.connectorStatus = "";
        } else {
            configModel.connectorStatus = connectorStatus;
        }
        if (connectorDeployMode === undefined) {
            configModel.connectorDeployMode = "";
        } else {
            configModel.connectorDeployMode = connectorDeployMode;
        }
        if (trustStoreUrl === undefined) {
            configModel.trustStoreUrl = "";
        } else {
            configModel.trustStoreUrl = trustStoreUrl;
        }
        if (trustStorePassword === undefined) {
            configModel.trustStorePassword = "";
        } else {
            configModel.trustStorePassword = trustStorePassword;
        }
        if (keyStoreUrl === undefined) {
            configModel.keyStoreUrl = "";
        } else {
            configModel.keyStoreUrl = keyStoreUrl;
        }
        if (keyStorePassword === undefined) {
            configModel.keyStorePassword = "";
        } else {
            configModel.keyStorePassword = keyStorePassword;
        }

        return configModel;
    },

    convertIdsResource(idsResource) {
        let standardLicense = undefined;
        if (idsResource["ids:standardLicense"] !== undefined) {
            standardLicense = idsResource["ids:standardLicense"]["@id"];
        }
        let publisher = undefined;
        if (idsResource["ids:publisher"] !== undefined) {
            publisher = idsResource["ids:publisher"]["@id"];
        }
        let contract = undefined;
        if (idsResource["ids:contractOffer"] !== undefined) {
            contract = idsResource["ids:contractOffer"][0];
        }
        let sourceType = undefined;
        let representationId = null;
        if (idsResource["ids:representation"] !== undefined) {
            sourceType = idsResource["ids:representation"][0]["https://w3id.org/idsa/core/sourceType"]["@value"];
            representationId = idsResource["ids:representation"][0]["@id"];
        }

        return this.createResource(idsResource["@id"], idsResource["ids:title"][0]["@value"], idsResource["ids:description"][0]["@value"],
            idsResource["ids:language"][0]["@id"].replace("idsc:", ""), idsResource["ids:keyword"],
            idsResource["ids:version"], standardLicense, publisher,
            contract, sourceType,
            representationId);
    },


    convertIdsConfigModel(idsConfigModel) {
        console.log(">>> CONVER: ", idsConfigModel);
        let proxyUrl = "";
        let username = "";
        let password = "";
        let noProxyArray = "";
        if (idsConfigModel["ids:connectorProxy"] !== undefined) {
            proxyUrl = idsConfigModel["ids:connectorProxy"][0]["ids:proxyURI"]["@id"];
            username = idsConfigModel["ids:connectorProxy"][0]["ids:proxyAuthentication"]["ids:authUsername"];
            password = idsConfigModel["ids:connectorProxy"][0]["ids:proxyAuthentication"]["ids:authPassword"];
            noProxyArray = idsConfigModel["ids:connectorProxy"][0]["ids:noProxy"];
        }
        let logLevel = idsConfigModel["ids:configurationModelLogLevel"]["@id"].replace("idsc:", "");
        let connectorStatus = idsConfigModel["ids:connectorStatus"]["@id"].replace("idsc:CONNECTOR_", "");
        let connectorDeployMode = idsConfigModel["ids:connectorDeployMode"]["@id"].replace("idsc:", "");
        let trustStoreUrl = idsConfigModel["ids:trustStore"]["@id"];
        let trustStorePassword = idsConfigModel["ids:trustStorePassword"];
        let keyStoreUrl = idsConfigModel["ids:keyStore"]["@id"];
        let keyStorePassword = idsConfigModel["ids:keyStorePassword"];

        return this.createConfigModel(proxyUrl, username, password, noProxyArray, logLevel, connectorStatus,
            connectorDeployMode, trustStoreUrl, trustStorePassword, keyStoreUrl, keyStorePassword);
    }
}
