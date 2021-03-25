import moment from 'moment';
import clientDataModel from "@/datamodel/clientDataModel";
import restUtils from "./restUtils";


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

const OPERATOR_TYPE_TO_SYMBOL = {
    "idsc:EQ": "=",
    "idsc:LTEQ": "<=",
    "idsc:LT": "<",
};



var languages = null;
var sourcTypes = null;
var apps = null;
var backendConnections = null;

export default {
    POLICY_PROVIDE_ACCESS,
    POLICY_PROHIBIT_ACCESS,
    POLICY_N_TIMES_USAGE,
    POLICY_DURATION_USAGE,
    POLICY_USAGE_DURING_INTERVAL,
    POLICY_USAGE_UNTIL_DELETION,
    POLICY_USAGE_LOGGING,

    escape(text) {
        return encodeURIComponent(text);
    },

    getPolicyNames() {
        return Object.values(POLICY_DESCRIPTION_TO_NAME);
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

    getOfferedResourcesStats() {
        return new Promise(function (resolve) {
            restUtils.call("GET", "/api/ui/resources").then(response => {
                let resources = response.data;
                let totalSize = 0;
                for (let resource of resources) {
                    if (resource["ids:representation"] !== undefined) {
                        if (resource["ids:representation"][0]["ids:instance"] !== undefined) {
                            totalSize += resource["ids:representation"][0]["ids:instance"][0]["ids:byteSize"];
                        }
                    }
                }
                resolve({
                    totalNumber: resources.length,
                    totalSize: totalSize
                });
            }).catch(error => {
                throw new Error(error);
            });
        });
    },

    getResources(callback) {
        restUtils.call("GET", "/api/ui/resources").then(response => {
            let resources = [];
            for (var idsResource of response.data) {
                resources.push(clientDataModel.convertIdsResource(idsResource));
            }
            callback(resources);
        }).catch(error => {
            console.log(error);
            callback([]);
        });
    },

    getResource(id, callback) {
        restUtils.call("GET", "/api/ui/resource", {
            "resourceId": id
        }).then(response => {
            callback(clientDataModel.convertIdsResource(response.data));
        }).catch(error => {
            console.log("Error in loadResource(): ", error);
            callback();
        });
    },

    getLanguages(callback) {
        if (languages == null) {
            restUtils.call("GET", "/api/ui/enum/Language").then(response => {
                languages = response.data;
                callback(languages);
            }).catch(error => {
                console.log("Error in loadData(): ", error);
                callback([]);
            });
        } else {
            callback(languages);
        }
    },

    getSourceTypes(callback) {
        if (sourcTypes == null) {
            restUtils.call("GET", "/api/ui/enum/SourceType").then(response => {
                sourcTypes = response.data;
                callback(sourcTypes);
            }).catch(error => {
                console.log("Error in loadData(): ", error);
                callback([]);
            });
        } else {
            callback(sourcTypes);
        }
    },

    registerConnectorAtBroker(brokerUri) {
        let params = {
            "brokerUri": brokerUri
        };
        return new Promise(function (resolve) {
            restUtils.call("POST", "/api/ui/broker/register", params).then(response => {
                resolve(response.data);
            }).catch(error => {
                console.log("Error in registerConnectorAtBroker(): ", error);
                throw new Error(error);
            });
        });
    },

    unregisterConnectorAtBroker(brokerUri) {
        let params = {
            "brokerUri": brokerUri
        };
        return new Promise(function (resolve, reject) {
            restUtils.call("POST", "/api/ui/broker/unregister", params).then(response => {
                resolve(response.data);
            }).catch(error => {
                console.log("Error in unregisterConnectorAtBroker(): ", error);
                reject();
            });
        });
    },

    getResourceRegistrationStatus(resourceId) {
        let params = {
            "resourceId": resourceId
        }
        return new Promise(function (resolve) {
            restUtils.call("GET", "/api/ui/broker/resource/information", params).then(response => {
                resolve(response.data);
            }).catch(error => {
                console.log("Error in getResourceRegistrationStatus(): ", error);
                throw new Error(error);
            });
        });
    },

    updateResourceAtBroker(brokerUri, resourceId) {
        let params = {
            "brokerUri": brokerUri,
            "resourceId": resourceId
        };
        return new Promise(function (resolve, reject) {
            restUtils.call("POST", "/api/ui/broker/update/resource", params).then(() => {
                resolve();
            }).catch(error => {
                console.log("Error in updateResourceAtBroker(): ", error);
                reject();
            });
        });
    },

    deleteResourceAtBroker(brokerUri, resourceId) {
        let params = {
            "brokerUri": brokerUri,
            "resourceId": resourceId
        };
        return new Promise(function (resolve, reject) {
            restUtils.call("POST", "/api/ui/broker/delete/resource", params).then(() => {
                resolve();
            }).catch(error => {
                console.log("Error in deleteResourceAtBroker(): ", error);
                reject();
            });
        });
    },

    getBrokers(callback) {
        let brokers = [];
        restUtils.call("GET", "/api/ui/brokers").then(response => {
            brokers = response.data;
            callback(brokers);
        }).catch(error => {
            console.log("Error in getBrokers(): ", error);
        });
    },

    getBackendConnections(callback) {
        restUtils.call("GET", "/api/ui/generic/endpoints").then(response => {
            backendConnections = [];

            var genericEndpoints = response.data;

            for (var genericEndpoint of genericEndpoints) {
                backendConnections.push(this.genericEndpointToBackendConnection(genericEndpoint));
            }
            callback(backendConnections);
        }).catch(error => {
            console.log("Error in getBackendConnections(): ", error);
            callback([]);
        });
    },

    genericEndpointToBackendConnection(genericEndpoint) {
        return {
            id: genericEndpoint["@id"],
            endpoint: genericEndpoint,
            url: genericEndpoint["ids:accessURL"]["@id"]
        };
    },

    createBroker(url, title) {
        let dataUtils = this;
        return new Promise(function (resolve) {
            let params = {
                "brokerUri": url,
                "title": title
            };
            restUtils.call("POST", "/api/ui/broker", params).then(() => {
                dataUtils.registerConnectorAtBroker(url).then(() => {
                    resolve();
                });
            }).catch(error => {
                console.log("Error in createBroker(): ", error);
                throw new Error(error);
            });
        });
    },

    updateBroker(url, title) {
        let dataUtils = this;
        return new Promise(function (resolve) {
            let params = {
                "brokerUri": url,
                "title": title
            };
            restUtils.call("PUT", "/api/ui/broker", params).then(() => {
                dataUtils.registerConnectorAtBroker(url).then(() => {
                    resolve();
                });
            }).catch(error => {
                console.log("Error in updateBroker(): ", error);
                throw new Error(error);
            });
        });
    },

    deleteBroker(brokerId) {
        return new Promise(function (resolve) {
            let params = {
                "brokerUri": brokerId
            };
            restUtils.call("DELETE", "/api/ui/broker", params).then(() => {
                resolve();
            }).catch(error => {
                console.log("Error in deleteBroker(): ", error);
                throw new Error(error);
            });
        });
    },

    createBackendConnection(url, username, password, callback) {
        let params = {
            "accessURL": url,
            "username": username,
            "password": password
        };
        restUtils.call("POST", "/api/ui/generic/endpoint", params).then(() => {
            callback();
        }).catch(error => {
            console.log("Error in saveBackendConnection(): ", error);
            callback();
        });
    },

    updateBackendConnection(id, url, username, password, callback) {
        let params = {
            "id": id,
            "accessURL": url,
            "username": username,
            "password": password
        };
        restUtils.call("PUT", "/api/ui/generic/endpoint", params).then(() => {
            callback();
        }).catch(error => {
            console.log("Error in saveBackendConnection(): ", error);
            callback();
        });
    },

    deleteResource(id, callback) {
        let params = {
            "resourceId": id
        };
        restUtils.call("DELETE", "/api/ui/resource", params).then(() => {
            callback();
        }).catch(error => {
            console.log(error);
            callback();
        });
    },

    getRoute(id, callback) {
        let params = {
            "routeId": id
        };
        restUtils.call("GET", "/api/ui/approute", params).then(response => {
            callback(response.data)
        }).catch(error => {
            console.log("Error in getRoute(): ", error);
            callback();
        });
    },

    deleteRoute(id, callback) {
        let params = {
            "routeId": id
        };
        restUtils.call("DELETE", "/api/ui/approute", params).then(() => {
            callback();
        }).catch(error => {
            console.log(error);
            callback();
        });
    },

    deleteBackendConnection(id, callback) {
        let params = {
            "endpointId": id
        };
        restUtils.call("DELETE", "/api/ui/generic/endpoint", params).then(() => {
            callback();
        }).catch(error => {
            console.log("Error in saveBackendConnection(): ", error);
            callback();
        });
    },

    getApps(callback) {
        apps = [];
        restUtils.call("GET", "/api/ui/apps").then(response => {
            let appsResponse = response.data;
            for (var app of appsResponse) {
                apps.push(app[1]);
            }
            callback(apps);
        }).catch(error => {
            console.log("Error in getApps(): ", error);
            callback([]);
        });
    },

    getEndpointList(node, endpointType) {
        var endpointList = [];
        if (node.type == "backendnode") {
            let endpoint = this.getBackendConnection(node.objectId).endpoint;
            endpointList.push(endpoint);
        } else if (node.type == "appnode") {
            let appEndpoints = this.getApp(node.objectId).appEndpointList[1];
            for (let appEndpoint of appEndpoints) {
                if (appEndpoint[1].endpoint["ids:appEndpointType"]["@id"] == endpointType) {
                    endpointList.push(appEndpoint[1].endpoint);
                }
            }
        }
        return endpointList;
    },

    getBackendConnection(id) {
        var result = null;
        for (var backendConnection of backendConnections) {
            if (id == backendConnection.id) {
                result = backendConnection;
                break;
            }
        }
        return result;
    },

    getApp(id) {
        var result = null;
        for (var app of apps) {
            if (id == app.id) {
                result = app;
                break;
            }
        }
        return result;
    },

    getAppIdOfEndpointId(endpointId) {
        var result = null;
        for (var app of apps) {
            for (let appEndpoint of app.appEndpointList[1]) {
                if (endpointId == appEndpoint[1].endpoint["@id"]) {
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

    createConnectorEndpoint(accessUrl, callback) {
        let params = {
            "accessUrl": accessUrl
        }
        restUtils.call("POST", "/api/ui/connector/endpoint", params).then((response) => {
            callback(response.data.connectorEndpointId);
        }).catch(error => {
            console.log("Error in createConnectorEndpoint(): ", error);
            callback();
        });
    },

    createResource(title, description, language, keyword, version, standardlicense, publisher, contractJson,
        filetype, bytesize, brokerUris, genericEndpointId, callback) {
        let params = {
            "title": title,
            "description": description,
            "language": language,
            "keyword": keyword,
            "version": version,
            "standardlicense": standardlicense,
            "publisher": publisher
        }
        restUtils.call("POST", "/api/ui/resource", params).then((response) => {
            let resourceId = response.data.resourceID;
            params = {
                "resourceId": resourceId
            }
            restUtils.call("PUT", "/api/ui/resource/contract", params, contractJson).then(() => {
                // TODO remove sourceType when API changed.
                params = {
                    "resourceId": resourceId,
                    "endpointId": genericEndpointId,
                    "language": language,
                    "sourceType": "LOCAL",
                    "filenameExtension": filetype,
                    "bytesize": bytesize
                }
                restUtils.call("POST", "/api/ui/resource/representation", params).then(() => {
                    this.createConnectorEndpoint("http://data_" + Date.now(), endpointId => {
                        this.createNewRoute(this.getCurrentDate() + " - " + title).then(routeId => {
                            this.createSubRoute(routeId, genericEndpointId, 20, 150,
                                endpointId, 220, 150, resourceId).then(() => {
                                    this.updateResourceAtBrokers(brokerUris, resourceId, callback);
                                });
                        });
                    });
                }).catch(error => {
                    console.log("Error in createResource(): ", error);
                    callback();
                });
            }).catch(error => {
                console.log("Error in createResource(): ", error);
                callback();
            });

        }).catch(error => {
            console.log("Error in createResource(): ", error);
            callback();
        });
    },

    async editResource(resourceId, representationId, title, description, language, keyword, version, standardlicense, publisher, contractJson,
        filetype, bytesize, brokerUris, brokerDeleteUris, genericEndpointId, callback) {
        let params = {
            "resourceId": resourceId,
            "title": title,
            "description": description,
            "language": language,
            "keyword": keyword,
            "version": version,
            "standardlicense": standardlicense,
            "publisher": publisher
        }
        restUtils.call("PUT", "/api/ui/resource", params).then(() => {
            params = {
                "resourceId": resourceId
            }
            restUtils.call("PUT", "/api/ui/resource/contract", params, contractJson).then(() => {
                // TODO remove sourceType when API changed.
                params = {
                    "resourceId": resourceId,
                    "representationId": representationId,
                    "endpointId": genericEndpointId,
                    "language": language,
                    "filenameExtension": filetype,
                    "bytesize": bytesize,
                    "sourceType": "LOCAL"
                }
                restUtils.call("PUT", "/api/ui/resource/representation", params).then(() => {
                    this.updateResourceBrokerRegistration(brokerUris, brokerDeleteUris, resourceId, callback);
                }).catch(error => {
                    console.log("Error in editResource(): ", error);
                    callback();
                });
            }).catch(error => {
                console.log("Error in editResource(): ", error);
                callback();
            });
        }).catch(error => {
            console.log("Error in editResource(): ", error);
            callback();
        });
    },

    async updateResourceBrokerRegistration(brokerUris, brokerDeleteUris, resourceId, callback) {
        let updateDeletePromises = [];
        for (let brokerUri of brokerUris) {
            updateDeletePromises.push(await this.updateResourceAtBroker(brokerUri, resourceId));
        }
        for (let brokerUri of brokerDeleteUris) {
            updateDeletePromises.push(await this.deleteResourceAtBroker(brokerUri, resourceId));
        }
        Promise.all(updateDeletePromises).then(() => {
            callback();
        });
    },

    createResourceIdsEndpointAndAddSubRoute(title, description, language, keyword, version, standardlicense,
        publisher, contractJson, filetype, bytesize, brokerUris, genericEndpointId, routeId, startId, startCoordinateX,
        startCoordinateY, endCoordinateX, endCoordinateY) {
        let dataUtils = this;
        let params = {
            "title": title,
            "description": description,
            "language": language,
            "keyword": keyword,
            "version": version,
            "standardlicense": standardlicense,
            "publisher": publisher
        };
        return new Promise(function (resolve, reject) {
            restUtils.call("POST", "/api/ui/resource", params).then((response) => {
                let resourceId = response.data.resourceID;
                params = {
                    "resourceId": resourceId
                };
                restUtils.call("PUT", "/api/ui/resource/contract", params, contractJson).then(() => {
                    params = {
                        "resourceId": resourceId,
                        "endpointId": genericEndpointId,
                        "language": language,
                        "sourceType": "LOCAL",
                        "filenameExtension": filetype,
                        "bytesize": bytesize
                    };
                    restUtils.call("POST", "/api/ui/resource/representation", params).then(() => {
                        dataUtils.createConnectorEndpoint("http://data_" + Date.now(), endpointId => {
                            dataUtils.createSubRoute(routeId, startId, startCoordinateX, startCoordinateY,
                                endpointId, endCoordinateX, endCoordinateY, resourceId).then(() => {
                                    dataUtils.updateResourceAtBrokers(brokerUris, resourceId, resolve);
                                });
                        });
                    }).catch(error => {
                        console.log("Error in createResourceIdsEndpointAndAddSubRoute(): ", error);
                        reject();
                    });
                }).catch(error => {
                    console.log("Error in createResourceIdsEndpointAndAddSubRoute(): ", error);
                    reject();
                });

            }).catch(error => {
                console.log("Error in createResource(): ", error);
                reject();
            });
        });
    },

    async updateResourceAtBrokers(brokerUris, resourceId, resolve) {
        let updatePromises = [];
        for (let brokerUri of brokerUris) {
            updatePromises.push(await this.updateResourceAtBroker(brokerUri, resourceId));
        }
        Promise.all(updatePromises).then(() => {
            resolve();
        });
        return updatePromises;
    },

    getEndpointInfo(routeId, endpointId, callback) {
        let params = {
            "routeId": routeId,
            "endpointId": endpointId
        }
        restUtils.call("GET", "/api/ui/approute/step/endpoint/info", params).then(response => {
            callback(response.data)
        }).catch(error => {
            console.log("Error in getEndpointInfo(): ", error);
            callback();
        });
    },

    getRoutes(callback) {
        restUtils.call("GET", "/api/ui/approutes").then(response => {
            callback(response.data);
        }).catch(error => {
            console.log("Error in getRoutes(): ", error);
            callback([]);
        });
    },

    createNewRoute(description) {
        let params = {
            "description": description
        }
        return new Promise(function (resolve, reject) {
            restUtils.call("POST", "/api/ui/approute", params).then(response => {
                console.log("ROUTE RESP:", response.data);
                resolve(response.data.id);
            }).catch(error => {
                console.log("Error in createNewRoute(): ", error);
                reject();
            });
        });
    },

    createSubRoute(routeId, startId, startCoordinateX, startCoordinateY, endId, endCoordinateX, endCoordinateY, resourceId) {
        let params = {
            "routeId": routeId,
            "startId": startId,
            "startCoordinateX": startCoordinateX,
            "startCoordinateY": startCoordinateY,
            "endId": endId,
            "endCoordinateX": endCoordinateX,
            "endCoordinateY": endCoordinateY,
            "resourceId": resourceId
        }
        return new Promise(function (resolve, reject) {
            restUtils.call("POST", "/api/ui/approute/step", params).then(response => {
                resolve(response.data);
            }).catch(error => {
                console.log("Error in createSubRoute(): ", error);
                reject();
            });
        });

    },

    getDeployMethods() {
        return new Promise(function (resolve, reject) {
            restUtils.call("GET", "/api/ui/enum/deployMethod").then((response) => {
                resolve(response.data);
            }).catch(error => {
                console.log("Error in getDeployMethods(): ", error);
                reject(null);
            });
        });

    },

    getDeployMethod() {
        return new Promise(function (resolve, reject) {
            restUtils.call("GET", "/api/ui/route/deploymethod").then((response) => {
                resolve(response.data);
            }).catch(error => {
                console.log("Error in getDeployMethod(): ", error);
                reject(null);
            });
        });
    },

    changeDeployMethod(deployMethod) {
        let params = {
            "deployMethod": deployMethod
        };
        return new Promise(function (resolve, reject) {
            restUtils.call("PUT", "/api/ui/route/deploymethod", params).then(() => {
                resolve();
            }).catch(error => {
                console.log("Error in changeDeployMethod(): ", error);
                reject();
            });
        });
    },

    getLogLevels() {
        return new Promise(function (resolve, reject) {
            restUtils.call("GET", "/api/ui/enum/logLevel").then((response) => {
                resolve(response.data);
            }).catch(error => {
                console.log("Error in getLogLevels(): ", error);
                reject(null);
            });
        });
    },

    getConfigModel() {
        return new Promise(function (resolve, reject) {
            restUtils.call("GET", "/api/ui/configmodel").then((response) => {
                resolve(clientDataModel.convertIdsConfigModel(response.data));
            }).catch(error => {
                console.log("Error in getConfigModel(): ", error);
                reject();
            });
        });
    },

    changeConfigModel(logLevel, connectorDeployMode,
        trustStoreUrl, trustStorePassword, keyStoreUrl, keyStorePassword, proxyUrl, proxyNoProxy, username, password) {
        let params = {
            "logLevel": logLevel,
            "connectorDeployMode": connectorDeployMode,
            "trustStore": trustStoreUrl,
            "trustStorePassword": trustStorePassword,
            "keyStore": keyStoreUrl,
            "keyStorePassword": keyStorePassword,
            "proxyUri": proxyUrl,
            "noProxyUri": proxyNoProxy,
            "username": username,
            "password": password
        };
        return new Promise(function (resolve, reject) {
            restUtils.call("PUT", "/api/ui/configmodel", params).then(() => {
                resolve();
            }).catch(error => {
                console.log("Error in changeConfigModel(): ", error);
                reject();
            });
        });
    },

    getConnectorSettings() {
        return new Promise(function (resolve, reject) {
            restUtils.call("GET", "/api/ui/connector").then((response) => {
                resolve(clientDataModel.convertIdsConnector(response.data));
            }).catch(error => {
                console.log("Error in getConnectorSettings(): ", error);
                reject();
            });
        });
    },

    changeConnectorSettings(connectorTitle, connectorDescription,
        connectorEndpoint, connectorVersion, connectorCurator,
        connectorMaintainer, connectorInboundModelVersion, connectorOutboundModelVersion) {
        let params = {
            "title": connectorTitle,
            "description": connectorDescription,
            "version": connectorVersion,
            "curator": connectorCurator,
            "endpoint": connectorEndpoint,
            "maintainer": connectorMaintainer,
            "inboundModelVersion": connectorInboundModelVersion,
            "outboundModelVersion": connectorOutboundModelVersion
        };
        return new Promise(function (resolve, reject) {
            restUtils.call("PUT", "/api/ui/connector", params).then(() => {
                resolve();
            }).catch(error => {
                console.log("Error in changeConnectorSettings(): ", error);
                reject();
            });
        });
    },

    getConnectorStatuses() {
        return new Promise(function (resolve, reject) {
            restUtils.call("GET", "/api/ui/enum/connectorStatus").then((response) => {
                resolve(response.data);
            }).catch(error => {
                console.log("Error in getConnectorStatuses(): " + error);
                reject();
            });
        });
    },

    getConnectorDeployModes() {
        return new Promise(function (resolve, reject) {
            restUtils.call("GET", "/api/ui/enum/connectorDeployMode").then((response) => {
                resolve(response.data);
            }).catch(error => {
                console.log("Error in getConnectorDeployModes(): " + error);
                reject();
            });
        });
    },

    changeTrustStoreSettings(trustStoreURL, callback) {
        let params = {
            "trustStoreUrl": trustStoreURL
        };
        restUtils.call("PUT", "/api/ui/configmodel", params).then(() => {
            callback();
        }).catch(error => {
            console.log("Error in changeTrustStoreSettings(): ", error);
            callback();
        });
    },

    changeKeyStoreSettings(keyStoreURL, callback) {
        let params = {
            "keyStoreUrl": keyStoreURL
        };
        restUtils.call("PUT", "/api/ui/configmodel", params).then(() => {
            callback();
        }).catch(error => {
            console.log("Error in changeKeyStoreSettings(): ", error);
            callback();
        });
    },

    receiveResources(recipientId) {
        let params = {
            "recipientId": recipientId
        }
        return restUtils.call("POST", "/api/ui/request/description", params);
    },

    receiveResource(recipientId, requestedResourceId) {
        return new Promise(function (resolve, reject) {
            let params = {
                "recipientId": recipientId,
                "requestedResourceId": requestedResourceId
            };
            restUtils.call("POST", "/api/ui/request/description", params).then(response => {
                resolve(clientDataModel.convertIdsResource(response.data));
            }).catch(error => {
                console.log("Error in receiveResource(): ", error);
                reject(error);
            });
        });
    }
}
