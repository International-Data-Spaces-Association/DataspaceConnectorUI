import express from "express";
import cors from "cors";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 80;
let configModelUrl = "http://localhost:8081";

console.log("CONFIGMANAGER_URL", process.env.CONFIGMANAGER_URL);
if (process.env.CONFIGMANAGER_URL !== undefined) {
    configModelUrl = process.env.CONFIGMANAGER_URL;
}

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

function post(url, data) {
    console.log(">>> POST " + url);
    return axios.post(url, data, {
        headers: { 'content-type': 'charset=utf-8' }
    });
}

function put(url, data) {
    console.log(">>> PUT " + url);
    return axios.put(url, data);
}

function get(url) {
    console.log(">>> GET " + url);
    return axios.get(url);
}

function del(url) {
    console.log(">>> DELETE " + url);
    return axios.delete(url);
}

function escape(text) {
    return encodeURIComponent(text);
}

app.get('/connector', (req, res) => {
    get(configModelUrl + "/api/ui/connector").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /connector", error.response.status);
        res.send(error);
    });
});

app.post('/connector/endpoint', (req, res) => {
    var params = "?accessUrl=" + escape(req.query.accessUrl);
    post(configModelUrl + "/api/ui/connector/endpoint" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /connector/endpoint", error.response.status);
        res.send(error);
    });
});

app.get('/resources', (req, res) => {
    get(configModelUrl + "/api/ui/resources").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /resources", error);
        res.send(error);
    });
});

app.get('/resource', (req, res) => {
    get(configModelUrl + "/api/ui/resource?resourceId=" + escape(req.query.resourceId)).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /resource", error.response.status);
        res.send(error);
    });
});

app.post('/resource', (req, res) => {
    var params = "?title=" + escape(req.query.title) + "&description=" + escape(req.query.description) +
        "&language=" + escape(req.query.language) + "&keyword=" + escape(req.query.keyword) + "&version=" + escape(req.query.version) + "&standardlicense=" +
        escape(req.query.standardlicense) + "&publisher=" + escape(req.query.publisher);
    post(configModelUrl + "/api/ui/resource" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /resource", error.response.status);
        res.send(error);
    });
});

app.put('/resource', (req, res) => {
    var params = "?resourceId=" + escape(req.query.resourceId) + "&title=" + escape(req.query.title) +
        "&description=" + escape(req.query.description) + "&language=" + escape(req.query.language) + "&keyword=" + escape(req.query.keyword) +
        "&version=" + escape(req.query.version) + "&standardlicense=" + escape(req.query.standardlicense) + "&publisher=" +
        escape(req.query.publisher);
    put(configModelUrl + "/api/ui/resource" + params, req.body).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /resource", error.response.status);
        res.send(error);
    });
});

app.delete('/resource', (req, res) => {
    del(configModelUrl + "/api/ui/resource?resourceId=" + escape(req.query.resourceId)).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on DELETE /resource", error.response.status);
        res.send(error);
    });
});

app.put('/contract', (req, res) => {
    var params = "?resourceId=" + escape(req.query.resourceId);
    put(configModelUrl + "/api/ui/resource/contract" + params, req.body).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /contract", error.response.status);
        res.send(error);
    });
});

app.post('/representation', (req, res) => {
    // TODO filename extension and byte size should not be set in UI.
    var params = "?resourceId=" + escape(req.query.resourceId) + "&endpointId=" + escape(req.query.endpointId) + "&language=" + escape(req.query.language) + "&filenameExtension=json" +
        "&bytesize=1234&sourceType=" + escape(req.query.sourceType);
    post(configModelUrl + "/api/ui/resource/representation" + params, req.body).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /representation", error.response.status);
        res.send(error);
    });
});

