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

const POLICY_DESCRIPTION_TO_NAME = {
    "n-times-usage": POLICY_N_TIMES_USAGE,
    "duration-usage": POLICY_DURATION_USAGE,
    "usage-during-interval": POLICY_USAGE_DURING_INTERVAL,
    "provide-access": POLICY_PROVIDE_ACCESS,
    "prohibit-access": POLICY_PROHIBIT_ACCESS,
    "usage-until-deletion": POLICY_USAGE_UNTIL_DELETION,
    "usage-logging": POLICY_USAGE_LOGGING,
    "usage-notification": POLICY_USAGE_NOTIFICATION
};

const POLICY_TYPE_TO_DISPLAY_NAME = {
    "PROVIDE_ACCESS": POLICY_PROVIDE_ACCESS,
    "PROHIBIT_ACCESS": POLICY_PROHIBIT_ACCESS,
    "N_TIMES_USAGE": POLICY_N_TIMES_USAGE,
    "DURATION_USAGE": POLICY_DURATION_USAGE,
    "USAGE_DURING_INTERVAL": POLICY_USAGE_DURING_INTERVAL,
    "USAGE_UNTIL_DELETION": POLICY_USAGE_UNTIL_DELETION,
    "USAGE_LOGGING": POLICY_USAGE_LOGGING,
    "USAGE_NOTIFICATION": POLICY_USAGE_NOTIFICATION
}

