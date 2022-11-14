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

let enums = null;

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
            let type = representation.mediaType.toLowerCase();
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
            let resource = clientDataModel.convertIdsResource(idsResource);
            resource.remoteId = idsResource.remoteId.substring(idsResource.remoteId.lastIndexOf("/") + 1, idsResource.remoteId.length);
            resource.selfLink = idsResource._links.self.href;
            resources.push(resource);
        }
        return resources;
    },

    async addAgreements(resource) {
        let resAgreements = [];
        let representations = (await restUtils.callConnector("GET", "/api/offers/" + resource.id + "/representations"))["_embedded"].representations;
        let representation = undefined;
        let artifactId = undefined;
        if (representations.length > 0) {
            representation = representations[0];
            let representationId = this.getIdOfConnectorResponse(representation);
            let artifacts = (await restUtils.callConnector("GET", "/api/representations/" + representationId + "/artifacts"))["_embedded"].artifacts;
            if (artifacts.length > 0) {
                artifactId = this.getIdOfConnectorResponse(artifacts[0]);
                let agreements = (await restUtils.callConnector("GET", "/api/artifacts/" + artifactId + "/agreements"))["_embedded"].agreements;
                for (let agreement of agreements) {
                    resAgreements.push(JSON.parse(agreement.value));
                }
            }
        }
        resource.agreements = resAgreements;
    },

    async getResource(resourceId) {
        let resource = await restUtils.callConnector("GET", "/api/offers/" + resourceId);
        let policyNames = [];
        let contractName = undefined;
        let contractPeriodFromValue = undefined;
        let contractPeriodToValue = undefined;
        let ruleIds = [];
        let ruleJsons = [];
        let contracts = (await restUtils.callConnector("GET", "/api/offers/" + resourceId + "/contracts"))["_embedded"].contracts;
        if (contracts.length > 0) {
            let contract = contracts[0];
            contractName = contract.title;
            contractPeriodFromValue = contract.start;
            contractPeriodToValue = contract.end;
            let contractId = this.getIdOfConnectorResponse(contract);
            let rules = (await restUtils.callConnector("GET", "/api/contracts/" + contractId + "/rules"))["_embedded"].rules;
            for (let rule of rules) {
                let name = await this.getPolicyNameByPattern(rule.value);
                policyNames.push(name);
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
        let catalogs = await this.getCatalogsOfResource(resourceId);
        return clientDataModel.convertIdsResource(resource, representation, contractName, policyNames, contractPeriodFromValue, contractPeriodToValue, ruleIds, ruleJsons, artifactId, brokerUris, catalogs);
    },

    async getRequestedResource(resourceId) {
        let resource = await restUtils.callConnector("GET", "/api/requests/" + resourceId);
        let policyNames = [];
        let contractPeriodFromValue = undefined;
        let contractPeriodToValue = undefined;
        let ruleIds = [];
        let ruleJsons = [];

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

        let res = clientDataModel.convertIdsResource(resource, representation, "", policyNames, contractPeriodFromValue, contractPeriodToValue, ruleIds, ruleJsons, artifactId);
        res.remoteId = resource.remoteId;
        res.selfLink = resource._links.self.href;
        return res;
    },

    async getPolicyNameByPattern(pattern) {
        return (await restUtils.callConnector("POST", "/api/examples/validation", null, pattern)).value;
    },

    async getArtifactOfRoute(routeId) {
        return (await restUtils.callConnector("GET", "/api/routes/" + routeId + "/output"));
    },

    async getArtifact(artifactId) {
        return await restUtils.callConnector("GET", "/api/artifacts/" + artifactId);
    },

    async getArtifactAgreements(artifactId) {
        return (await restUtils.callConnector("GET", "/api/artifacts/" + artifactId + "/agreements"))["_embedded"].agreements;
    },

    async getAgreementArtifacts(agreementId) {
        return (await restUtils.callConnector("GET", "/api/agreements/" + agreementId + "/artifacts"))["_embedded"].artifacts;
    },

    async getEnums() {
        if (enums == null) {
            enums = await restUtils.callConnector("GET", "/api/utils/enums");
        }
        return enums;
    },

    async getLanguages() {
        return (await this.getEnums())["LANGUAGE"];
    },

    async getPaymentMethods() {
        return (await this.getEnums())["PAYMENT_METHOD"];
    },

    async getSecurityProfiles() {
        return (await this.getEnums())["SECURITY_PROFILE"];
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
        if (brokerStatus === "Registered") {
            statusClass = "registeredAtBroker";
        }
        return statusClass;
    },

    async deleteAllRoutesOfApp(appId) {
        let appEndpoints = await this.getAppEndpoints(appId);
        let appEndpointIds = [];
        for (let appEndpoint of appEndpoints) {
            appEndpointIds.push(this.getIdOfConnectorResponse(appEndpoint));
        }
        let routes = await this.getRoutes();
        for (let route of routes) {
            let routeId = this.getIdOfConnectorResponse(route);
            if (this.routeContainsEndpoint(route, appEndpointIds)) {
                await this.deleteRoute(routeId);
            } else {
                let subRoutes = await this.getRouteSteps(routeId);
                for (let subRoute of subRoutes) {
                    if (this.routeContainsEndpoint(subRoute, appEndpointIds)) {
                        await this.deleteRoute(routeId);
                        break;
                    }
                }
            }
        }
    },

    async deleteAllRoutesOfGenericEndpoint(genericEndpointId) {
        let routes = await this.getRoutes();
        for (let route of routes) {
            let routeId = this.getIdOfConnectorResponse(route);
            if (this.routeContainsEndpoint(route, [genericEndpointId])) {
                await this.deleteRoute(routeId);
            } else {
                let subRoutes = await this.getRouteSteps(routeId);
                for (let subRoute of subRoutes) {
                    if (this.routeContainsEndpoint(subRoute, [genericEndpointId])) {
                        await this.deleteRoute(routeId);
                        break;
                    }
                }
            }
        }
    },

    routeContainsEndpoint(route, endpointsIds) {
        let contains = false;
        for (let endpointId of endpointsIds) {
            if (route.start !== undefined && route.start != null && route.start.id == endpointId) {
                contains = true;
                break;
            }
            if (route.end !== undefined && route.end != null && route.end.id == endpointId) {
                contains = true;
                break;
            }
        }
        return contains;
    },

    async startApp(appId) {
        try {
            let params = {
                "type": "START"
            };
            await restUtils.callConnector("PUT", "/api/apps/" + appId + "/actions", params);
        } catch (error) {
            errorUtils.showError(error, "Start app");
        }
    },

    async stopApp(appId) {
        let inUse = false;
        try {
            let params = {
                "type": "STOP"
            };
            await restUtils.callConnector("PUT", "/api/apps/" + appId + "/actions", params);
        } catch (error) {
            if (error.details !== undefined && error.details.data !== undefined && error.details.data.message == "Selected App is in use by Camel.") {
                inUse = true;
            } else {
                errorUtils.showError(error, "Stop app");
            }
        }
        return inUse;
    },

    async isAppRunning(appId) {
        let appStatus = null;
        try {
            let params = {
                "type": "DESCRIBE"
            };
            appStatus = JSON.parse((await restUtils.callConnector("PUT", "/api/apps/" + appId + "/actions", params)).value).State.Running;
        } catch (error) {
            appStatus = false;
        }
        return appStatus;
    },

    async deleteApp(appId) {
        if (await this.isAppRunning(appId)) {
            await this.stopApp(appId);
        }
        let params = {
            "type": "DELETE"
        };
        await restUtils.callConnector("PUT", "/api/apps/" + appId + "/actions", params);
        await restUtils.callConnector("DELETE", "/api/apps/" + appId);
    },

    async installApp(appStoreUrl, appUrl) {
        let params = {
            "recipient": appStoreUrl,
            "appId": appUrl
        }
        return await restUtils.callConnector("POST", "/api/ids/app", params);
    },

    async getAppsOfAppStore(appStoreUrl) {
        let apps = [];
        let params = {
            "recipient": appStoreUrl
        }
        let response = await restUtils.callConnector("POST", "/api/ids/description", params);


        if (response["ids:resourceCatalog"] !== undefined) {
            for (let catalog of response["ids:resourceCatalog"]) {
                params = {
                    "recipient": appStoreUrl,
                    "elementId": catalog["@id"]
                }
                response = await restUtils.callConnector("POST", "/api/ids/description", params);

                if (response["ids:offeredResource"] !== undefined) {
                    for (let app of response["ids:offeredResource"]) {
                        apps.push(app);
                    }
                }
            }
        }
        return apps;
    },

    async getAppToAppStoreMap() {
        let appToAppStoreMap = [];
        let appStores = await this.getAppStores();
        for (let appStore of appStores) {
            let apps = (await restUtils.callConnector("GET", "/api/appstores/" +
                this.getIdOfConnectorResponse(appStore) + "/apps"))._embedded.apps;
            for (let app of apps) {
                appToAppStoreMap[this.getIdOfConnectorResponse(app)] = appStore;
            }
        }
        return appToAppStoreMap;
    },

    async getApps() {
        let apps = (await restUtils.callConnector("GET", "/api/apps"))._embedded.apps;
        for (let app of apps) {
            app.id = this.getIdOfConnectorResponse(app);
        }
        return apps;
    },

    async getApp(id) {
        let app = await restUtils.callConnector("GET", "/api/apps/" + id);
        app.id = this.getIdOfConnectorResponse(app);
        return app;
    },

    async getAppEndpoints(id, endpointType) {
        let response = [];
        let endpoints = (await restUtils.callConnector("GET", "/api/apps/" + id + "/endpoints"))._embedded.endpoints;
        for (let endpoint of endpoints) {
            if (endpointType === undefined || endpoint.endpointType == endpointType) {
                endpoint.id = this.getIdOfConnectorResponse(endpoint);
                endpoint.selfLink = endpoint._links.self.href;
                response.push(endpoint);
            }
        }
        return response;
    },

    async getAppStore(id) {
        return await restUtils.callConnector("GET", "/api/appstores/" + id);
    },

    async getAppStores() {
        return (await restUtils.callConnector("GET", "/api/appstores"))._embedded.apps;
    },

    async createAppStore(url, title) {
        try {
            await restUtils.callConnector("POST", "/api/appstores", null, {
                "location": url,
                "title": title
            });
        } catch (error) {
            errorUtils.showError(error, "Create app store");
        }
    },

    async updateAppStore(id, url, title) {
        try {
            await restUtils.callConnector("PUT", "/api/appstores/" + id, null, {
                "location": url,
                "title": title
            });
        } catch (error) {
            errorUtils.showError(error, "Update app store");
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

    async getSubscriptions() {
        let subscriptions = (await restUtils.callConnector("GET", "/api/subscriptions"))._embedded.subscriptions;
        for (let subscription of subscriptions) {
            subscription.creationDate = subscription.creationDate.substring(0, 19).replace("T", " ");
        }
        return subscriptions;
    },

    async deleteSubscription(id) {
        await restUtils.callConnector("DELETE", "/api/subscriptions/" + id);
    },

    async getGenericEndpoints() {
        let genericEndpoints = [];
        let idsEndpoints = (await restUtils.callConnector("GET", "/api/endpoints"))._embedded.endpoints;
        let dataSources = (await restUtils.callConnector("GET", "/api/datasources"))._embedded.datasources;
        if (idsEndpoints !== undefined) {
            for (let idsEndpoint of idsEndpoints) {
                if (idsEndpoint.type === "GENERIC") {
                    let dataSource = null;
                    if (idsEndpoint._links["datasource"] === undefined) {
                        dataSource = {
                            "type": "Other"
                        }
                    } else {
                        let datasourceId = this.getIdOfLink(idsEndpoint, "datasource");
                        for (let ds of dataSources) {
                            if (ds.id === datasourceId) {
                                dataSource = ds;
                                break;
                            }
                        }
                    }
                    let endpoint = clientDataModel.convertIdsGenericEndpoint(idsEndpoint, dataSource);
                    endpoint.selfLink = idsEndpoint._links.self.href;
                    endpoint.dataSource = dataSource;
                    genericEndpoints.push(endpoint);
                }
            }
        }

        return genericEndpoints;
    },

    async createGenericEndpoint(title, desc, url, username, password, authHeaderName, authHeaderValue, sourceType, driverClassName, camelSqlUri) {
        let location = url;
        if (sourceType === "OTHER" || sourceType === "DATABASE") {
            location = camelSqlUri;
        }
        let response = await restUtils.callConnector("POST", "/api/endpoints", null, {
            "location": location,
            "type": "GENERIC",
            "title": title,
            "description": desc
        });
        let genericEndpointId = this.getIdOfConnectorResponse(response);

        let bodyData = null;
        if (username !== undefined && username !== null) {
            bodyData = {
                "basicAuth": {
                    "key": username,
                    "value": password
                },
                "type": sourceType
            };
        } else if (authHeaderName !== undefined && authHeaderName !== null && authHeaderValue !== undefined && authHeaderValue !== null){
            bodyData = {
                "apiKey": {
                    "key": authHeaderName,
                    "value": authHeaderValue
                },
                "type": sourceType
            };
        } else {
            bodyData = {
                "type": sourceType
            };
        }

        if (sourceType === "DATABASE") {
            bodyData.url = url;
            bodyData.driverClassName = driverClassName;
        }

        if (sourceType !== "OTHER") {
            response = await restUtils.callConnector("POST", "/api/datasources", null, bodyData);
            let dataSourceId = this.getIdOfConnectorResponse(response);

            // dataSourceId is needed with double quotes at start and end for this API call
            await restUtils.callConnector("PUT", "/api/endpoints/" + genericEndpointId + "/datasource/" + dataSourceId);
        }
    },

    async updateGenericEndpoint(title, desc, id, dataSourceId, url, username, password, authHeaderName, authHeaderValue, sourceType, driverClassName, camelSqlUri) {
        let location = url;
        if (sourceType === "OTHER" || sourceType === "DATABASE") {
            location = camelSqlUri;
        }
        await restUtils.callConnector("PUT", "/api/endpoints/" + id, null, {
            "location": location,
            "type": "GENERIC",
            "title": title,
            "description": desc
        });

        if (sourceType !== "OTHER") {
            let bodyData = null;
            if (username !== undefined && username !== null) {
                bodyData = {
                    "basicAuth": {
                        "key": username,
                        "value": password
                    },
                    "type": sourceType,
                    "url": url
                };
            } else if (authHeaderName !== undefined && authHeaderName !== null && authHeaderValue !== undefined && authHeaderValue !== null){
                bodyData = {
                    "apiKey": {
                        "key": authHeaderName,
                        "value": authHeaderValue
                    },
                    "type": sourceType,
                    "url": url
                };
            } else {
                bodyData = {
                    "type": sourceType,
                    "url": url
                };
            }

            if (sourceType === "DATABASE") {
                bodyData.url = url;
                bodyData.driverClassName = driverClassName;
            }
            await restUtils.callConnector("PUT", "/api/datasources/" + dataSourceId, null, bodyData);
        }
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
        if (resource.artifactId !== undefined && resource.artifactId != null && resource.artifactId.trim() !== "") {
            await restUtils.callConnector("DELETE", "/api/artifacts/" + resource.artifactId);
        }
    },

    async deleteRequestedResource(id) {
        let resource = await this.getRequestedResource(id);
        await restUtils.callConnector("DELETE", "/api/requests/" + id);
        await restUtils.callConnector("DELETE", "/api/representations/" + resource.representationId);
        if (resource.artifactId !== undefined && resource.artifactId != null && resource.artifactId.trim() !== "") {
            await restUtils.callConnector("DELETE", "/api/artifacts/" + resource.artifactId);
        }
    },

    async getRoute(id) {
        return await restUtils.callConnector("GET", "/api/routes/" + id);
    },

    async getRouteSteps(id) {
        return (await restUtils.callConnector("GET", "/api/routes/" + id + "/steps"))._embedded.routes;
    },

    async deleteRoute(id) {
        let artifact = await restUtils.callConnector("GET", "/api/routes/" + id + "/output");
        if (typeof artifact == 'object') {
            let artifactId = this.getIdOfConnectorResponse(artifact);
            await restUtils.callConnector("DELETE", "/api/artifacts/" + artifactId);
        }
        await restUtils.callConnector("DELETE", "/api/routes/" + id);
    },

    async getEndpointList(node) {
        let endpointList = [];
        if (node.type === "backendnode") {
            let endpoint = await this.getGenericEndpoint(node.objectId);
            endpointList.push(endpoint);
        } else if (node.type === "appnode") {
            let endpoint = await this.getApp(node.objectId);
            endpointList.push(endpoint);
        }
        return endpointList;
    },

    async getGenericEndpoint(id) {
        let idsGenericEndpoint = await restUtils.callConnector("GET", "/api/endpoints/" + id);
        let dataSources = (await restUtils.callConnector("GET", "/api/datasources"))._embedded.datasources;
        let dataSource = null;
        let datasourceId = this.getIdOfLink(idsGenericEndpoint, "datasource");
        for (let ds of dataSources) {
            if (ds.id == datasourceId) {
                dataSource = ds;
            }
        }
        let endpoint = clientDataModel.convertIdsGenericEndpoint(idsGenericEndpoint, dataSource);
        endpoint.dataSource = dataSource;
        endpoint.selfLink = idsGenericEndpoint._links.self.href;
        return endpoint;
    },

    async getAppIdOfEndpointId(endpointId) {
        let result = null;
        let apps = await this.getApps();
        for (let app of apps) {
            let appEndpoints = await this.getAppEndpoints(app.id);

            for (let appEndpoint of appEndpoints) {
                if (endpointId == appEndpoint.id) {
                    result = app.id;
                    break;
                }
            }
        }
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

    async getSelfLinkOfEndpoint(endpointId) {
        let endpoint = await restUtils.callConnector("GET", "/api/endpoints/" + endpointId);
        return endpoint._links.self.href;
    },

    async getNodeIdByObjectId(endpointId, nodes) {
        let nodeId = null;
        for (let n of nodes) {
            if (n.type == "appnode") {
                let appId = await this.getAppIdOfEndpointId(endpointId);
                if (n.objectId == appId) {
                    nodeId = n.id;
                    break;
                }
            } else {
                if (n.objectId == endpointId) {
                    nodeId = n.id;
                    break;
                }
            }
        }
        return nodeId;
    },

    getCurrentDate() {
        return moment().format("YYYY-MM-DD");
    },

    async getConnectorAddress() {
        return await restUtils.callConnector("GET", "/connector/address");
    },

    getIdOfConnectorResponse(response) {
        return this.getIdOfLink(response, "self");
    },

    getIdOfPolicy(policyLink) {
        return policyLink.substring(policyLink.lastIndexOf("/")+1, policyLink.length);
    },

    getIdOfLink(response, linkName) {
        let url = response._links[linkName].href;
        return url.substring(url.lastIndexOf("/") + 1, url.length);
    },

    getIdOfAgreement(agreementLink) {
        let id = agreementLink.substring(0, agreementLink.lastIndexOf("/"));
        id = id.substring(id.lastIndexOf("/") + 1, id.length);
        return id;
    },

    async getCatalogs() {
        return (await restUtils.callConnector("GET", "/api/catalogs"))._embedded.catalogs;
    },

    async createCatalog(title, description) {
        await restUtils.callConnector("POST", "/api/catalogs", null, {
            "title": title,
            "description": description
        });
    },

    async updateCatalog(id, title, description) {
        await restUtils.callConnector("PUT", "/api/catalogs/" + id, null, {
            "title": title,
            "description": description
        });
    },

    async deleteCatalog(id) {
        await restUtils.callConnector("DELETE", "/api/catalogs/" + id);
    },

    async getCatalogsOfResource(resourceId) {
        return (await restUtils.callConnector("GET", "/api/offers/" + resourceId + "/catalogs"))._embedded.catalogs;
    },

    async getResourcesOfCatalog(catalogId) {
        let response = (await restUtils.callConnector("GET", "/api/catalogs/" + catalogId + "/offers"))._embedded.resources;
        let resources = [];
        for (let idsResource of response) {
            resources.push(clientDataModel.convertIdsResource(idsResource));
        }
        return resources;
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

    async createResourceWithMinimalRoute(catalogIds, title, description, language, paymentMethod, keywords, standardLicense, publisher, templateTitle, policyDescriptions,
        contractPeriodFromValue, contractPeriodToValue, filetype, brokerUris, file, genericEndpoint, additionalFields, endpointDocumentation = {}) {
        try {
            let routeSelfLink = null;
            if (genericEndpoint != null) {
                let response = await this.createNewRoute(this.getCurrentDate() + " - " + title);
                let routeId = this.getIdOfConnectorResponse(response);
                routeSelfLink = response._links.self.href;
                await restUtils.callConnector("PUT", "/api/routes/" + routeId + "/endpoint/start", null, "\"" + genericEndpoint.selfLink + "\"");
            }
            let resourceResponse = await this.createResource(catalogIds, title, description, language, paymentMethod, keywords, standardLicense, publisher,
                policyDescriptions, templateTitle, contractPeriodFromValue, contractPeriodToValue, filetype, file, routeSelfLink, additionalFields, endpointDocumentation);
            await this.updateResourceAtBrokers(brokerUris, resourceResponse.resourceId);
        } catch (error) {
            errorUtils.showError(error, "Save resource");
        }
    },

    async createResource(catalogIds, title, description, language, paymentMethod, keywords, standardLicense, publisher, policyDescriptions, templateTitle,
        contractPeriodFromValue, contractPeriodToValue, filetype, file, routeSelfLink, additionalFields, endpointDocumentation= {}) {
        // TODO Sovereign
        let resourceFields = {
            "title": title,
            "description": description,
            "keywords": keywords,
            "publisher": publisher,
            "language": language,
            "paymentMethod": paymentMethod,
            "license": standardLicense,
            "endpointDocumentation": endpointDocumentation
        }
        let response = (await restUtils.callConnector("POST", "/api/offers", null, Object.assign(resourceFields, additionalFields)));

        let resourceId = this.getIdOfConnectorResponse(response);
        for (let catalogId of catalogIds) {
            await restUtils.callConnector("POST", "/api/catalogs/" + catalogId + "/offers", null, [resourceId]);
        }
        response = await restUtils.callConnector("POST", "/api/contracts", null, {
            "title": templateTitle,
            "start": contractPeriodFromValue,
            "end": contractPeriodToValue
        });
        let contractId = this.getIdOfConnectorResponse(response);
        response = this.createRules(policyDescriptions, contractId);

        response = await restUtils.callConnector("POST", "/api/offers/" + resourceId + "/contracts", null, [contractId]);

        response = await restUtils.callConnector("POST", "/api/representations", null, {
            "language": language,
            "mediaType": filetype,
        });
        let representationId = this.getIdOfConnectorResponse(response);

        if (file != null) {
            response = await restUtils.callConnector("POST", "/api/artifacts", null, {
                "title": file.name,
                "value": file.data
            });
        } else if (routeSelfLink != null) {
            response = await restUtils.callConnector("POST", "/api/artifacts", null, {
                "accessUrl": routeSelfLink
            });
        }
        let artifactId = this.getIdOfConnectorResponse(response);

        response = await restUtils.callConnector("POST", "/api/offers/" + resourceId + "/representations", null, [representationId]);

        response = await restUtils.callConnector("POST", "/api/representations/" + representationId + "/artifacts", null, [artifactId]);

        return {
            "resourceId": resourceId,
            "artifactId": artifactId
        };
    },

    async editResource(resourceId, representationId, catalogIds, deletedCatalogIds, title, description, language, paymentMethod,
        keywords, standardLicense, publisher, samples, templateTitle, policyDescriptions, contractPeriodFromValue, contractPeriodToValue,
        filetype, brokerUris, brokerDeleteUris, file, genericEndpoint, ruleId, artifactId, additionalFields, endpointDocumentation = {}) {
        try {
            let resourceFields = {
                "title": title,
                "description": description,
                "keywords": keywords,
                "publisher": publisher,
                "language": language,
                "paymentMethod": paymentMethod,
                "license": standardLicense,
                "endpointDocumentation": endpointDocumentation,
                "samples": samples
            }
            await restUtils.callConnector("PUT", "/api/offers/" + resourceId, null, Object.assign(resourceFields, additionalFields));

            for (let catalogId of catalogIds) {
                await restUtils.callConnector("POST", "/api/catalogs/" + catalogId + "/offers", null, [resourceId]);
            }

            // TODO API Call Error
            for (let catalogId of deletedCatalogIds) {
                await restUtils.callConnector("DELETE", "/api/catalogs/" + catalogId + "/offers", null, [resourceId]);
            }

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

            let response = null;
            for (let policyDescription of policyDescriptions) {
                let ruleJson = await restUtils.callConnector("POST", "/api/examples/policy", null, policyDescription);
                response = await restUtils.callConnector("POST", "/api/rules", null, {
                    "value": JSON.stringify(ruleJson)
                });
                let ruleId = this.getIdOfConnectorResponse(response);
                response = await restUtils.callConnector("POST", "/api/contracts/" + contractId + "/rules", null, [ruleId]);
                response = await restUtils.callConnector("PUT", "/api/contracts/" + contractId, null, {
                    "title": templateTitle,
                    "start": contractPeriodFromValue,
                    "end": contractPeriodToValue
                });
            }

            await restUtils.callConnector("PUT", "/api/representations/" + representationId, null, {
                "language": language,
                "mediaType": filetype,
            });

            if (genericEndpoint != null) {
                let route = await this.getRouteOfArtifact(artifactId);
                let routeId = this.getIdOfConnectorResponse(route);
                await restUtils.callConnector("PUT", "/api/routes/" + routeId + "/endpoint/start", null, "\"" + genericEndpoint.selfLink + "\"");
            } else if (file != null) {
                await restUtils.callConnector("PUT", "/api/artifacts/" + artifactId, null, {
                    "title": file.name,
                    "value": file.data
                });
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
                "license": resource.standardLicense,
                "endpointDocumentation": resource.endpointDocumentation,
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

    async createResourceAndArtifact(destinationNode, routeSelfLink) {
        let resource = destinationNode.resource;
        let catalogIds = resource.catalogIds;
        let title = resource.title;
        let description = resource.description;
        let language = resource.language;
        let paymentMethod = resource.paymentMethod;
        let keywords = resource.keywords;
        let standardLicense = resource.standardLicense;
        let endpointDocumentation = resource.endpointDocumentation;
        let publisher = resource.publisher;
        let policyDescriptions = resource.policyDescriptions;
        let contractPeriodFromValue = resource.contractPeriodFromValue;
        let contractPeriodToValue = resource.contractPeriodToValue;
        let filetype = resource.fileType;
        let brokerUris = resource.brokerUris;
        let contractName = resource.contractName;
        let resourceResponse = await this.createResource(catalogIds, title, description, language, paymentMethod, keywords, standardLicense, publisher,
            policyDescriptions, contractName, contractPeriodFromValue, contractPeriodToValue, filetype, null, routeSelfLink, undefined, endpointDocumentation);

        await this.updateResourceAtBrokers(brokerUris, resourceResponse.resourceId);
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

    async getRouteOfArtifact(artifactId) {
        let route = await restUtils.callConnector("GET", "/api/artifacts/" + artifactId + "/route");
        if (typeof route == "string") {
            route = null;
        }
        return route;
    },

    async getRouteErrors() {
        let response = await restUtils.callConnector("GET", "/api/camel/routes/error");
        // response is not a valid JSON "{[]}", so remove brackets and parse.
        response = response.substring(1, response.length - 1);
        return JSON.parse(response);
    },

    async getRoutes() {
        return (await restUtils.callConnector("GET", "/api/routes"))._embedded.routes;
    },

    async addRouteStart(routeId, startSelfLink) {
        await restUtils.callConnector("PUT", "/api/routes/" + routeId + "/endpoint/start", null, "\"" + startSelfLink + "\"");
    },

    async addRouteEnd(routeId, endSelfLink) {
        await restUtils.callConnector("PUT", "/api/routes/" + routeId + "/endpoint/end", null, "\"" + endSelfLink + "\"");
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

    async createSubRoute(routeId, startSelfLink, startCoordinateX, startCoordinateY, endSelfLink, endCoordinateX, endCoordinateY) {
        let hasError = false;
        try {
            let response = await restUtils.callConnector("POST", "/api/routes", null, {
                "deploy": "None",
                "startCoordinateX": startCoordinateX,
                "startCoordinateY": startCoordinateY,
                "endCoordinateX": endCoordinateX,
                "endCoordinateY": endCoordinateY
            });
            let subRouteId = this.getIdOfConnectorResponse(response);
            let subRouteSelfLink = response._links.self.href;
            if (startSelfLink !== undefined && startSelfLink != null) {
                await restUtils.callConnector("PUT", "/api/routes/" + subRouteId + "/endpoint/start", null, "\"" + startSelfLink + "\"");
            }
            if (endSelfLink !== undefined && endSelfLink != null) {
                await restUtils.callConnector("PUT", "/api/routes/" + subRouteId + "/endpoint/end", null, "\"" + endSelfLink + "\"");
            }
            await restUtils.callConnector("POST", "/api/routes/" + routeId + "/steps", null, [subRouteSelfLink]);
        } catch (error) {
            errorUtils.showError(error, "Save Route");
            hasError = true;
        }
        return hasError;
    },

    async getDeployMethods() {
        return (await this.getEnums())["DEPLOY_METHOD"];
    },

    async getLogLevels() {
        return (await this.getEnums())["LOG_LEVEL"];
    },

    async getConnectorConfiguration() {
        let configuration = (await restUtils.callConnector("GET", "/api/configurations/active"));
        return clientDataModel.convertIdsConfiguration(configuration);
    },

    async changeConnectorConfiguration(id, connectorId, title, description, curator, maintainer, useProxy, proxyUrl, proxyNoProxy,
        useAuthentication, proxyUsername, proxyPassword, loglevel, deployMode, trustStoreUrl, trustStorePassword, trustStoreAlias,
        keyStoreUrl, keyStorePassword, keyStoreAlias) {
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
            "connectorId": connectorId,
            "title": title,
            "description": description,
            "curator": curator,
            "maintainer": maintainer,
            "logLevel": loglevel,
            "deployMode": deployMode,
            "truststore": {
                "location": trustStoreUrl,
                "alias": trustStoreAlias
            },
            "proxy": proxySettings,
            "keystore": {
                "location": keyStoreUrl,
                "alias": keyStoreAlias
            }
        };
        if (trustStorePassword != null) {
            config.truststore.password = trustStorePassword;
        }
        if (keyStorePassword != null) {
            config.keystore.password = keyStorePassword;
        }
        await restUtils.callConnector("PUT", "/api/configurations/" + id, null, config);
    },

    async getConnectorUpdateInfo() {
        return await restUtils.callConnector("GET", "/actuator/info");
    },

    async getConnectorDeployModes() {
        return (await this.getEnums())["CONNECTOR_DEPLOY_MODE"];
    },

    async searchResources(brokerUri, search) {
        let searchResult = [];
        let params = {
            "recipient": brokerUri,
            "limit": 100
        }
        let response = await restUtils.callConnector("POST", "/api/ids/search", params, search);
        let lines = response.split('\n');
        for (let line of lines) {
            if (line.trim().length > 0) {
                let lineSplit = line.split('\t');
                if (lineSplit[2] == "<https://w3id.org/idsa/core/Resource>") {
                    let resourceUrl = lineSplit[0].replace('<', '').replace('>', '');
                    searchResult.push({
                        title: lineSplit[1].replaceAll('"', '').replace("@en", ""),
                        resourceId: resourceUrl.substring(resourceUrl.lastIndexOf('/'), resourceUrl.length),
                        accessUrl: lineSplit[3].replace('<', '').replace('>', ''),
                    });
                }
            }
        }
        return searchResult;
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
                this.convertToClientResource(resource, resources);
            }
        }
        return resources;
    },

    async receiveIdsResourceCatalog(recipientId, catalogId) {
        let params = {
            "recipient": recipientId,
            "elementId": catalogId
        }
        return await restUtils.callConnector("POST", "/api/ids/description", params);
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

    async subscribeToResource(recipientId, resoureceId, subscriptionLocation, pushData) {
        let params = {
            "recipient": recipientId,
        }

        let body = {
            "target": resoureceId,
            "location": subscriptionLocation,
            "subscriber": subscriptionLocation,
            "pushData": pushData
        }
        body = JSON.stringify(body);

        return await restUtils.callConnector("POST", "/api/ids/subscribe", params, body);
    },

    async nonIdsSubscribeToResource(recipientId, resoureceId, subscriptionLocation, pushData) {
        let params = {
            "recipient": recipientId,
        }

        let body = {
            "target": resoureceId,
            "location": subscriptionLocation,
            "subscriber": subscriptionLocation,
            "pushData": pushData
        }
        body = JSON.stringify(body);

        return await restUtils.callConnector("POST", "/api/subscriptions", params, body);
    },

    async dispatchViaRoutes(artifactId, routes) {
        let params = {
            "routeIds": routes
        };
        await restUtils.callConnector("GET", "/api/artifacts/" + artifactId + "/data/", params);
    },

    convertToClientResource(resource, resources) {
        let id = resource["@id"].substring(resource["@id"].lastIndexOf("/"), resource["@id"].length);
        let creationDate = resource["ids:created"]["@value"];
        let title = resource["ids:title"][0]["@value"];
        let description = resource["ids:description"][0]["@value"];
        let language = resource["ids:language"][0]["@id"].replace("https://w3id.org/idsa/code/", "");
        let paymentMethod = "undefined";
        if (resource["ids:paymentModality"] != undefined && resource["ids:paymentModality"]["@id"] != null) {
            paymentMethod = this.getPaymentMethodName(resource["ids:paymentModality"]["@id"]);
        }
        let keywords = [];
        let idsKeywords = resource["ids:keyword"];
        for (let idsKeyword of idsKeywords) {
            keywords.push(idsKeyword["@value"]);
        }
        let version = resource["ids:version"];
        let standardLicense = resource["ids:standardLicense"]["@id"];
        let endpointDocumentation = "";
        if (resource["ids:resourceEndpoint"] !== undefined && resource["ids:resourceEndpoint"].length > 0) {
            if(resource["ids:resourceEndpoint"][0]["ids:endpointDocumentation"] !== undefined &&
                resource["ids:resourceEndpoint"][0]["ids:endpointDocumentation"].length > 0){
                endpointDocumentation = resource["ids:resourceEndpoint"][0]["ids:endpointDocumentation"][0]["@id"];
            }
        }
        let publisher = resource["ids:publisher"]["@id"];
        let fileType = null;
        if (resource["ids:representation"] !== undefined && resource["ids:representation"].length > 0) {
            fileType = resource["ids:representation"][0]["ids:mediaType"]["ids:filenameExtension"];
        }
        let contractPeriodFromValue = undefined;
        let contractPeriodToValue = undefined;
        if (resource["ids:contractOffer"] !== undefined && resource["ids:contractOffer"].length > 0) {
            contractPeriodFromValue = resource["ids:contractOffer"][0]["ids:contractStart"]["@value"];
            contractPeriodToValue = resource["ids:contractOffer"][0]["ids:contractEnd"]["@value"];
        }
        let contractName = resource.contractName;
        let clientResource = clientDataModel.createResource(resource["@id"], id, creationDate, title, description,
            language, paymentMethod, keywords, version, standardLicense, publisher, fileType, contractName, "",
            contractPeriodFromValue, contractPeriodToValue, undefined, undefined, undefined, undefined, undefined,
            undefined, undefined, undefined, endpointDocumentation);
        clientResource.idsResource = resource;
        resources.push(clientResource);
    },

    async getNumberOfActiveIncomingAgreements(){
        return (await restUtils.callConnector("GET", "/api/agreements"))["_embedded"]
            .agreements
            .filter((element) => element.confirmed === true
                && moment(JSON.parse(element["value"])["ids:contractEnd"]["@value"]).diff(moment()) > 0
                && moment(JSON.parse(element["value"])["ids:contractStart"]["@value"]).diff(moment()) < 0
                && element.remoteId === "genesis")
            .length;
    },
    async getNumberOfActiveOutgoingAgreements() {
        return (await restUtils.callConnector("GET", "/api/agreements"))["_embedded"]
            .agreements
            .filter((element) => element.confirmed === true && element.remoteId !== "genesis")
            .length;
    },
    async getNumberOfDataSources(){
        return (await this.getGenericEndpoints()).length;
    },
    async createContract(name, desc, contractPeriodFromValue, contractPeriodToValue, policyDescriptions){
        let bodyData = {
            "title": name,
            "description": desc,
            "start": contractPeriodFromValue,
            "end": contractPeriodToValue,
        }
        let createdContract = await restUtils.callConnector("POST", "/api/contracts", null, bodyData);
        let contractId = this.getIdOfConnectorResponse(createdContract);
        let response = this.createRules(policyDescriptions, contractId);
        return response.value;
    },
    async createRules(policyDescriptions, contractId) {
        for (let policyDescription of policyDescriptions) {
            let ruleJson = await restUtils.callConnector("POST", "/api/examples/policy", null, policyDescription);
            let response = await restUtils.callConnector("POST", "/api/rules", null, {
                "value": JSON.stringify(ruleJson)
            });
            let ruleId = this.getIdOfConnectorResponse(response);
            response = await restUtils.callConnector("POST", "/api/contracts/" + contractId + "/rules", null, [ruleId]);
        }
    },
    async getAllContracts() {
        let allContracts = [];
        let response = (await restUtils.callConnector("GET", "/api/contracts"))._embedded.contracts;
        if (response !== undefined) {
            for(let policy of response){
                let creationDate = policy.creationDate.substring(0, 19).replace("T", " ");
                let start = policy.start.substring(0, 19).replace("T", " ");
                let end = policy.end.substring(0, 19).replace("T", " ");
                let rules = (await restUtils.callConnector("GET", "/api/contracts/" + this.getIdOfConnectorResponse(policy) + "/rules"))["_embedded"].rules;
                allContracts.push({
                    id: this.getIdOfConnectorResponse(policy),
                    title: policy.title,
                    description: policy.description,
                    dateCreated: creationDate,
                    contractStart: start,
                    contractEnd: end,
                    rules: rules
                });
            }
        }
        return allContracts;
    },
    async getAllPolicyTemplates() {
        return (await this.getAllContracts())
            .filter(str => str.title !== "" && str.title.length >= 0 );
    },
    async getRules(rules) {
        let policyNames = [];
        let ruleJsons = [];
        let ruleIds = [];
        let contractRules = {};
        for (let rule of rules) {
            let policyName = await this.getPolicyNameByPattern(rule.value);
            policyNames.push(policyName);
            ruleIds.push(this.getIdOfConnectorResponse(rule));
            ruleJsons.push(JSON.parse(rule.value));
            contractRules = {
                policyNames: policyNames,
                ruleIds: ruleIds,
                ruleJsons: ruleJsons
            }
        }
        return contractRules;
    },
    async updateContract(contractId, name, desc, contractPeriodFromValue, contractPeriodToValue, policyDescriptions) {
        let bodyData = {
            "title": name,
            "description": desc,
            "start": contractPeriodFromValue,
            "end": contractPeriodToValue
        }
        let response = await restUtils.callConnector("PUT", "/api/contracts/" + contractId, null, bodyData).value;
        let rules = (await restUtils.callConnector("GET", "/api/contracts/" + contractId + "/rules"))["_embedded"].rules;
            for (let rule of rules) {
                await restUtils.callConnector("DELETE", "/api/rules/" + this.getIdOfConnectorResponse(rule));
        }
            response = await this.createRules(policyDescriptions, contractId);
        return response;
    },
    async deleteContract(id) {
        await restUtils.callConnector("DELETE", "/api/contracts/" + id);
    },
    async getNumberOfContracts() {
        return (await this.getAllContracts())
            // .filter((element) => element.confirmed === true && element.remoteId !== "genesis")
            .length;
    },
    async getNumberOfPolicyTemplates() {
        return (await this.getAllContracts())
            .filter(str => str.title !== "" && str.title.length >= 0 )
            .length;
    },
    async getOntology(){
        return (await restUtils.get("ontology")).data;
    },

    async getDaps() {
        return (await restUtils.callConnector("GET", "/api/daps"))._embedded.daps;
    },

    async createDaps(title, description, location, whitelisted){
        try {
            await restUtils.callConnector("POST", "/api/daps", null, {
                "title": title,
                "description": description,
                "location" : location,
                "whitelisted" : whitelisted
            });
        } catch (error) {
            errorUtils.showError(error, "Create Daps");
        }
    },

    async updateDaps(id, title, description, location, whitelisted) {
        try {
            await restUtils.callConnector("PUT", "/api/daps/" + id, null, {
                "title": title,
                "description": description,
                "location" : location,
                "whitelisted" : whitelisted
            });
        } catch (error) {
            errorUtils.showError(error, "Update Daps");
        }
    },

    async deleteDaps(id) {
        return await restUtils.callConnector("DELETE", "/api/daps/" + id);
    },
}


