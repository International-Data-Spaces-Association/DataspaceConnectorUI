import dataUtils from "@/utils/dataUtils";

export default {
    createResource(id, title, description, language, keywords, version, standardLicense, publisher, fileType) {
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
        if (keywords === undefined) {
            resource.keywords = "";
        } else {
            resource.keywords = keywords;
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
        if (fileType === undefined) {
            resource.fileType = "";
        } else {
            resource.fileType = fileType;
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

    createConnector(title, description, endpoint, version, curator, maintainer, inboundModelVersion, outboundModelVersion) {
        let connector = {};
        if (title === undefined) {
            connector.title = "";
        } else {
            connector.title = title;
        }
        if (description === undefined) {
            connector.description = "";
        } else {
            connector.description = description;
        }
        if (endpoint === undefined) {
            connector.endpoint = "";
        } else {
            connector.endpoint = endpoint;
        }
        if (version === undefined) {
            connector.version = "";
        } else {
            connector.version = version;
        }
        if (curator === undefined) {
            connector.curator = "";
        } else {
            connector.curator = curator;
        }
        if (maintainer === undefined) {
            connector.maintainer = "";
        } else {
            connector.maintainer = maintainer;
        }
        if (inboundModelVersion === undefined) {
            connector.inboundModelVersion = "";
        } else {
            connector.inboundModelVersion = inboundModelVersion;
        }
        if (outboundModelVersion === undefined) {
            connector.outboundModelVersion = "";
        } else {
            connector.outboundModelVersion = outboundModelVersion;
        }


        return connector;
    },

    convertIdsResource(idsResource, representation, rule) {
        let title = idsResource.title;
        if (title.includes("\"@en")) {
            title = idsResource.title.substring(1, idsResource.title.lastIndexOf("\""));
        }
        let description = idsResource.description
        if (description.includes("\"@en")) {
            description = idsResource.description.substring(1, idsResource.description.lastIndexOf("\""));
        }
        let fileType = undefined;
        if (representation !== undefined) {
            fileType = representation.mediaType;
        }

        return this.createResource(dataUtils.getIdOfConnectorResponse(idsResource), title, description,
            idsResource.language.replace("https://w3id.org/idsa/code/", ""), idsResource.keywords,
            idsResource.version, idsResource.license, idsResource.publisher, fileType);
    },


    convertIdsConfigModel(idsConfigModel) {
        let proxyUrl = "";
        let username = "";
        let password = "";
        let noProxyArray = "";
        if (idsConfigModel["ids:connectorProxy"] !== undefined) {
            proxyUrl = idsConfigModel["ids:connectorProxy"][0]["ids:proxyURI"]["@id"];
            if (idsConfigModel["ids:connectorProxy"][0]["ids:proxyAuthentication"] !== undefined) {
                username = idsConfigModel["ids:connectorProxy"][0]["ids:proxyAuthentication"]["ids:authUsername"];
                password = idsConfigModel["ids:connectorProxy"][0]["ids:proxyAuthentication"]["ids:authPassword"];
            }
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
    },

    convertIdsConnector(idsConnector) {
        let title = "";
        let description = "";
        let endpoint = "";
        let version = "";
        let curator = "";
        let maintainer = "";
        let inboundModelVersion = "";

        if (idsConnector["ids:connectorDescription"] !== undefined) {
            if (idsConnector["ids:connectorDescription"]["ids:title"] !== undefined) {
                title = idsConnector["ids:connectorDescription"]["ids:title"][0]["@value"];
            }

            if (idsConnector["ids:connectorDescription"]["ids:description"] !== undefined) {
                description = idsConnector["ids:connectorDescription"]["ids:description"][0]["@value"];
            }

            if (idsConnector["ids:connectorDescription"]["ids:hasDefaultEndpoint"] !== undefined) {
                endpoint = idsConnector["ids:connectorDescription"]["ids:hasDefaultEndpoint"]["@id"];
            }

            if (idsConnector["ids:connectorDescription"]["ids:version"] !== undefined) {
                version = idsConnector["ids:connectorDescription"]["ids:version"];
            }

            if (idsConnector["ids:connectorDescription"]["ids:curator"] !== undefined) {
                curator = idsConnector["ids:connectorDescription"]["ids:curator"]["@id"];
            }

            if (idsConnector["ids:connectorDescription"]["ids:maintainer"] !== undefined) {
                maintainer = idsConnector["ids:connectorDescription"]["ids:maintainer"]["@id"];
            }

            if (idsConnector["ids:connectorDescription"]["ids:inboundModelVersion"] !== undefined) {
                inboundModelVersion = idsConnector["ids:connectorDescription"]["ids:inboundModelVersion"][0];
            }
        }


        let outboundModelVersion = "";
        if (idsConnector["ids:outboundModelVersion"] !== undefined) {
            outboundModelVersion = idsConnector["ids:outboundModelVersion"];
        }

        return this.createConnector(title, description, endpoint, version, curator, maintainer, inboundModelVersion, outboundModelVersion);
    }
}
