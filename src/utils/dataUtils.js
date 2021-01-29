    import Axios from "axios";

    const POLICY_N_TIMES_USAGE = "N Times Usage";
    const POLICY_DURATION_USAGE = "Duration Usage";
    const POLICY_USAGE_DURING_INTERVAL = "Usage During Interval";

    const POLICY_TYPE_TO_NAME = {
        "ids:NotMoreThanNOffer": POLICY_N_TIMES_USAGE,
        "ids:DurationOffer": POLICY_DURATION_USAGE,
        "ids:IntervalUsageOffer": POLICY_USAGE_DURING_INTERVAL
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
        POLICY_N_TIMES_USAGE,
        POLICY_DURATION_USAGE,
        POLICY_USAGE_DURING_INTERVAL,

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

        convertTypeToPolicyName(type) {
            return POLICY_TYPE_TO_NAME[type];
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

        getBackendConnections(callback) {
            backendConnections = [];
            Axios.get("http://localhost:80/backend/connections").then(response => {
                var genericEndpoints = response.data;

                for (var genericEndpoint of genericEndpoints) {
                    backendConnections.push({
                        id: genericEndpoint["@id"],
                        endpoint: genericEndpoint,
                        url: genericEndpoint["ids:accessURL"]["@id"]
                    });
                }
                callback(backendConnections);
            }).catch(error => {
                console.log("Error in getBackendConnections(): ", error);
                callback([]);
            });
        },

        createBackendConnection(url, username, password, callback) {
            Axios.post("http://localhost:80/backend/connection?accessUrl=" + url + "&username=" + username + "&password=" + password).then(() => {
                callback();
            }).catch(error => {
                console.log("Error in saveBackendConnection(): ", error);
                callback();
            });
        },

        updateBackendConnection(id, url, username, password, callback) {
            Axios.put("http://localhost:80/backend/connection?id=" + id + "&accessUrl=" + url + "&username=" + username + "&password=" + password).then(() => {
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
            Axios.delete("http://localhost:80/backend/connection?id=" + id).then(() => {
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
                console.log(">>> appEndpoints: ", appEndpoints);
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

        getRoutes(callback) {
            Axios.get("http://localhost:80/approutes").then(response => {
                callback(response.data);
            }).catch(error => {
                console.log("Error in getRoutes(): ", error);
                callback([]);
            });
        },

        createNewRoute(callback) {
            Axios.post("http://localhost:80/createnewroute").then(response => {
                callback(response.data);
            }).catch(error => {
                console.log("Error in createNewRoute(): ", error);
            });
        },

        createSubRoute(routeId, startId, startCoordinateX, startCoordinateY, endId, endCoordinateX, endCoordinateY, resourceId, callback) {
            let params = "?routeId=" + routeId + "&startId=" + startId + "&startCoordinateX=" + startCoordinateX +
                "&startCoordinateY=" + startCoordinateY + "&endId=" + endId + "&endCoordinateX=" + endCoordinateX +
                "&endCoordinateY=" + endCoordinateY + "&resourceId=" + resourceId;
            Axios.post("http://localhost:80/approute/step" + params).then(response => {
                callback(response.data);
            }).catch(error => {
                console.log("Error in createSubRoute(): ", error);
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

        getProxySettings(callback) {
            Axios.get("http://localhost:80/proxy").then((response) => {
                callback(response.data);
            }).catch(error => {
                console.log("Error in getProxySettings(): ", error);
                callback(null);
            });
        },

        changeProxySettings(proxyUrl, proxyNoProxy, username, password, callback) {
            let params = "?proxyUri=" + proxyUrl + "&noProxyUri=" + proxyNoProxy + "&username=" +
                username + "&password=" + password;
            Axios.put("http://localhost:80/proxy" + params).then(() => {
                callback();
            }).catch(error => {
                console.log("Error in changeProxySettings(): ", error);
                callback();
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

        changeDeployMethod(deployMethod, callback) {
            let params = "?deployMethod=" + deployMethod;
            Axios.post("http://localhost:80/route/deploymethod" + params).then(() => {
                callback();
            }).catch(error => {
                console.log("Error in changeDeployMethod(): ", error);
                callback();
            });
        },
    }
