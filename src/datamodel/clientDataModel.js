import dataUtils from "@/utils/dataUtils";

export default {
    createResource(url, id, creationDate, title, description, language, paymentMethod, keywords, version,
        standardLicense, publisher, fileType, contractName, policyNames, contractPeriodFromValue, contractPeriodToValue,
        ruleIds, ruleJsons, artifactId, representationId, brokerUris, samples, catalogs, additional,
        endpointDocumentation = {}) {
        let resource = {};
        if (url === undefined) {
            resource.url = "";
        } else {
            resource.url = url;
        }
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
        if (paymentMethod === undefined) {
            resource.paymentMethod = "";
        } else {
            resource.paymentMethod = paymentMethod;
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
        if (endpointDocumentation === undefined) {
            resource.endpointDocumentation = "";
        } else {
            resource.endpointDocumentation = endpointDocumentation;
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
        if (policyNames === undefined) {
            resource.policyNames = [];
        } else {
            resource.policyNames = policyNames;
        }
        if (contractName === undefined) {
            resource.contractName = "";
        } else {
            resource.contractName = contractName;
        }
        if (contractPeriodFromValue === undefined) {
            resource.contractPeriodFromValue = "";
        } else {
            resource.contractPeriodFromValue = contractPeriodFromValue.substring(0, 10);
        }
        if (contractPeriodToValue === undefined) {
            resource.contractPeriodToValue = "";
        } else {
            resource.contractPeriodToValue = contractPeriodToValue.substring(0, 10);
        }
        if (ruleIds === undefined) {
            resource.ruleIds = [];
        } else {
            resource.ruleIds = ruleIds;
        }
        if (ruleJsons === undefined) {
            resource.ruleJsons = [];
        } else {
            resource.ruleJsons = ruleJsons;
        }
        if (artifactId === undefined) {
            resource.artifactId = "";
        } else {
            resource.artifactId = artifactId;
        }
        if (representationId === undefined) {
            resource.representationId = "";
        } else {
            resource.representationId = representationId;
        }
        if (brokerUris === undefined) {
            resource.brokerUris = [];
        } else {
            resource.brokerUris = brokerUris;
        }
        if (samples === undefined) {
            resource.samples = [];
        } else {
            resource.samples = samples;
        }
        if (catalogs === undefined) {
            resource.catalogs = [];
        } else {
            resource.catalogs = catalogs;
        }
        if (additional === undefined) {
            resource.additional = {};
        } else {
            resource.additional = additional;
        }
        return resource;
    },

    createConnectorConfig(id, connectorId, title, description, endpoint, version, curator, maintainer, inboundModelVersion, outboundModelVersion,
        useProxy, proxyUrl, proxyUsername, proxyPassword, noProxyArray, logLevel, connectorStatus, connectorDeployMode, trustStoreUrl, trustStorePassword,
        trustStoreAlias, keyStoreUrl, keyStorePassword, keyStoreAlias) {
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
        if (connectorId === undefined) {
            configuration.connectorId = "";
        } else {
            configuration.connectorId = connectorId;
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
        if (useProxy === undefined) {
            configuration.useProxy = false;
        } else {
            configuration.useProxy = useProxy;
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
        if (trustStoreAlias === undefined) {
            configuration.trustStoreAlias = "";
        } else {
            configuration.trustStoreAlias = trustStoreAlias;
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
        if (keyStoreAlias === undefined) {
            configuration.keyStoreAlias = "";
        } else {
            configuration.keyStoreAlias = keyStoreAlias;
        }

        return configuration;
    },

    createGenericEndpoint(id, accessUrl, username, password, apiKey, type, driverClassName, camelSqlUri, title, description) {
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

        if (apiKey === undefined) {
            genericEndpoint.apiKey = "";
        } else {
            genericEndpoint.apiKey = apiKey;
        }

        if (type === undefined) {
            genericEndpoint.type = "";
        } else {
            genericEndpoint.type = type;
        }

        if (driverClassName === undefined) {
            genericEndpoint.driverClassName = "";
        } else {
            genericEndpoint.driverClassName = driverClassName;
        }

        if (camelSqlUri === undefined) {
            genericEndpoint.camelSqlUri = "";
        } else {
            genericEndpoint.camelSqlUri = camelSqlUri;
        }

        if (title === undefined) {
            genericEndpoint.title = "";
        } else {
            genericEndpoint.title = title;
        }

        if (description === undefined) {
            genericEndpoint.description = "";
        } else {
            genericEndpoint.description = description;
        }

        return genericEndpoint;
    },

    convertIdsGenericEndpoint(genericEndpoint, dataSource) {
        let id = dataUtils.getIdOfConnectorResponse(genericEndpoint);
        let accessUrl = undefined;
        let driverClassName = undefined;
        let camelSqlUri = undefined;
        if (dataSource.type == "REST" || dataSource.type == "Other") {
            accessUrl = genericEndpoint.location;
        } else {
            accessUrl = dataSource.url;
            driverClassName = dataSource.driverClassName;
            camelSqlUri = genericEndpoint.location;
        }
        let username = undefined;
        let password = undefined;
        let apiKey = undefined;
        let title = genericEndpoint.additional !== undefined ? genericEndpoint.additional.title : undefined;
        let description = genericEndpoint.additional !== undefined ? genericEndpoint.additional.description : undefined;
        return this.createGenericEndpoint(id, accessUrl, username, password, apiKey, genericEndpoint.type, driverClassName, camelSqlUri, title, description);
    },

    createApp(id, title, description, type) {
        let app = {};
        if (id === undefined) {
            app.id = "";
        } else {
            app.id = id;
        }

        if (title === undefined) {
            app.title = "";
        } else {
            app.title = title;
        }

        if (description === undefined) {
            app.description = "";
        } else {
            app.description = description;
        }

        if (type === undefined) {
            app.type = "";
        } else {
            app.type = type;
        }

        return app;
    },

    convertIdsApp(idsApp) {
        let id = dataUtils.getIdOfConnectorResponse(idsApp);
        return this.createApp(id, idsApp.title, idsApp.description, "APP");
    },

    convertIdsResource(idsResource, representation, contractName, policyNames, contractPeriodFromValue, contractPeriodToValue, ruleIds, ruleJsons, artifactId, brokerUris, catalogs) {
        let title = idsResource.title;
        if (title.includes("\"@en")) {
            title = idsResource.title.substring(1, idsResource.title.lastIndexOf("\""));
        }
        let description = idsResource.description
        if (description.includes("\"@en")) {
            description = idsResource.description.substring(1, idsResource.description.lastIndexOf("\""));
        }
        let fileType = undefined;
        let representationId = undefined;
        if (representation !== undefined) {
            fileType = representation.mediaType;
            representationId = dataUtils.getIdOfConnectorResponse(representation);
        }

        return this.createResource(idsResource._links.self.href, dataUtils.getIdOfConnectorResponse(idsResource), idsResource.creationDate, title, description,
            idsResource.language.replace("https://w3id.org/idsa/code/", ""), idsResource.paymentModality, idsResource.keywords,
            idsResource.version, idsResource.license, idsResource.publisher, fileType, contractName, policyNames, contractPeriodFromValue, contractPeriodToValue, ruleIds, ruleJsons, artifactId, representationId, brokerUris,
            idsResource.samples, catalogs, idsResource.additional,idsResource.endpointDocumentation);
    },


    convertIdsConfiguration(idsConfiguration) {
        let id = "";
        let connectorId = "";
        let title = "";
        let description = "";
        let endpoint = "";
        let version = "";
        let curator = "";
        let maintainer = "";
        let inboundModelVersion = "";
        let outboundModelVersion = "";
        let useProxy = false;
        let proxyUrl = "";
        let username = "";
        let password = "";
        let noProxyArray = "";
        let logLevel = "";
        let connectorStatus = "";
        let connectorDeployMode = "";
        let trustStoreUrl = "";
        let trustStorePassword = "";
        let trustStoreAlias = "";
        let keyStoreUrl = "";
        let keyStorePassword = "";
        let keyStoreAlias = "";

        if (idsConfiguration !== undefined) {
            id = dataUtils.getIdOfConnectorResponse(idsConfiguration);
            connectorId = idsConfiguration.connectorId;
            title = idsConfiguration.title;
            description = idsConfiguration.description;
            endpoint = idsConfiguration.defaultEndpoint;
            version = idsConfiguration.version;
            curator = idsConfiguration.curator;
            maintainer = idsConfiguration.maintainer;
            inboundModelVersion = idsConfiguration.inboundModelVersion;
            outboundModelVersion = idsConfiguration.outboundModelVersion;


            if (idsConfiguration.proxy !== undefined && idsConfiguration.proxy != null) {
                useProxy = true;
                proxyUrl = idsConfiguration.proxy.location;
                noProxyArray = idsConfiguration.proxy.exclusions;
                if (idsConfiguration.proxy.authenticationSet) {
                    username = "••••";
                    password = "••••";
                }
            }
            logLevel = idsConfiguration.logLevel;
            connectorDeployMode = idsConfiguration.deployMode;
            trustStoreUrl = idsConfiguration.trustStore.location;
            trustStoreAlias = idsConfiguration.trustStore.alias;
            keyStoreUrl = idsConfiguration.keyStore.location;
            keyStoreAlias = idsConfiguration.keyStore.alias;
        }

        return this.createConnectorConfig(id, connectorId, title, description, endpoint, version, curator, maintainer, inboundModelVersion, outboundModelVersion,
            useProxy, proxyUrl, username, password, noProxyArray, logLevel, connectorStatus, connectorDeployMode, trustStoreUrl, trustStorePassword, trustStoreAlias,
            keyStoreUrl, keyStorePassword, keyStoreAlias);
    }
}