app.put('/representation', (req, res) => {
    // TODO filename extension and byte size should not be set in UI.
    var params = "?resourceId=" + escape(req.query.resourceId) + "&representationId=" + escape(req.query.representationId) +
        "&endpointId=" + escape(req.query.endpointId) + "&language=" + escape(req.query.language) + "&filenameExtension=json" +
        "&bytesize=1234&sourceType=" + escape(req.query.sourceType);
    put(configModelUrl + "/api/ui/resource/representation" + params, req.body).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /representation", error.response.status);
        res.send(error);
    });
});

app.get('/approutes', (req, res) => {
    get(configModelUrl + "/api/ui/configmodel").then(response => {
        res.send(response.data["ids:appRoute"]);
    }).catch(error => {
        console.log("Error on GET /approutes", error.response.status);
        res.send(error);
    });
});

app.get('/approute', (req, res) => {
    var params = "?routeId=" + escape(req.query.routeId);
    get(configModelUrl + "/api/ui/approute" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /approute", error.response.status);
        res.send(error);
    });
});

app.get('/approute/step/endpoint/info', (req, res) => {
    var params = "?routeId=" + escape(req.query.routeId) + "&endpointId=" + escape(req.query.endpointId);
    get(configModelUrl + "/api/ui/approute/step/endpoint/info" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /approute/step/endpoint/info", error.response.status);
        res.send(error);
    });
});

app.get('/generic/endpoints', (req, res) => {
    get(configModelUrl + "/api/ui/generic/endpoints").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /generic/endpoints", error.response.status);
        res.send(error);
    });
});

app.post('/generic/endpoint', (req, res) => {
    post(configModelUrl + "/api/ui/generic/endpoint?accessURL=" + escape(req.query.accessUrl) + "&username=" +
        escape(req.query.username) + "&password=" + escape(req.query.password)).then(response => {
            res.send(response.data);
        }).catch(error => {
            console.log("Error on POST /generic/endpoint", error.response.status);
            res.send(error);
        });
});

app.put('/generic/endpoint', (req, res) => {
    put(configModelUrl + "/api/ui/generic/endpoint?id=" + escape(req.query.id) + "&accessURL=" +
        escape(req.query.accessUrl) + "&username=" + escape(req.query.username) + "&password=" +
        escape(req.query.password)).then(response => {
            res.send(response.data);
        }).catch(error => {
            console.log("Error on PUT /generic/endpoint", error.response.status);
            res.send(error);
        });
});

app.delete('/generic/endpoint', (req, res) => {
    del(configModelUrl + "/api/ui/generic/endpoint?endpointId=" +
        escape(req.query.endpointId)).then(response => {
            res.send(response.data);
        }).catch(error => {
            console.log("Error on DELETE /generic/endpoint", error.response.status);
            res.send(error);
        });
});

app.put('/approute', (req, res) => {
    put(configModelUrl + "/api/ui/approute/endpoint?routeId=" + escape(req.query.routeId) + "&endpointId=" +
        escape(req.query.endpointId) + "&accessUrl=" + escape(req.query.accessUrl) + "&username=" +
        escape(req.query.username) + "&password=" + escape(req.query.password)).then(response => {
            res.send(response.data);
        }).catch(error => {
            console.log("Error on POST /resource", error.response.status);
            res.send(error);
        });
});

app.delete('/approute', (req, res) => {
    del(configModelUrl + "/api/ui/approute?routeId=" + escape(req.query.routeId)).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on DELETE /approute", error.response.status);
        res.send(error);
    });
});

app.get('/apps', (req, res) => {
    get(configModelUrl + "/api/ui/apps").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /apps", error.response.status);
        res.send(error);
    });
});

app.get('/test', (req, res) => {
    get(configModelUrl + "/api/ui/configmodel").then(response => {
        let output = "";
        let configmodel = response.data;
        if (configmodel["ids:appRoute"] !== undefined) {
            output += "App Routes: " + configmodel["ids:appRoute"].length + "<br>";
            for (let route of configmodel["ids:appRoute"]) {
                output += "&emsp;Route Starts: " + route["ids:appRouteStart"].length + "<br>";
                for (let start of route["ids:appRouteStart"]) {
                    output += "&emsp;&emsp;Endpoint URL: " + start["ids:accessURL"]["@id"] + "<br>";
                }
            }
        }
        res.send(output);
    }).catch(error => {
        console.log("Error on GET /test", error);
        res.send(error);
    });
});

