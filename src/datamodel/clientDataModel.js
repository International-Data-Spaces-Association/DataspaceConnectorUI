import dataUtils from "@/utils/dataUtils";

export default {
    createResource(id, creationDate, title, description, language, keywords, version, standardLicense, publisher, fileType, policyName, contract) {
        let resource = {};
        if (id === undefined) {
            resource.id = "";
        } else {
            resource.id = id;
        }
        if (creationDate === undefined) {
            resource.creationDate = "";
        } else {
            resource.creationDate = creationDate = creationDate.substring(0, 19).replace("T", " ");
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
        if (policyName === undefined) {
            resource.policyName = "";
        } else {
            resource.policyName = policyName;
        }
        if (contract === undefined) {
            resource.contract = "";
        } else {
            resource.contract = contract;
        }
        return resource;
    },

    createConnectorConfig(id, title, description, endpoint, version, curator, maintainer, inboundModelVersion, outboundModelVersion,
        proxyUrl, proxyUsername, proxyPassword, noProxyArray, logLevel, connectorStatus, connectorDeployMode, trustStoreUrl, trustStorePassword,
        keyStoreUrl, keyStorePassword) {
        let configuration = {};
        if (id === undefined) {
            configuration.id = "";
        } else {
            configuration.id = id;
        }
        if (title === undefined) {
            configuration.title = "";
        } else {
            configuration.title = title;
        }
        if (description === undefined) {
            configuration.description = "";
        } else {
            configuration.description = description;
        }
        if (endpoint === undefined) {
            configuration.endpoint = "";
        } else {
            configuration.endpoint = endpoint;
        }
        if (version === undefined) {
            configuration.version = "";
        } else {
            configuration.version = version;
        }
        if (curator === undefined) {
            configuration.curator = "";
        } else {
            configuration.curator = curator;
        }
        if (maintainer === undefined) {
            configuration.maintainer = "";
        } else {
            configuration.maintainer = maintainer;
        }
        if (inboundModelVersion === undefined) {
            configuration.inboundModelVersion = "";
        } else {
            configuration.inboundModelVersion = inboundModelVersion;
        }
        if (outboundModelVersion === undefined) {
            configuration.outboundModelVersion = "";
        } else {
            configuration.outboundModelVersion = outboundModelVersion;
        }
        if (proxyUrl === undefined) {
            configuration.proxyUrl = "";
        } else {
            configuration.proxyUrl = proxyUrl;
        }
        if (proxyUsername === undefined) {
            configuration.proxyUsername = "";
        } else {
            configuration.proxyUsername = proxyUsername;
        }
        if (proxyPassword === undefined) {
            configuration.proxyPassword = "";
        } else {
            configuration.proxyPassword = proxyPassword;
        }
        if (noProxyArray === undefined) {
            configuration.noProxyArray = "";
        } else {
            configuration.noProxyArray = noProxyArray;
        }
        if (logLevel === undefined) {
            configuration.logLevel = "";
        } else {
            configuration.logLevel = logLevel;
        }
        if (connectorStatus === undefined) {
            configuration.connectorStatus = "";
        } else {
            configuration.connectorStatus = connectorStatus;
        }
        if (connectorDeployMode === undefined) {
            configuration.connectorDeployMode = "";
        } else {
            configuration.connectorDeployMode = connectorDeployMode;
        }
        if (trustStoreUrl === undefined) {
            configuration.trustStoreUrl = "";
        } else {
            configuration.trustStoreUrl = trustStoreUrl;
        }
        if (trustStorePassword === undefined) {
            configuration.trustStorePassword = "";
        } else {
            configuration.trustStorePassword = trustStorePassword;
        }
        if (keyStoreUrl === undefined) {
            configuration.keyStoreUrl = "";
        } else {
            configuration.keyStoreUrl = keyStoreUrl;
        }
        if (keyStorePassword === undefined) {
            configuration.keyStorePassword = "";
        } else {
            configuration.keyStorePassword = keyStorePassword;
        }

        return configuration;
    },

    createGenericEndpoint(id, accessUrl, sourceType, dataSourceId, username, password) {
        let genericEndpoint = {};

        if (id === undefined) {
            genericEndpoint.id = "";
        } else {
            genericEndpoint.id = id;
        }

        if (accessUrl === undefined) {
            genericEndpoint.accessUrl = "";
        } else {
            genericEndpoint.accessUrl = accessUrl;
        }

        if (sourceType === undefined) {
            genericEndpoint.sourceType = "";
        } else {
            genericEndpoint.sourceType = sourceType;
        }

        if (dataSourceId === undefined) {
            genericEndpoint.dataSourceId = "";
        } else {
            genericEndpoint.dataSourceId = dataSourceId;
        }

        if (username === undefined) {
            genericEndpoint.username = "";
        } else {
            genericEndpoint.username = username;
        }

        if (password === undefined) {
            genericEndpoint.password = "";
        } else {
            genericEndpoint.password = password;
        }

        return genericEndpoint;
    },

    convertIdsGenericEndpoint(genericEndpoint) {
        let id = dataUtils.getIdOfConnectorResponse(genericEndpoint);
        let accessUrl = undefined;
        accessUrl = genericEndpoint.location;
        let sourceType = undefined;
        let dataSourceId = undefined;
        let username = undefined;
        let password = undefined;
        if (genericEndpoint.datasource !== undefined && genericEndpoint.datasource != null) {
            dataSourceId = genericEndpoint.datasource.id;
            sourceType = genericEndpoint.datasource.type;
            if (genericEndpoint.datasource.authentication !== undefined) {
                username = genericEndpoint.datasource.authentication.username;
                password = genericEndpoint.datasource.authentication.password;
            }
        }
        return this.createGenericEndpoint(id, accessUrl, sourceType, dataSourceId, username, password);
    },

    convertIdsResource(idsResource, representation, policyName, contract) {
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

        return this.createResource(dataUtils.getIdOfConnectorResponse(idsResource), idsResource.creationDate, title, description,
            idsResource.language.replace("https://w3id.org/idsa/code/", ""), idsResource.keywords,
            idsResource.version, idsResource.license, idsResource.publisher, fileType, policyName, contract);
    },


    convertIdsConfiguration(idsConfiguration) {
        let id = "";
        let title = "";
        let description = "";
        let endpoint = "";
        let version = "";
        let curator = "";
        let maintainer = "";
        let inboundModelVersion = "";
        let outboundModelVersion = "";
        let proxyUrl = "";
        let username = "";
        let password = "";
        let noProxyArray = "";
        let logLevel = "";
        let connectorStatus = "";
        let connectorDeployMode = "";
        let trustStoreUrl = "";
        let trustStorePassword = "";
        let keyStoreUrl = "";
        let keyStorePassword = "";

        if (idsConfiguration !== undefined) {
            id = dataUtils.getIdOfConnectorResponse(idsConfiguration);
            title = idsConfiguration.title;
            description = idsConfiguration.description;
            endpoint = idsConfiguration.connectorEndpoint;
            version = idsConfiguration.version;
            curator = idsConfiguration.curator;
            maintainer = idsConfiguration.maintainer;
            inboundModelVersion = idsConfiguration.inboundModelVersion;
            outboundModelVersion = idsConfiguration.outboundModelVersion;


            if (idsConfiguration.proxy !== undefined && idsConfiguration.proxy != null) {
                proxyUrl = idsConfiguration.proxy.location;
                noProxyArray = idsConfiguration.proxy.exclusions;
            }
            logLevel = idsConfiguration.logLevel;
            connectorDeployMode = idsConfiguration.deployMode;
            trustStoreUrl = idsConfiguration.trustStore.name;
            keyStoreUrl = idsConfiguration.keyStore.location;
        }

        return this.createConnectorConfig(id, title, description, endpoint, version, curator, maintainer, inboundModelVersion, outboundModelVersion,
            proxyUrl, username, password, noProxyArray, logLevel, connectorStatus, connectorDeployMode, trustStoreUrl, trustStorePassword,
            keyStoreUrl, keyStorePassword);
    }
}