const OPERATOR_TYPE_TO_SYMBOL = {
    "https://w3id.org/idsa/code/EQ": "=",
    "https://w3id.org/idsa/code/LTEQ": "<=",
    "https://w3id.org/idsa/code/LT": "<",
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

    async getResource(resourceId) {
        let resource = await restUtils.callConnector("GET", "/api/offers/" + resourceId);
        let rule = undefined;
        let policyName = undefined;
        let contracts = (await restUtils.callConnector("GET", "/api/offers/" + resourceId + "/contracts"))["_embedded"].contract;
        let ruleId = undefined;
        if (contracts.length > 0) {
            let contract = contracts[0];
            let contractId = this.getIdOfConnectorResponse(contract);
            let rules = (await restUtils.callConnector("GET", "/api/contracts/" + contractId + "/rules"))["_embedded"].rules;
            if (rules.length > 0) {
                rule = rules[0];
                ruleId = this.getIdOfConnectorResponse(rule);
                policyName = (await restUtils.callConnector("POST", "/api/examples/validation", null, rule.value));
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
        return clientDataModel.convertIdsResource(resource, representation, policyName, JSON.parse(rule.value), artifactId, ruleId);
    },

    async getLanguages() {
        if (languages == null) {
            let languages = (await restUtils.callConnector("GET", "/api/configmanager/enum/Language"));
            return languages;
        } else {
            return languages;
        }
    },

    async registerConnectorAtBroker(brokerUri) {
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
                "recipient ": brokerUri
            };
            await restUtils.callConnector("POST", "/api/ids/connector/unavailable", params);
        } catch (error) {
            errorUtils.showError(error, "Unregister connector at broker");
        }
    },

    async getBrokersOfResource(resourceId) {
        return (await restUtils.callConnector("GET", "/api/offers/" + resourceId + "/brokers"))._embedded.brokerViewList;
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
            await this.registerConnectorAtBroker(url);
        } catch (error) {
            errorUtils.showError(error, "Update broker");
        }
    },

    async deleteBroker(brokerId) {
        return await restUtils.callConnector("DELETE", "/api/brokers/" + brokerId);
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

    async createGenericEndpoint(url, username, password, sourceType) {
        let response = await restUtils.callConnector("POST", "/api/endpoints", null, {
            "location": url,
            "type": "GENERIC"
        });
        let genericEndpointId = this.getIdOfConnectorResponse(response);

        response = await restUtils.callConnector("POST", "/api/datasources", null, {
            "authentication": {
                "username": username,
                "password": password
            },
            "type": sourceType
        });
        let dataSourceId = this.getIdOfConnectorResponse(response);

        // dataSourceId is needed with double quotes at start and end for this API call
        await restUtils.callConnector("PUT", "/api/endpoints/" + genericEndpointId + "/datasource", null, "\"" + dataSourceId + "\"");
    },

    async updateGenericEndpoint(id, dataSourceId, url, username, password, sourceType) {
        await restUtils.callConnector("PUT", "/api/endpoints/" + id, null, {
            "location": url,
            "type": "GENERIC"
        });

        await restUtils.callConnector("PUT", "/api/datasources/" + dataSourceId, null, {
            "authentication": {
                "username": username,
                "password": password
            },
            "type": sourceType
        });
    },

    async deleteGenericEndpoint(id, dataSourceId) {
        await restUtils.callConnector("DELETE", "/api/endpoints/" + id);
        await restUtils.callConnector("DELETE", "/api/datasources/" + dataSourceId);
    },

    async deleteResource(id) {
        // let brokers = this.getBrokersOfResource(id);
        return await restUtils.callConnector("DELETE", "/api/offers/" + id);
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
        let routeSteps = await this.getRouteSteps(id);
        for (let routeStep of routeSteps) {
            await restUtils.callConnector("DELETE", "/api/routes/" + this.getIdOfConnectorResponse(routeStep));
        }
        await restUtils.callConnector("DELETE", "/api/routes/" + id);
    },

    async getApps() {
        let apps = [];
        let idsApps = (await restUtils.callConnector("GET", "/api/apps"))._embedded.apps;
        if (idsApps !== undefined) {
            for (let idsApp of idsApps) {
                apps.push(clientDataModel.convertIdsApp(idsApp));
            }
        }

        return apps;
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

    async getApp(id) {
        let app = await await restUtils.callConnector("GET", "/api/apps/" + id);
        return clientDataModel.convertIdsApp(app);
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
        let url = response._links.self.href;
        return url.substring(url.lastIndexOf("/") + 1, url.length);
    },

    async createResource(title, description, language, keyword, standardlicense, publisher, policyDescription,
        filetype, brokerUris, genericEndpoint) {
        try {
            // TODO Sovereign, EndpointDocumentation
            let response = (await restUtils.callConnector("POST", "/api/offers", null, {
                "title": title,
                "description": description,
                "keywords": keyword,
                "publisher": publisher,
                "language": language,
                "license": standardlicense
            }));

            let resourceId = this.getIdOfConnectorResponse(response);
            response = await restUtils.callConnector("POST", "/api/contracts", null, {});
            let contractId = this.getIdOfConnectorResponse(response);

            let ruleJson = await restUtils.callConnector("POST", "/api/examples/policy", null, policyDescription);

            response = await restUtils.callConnector("POST", "/api/rules", null, {
                "value": JSON.stringify(ruleJson)
            });

            let ruleId = this.getIdOfConnectorResponse(response);
            response = await restUtils.callConnector("POST", "/api/offers/" + resourceId + "/contracts", null, [contractId]);

            response = await restUtils.callConnector("POST", "/api/contracts/" + contractId + "/rules", null, [ruleId]);

            response = await restUtils.callConnector("POST", "/api/representations", null, {
                "language": language,
                "mediaType": filetype,
            });
            let representationId = this.getIdOfConnectorResponse(response);

            response = await restUtils.callConnector("POST", "/api/artifacts", null, {
                "accessUrl": genericEndpoint.accessUrl,
                "username": genericEndpoint.username,
                "password": genericEndpoint.password
            });
            let artifactId = this.getIdOfConnectorResponse(response);

            response = await restUtils.callConnector("POST", "/api/offers/" + resourceId + "/representations", null, [representationId]);

            response = await restUtils.callConnector("POST", "/api/representations/" + representationId + "/artifacts", null, [artifactId]);

            response = await this.createConnectorEndpoint(artifactId);
            let endpointId = this.getIdOfConnectorResponse(response);

            response = await this.createNewRoute(this.getCurrentDate() + " - " + title);
            let routeId = this.getIdOfConnectorResponse(response);
            response = await this.createSubRoute(routeId, genericEndpoint.id, 20, 150, endpointId, 220, 150, artifactId);

            await this.updateResourceAtBrokers(brokerUris, resourceId);

        } catch (error) {
            errorUtils.showError(error, "Save resource");
        }
    },

    async editResource(resourceId, representationId, title, description, language, keyword, standardlicense, publisher, policyDescription,
        filetype, brokerUris, brokerDeleteUris, genericEndpoint, ruleId, artifactId) {
        try {
            await restUtils.callConnector("PUT", "/api/offers/" + resourceId, null, {
                "title": title,
                "description": description,
                "keywords": keyword,
                "publisher": publisher,
                "language": language,
                "license": standardlicense
            });

            let ruleJson = await restUtils.callConnector("POST", "/api/examples/policy", null, policyDescription);
            await restUtils.callConnector("PUT", "/api/rules/" + ruleId, null, {
                "value": JSON.stringify(ruleJson)
            });

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
            let routeId = this.getIdOfConnectorResponse(route);
            await restUtils.callConnector("PUT", "/api/routes/" + routeId + "/endpoint/start", null, "\"" + genericEndpoint.id + "\"");

            await this.updateResourceBrokerRegistration(brokerUris, brokerDeleteUris, resourceId);

            //     let params = {
            //         "resourceId": resourceId,
            //         "title": title,
            //         "description": description,
            //         "language": language,
            //         "keyword": keyword,
            //         "standardlicense": standardlicense,
            //         "publisher": publisher
            //     }

            //     await restUtils.call("PUT", "/api/ui/resource", params);

            //     params = {
            //         "resourceId": resourceId,
            //         "pattern": pattern
            //     }
            //     await restUtils.call("PUT", "/api/ui/resource/contract/update", params, contractJson);

            //     // TODO remove sourceType when API changed.
            //     params = {
            //         "resourceId": resourceId,
            //         "representationId": representationId,
            //         "endpointId": genericEndpoint["@id"],
            //         "language": language,
            //         "filenameExtension": filetype,
            //         "sourceType": "LOCAL"
            //     }
            //     await restUtils.call("PUT", "/api/ui/resource/representation", params);

            //     await this.updateResourceBrokerRegistration(brokerUris, brokerDeleteUris, resourceId);
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
        let keywords = resource.keywords;
        let standardlicense = resource.standardlicense;
        let publisher = resource.publisher;
        let policyDescription = resource.policyDescription;
        let filetype = resource.filetype;
        let brokerUris = resource.brokerList;

        try {
            // TODO Sovereign, EndpointDocumentation
            let response = (await restUtils.callConnector("POST", "/api/offers", null, {
                "title": title,
                "description": description,
                "keywords": keywords,
                "publisher": publisher,
                "language": language,
                "license": standardlicense
            }));

            let resourceId = this.getIdOfConnectorResponse(response);
            response = await restUtils.callConnector("POST", "/api/contracts", null, {});
            let contractId = this.getIdOfConnectorResponse(response);

            let ruleJson = await restUtils.callConnector("POST", "/api/examples/policy", null, policyDescription);

            response = await restUtils.callConnector("POST", "/api/rules", null, {
                "value": JSON.stringify(ruleJson)
            });

            let ruleId = this.getIdOfConnectorResponse(response);
            response = await restUtils.callConnector("POST", "/api/offers/" + resourceId + "/contracts", null, [contractId]);

            response = await restUtils.callConnector("POST", "/api/contracts/" + contractId + "/rules", null, [ruleId]);

            response = await restUtils.callConnector("POST", "/api/representations", null, {
                "language": language,
                "mediaType": filetype,
            });
            let representationId = this.getIdOfConnectorResponse(response);

            response = await restUtils.callConnector("POST", "/api/artifacts", null, {
                "accessUrl": genericEndpoint.accessUrl,
                "username": genericEndpoint.username,
                "password": genericEndpoint.password
            });
            let artifactId = this.getIdOfConnectorResponse(response);

            response = await restUtils.callConnector("POST", "/api/offers/" + resourceId + "/representations", null, [representationId]);

            response = await restUtils.callConnector("POST", "/api/representations/" + representationId + "/artifacts", null, [artifactId]);

            response = await this.createConnectorEndpoint(artifactId);
            let endpointId = this.getIdOfConnectorResponse(response);

            response = await this.createSubRoute(routeId, startId, sourceNode.x, sourceNode.y, endpointId, destinationNode.x, destinationNode.y, artifactId);

            await this.updateResourceAtBrokers(brokerUris, resourceId);

        } catch (error) {
            errorUtils.showError(error, "Save Route");
            hasError = true;
        }


        //     let endpointId = (await this.createConnectorEndpoint(resourceUUID));
        //     response = await this.createSubRoute(routeId, startId, startCoordinateX, startCoordinateY,
        //         endpointId, endCoordinateX, endCoordinateY, resourceId);

        //     await this.updateResourceAtBrokers(brokerUris, resourceId);
        // } catch (error) {
        //     hasError = true;
        //     errorUtils.showError(error, "Create IDS endpoint");
        // }

        return hasError;
    },

    async updateResourceAtBrokers(brokerUris, resourceId) {
        for (let brokerUri of brokerUris) {
            await this.updateResourceAtBroker(brokerUri, resourceId);
        }
    },

    getEndpointInfo(routeId, endpointId) {
        return new Promise(function (resolve) {
            let params = {
                "routeId": routeId,
                "endpointId": endpointId
            }
            restUtils.call("GET", "/api/ui/approute/step/endpoint/info", params).then(response => {
                resolve(response.data)
            }).catch(error => {
                console.log("Error in getEndpointInfo(): ", error);
                resolve(error);
            });
        });
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

    async getRoutes() {
        return (await restUtils.callConnector("GET", "/api/routes"))._embedded.routes;
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

    async changeConnectorConfiguration(id, title, description, curator, maintainer, proxyUrl, proxyNoProxy, proxyUsername,
        proxyPassword, loglevel, deployMode, trustStoreUrl, trustStorePassword, keyStoreUrl, keyStorePassword) {
        await restUtils.callConnector("PUT", "/api/configurations/" + id, null, {
            "title": title,
            "description": description,
            "curator": curator,
            "maintainer": maintainer,
            "logLevel": loglevel,
            "deployMode": deployMode,
            "truststoreSettings": {
                "name": trustStoreUrl,
                "password": trustStorePassword
            },
            "proxySettings": {
                "location": proxyUrl,
                "exclusions": proxyNoProxy,
                "authentication": {
                    "username": proxyUsername,
                    "password": proxyPassword
                }
            },
            "keystoreSettings": {
                "location": keyStoreUrl,
                "password": keyStorePassword
            }
        });
    },

    async getConnectorDeployModes() {
        let response = await restUtils.callConnector("GET", "/api/configmanager/enum/connectorDeployMode");
        return response;
    },

    receiveResources(recipientId) {
        return new Promise(function (resolve) {
            let params = {
                "recipientId": recipientId
            }
            restUtils.call("POST", "/api/ui/request/description", params).then(response => {
                resolve(response.data);
            }).catch(error => {
                console.log("Error in receiveResources(): ", error);
                resolve(error);
            });
        });
    },

    receiveResource(recipientId, requestedResourceId) {
        return new Promise(function (resolve) {
            let params = {
                "recipientId": recipientId,
                "requestedResourceId": requestedResourceId
            };
            restUtils.call("POST", "/api/ui/request/description", params).then(response => {
                resolve(clientDataModel.convertIdsResource(response.data));
            }).catch(error => {
                console.log("Error in receiveResource(): ", error);
                resolve(error);
            });
        });
    }
}