app.get('/brokers', (req, res) => {
    get(configModelUrl + "/api/ui/brokers").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /brokers", error.response.status);
        res.send(error);
    });
});

app.post('/broker', (req, res) => {
    let params = "?brokerUri=" + escape(req.query.brokerUri) + "&title=" + escape(req.query.title);
    post(configModelUrl + "/api/ui/broker" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /broker", error.response.status);
        res.send(error);
    });
});

app.post('/broker/register', (req, res) => {
    let params = "?brokerUri=" + escape(req.query.brokerUri);
    post(configModelUrl + "/api/ui/broker/register" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /broker/register", error.response.status);
        res.send(error);
    });
});

app.post('/broker/unregister', (req, res) => {
    let params = "?brokerUri=" + escape(req.query.brokerUri);
    post(configModelUrl + "/api/ui/broker/unregister" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /broker/unregister", error.response.status);
        res.send(error);
    });
});

app.post('/broker/update/resource', (req, res) => {
    let params = "?brokerUri=" + escape(req.query.brokerUri) + "&resourceId=" + escape(req.query.resourceId);
    post(configModelUrl + "/api/ui/broker/update/resource" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /broker/update/resource", error.response.status);
        res.send(error);
    });
});

app.get('/broker/resource/information', (req, res) => {
    let params = "?resourceId=" + escape(req.query.resourceId);
    get(configModelUrl + "/api/ui/broker/resource/information" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /broker/resource/information", error.response.status);
        res.send(error);
    });
});

app.post('/broker/delete/resource', (req, res) => {
    let params = "?brokerUri=" + escape(req.query.brokerUri) + "&resourceId=" + escape(req.query.resourceId);
    post(configModelUrl + "/api/ui/broker/delete/resource" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /broker/delete/resource", error.response.status);
        res.send(error);
    });
});

app.put('/broker', (req, res) => {
    let params = "?brokerUri=" + escape(req.query.brokerUri) + "&title=" + escape(req.query.title);
    put(configModelUrl + "/api/ui/broker" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /broker", error.response.status);
        res.send(error);
    });
});

app.delete('/broker', (req, res) => {
    del(configModelUrl + "/api/ui/broker?brokerUri=" + escape(req.query.brokerId)).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on DELETE /broker", error.response.status);
        res.send(error);
    });
});

app.get('/offeredresourcesstats', (req, res) => {
    get(configModelUrl + "/api/ui/resources").then(response => {
        let resources = response.data;
        let totalSize = 0;
        for (let resource of resources) {
            if (resource["ids:representation"] !== undefined) {
                if (resource["ids:representation"][0]["ids:instance"] !== undefined) {
                    totalSize += resource["ids:representation"][0]["ids:instance"][0]["ids:byteSize"];
                }
            }
        }
        res.send({
            totalNumber: resources.length,
            totalSize: totalSize
        });
    }).catch(error => {
        console.log("Error on GET /offeredresourcesstats", error);
        res.send(error);
    });
});

app.get('/configmodel', (req, res) => {
    get(configModelUrl + "/api/ui/configmodel").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /configmodel", error.response.status);
        res.send(error);
    });
});

app.put('/configmodel', (req, res) => {
    let params = "?loglevel=" + escape(req.query.logLevel) + "&connectorDeployMode=" + escape(req.query.connectorDeployMode) + "&trustStore=" +
        escape(req.query.trustStoreUrl) + "&trustStorePassword=" + escape(req.query.trustStorePassword) + "&keyStore=" + escape(req.query.keyStoreUrl) +
        "&keyStorePassword=" + escape(req.query.keyStorePassword) + "&proxyUri=" + escape(req.query.proxyUri) + "&noProxyUri=" + escape(req.query.noProxyUri) +
        "&username=" + escape(req.query.username) + "&password=" + escape(req.query.password);
    put(configModelUrl + "/api/ui/configmodel" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /configmodel", error.response.status);
        res.send(error);
    });
});

