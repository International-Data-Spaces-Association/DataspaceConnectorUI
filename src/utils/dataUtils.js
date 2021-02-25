    import Axios from "axios";
    import moment from 'moment';
    import clientDataModel from "@/datamodel/clientDataModel";


    const POLICY_N_TIMES_USAGE = "N Times Usage";
    const POLICY_DURATION_USAGE = "Duration Usage";
    const POLICY_USAGE_DURING_INTERVAL = "Usage During Interval";
    const POLICY_PROVIDE_ACCESS = "Provide Access";
    const POLICY_PROHIBIT_ACCESS = "Prohibit Access";

    const POLICY_DESCRIPTION_TO_NAME = {
        "n-times-usage": POLICY_N_TIMES_USAGE,
        "duration-usage": POLICY_DURATION_USAGE,
        "usage-during-interval": POLICY_USAGE_DURING_INTERVAL,
        "provide-access": POLICY_PROVIDE_ACCESS,
        "prohibit-access": POLICY_PROHIBIT_ACCESS
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

        getResources(callback) {
            Axios.get("http://localhost:80/resources").then(response => {
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
            Axios.get("http://localhost:80/resource?resourceId=" + id).then(response => {
                callback(clientDataModel.convertIdsResource(response.data));
            }).catch(error => {
                console.log("Error in loadResource(): ", error);
                callback();
            });
        },

        getLanguages(callback) {
            if (languages == null) {
                Axios.get("http://localhost:80/enum?enumName=Language").then(response => {
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
                Axios.get("http://localhost:80/enum?enumName=SourceType").then(response => {
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
            let params = "?brokerUri=" + brokerUri;
            return new Promise(function (resolve, reject) {
                Axios.post("http://localhost:80/broker/register" + params).then(response => {
                    resolve(response.data);
                }).catch(error => {
                    console.log("Error in registerConnectorAtBroker(): ", error);
                    reject();
                });
            });
        },

        unregisterConnectorAtBroker(brokerUri) {
            let params = "?brokerUri=" + brokerUri;
            return new Promise(function (resolve, reject) {
                Axios.post("http://localhost:80/broker/unregister" + params).then(response => {
                    resolve(response.data);
                }).catch(error => {
                    console.log("Error in unregisterConnectorAtBroker(): ", error);
                    reject();
                });
            });
        },

        getResourceRegistrationStatus(resourceId) {
            let params = "?resourceId=" + resourceId;
            return new Promise(function (resolve, reject) {
                Axios.get("http://localhost:80/broker/resource/information" + params).then(response => {
                    resolve(response.data);
                }).catch(error => {
                    console.log("Error in getResourceRegistrationStatus(): ", error);
                    reject();
                });
            });
        },

        updateResourceAtBroker(brokerUri, resourceId) {
            let params = "?brokerUri=" + brokerUri + "&resourceId=" + resourceId;
            return new Promise(function (resolve, reject) {
                Axios.post("http://localhost:80/broker/update/resource" + params).then(() => {
                    resolve();
                }).catch(error => {
                    console.log("Error in updateResourceAtBroker(): ", error);
                    reject();
                });
            });
        },

        deleteResourceAtBroker(brokerUri, resourceId) {
            let params = "?brokerUri=" + brokerUri + "&resourceId=" + resourceId;
            return new Promise(function (resolve, reject) {
                Axios.post("http://localhost:80/broker/delete/resource" + params).then(() => {
                    resolve();
                }).catch(error => {
                    console.log("Error in deleteResourceAtBroker(): ", error);
                    reject();
                });
            });
        },

        getBrokers(callback) {
            let brokers = [];
            Axios.get("http://localhost:80/brokers").then(response => {
                brokers = response.data;
                callback(brokers);
            }).catch(error => {
                console.log("Error in getBrokers(): ", error);
            });
        },

        getBackendConnections(callback) {
            backendConnections = [];
            Axios.get("http://localhost:80/generic/endpoints").then(response => {
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

        createBackendConnection(url, username, password, callback) {
            Axios.post("http://localhost:80/generic/endpoint?accessUrl=" + url + "&username=" + username + "&password=" + password).then(() => {
                callback();
            }).catch(error => {
                console.log("Error in saveBackendConnection(): ", error);
                callback();
            });
        },

        updateBackendConnection(id, url, username, password, callback) {
            Axios.put("http://localhost:80/generic/endpoint?id=" + id + "&accessUrl=" + url + "&username=" + username + "&password=" + password).then(() => {
                callback();
            }).catch(error => {
                console.log("Error in saveBackendConnection(): ", error);
                callback();
            });
        },

        deleteResource(id, callback) {
            Axios.delete("http://localhost:80/resource?resourceId=" + id).then(() => {
                callback();
            }).catch(error => {
                console.log(error);
                callback();
            });
        },

        getRoute(id, callback) {
            Axios.get("http://localhost:80/approute?routeId=" + id).then(response => {
                callback(response.data)
            }).catch(error => {
                console.log("Error in getRoute(): ", error);
                callback();
            });
        },

        deleteRoute(id, callback) {
            Axios.delete("http://localhost:80/approute?routeId=" + id).then(() => {
                callback();
            }).catch(error => {
                console.log(error);
                callback();
            });
        },

        deleteBackendConnection(id, callback) {
            Axios.delete("http://localhost:80/generic/endpoint?endpointId=" + id).then(() => {
                callback();
            }).catch(error => {
                console.log("Error in saveBackendConnection(): ", error);
                callback();
            });
        },

        getApps(callback) {
            apps = [];
            Axios.get("http://localhost:80/apps").then(response => {
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
                console.log(id, " <> ", backendConnection.id);
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
            let params = "?accessUrl=" + accessUrl;
            Axios.post("http://localhost:80/connector/endpoint" + params).then((response) => {
                callback(response.data.connectorEndpointId);
            }).catch(error => {
                console.log("Error in createConnectorEndpoint(): ", error);
                callback();
            });
        },

        createResource(title, description, language, keyword, version, standardlicense, publisher, contractJson,
            sourceType, brokerUris, genericEndpointId, callback) {
            let params = "?title=" + title + "&description=" + description + "&language=" +
                language + "&keyword=" + keyword + "&version=" + version + "&standardlicense=" + standardlicense +
                "&publisher=" + publisher;
            Axios.post("http://localhost:80/resource" + params).then((response) => {
                let resourceId = response.data.resourceID;
                params = "?resourceId=" + resourceId;
                Axios.put("http://localhost:80/contract" + params, contractJson).then(() => {
                    params = "?resourceId=" + resourceId + "&endpointId=" + genericEndpointId + "&language=" + language + "&sourceType=" + sourceType;
                    Axios.post("http://localhost:80/representation" + params).then(() => {
                        this.createConnectorEndpoint("http://data_" + Date.now(), endpointId => {
                            this.createNewRoute(this.getCurrentDate() + " - " + title).then(routeId => {
                                this.createSubRoute(routeId, genericEndpointId, 0, 0,
                                    endpointId, 0, 0, resourceId).then(() => {
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

        editResource(resourceId, representationId, title, description, language, keyword, version, standardlicense, publisher, contractJson,
            sourceType, brokerUris, brokerDeleteUris, genericEndpointId, callback) {
            let params = "?resourceId=" + resourceId + "&title=" + title + "&description=" + description + "&language=" +
                language + "&keyword=" + keyword + "&version=" + version + "&standardlicense=" + standardlicense +
                "&publisher=" + publisher;
            Axios.put("http://localhost:80/resource" + params).then(() => {
                params = "?resourceId=" + resourceId;
                Axios.put("http://localhost:80/contract" + params, contractJson).then(() => {
                    params = "?resourceId=" + resourceId + "&representationId =" + representationId + "&endpointId=" + genericEndpointId + "&language=" + language + "&sourceType=" + sourceType;
                    Axios.put("http://localhost:80/representation" + params).then(() => {
                        // TODO Edit route/subroute on backend conneciton change.
                        let updateDeletePromises = [];
                        for (let brokerUri of brokerUris) {
                            updateDeletePromises.push(this.updateResourceAtBroker(brokerUri, resourceId));
                        }
                        for (let brokerUri of brokerDeleteUris) {
                            updateDeletePromises.push(this.deleteResourceAtBroker(brokerUri, resourceId));
                        }
                        Promise.all(updateDeletePromises).then(() => {
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
            }).catch(error => {
                console.log("Error in editResource(): ", error);
                callback();
            });
        },

        createResourceIdsEndpointAndAddSubRoute(title, description, language, keyword, version, standardlicense,
            publisher, contractJson, sourceType, brokerUris, genericEndpointId, routeId, startId, startCoordinateX,
            startCoordinateY, endCoordinateX, endCoordinateY) {
            let dataUtils = this;
            let params = "?title=" + title + "&description=" + description + "&language=" +
                language + "&keyword=" + keyword + "&version=" + version + "&standardlicense=" + standardlicense +
                "&publisher=" + publisher;
            return new Promise(function (resolve, reject) {
                Axios.post("http://localhost:80/resource" + params).then((response) => {
                    let resourceId = response.data.resourceID;
                    params = "?resourceId=" + resourceId;
                    Axios.put("http://localhost:80/contract" + params, contractJson).then(() => {
                        params = "?resourceId=" + resourceId + "&endpointId=" + genericEndpointId + "&language=" + language +
                            "&sourceType=" + sourceType;
                        Axios.post("http://localhost:80/representation" + params).then(() => {
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
        },

        getEndpointInfo(routeId, endpointId, callback) {
            var params = "?routeId=" + routeId + "&endpointId=" + endpointId;
            Axios.get("http://localhost:80/approute/step/endpoint/info" + params).then(response => {
                callback(response.data)
            }).catch(error => {
                console.log("Error in getEndpointInfo(): ", error);
                callback();
            });
        },

        getRoutes(callback) {
            Axios.get("http://localhost:80/approutes").then(response => {
                callback(response.data);
            }).catch(error => {
                console.log("Error in getRoutes(): ", error);
                callback([]);
            });
        },

        createNewRoute(description) {
            let params = "?description=" + description;
            return new Promise(function (resolve, reject) {
                Axios.post("http://localhost:80/approute" + params).then(response => {
                    resolve(response.data);
                }).catch(error => {
                    console.log("Error in createNewRoute(): ", error);
                    reject();
                });
            });
        },

        createSubRoute(routeId, startId, startCoordinateX, startCoordinateY, endId, endCoordinateX, endCoordinateY, resourceId) {
            let params = "?routeId=" + routeId + "&startId=" + startId + "&startCoordinateX=" + startCoordinateX +
                "&startCoordinateY=" + startCoordinateY + "&endId=" + endId + "&endCoordinateX=" + endCoordinateX +
                "&endCoordinateY=" + endCoordinateY + "&resourceId=" + resourceId;
            return new Promise(function (resolve, reject) {
                Axios.post("http://localhost:80/approute/step" + params).then(response => {
                    resolve(response.data);
                }).catch(error => {
                    console.log("Error in createSubRoute(): ", error);
                    reject();
                });
            });

        },

        setSubRouteEnd(routeId, subRouteId, accessUrl, callback) {
            let params = "?routeId=" + routeId + "&routeStepId=" + subRouteId + "&accessUrl=" + accessUrl;
            Axios.post("http://localhost:80/approute/subroute/end" + params).then(response => {
                callback(response.data);
            }).catch(error => {
                console.log("Error in setSubRouteEnd(): ", error);
            });
        },

        changeProxySettings(proxyUrl, proxyNoProxy, username, password) {
            let params = "?proxyUri=" + proxyUrl + "&noProxyUri=" + proxyNoProxy + "&username=" +
                username + "&password=" + password;
            return new Promise(function (resolve, reject) {
                Axios.put("http://localhost:80/proxy" + params).then(() => {
                    resolve();
                }).catch(error => {
                    console.log("Error in changeProxySettings(): ", error);
                    reject();
                });
            });
        },

        getDeployMethods(callback) {
            Axios.get("http://localhost:80/enum?enumName=deployMethod").then((response) => {
                callback(response.data);
            }).catch(error => {
                console.log("Error in getDeployMethod(): ", error);
                callback(null);
            });
        },

        getDeployMethod(callback) {
            Axios.get("http://localhost:80/route/deploymethod").then((response) => {
                callback(response.data);
            }).catch(error => {
                console.log("Error in getDeployMethod(): ", error);
                callback(null);
            });
        },

        changeDeployMethod(deployMethod) {
            let params = "?deployMethod=" + deployMethod;
            return new Promise(function (resolve, reject) {
                Axios.post("http://localhost:80/route/deploymethod" + params).then(() => {
                    resolve();
                }).catch(error => {
                    console.log("Error in changeDeployMethod(): ", error);
                    reject();
                });
            });
        },

        getLogLevels(callback) {
            Axios.get("http://localhost:80/enum?enumName=logLevel").then((response) => {
                callback(response.data);
            }).catch(error => {
                console.log("Error in getLogLevels(): ", error);
                callback(null);
            });
        },

        getConfigModel() {
            return new Promise(function (resolve, reject) {
                Axios.get("http://localhost:80/configmodel").then((response) => {
                    resolve(clientDataModel.convertIdsConfigModel(response.data));
                }).catch(error => {
                    console.log("Error in getConfigModel(): ", error);
                    reject();
                });
            });
        },

        changeConfigModel(logLevel, connectorDeployMode,
            trustStoreUrl, trustStorePassword, keyStoreUrl, keyStorePassword) {
            let params = "?logLevel=" + logLevel + "&connectorDeployMode=" + connectorDeployMode + "&trustStoreUrl=" +
                trustStoreUrl + "&trustStorePassword=" + trustStorePassword + "&keyStoreUrl=" + keyStoreUrl +
                "&keyStorePassword=" + keyStorePassword;
            return new Promise(function (resolve, reject) {
                Axios.put("http://localhost:80/configmodel" + params).then(() => {
                    resolve();
                }).catch(error => {
                    console.log("Error in changeLogLevel(): ", error);
                    reject();
                });
            });
        },

        getConnectorStatuses(callback) {
            Axios.get("http://localhost:80/enum?enumName=connectorStatus").then((response) => {
                callback(response.data);
            }).catch(error => {
                console.log("Error in getConnectorStatuses(): " + error);
                callback();
            })
        },

        getConnectorDeployModes(callback) {
            Axios.get("http://localhost:80/enum?enumName=connectorDeployMode").then((response) => {
                callback(response.data);
            }).catch(error => {
                console.log("Error in getConnectorDeployModes(): " + error);
                callback();
            })
        },

        changeTrustStoreSettings(trustStoreURL, callback) {
            let params = "?trustStoreUrl=" + trustStoreURL;
            Axios.put("http://localhost:80/configmodel" + params).then(() => {
                callback();
            }).catch(error => {
                console.log("Error in changeTrustStoreSettings(): ", error);
                callback();
            });
        },

        changeKeyStoreSettings(keyStoreURL, callback) {
            let params = "?keyStoreUrl=" + keyStoreURL;
            Axios.put("http://localhost:80/configmodel" + params).then(() => {
                callback();
            }).catch(error => {
                console.log("Error in changeKeyStoreSettings(): ", error);
                callback();
            });
        },
    }
