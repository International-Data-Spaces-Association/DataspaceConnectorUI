import moment from 'moment';
import clientDataModel from "@/datamodel/clientDataModel";
import restUtils from "./restUtils";
import errorUtils from './errorUtils';

const POLICY_N_TIMES_USAGE = "N Times Usage";
const POLICY_DURATION_USAGE = "Duration Usage";
const POLICY_USAGE_DURING_INTERVAL = "Usage During Interval";
const POLICY_PROVIDE_ACCESS = "Provide Access";
const POLICY_PROHIBIT_ACCESS = "Prohibit Access";
const POLICY_USAGE_UNTIL_DELETION = "Usage Until Deletion";
const POLICY_USAGE_LOGGING = "Usage Logging";
const POLICY_USAGE_NOTIFICATION = "Usage Notification";
const POLICY_CONNECTOR_RESTRICTED_USAGE = "Connector Restricted Usage";
const POLICY_SECURITY_PROFILE_RESTRICTED_USAGE = "Security Profile Restricted Usage";

const POLICY_DESCRIPTION_TO_NAME = {
    "provide-access": POLICY_PROVIDE_ACCESS,
    "prohibit-access": POLICY_PROHIBIT_ACCESS,
    "n-times-usage": POLICY_N_TIMES_USAGE,
    "duration-usage": POLICY_DURATION_USAGE,
    "usage-during-interval": POLICY_USAGE_DURING_INTERVAL,
    "usage-until-deletion": POLICY_USAGE_UNTIL_DELETION,
    "usage-logging": POLICY_USAGE_LOGGING,
    "usage-notification": POLICY_USAGE_NOTIFICATION,
    "connector-restricted-usage": POLICY_CONNECTOR_RESTRICTED_USAGE,
    "security-profile-restricted-usage": POLICY_SECURITY_PROFILE_RESTRICTED_USAGE
};

const POLICY_TYPE_TO_DISPLAY_NAME = {
    "PROVIDE_ACCESS": POLICY_PROVIDE_ACCESS,
    "PROHIBIT_ACCESS": POLICY_PROHIBIT_ACCESS,
    "N_TIMES_USAGE": POLICY_N_TIMES_USAGE,
    "DURATION_USAGE": POLICY_DURATION_USAGE,
    "USAGE_DURING_INTERVAL": POLICY_USAGE_DURING_INTERVAL,
    "USAGE_UNTIL_DELETION": POLICY_USAGE_UNTIL_DELETION,
    "USAGE_LOGGING": POLICY_USAGE_LOGGING,
    "USAGE_NOTIFICATION": POLICY_USAGE_NOTIFICATION,
    "CONNECTOR_RESTRICTED_USAGE": POLICY_CONNECTOR_RESTRICTED_USAGE,
    "SECURITY_PROFILE_RESTRICTED_USAGE": POLICY_SECURITY_PROFILE_RESTRICTED_USAGE
}

const OPERATOR_TYPE_TO_SYMBOL = {
    "https://w3id.org/idsa/code/EQ": "=",
    "https://w3id.org/idsa/code/LTEQ": "<=",
    "https://w3id.org/idsa/code/LT": "<",
};

const IDS_PAYMENT_METHOD_TO_NAME = {
    "https://w3id.org/idsa/code/NEGOTIATION_BASIS": "negotiationBasis",
    "https://w3id.org/idsa/code/FREE": "free",
    "https://w3id.org/idsa/code/FIXED_PRICE": "fixedPrice",
    "https://w3id.org/idsa/code/UNDEFINED": "undefined"
};

let languages = null;
let connectorUrl = "https://localhost:8080"
console.log("CONNECTOR_URL", process.env.CONNECTOR_URL);
if (process.env.CONNECTOR_URL !== undefined) {
    connectorUrl = process.env.CONNECTOR_URL;
}