app.get('/connector', (req, res) => {
    get(configModelUrl + "/api/ui/connector").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /connector", error.response.status);
        res.send(error);
    });
});

app.put('/connector', (req, res) => {
    let params = "?title=" + escape(req.query.connectorTitle) + "&description=" + escape(req.query.connectorDescription) +
        "&endpoint=" + escape(req.query.connectorEndpoint) + "&version=" + escape(req.query.connectorVersion) +
        "&curator=" + escape(req.query.connectorCurator) + "&maintainer=" + escape(req.query.connectorMaintainer) +
        "&inboundModelVersion=" + escape(req.query.connectorInboundModelVersion) + "&outboundModelVersion=" +
        escape(req.query.connectorOutboundModelVersion);
    put(configModelUrl + "/api/ui/connector" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /connector", error.response.status);
        res.send(error);
    });
});

app.get('/configmodel', (req, res) => {
    console.log("GET http://" + configModelHost + ":" + configModelPort + "/api/ui/configmodel");
    get(configModelUrl + "/api/ui/configmodel").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /configmodel", error.response.status);
        res.send(error);
    });
});

app.get('/route/deploymethod', (req, res) => {
    get(configModelUrl + "/api/ui/route/deploymethod").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /route/deploymethod", error.response.status);
        res.send(error);
    });
});

app.put('/route/deploymethod', (req, res) => {
    let params = "?deployMethod=" + escape(req.query.deployMethod);
    put(configModelUrl + "/api/ui/route/deploymethod" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /route/deploymethod", error.response.status);
        res.send(error);
    });
});

app.get('/enum', (req, res) => {
    get(configModelUrl + "/api/ui/enum/" + escape(req.query.enumName)).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /enum", error.response.status);
        res.send(error);
    });
});

app.post('/approute', (req, res) => {
    let params = "?description=" + escape(req.query.description);
    post(configModelUrl + "/api/ui/approute" + params).then(response => {
        console.log(">>> new route response: ", response.data);
        res.send(response.data.id);
    }).catch(error => {
        console.log("Error on POST /approute", error.response.status);
        res.send(error);
    });
});

app.post('/approute/step', (req, res) => {
    let params;
    if (req.query.resourceId == null) {
        params = "?routeId=" + escape(req.query.routeId) + "&startId=" + escape(req.query.startId) + "&startCoordinateX=" + escape(req.query.startCoordinateX) +
            "&startCoordinateY=" + escape(req.query.startCoordinateY) + "&endId=" + escape(req.query.endId) + "&endCoordinateX=" + escape(req.query.endCoordinateX) +
            "&endCoordinateY=" + escape(req.query.endCoordinateY);
    } else {
        params = "?routeId=" + escape(req.query.routeId) + "&startId=" + escape(req.query.startId) + "&startCoordinateX=" + escape(req.query.startCoordinateX) +
            "&startCoordinateY=" + escape(req.query.startCoordinateY) + "&endId=" + escape(req.query.endId) + "&endCoordinateX=" + escape(req.query.endCoordinateX) +
            "&endCoordinateY=" + escape(req.query.endCoordinateY) + "&resourceId=" + escape(req.query.resourceId);
    }
    post(configModelUrl + "/api/ui/approute/step" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /approute/step", error.response.status);
        res.send(error);
    });
});

app.post('/request/description', (req, res) => {
    let params = "?recipientId=" + escape(req.query.recipientId);
    if (req.query.requestedResourceId !== undefined) {
        params += "&requestedResourceId=" + escape(req.query.requestedResourceId);
    }
    post(configModelUrl + "/api/ui/request/description" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /request/description", error.response.status);
        res.send(error);
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
