import dataUtils from "@/utils/dataUtils";

export default {
    createResource(url, id, creationDate, title, description, language, paymentMethod, keywords, version, standardlicense,
        publisher, fileType, policyNames, ruleIds, ruleJsons, artifactId, representationId, brokerUris, samples) {
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
        if (standardlicense === undefined) {
            resource.standardlicense = "";
        } else {
            resource.standardlicense = standardlicense;
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
        return resource;
    },

    createConnectorConfig(id, title, description, endpoint, version, curator, maintainer, inboundModelVersion, outboundModelVersion,
        useProxy, proxyUrl, proxyUsername, proxyPassword, noProxyArray, logLevel, connectorStatus, connectorDeployMode, trustStoreUrl, trustStorePassword,
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

    createGenericEndpoint(id, accessUrl, dataSourceId, username, password, apiKey, type) {
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

        return genericEndpoint;
    },

    convertIdsGenericEndpoint(genericEndpoint) {
        let id = dataUtils.getIdOfConnectorResponse(genericEndpoint);
        let accessUrl = undefined;
        accessUrl = genericEndpoint.location;
        let dataSourceId = dataUtils.getIdOfLink(genericEndpoint, "dataSource");
        let username = undefined;
        let password = undefined;
        let apiKey = undefined;
        return this.createGenericEndpoint(id, accessUrl, dataSourceId, username, password, apiKey, genericEndpoint.type);
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

    convertIdsResource(idsResource, representation, policyNames, ruleIds, ruleJsons, artifactId, brokerUris) {
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
            idsResource.version, idsResource.license, idsResource.publisher, fileType, policyNames, ruleIds, ruleJsons, artifactId, representationId, brokerUris, idsResource.samples);
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
        let keyStoreUrl = "";
        let keyStorePassword = "";

        if (idsConfiguration !== undefined) {
            id = dataUtils.getIdOfConnectorResponse(idsConfiguration);
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
            keyStoreUrl = idsConfiguration.keyStore.location;
        }

        return this.createConnectorConfig(id, title, description, endpoint, version, curator, maintainer, inboundModelVersion, outboundModelVersion,
            useProxy, proxyUrl, username, password, noProxyArray, logLevel, connectorStatus, connectorDeployMode, trustStoreUrl, trustStorePassword,
            keyStoreUrl, keyStorePassword);
    }
}