export default {
    POLICY_PROVIDE_ACCESS,
    POLICY_PROHIBIT_ACCESS,
    POLICY_N_TIMES_USAGE,
    POLICY_DURATION_USAGE,
    POLICY_USAGE_DURING_INTERVAL,
    POLICY_USAGE_UNTIL_DELETION,
    POLICY_USAGE_LOGGING,

    getPolicyNames() {
        return Object.values(POLICY_DESCRIPTION_TO_NAME);
    },

    getPolicyTypes() {
        return Object.keys(POLICY_TYPE_TO_DISPLAY_NAME);
    },

    getPolicyDisplayName(type) {
        return POLICY_TYPE_TO_DISPLAY_NAME[type];
    },

    getPaymentMethodName(idsName) {
        return IDS_PAYMENT_METHOD_TO_NAME[idsName];
    },

    getValue(data, name) {
        let value = "-";
        if (data[name] !== undefined && data[name] != null) {
            if (Array.isArray(data[name])) {
                value = data[name][0]["@value"];
            } else {
                value = data[name]["@id"];
            }
        }
        return value;
    },

    convertDescriptionToPolicyName(type) {
        return POLICY_DESCRIPTION_TO_NAME[type];
    },

    convertPolicyNameToType(name) {
        let type = null;
        for (let key in POLICY_TYPE_TO_DISPLAY_NAME) {
            if (name == POLICY_TYPE_TO_DISPLAY_NAME[key]) {
                type = key;
                break;
            }
        }
        return type;
    },

    convertOperatorTypeToSymbol(type) {
        return OPERATOR_TYPE_TO_SYMBOL[type];
    },

    convertOperatorSymbolToType(symbol) {
        let type = "";
        for (let [key, value] of Object.entries(OPERATOR_TYPE_TO_SYMBOL)) {
            if (value == symbol) {
                type = key;
                break;
            }
        }
        return type;
    },

    arrayToCommaSeperatedString(arr) {
        let str = "";
        let count = 0;
        for (let el of arr) {
            if (count > 0) {
                str += ", ";
            }
            str += el;
            count++;
        }
        return str
    },

    commaSeperatedStringToArray(str) {
        return str.replace(/ /g, "").split(",");
    },

    async getOfferedResourcesStats() {
        let totalNumber = 0;
        let totalSize = 0;
        let response = await restUtils.callConnector("GET", "/api/offers");
        totalNumber = response.page.totalElements;
        response = await restUtils.callConnector("GET", "/api/artifacts");
        let artifacts = response._embedded.artifacts;
        for (let artifact of artifacts) {
            totalSize += artifact.byteSize;
        }
        return {
            totalNumber: totalNumber,
            totalSize: totalSize
        };
    },

    async getOfferedResourcesFileTypes() {
        let response = await restUtils.callConnector("GET", "/api/representations");
        let representations = response._embedded.representations;
        let fileTypes = [];
        for (let representation of representations) {
            let type = representation.mediaType;
            if (fileTypes[type] === undefined) {
                fileTypes[type] = 1;
            } else {
                fileTypes[type] = fileTypes[type] + 1;
            }
        }
        return fileTypes;
    },

    async getResources() {
        let response = (await restUtils.callConnector("GET", "/api/offers"))["_embedded"].resources;
        let resources = [];
        for (let idsResource of response) {
            resources.push(clientDataModel.convertIdsResource(idsResource));
        }
        return resources;
    },

    async getRequestedResources() {
        let response = (await restUtils.callConnector("GET", "/api/requests"))["_embedded"].resources;
        let resources = [];
        for (let idsResource of response) {
            resources.push(clientDataModel.convertIdsResource(idsResource));
        }
        return resources;
    },

    async getResource(resourceId) {
        let resource = await restUtils.callConnector("GET", "/api/offers/" + resourceId);
        let policyNames = [];
        let ruleIds = [];
        let ruleJsons = [];
        let contracts = (await restUtils.callConnector("GET", "/api/offers/" + resourceId + "/contracts"))["_embedded"].contracts;
        if (contracts.length > 0) {
            let contract = contracts[0];
            let contractId = this.getIdOfConnectorResponse(contract);
            let rules = (await restUtils.callConnector("GET", "/api/contracts/" + contractId + "/rules"))["_embedded"].rules;
            for (let rule of rules) {
                policyNames.push(await restUtils.callConnector("POST", "/api/examples/validation", null, rule.value));
                ruleIds.push(this.getIdOfConnectorResponse(rule));
                ruleJsons.push(JSON.parse(rule.value));
            }
        }
        let representations = (await restUtils.callConnector("GET", "/api/offers/" + resourceId + "/representations"))["_embedded"].representations;
        let representation = undefined;
        let artifactId = undefined;
        if (representations.length > 0) {
            representation = representations[0];
            let representationId = this.getIdOfConnectorResponse(representation);
            let artifacts = (await restUtils.callConnector("GET", "/api/representations/" + representationId + "/artifacts"))["_embedded"].artifacts;
            if (artifacts.length > 0) {
                artifactId = this.getIdOfConnectorResponse(artifacts[0]);
            }
        }
        let brokers = await this.getBrokersOfResource(resourceId);
        let brokerUris = brokers.map(x => x.location);
        return clientDataModel.convertIdsResource(resource, representation, policyNames, ruleIds, ruleJsons, artifactId, brokerUris);
    },

    async getRequestedResource(resourceId) {
        let resource = await restUtils.callConnector("GET", "/api/requests/" + resourceId);
        let policyNames = [];
        let ruleIds = [];
        let ruleJsons = [];
        let contracts = (await restUtils.callConnector("GET", "/api/requests/" + resourceId + "/contracts"))["_embedded"].contracts;
        if (contracts.length > 0) {
            let contract = contracts[0];
            let contractId = this.getIdOfConnectorResponse(contract);
            let rules = (await restUtils.callConnector("GET", "/api/contracts/" + contractId + "/rules"))["_embedded"].rules;
            for (let rule of rules) {
                policyNames.push(await restUtils.callConnector("POST", "/api/examples/validation", null, rule.value));
                ruleIds.push(this.getIdOfConnectorResponse(rule));
                ruleJsons.push(JSON.parse(rule.value));
            }
        }
        let representations = (await restUtils.callConnector("GET", "/api/requests/" + resourceId + "/representations"))["_embedded"].representations;
        let representation = undefined;
        let artifactId = undefined;
        if (representations.length > 0) {
            representation = representations[0];
            let representationId = this.getIdOfConnectorResponse(representation);
            let artifacts = (await restUtils.callConnector("GET", "/api/representations/" + representationId + "/artifacts"))["_embedded"].artifacts;
            if (artifacts.length > 0) {
                artifactId = this.getIdOfConnectorResponse(artifacts[0]);
            }
        }
        return clientDataModel.convertIdsResource(resource, representation, policyNames, ruleIds, ruleJsons, artifactId);
    },

    async getPolicyNameByPattern(pattern) {
        return await restUtils.callConnector("POST", "/api/examples/validation", null, pattern);
    },

    async getArtifactAgreements(artifactId) {
        return (await restUtils.callConnector("GET", "/api/artifacts/" + artifactId + "/agreements"))["_embedded"].agreements;
    },

    async getAgreementArtifacts(agreementId) {
        return (await restUtils.callConnector("GET", "/api/agreements/" + agreementId + "/artifacts"))["_embedded"].artifacts;
    },

    async getLanguages() {
        if (languages == null) {
            let languages = (await restUtils.callConnector("GET", "/api/configmanager/enum/Language"));
            return languages;
        } else {
            return languages;
        }
    },

    async getPaymentMethods() {
        return await restUtils.callConnector("GET", "/api/configmanager/enum/paymentmethod");
    },

    async getSecurityProfiles() {
        return await restUtils.callConnector("GET", "/api/configmanager/enum/securityprofile");
    },

    async registerConnectorAtBroker(brokerUri) {
        await this.initDefaultCatalog();
        try {
            let params = {
                "recipient": brokerUri
            };
            await restUtils.callConnector("POST", "/api/ids/connector/update", params);
        } catch (error) {
            errorUtils.showError(error, "Register connector at broker");
        }
    },

    async unregisterConnectorAtBroker(brokerUri) {
        try {
            let params = {
                "recipient": brokerUri
            };
            await restUtils.callConnector("POST", "/api/ids/connector/unavailable", params);
        } catch (error) {
            errorUtils.showError(error, "Unregister connector at broker");
        }
    },

    async getBrokersOfResource(resourceId) {
        return (await restUtils.callConnector("GET", "/api/offers/" + resourceId + "/brokers"))._embedded.brokers;
    },

    async updateResourceAtBroker(brokerUri, resourceId) {
        let params = {
            "recipient": brokerUri,
            "resourceId": resourceId
        };
        await restUtils.callConnector("POST", "/api/ids/resource/update", params);
    },

    async deleteResourceAtBroker(brokerUri, resourceId) {
        let params = {
            "recipient": brokerUri,
            "resourceId": resourceId
        };
        await restUtils.callConnector("POST", "/api/ids/resource/unavailable", params);
    },

    toRegisterStatusClass(brokerStatus) {
        let statusClass = "notRegisteredAtBroker";
        if (brokerStatus == "Registered") {
            statusClass = "registeredAtBroker";
        }
        return statusClass;
    },

    async getAppStores() {
        return await restUtils.callConnector("GET", "/api/appstores");
    },

    async createAppStore(url, title) {
        try {
            await restUtils.callConnector("POST", "/api/appstores", null, {
                "location": url,
                "title": title
            });
        } catch (error) {
            errorUtils.showError(error, "Create broker");
        }
    },

    async updateAppStore(id, url, title) {
        try {
            await restUtils.callConnector("PUT", "/api/appstores/" + id, null, {
                "location": url,
                "title": title
            });
        } catch (error) {
            errorUtils.showError(error, "Update broker");
        }
    },

    async deleteAppStore(id) {
        return await restUtils.callConnector("DELETE", "/api/appstores/" + id);
    },

    async getBrokers() {
        return await restUtils.callConnector("GET", "/api/brokers");
    },

    async createBroker(url, title) {
        try {
            await restUtils.callConnector("POST", "/api/brokers", null, {
                "location": url,
                "title": title
            });
        } catch (error) {
            errorUtils.showError(error, "Create broker");
        }
    },

    async updateBroker(id, url, title) {
        try {
            await restUtils.callConnector("PUT", "/api/brokers/" + id, null, {
                "location": url,
                "title": title
            });
        } catch (error) {
            errorUtils.showError(error, "Update broker");
        }
    },

    async deleteBroker(brokerId) {
        return await restUtils.callConnector("DELETE", "/api/brokers/" + brokerId);
    },

    async getDataSource(id) {
        return await restUtils.callConnector("GET", "/api/datasources/" + id);
    },

    async getGenericEndpoints() {
        let genericEndpoints = [];
        let idsEndpoints = (await restUtils.callConnector("GET", "/api/endpoints"))._embedded.endpoints;
        if (idsEndpoints !== undefined) {
            for (let idsEndpoint of idsEndpoints) {
                if (idsEndpoint.type == "GENERIC") {
                    genericEndpoints.push(clientDataModel.convertIdsGenericEndpoint(idsEndpoint));
                }
            }
        }

        return genericEndpoints;
    },

    async createGenericEndpoint(url, username, password, apiKey, sourceType) {
        let response = await restUtils.callConnector("POST", "/api/endpoints", null, {
            "location": url,
            "type": "GENERIC"
        });
        let genericEndpointId = this.getIdOfConnectorResponse(response);

        let authentication = null;
        if (username != null) {
            authentication = {
                "key": username,
                "value": password
            };
        } else {
            authentication = {
                "value": apiKey
            };
        }
        response = await restUtils.callConnector("POST", "/api/datasources", null, {
            "authentication": authentication,
            "type": sourceType
        });
        let dataSourceId = this.getIdOfConnectorResponse(response);

        // dataSourceId is needed with double quotes at start and end for this API call
        await restUtils.callConnector("PUT", "/api/endpoints/" + genericEndpointId + "/datasource/" + dataSourceId);
    },

    async updateGenericEndpoint(id, dataSourceId, url, username, password, sourceType) {
        await restUtils.callConnector("PUT", "/api/endpoints/" + id, null, {
            "location": url,
            "type": "GENERIC"
        });

        await restUtils.callConnector("PUT", "/api/datasources/" + dataSourceId, null, {
            "authentication": {
                "key": username,
                "value": password
            },
            "type": sourceType
        });
    },

    async deleteGenericEndpoint(id, dataSourceId) {
        await restUtils.callConnector("DELETE", "/api/endpoints/" + id);
        await restUtils.callConnector("DELETE", "/api/datasources/" + dataSourceId);
    },

    async deleteResource(id) {
        try {
            let brokers = await this.getBrokersOfResource(id);
            for (let broker of brokers) {
                await this.deleteResourceAtBroker(broker.location, id);
            }
        } catch (error) {
            errorUtils.showError(error, "Remove resource from broker");
        }
        let resource = await this.getResource(id);
        await restUtils.callConnector("DELETE", "/api/offers/" + resource.id);
        await restUtils.callConnector("DELETE", "/api/representations/" + resource.representationId);
        await restUtils.callConnector("DELETE", "/api/artifacts/" + resource.artifactId);
    },

    async getRoute(id) {
        return await restUtils.callConnector("GET", "/api/routes/" + id);
    },

    async getRouteSteps(id) {
        return (await restUtils.callConnector("GET", "/api/routes/" + id + "/steps"))._embedded.routes;
    },

    async getRouteOutput(id) {
        return (await restUtils.callConnector("GET", "/api/routes/" + id + "/outputs"))._embedded.artifacts;
    },

    async deleteRoute(id) {
        await restUtils.callConnector("DELETE", "/api/routes/" + id);
    },

    async getEndpointList(node) {
        let endpointList = [];
        if (node.type == "backendnode") {
            let endpoint = await this.getGenericEndpoint(node.objectId);
            endpointList.push(endpoint);
        } else if (node.type == "appnode") {
            let endpoint = await this.getApp(node.objectId);
            endpointList.push(endpoint);
        }
        return endpointList;
    },

    async getGenericEndpoint(id) {
        let idsGenericEndpoint = await await restUtils.callConnector("GET", "/api/endpoints/" + id);
        return clientDataModel.convertIdsGenericEndpoint(idsGenericEndpoint);
    },

    getAppIdOfEndpointId() {
        let result = null;
        // for (let app of apps) {
        //     for (let appEndpoint of app.appEndpointList[1]) {
        //         if (endpointId == appEndpoint[1].endpoint["@id"]) {
        //             result = app.id;
        //             break;
        //         }
        //     }
        // }
        return result;
    },

    getNode(id, nodes) {
        let node = null;
        for (let n of nodes) {
            if (n.id == id) {
                node = n;
                break;
            }
        }
        return node;
    },

    getNodeIdByObjectId(endpointId, nodes) {
        let nodeId = null;
        for (let n of nodes) {
            if (n.objectId == endpointId) {
                nodeId = n.id;
                break;
            }
        }
        return nodeId;
    },

    getCurrentDate() {
        return moment().format("YYYY-MM-DD");
    },

    async getConnectorAddress() {
        return connectorUrl;
    },

    async createConnectorEndpoint(artifactId) {
        let connectorAddress = (await this.getConnectorAddress());
        let accessUrl = connectorAddress + "/api/artifacts/" + artifactId + "/data";

        return await restUtils.callConnector("POST", "/api/endpoints", null, {
            "location": accessUrl,
            "type": "CONNECTOR"
        });
    },

    getIdOfConnectorResponse(response) {
        return this.getIdOfLink(response, "self");
    },

    getIdOfLink(response, linkName) {
        let url = response._links.[linkName].href;
        return url.substring(url.lastIndexOf("/") + 1, url.length);
    },

    getIdOfAgreement(agreementLink) {
        let id = agreementLink.replace("https://localhost:8080/api/agreements/", "");
        id = id.replace("/artifacts{?page,size}", "");
        return id;
    },

    async getDefaultCatalogId() {
        let defaultCatalogId = -1;
        let catalogs = (await restUtils.callConnector("GET", "/api/catalogs"))._embedded.catalogs;
        if (catalogs.length > 0) {
            defaultCatalogId = this.getIdOfConnectorResponse(catalogs[0]);
        } else {
            await restUtils.callConnector("POST", "/api/catalogs", null, {
                "title": "Default catalog"
            });
            catalogs = (await restUtils.callConnector("GET", "/api/catalogs"))._embedded.catalogs;
            defaultCatalogId = this.getIdOfConnectorResponse(catalogs[0]);
        }
        return defaultCatalogId;
    },

    async initDefaultCatalog() {
        let catalogs = (await restUtils.callConnector("GET", "/api/catalogs"))._embedded.catalogs;
        if (catalogs.length == 0) {
            await restUtils.callConnector("POST", "/api/catalogs", null, {
                "title": "Default catalog"
            });
            catalogs = (await restUtils.callConnector("GET", "/api/catalogs"))._embedded.catalogs;
            this.getIdOfConnectorResponse(catalogs[0]);
        }
    },

    async createResourceWithMinimalRoute(title, description, language, paymentMethod, keywords, standardlicense, publisher, policyDescriptions,
        filetype, brokerUris, genericEndpoint) {
        try {
            let resourceResponse = await this.createResource(title, description, language, paymentMethod, keywords, standardlicense, publisher, policyDescriptions, filetype, genericEndpoint);
            let response = await this.createNewRoute(this.getCurrentDate() + " - " + title);
            let routeId = this.getIdOfConnectorResponse(response);
            response = await this.createSubRoute(routeId, genericEndpoint.id, 20, 150, resourceResponse.endpointId, 220, 150, resourceResponse.artifactId);

            this.addRouteStartAndEnd(routeId, genericEndpoint.id, resourceResponse.endpointId);

            await this.updateResourceAtBrokers(brokerUris, resourceResponse.resourceId);

        } catch (error) {
            errorUtils.showError(error, "Save resource");
        }
    },

    async createResource(title, description, language, paymentMethod, keywords, standardlicense, publisher, policyDescriptions,
        filetype) {
        // TODO Sovereign, EndpointDocumentation
        let response = (await restUtils.callConnector("POST", "/api/offers", null, {
            "title": title,
            "description": description,
            "keywords": keywords,
            "publisher": publisher,
            "language": language,
            "paymentMethod": paymentMethod,
            "license": standardlicense
        }));

        let resourceId = this.getIdOfConnectorResponse(response);
        let catalogId = await this.getDefaultCatalogId();
        response = await restUtils.callConnector("POST", "/api/catalogs/" + catalogId + "/offers", null, [resourceId]);

        response = await restUtils.callConnector("POST", "/api/contracts", null, {});
        let contractId = this.getIdOfConnectorResponse(response);

        for (let policyDescription of policyDescriptions) {
            let ruleJson = await restUtils.callConnector("POST", "/api/examples/policy", null, policyDescription);
            response = await restUtils.callConnector("POST", "/api/rules", null, {
                "value": JSON.stringify(ruleJson)
            });
            let ruleId = this.getIdOfConnectorResponse(response);
            response = await restUtils.callConnector("POST", "/api/contracts/" + contractId + "/rules", null, [ruleId]);
        }
        response = await restUtils.callConnector("POST", "/api/offers/" + resourceId + "/contracts", null, [contractId]);

        response = await restUtils.callConnector("POST", "/api/representations", null, {
            "language": language,
            "mediaType": filetype,
        });
        let representationId = this.getIdOfConnectorResponse(response);

        response = await restUtils.callConnector("POST", "/api/artifacts", null, {
            // "accessUrl": genericEndpoint.accessUrl,
            // "username": genericEndpoint.username,
            // "password": genericEndpoint.password
            "value": ""
        });
        let artifactId = this.getIdOfConnectorResponse(response);

        response = await restUtils.callConnector("POST", "/api/offers/" + resourceId + "/representations", null, [representationId]);

        response = await restUtils.callConnector("POST", "/api/representations/" + representationId + "/artifacts", null, [artifactId]);

        response = await this.createConnectorEndpoint(artifactId);
        let endpointId = this.getIdOfConnectorResponse(response);
        return {
            "resourceId": resourceId,
            "artifactId": artifactId,
            "endpointId": endpointId
        };
    },

    async editResource(resourceId, representationId, title, description, language, paymentMethod, keywords, standardlicense, publisher, samples,
        policyDescriptions, filetype, brokerUris, brokerDeleteUris, genericEndpoint, ruleId, artifactId) {
        try {
            await restUtils.callConnector("PUT", "/api/offers/" + resourceId, null, {
                "title": title,
                "description": description,
                "keywords": keywords,
                "publisher": publisher,
                "language": language,
                "paymentMethod": paymentMethod,
                "license": standardlicense,
                "samples": samples
            });

            // Delete all rules and create new ones. Rules that have not been edited in the UI are also deleted and recreated. 
            // Implementing the detection of a change to an existing rule would have been complicated (Pattern can change, only value can change, ...)

            let contractId = -1;
            let contracts = (await restUtils.callConnector("GET", "/api/offers/" + resourceId + "/contracts"))["_embedded"].contracts;
            if (contracts.length > 0) {
                let contract = contracts[0];
                contractId = this.getIdOfConnectorResponse(contract);
                let rules = (await restUtils.callConnector("GET", "/api/contracts/" + contractId + "/rules"))["_embedded"].rules;
                for (let rule of rules) {
                    await restUtils.callConnector("DELETE", "/api/rules/" + this.getIdOfConnectorResponse(rule));
                }
            }

            for (let policyDescription of policyDescriptions) {
                let ruleJson = await restUtils.callConnector("POST", "/api/examples/policy", null, policyDescription);
                let response = await restUtils.callConnector("POST", "/api/rules", null, {
                    "value": JSON.stringify(ruleJson)
                });
                let ruleId = this.getIdOfConnectorResponse(response);
                response = await restUtils.callConnector("POST", "/api/contracts/" + contractId + "/rules", null, [ruleId]);
            }
            //

            await restUtils.callConnector("PUT", "/api/representations/" + representationId, null, {
                "language": language,
                "mediaType": filetype,
            });

            await restUtils.callConnector("PUT", "/api/artifacts/" + artifactId, null, {
                "accessUrl": genericEndpoint.accessUrl,
                "username": genericEndpoint.username,
                "password": genericEndpoint.password
            });

            let route = await this.getRouteWithEnd(artifactId);
            if (route != null) {
                let routeId = this.getIdOfConnectorResponse(route);
                await restUtils.callConnector("PUT", "/api/routes/" + routeId + "/endpoint/start", null, "\"" + genericEndpoint.id + "\"");
            } else {
                response = await this.createConnectorEndpoint(artifactId);
                let endpointId = this.getIdOfConnectorResponse(response);
                let response = await this.createNewRoute(this.getCurrentDate() + " - " + title);
                let routeId = this.getIdOfConnectorResponse(response);
                response = await this.createSubRoute(routeId, genericEndpoint.id, 20, 150, endpointId, 220, 150, artifactId);
                this.addRouteStartAndEnd(routeId, genericEndpoint.id, endpointId);
            }

            await this.updateResourceBrokerRegistration(brokerUris, brokerDeleteUris, resourceId);
        } catch (error) {
            errorUtils.showError(error, "Save resource");
        }
    },

    async updateResourceReferences(resource, samples) {
        try {
            await restUtils.callConnector("PUT", "/api/offers/" + resource.id, null, {
                "title": resource.title,
                "description": resource.description,
                "keywords": resource.keywords,
                "publisher": resource.publisher,
                "language": resource.language,
                "paymentMethod": resource.paymentMethod,
                "license": resource.standardlicense,
                "samples": samples
            });
        } catch (error) {
            errorUtils.showError(error, "Save resource");
        }
    },

    async updateResourceBrokerRegistration(brokerUris, brokerDeleteUris, resourceId) {
        for (let brokerUri of brokerUris) {
            await this.updateResourceAtBroker(brokerUri, resourceId);
        }
        for (let brokerUri of brokerDeleteUris) {
            await this.deleteResourceAtBroker(brokerUri, resourceId);
        }
    },

    async createResourceIdsEndpointAndAddSubRoute(sourceNode, destinationNode, genericEndpoint, routeId, startId) {
        let hasError = false;
        let resource = destinationNode.resource;
        let title = resource.title;
        let description = resource.description;
        let language = resource.language;
        let paymentMethod = resource.paymentMethod;
        let keywords = resource.keywords;
        let standardlicense = resource.standardlicense;
        let publisher = resource.publisher;
        let policyDescriptions = resource.policyDescriptions;
        let filetype = resource.fileType;
        let brokerUris = resource.brokerUris;

        try {
            let resourceResponse = await this.createResource(title, description, language, paymentMethod, keywords, standardlicense, publisher, policyDescriptions, filetype, genericEndpoint);
            await this.createSubRoute(routeId, startId, sourceNode.x, sourceNode.y, resourceResponse.endpointId, destinationNode.x, destinationNode.y, resourceResponse.artifactId);
            this.addRouteStartAndEnd(routeId, startId, resourceResponse.endpointId);
            await this.updateResourceAtBrokers(brokerUris, resourceResponse.resourceId);
        } catch (error) {
            errorUtils.showError(error, "Save Route");
            hasError = true;
        }

        return hasError;
    },

    async updateResourceAtBrokers(brokerUris, resourceId) {
        for (let brokerUri of brokerUris) {
            await this.updateResourceAtBroker(brokerUri, resourceId);
        }
    },

    async getResourceOfArtifact(artifactId) {
        let resource = undefined;
        let representations = (await restUtils.callConnector("GET", "/api/artifacts/" + artifactId + "/representations"))._embedded.representations;
        if (representations.length > 0) {
            let representationId = this.getIdOfConnectorResponse(representations[0]);
            let resources = (await restUtils.callConnector("GET", "/api/representations/" + representationId + "/offers"))._embedded.resources;
            if (resources.length > 0) {
                resource = resources[0];
            }
        }
        return resource;
    },

    async getRouteWithEnd(artifactId) {
        let routeWithEnd = null;
        let response = await this.getRoutes();
        for (let route of response) {
            if (route.end !== undefined && route.end != null) {
                if (route.end.location.includes(artifactId)) {
                    routeWithEnd = route;
                    break;
                }
            }
        }
        return routeWithEnd;
    },

    async getRouteErrors() {
        return await restUtils.callConnector("GET", "/api/configmanager/route/error");
    },

    async getRoutes() {
        return (await restUtils.callConnector("GET", "/api/routes"))._embedded.routes;
    },

    async addRouteStartAndEnd(routeId, startId, endId) {
        await restUtils.callConnector("PUT", "/api/routes/" + routeId + "/endpoint/start", null, "\"" + startId + "\"");
        await restUtils.callConnector("PUT", "/api/routes/" + routeId + "/endpoint/end", null, "\"" + endId + "\"");
    },

    async createNewRoute(description) {
        return await restUtils.callConnector("POST", "/api/routes", null, {
            "description": description,
            "routeType": "Route",
            "deploy": "Camel"
        });
    },

    async createSubRoute(routeId, startId, startCoordinateX, startCoordinateY, endId, endCoordinateX, endCoordinateY, artifactId) {
        let hasError = false;
        try {
            let response = await restUtils.callConnector("POST", "/api/routes", null, {
                "routeType": "Subroute",
                "deploy": "Camel",
                "startCoordinateX": startCoordinateX,
                "startCoordinateY": startCoordinateY,
                "endCoordinateX": endCoordinateX,
                "endCoordinateY": endCoordinateY
            });
            let subRouteId = this.getIdOfConnectorResponse(response);
            await restUtils.callConnector("POST", "/api/routes/" + routeId + "/steps", null, [subRouteId]);
            await restUtils.callConnector("PUT", "/api/routes/" + subRouteId + "/endpoint/start", null, "\"" + startId + "\"");
            await restUtils.callConnector("PUT", "/api/routes/" + subRouteId + "/endpoint/end", null, "\"" + endId + "\"");
            await restUtils.callConnector("POST", "/api/routes/" + subRouteId + "/outputs", null, [artifactId]);

        } catch (error) {
            errorUtils.showError(error, "Save Route");
            hasError = true;
        }
        return hasError;
    },

    async getDeployMethods() {
        let response = await restUtils.callConnector("GET", "/api/configmanager/enum/deployMethod");
        return response;

    },

    async getLogLevels() {
        let response = await restUtils.callConnector("GET", "/api/configmanager/enum/logLevel");
        return response;
    },

    async getConnectorConfiguration() {
        let configurations = (await restUtils.callConnector("GET", "/api/configurations"))._embedded.configurations;
        let configuration = undefined;
        if (configurations !== undefined && configurations.length > 0) {
            configuration = configurations[0];
        }
        return clientDataModel.convertIdsConfiguration(configuration);
    },

    async changeConnectorConfiguration(id, title, description, curator, maintainer, useProxy, proxyUrl, proxyNoProxy,
        useAuthentication, proxyUsername, proxyPassword, loglevel, deployMode, trustStoreUrl, trustStorePassword,
        keyStoreUrl, keyStorePassword) {
        let proxySettings = null;
        let proxyAuth = null;
        if (useAuthentication) {
            proxyAuth = {
                "key": proxyUsername,
                "value": proxyPassword
            };
        }
        if (useProxy) {
            proxySettings = {
                "location": proxyUrl,
                "exclusions": proxyNoProxy,
                "authentication": proxyAuth
            };
        }
        let config = {
            "title": title,
            "description": description,
            "curator": curator,
            "maintainer": maintainer,
            "logLevel": loglevel,
            "deployMode": deployMode,
            "truststoreSettings": {
                "location": trustStoreUrl
            },
            "proxySettings": proxySettings,
            "keystoreSettings": {
                "location": keyStoreUrl
            }
        };
        if (trustStorePassword != null) {
            config.truststoreSettings.password = trustStorePassword;
        }
        if (keyStorePassword != null) {
            config.keystoreSettings.password = keyStorePassword;
        }
        await restUtils.callConnector("PUT", "/api/configurations/" + id, null, config);
    },

    async getConnectorUpdateInfo() {
        return await restUtils.callConnector("GET", "/actuator/info");
    },

    async getConnectorDeployModes() {
        let response = await restUtils.callConnector("GET", "/api/configmanager/enum/connectorDeployMode");
        return response;
    },

    async receiveResources(recipientId) {
        let resources = [];
        let params = {
            "recipient": recipientId
        }
        let response = await restUtils.callConnector("POST", "/api/ids/description", params);
        if (response["ids:resourceCatalog"] !== undefined) {
            for (let catalog of response["ids:resourceCatalog"]) {
                params = {
                    "recipient": recipientId,
                    "elementId": catalog["@id"]
                }
                response = await restUtils.callConnector("POST", "/api/ids/description", params);
                if (response["ids:offeredResource"] !== undefined) {
                    for (let resource of response["ids:offeredResource"]) {
                        this.addToLocalResources(resource, resources);
                    }
                }
            }
        }

        return resources;
    },

    async receiveCatalogs(recipientId) {
        let catalogs = [];
        let params = {
            "recipient": recipientId
        }
        let response = await restUtils.callConnector("POST", "/api/ids/description", params);
        if (response["ids:resourceCatalog"] !== undefined) {
            for (let catalog of response["ids:resourceCatalog"]) {
                let id = catalog["@id"].substring(catalog["@id"]/*.lastIndexOf("/"), catalog["@id"].length*/);
                catalogs.push(id);
            }
        }

        return catalogs;
    },

    async receiveResourcesInCatalog(recipientId, catalogID) {
        let resources = [];
        let params = {
            "recipient": recipientId,
            "elementId": catalogID
        }
        let response = await restUtils.callConnector("POST", "/api/ids/description", params);
        if (response["ids:offeredResource"] !== undefined) {
            for (let resource of response["ids:offeredResource"]) {
                this.addToLocalResources(resource, resources);
            }
        }
        return resources;
    },

    async receiveIdsResourceCatalog(recipientId, catalogId) {
        let params = {
            "recipient": recipientId,
            "elementId": catalogId
        }
        let response = await restUtils.callConnector("POST", "/api/ids/description", params);
        return response;
    },

    /*     async receiveIdsArtifact(recipientId, artifactId) {
            let params = {
                "recipient": recipientId,
                "elementId": artifactId
            }
            let response = await restUtils.callConnector("POST", "/api/ids/description", params);
            return response;
        },
    
        async receiveIdsContractOffer(recipientId, artifactId) {
            let params = {
                "recipient": recipientId,
                "elementId": artifactId
            }
            let response = await restUtils.callConnector("POST", "/api/ids/description", params);
            return response;
        } */

    async receiveContract(recipientId, resourceId, contractOffer, artifact, download) {
        let params = {
            "recipient": recipientId,
            "resourceIds": resourceId,
            "artifactIds": artifact["@id"],
            "download": download
        }

        for (let body of contractOffer[0]["ids:permission"]) {
            body["ids:target"] = artifact["@id"];
        }
        return await restUtils.callConnector("POST", "/api/ids/contract", params, contractOffer[0]["ids:permission"]);
    },

    async subscribeToResource(recipientId, resoureceId) {
        let params = {
            "recipient": recipientId,
        }

        let configuration = await this.getConnectorConfiguration();

        let body = {
            "title": "default",
            "description": "Notify on update",
            "target": resoureceId,
            "location": configuration.endpoint,
            "subscriber": configuration.id,
            "pushData": true
        }
        body = JSON.stringify(body);

        let response = await restUtils.callConnector("POST", "/api/ids/subscribe", params, body);
        return response;
    },

    addToLocalResources(resource, resources) {
        let id = resource["@id"].substring(resource["@id"].lastIndexOf("/"), resource["@id"].length);
        let creationDate = resource["ids:created"]["@value"];
        let title = resource["ids:title"][0]["@value"];
        let description = resource["ids:description"][0]["@value"];
        let language = resource["ids:language"][0]["@id"].replace("https://w3id.org/idsa/code/", "");
        let paymentMethod = "undefined";
        if (resource["ids:paymentModality"] != undefined && resource["ids:paymentModality"][0] != null) {
            paymentMethod = this.getPaymentMethodName(resource["ids:paymentModality"][0]["@id"]);
        }
        let keywords = [];
        let idsKeywords = resource["ids:keyword"];
        for (let idsKeyword of idsKeywords) {
            keywords.push(idsKeyword["@value"]);
        }
        let version = resource["ids:version"];
        let standardlicense = resource["ids:standardLicense"]["@id"];
        let publisher = resource["ids:publisher"]["@id"];
        let fileType = null;
        if (resource["ids:representation"] !== undefined && resource["ids:representation"].length > 0) {
            fileType = resource["ids:representation"][0]["ids:mediaType"]["ids:filenameExtension"];
        }

        resources.push(clientDataModel.createResource(resource["@id"], id, creationDate, title, description, language, paymentMethod, keywords, version, standardlicense,
            publisher, fileType, "", null));
    }
}


