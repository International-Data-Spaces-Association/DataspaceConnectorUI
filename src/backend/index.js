import express from "express";
import cors from "cors";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 80;
const configModelPort = 8081;

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/connector', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/connector").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /connector", error.response.status);
        res.send(error);
    });
});

app.get('/attributes', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/attributes/properties/" + req.query.type).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /attributes", error.response.status);
        res.send(error);
    });
});

app.get('/resources', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/resources").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /resources", error);
        res.send(error);
    });
});

app.get('/resource', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/resource?resourceId=" + req.query.resourceId).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /resource", error.response.status);
        res.send(error);
    });
});

app.post('/resource', (req, res) => {
    var params = "?title=" + req.query.title + "&description=" + req.query.description +
        "&language=" + req.query.language + "&keyword=" + req.query.keyword + "&version=" + req.query.version + "&standardlicense=" +
        req.query.standardlicense + "&publisher=" + req.query.publisher + "&brokerList=";
    console.log(">>> POST http://localhost:" + configModelPort + "/api/ui/resource" + params);
    axios.post("http://localhost:" + configModelPort + "/api/ui/resource" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /resource", error.response.status);
        res.send(error);
    });
});

app.put('/resource', (req, res) => {
    var params = "?resourceId=" + req.query.resourceId + "&title=" + req.query.title +
        "&description=" + req.query.description + "&language=" + req.query.language + "&keyword=" + req.query.keyword +
        "&version=" + req.query.version + "&standardlicense=" + req.query.standardlicense + "&publisher=" +
        req.query.publisher;
    axios.put("http://localhost:" + configModelPort + "/api/ui/resource" + params, req.body).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /resource", error.response.status);
        res.send(error);
    });
});

app.delete('/resource', (req, res) => {
    axios.delete("http://localhost:" + configModelPort + "/api/ui/resource?resourceId=" + req.query.resourceId).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on DELETE /resource", error.response.status);
        res.send(error);
    });
});

app.put('/contract', (req, res) => {
    var params = "?resourceId=" + req.query.resourceId;
    console.log(">>> PUT http://localhost:" + configModelPort + "/api/ui/resource/contract" + params);
    console.log(req.body);
    axios.put("http://localhost:" + configModelPort + "/api/ui/resource/contract" + params, req.body).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /contract", error.response.status);
        res.send(error);
    });
});

app.post('/representation', (req, res) => {
    // TODO filename extension and byte size should not be set in UI.
    var params = "?resourceId=" + req.query.resourceId + "&endpointId=" + req.query.endpointId + "&language=" + req.query.language + "&filenameExtension=json" +
        "&bytesize=1234&sourceType=" + req.query.sourceType;
    console.log(">>> POST http://localhost:" + configModelPort + "/api/ui/resource/representation" + params);
    axios.post("http://localhost:" + configModelPort + "/api/ui/resource/representation" + params, req.body).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /representation", error.response.status);
        res.send(error);
    });
});

app.get('/approutes', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/configmodel").then(response => {
        res.send(response.data["ids:appRoute"]);
    }).catch(error => {
        console.log("Error on GET /approutes", error.response.status);
        res.send(error);
    });
});

app.get('/approute', (req, res) => {
    var params = "?routeId=" + req.query.routeId;
    console.log(">>> GET http://localhost:" + configModelPort + "/api/ui/approute" + params);
    axios.get("http://localhost:" + configModelPort + "/api/ui/approute" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /approute", error.response.status);
        res.send(error);
    });
});

app.get('/approute/step/endpoint/info', (req, res) => {
    var params = "?routeId=" + req.query.routeId + "&endpointId=" + req.query.endpointId;
    console.log(">>> GET http://localhost:" + configModelPort + "/api/ui/approute/step/endpoint/info" + params);
    axios.get("http://localhost:" + configModelPort + "/api/ui/approute/step/endpoint/info" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /approute/step/endpoint/info", error.response.status);
        res.send(error);
    });
});

app.get('/backend/connections', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/backend/connections").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /backend/connections", error.response.status);
        res.send(error);
    });
});

app.post('/backend/connection', (req, res) => {
    console.log(">>> POST http://localhost:" + configModelPort + "/api/ui/backend/connection?accessURL=" + req.query.accessUrl + "&username=" +
        req.query.username + "&password=" + req.query.password);
    axios.post("http://localhost:" + configModelPort + "/api/ui/backend/connection?accessURL=" + req.query.accessUrl + "&username=" +
        req.query.username + "&password=" + req.query.password).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /backend/connection", error.response.status);
        res.send(error);
    });
});

app.put('/backend/connection', (req, res) => {
    console.log(">>> PUT http://localhost:" + configModelPort + "/api/ui/backend/connection?id=" + req.query.id + "&accessURL=" + req.query.accessUrl + "&username=" +
        req.query.username + "&password=" + req.query.password);
    axios.put("http://localhost:" + configModelPort + "/api/ui/backend/connection?id=" + req.query.id + "&accessURL=" + req.query.accessUrl + "&username=" +
        req.query.username + "&password=" + req.query.password).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /backend/connection", error.response.status);
        res.send(error);
    });
});

app.delete('/backend/connection', (req, res) => {
    console.log(">>> DELETE http://localhost:" + configModelPort + "/api/ui/backend/connection?id=" + req.query.id);
    axios.delete("http://localhost:" + configModelPort + "/api/ui/backend/connection?id=" + req.query.id).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on DELETE /backend/connection", error.response.status);
        res.send(error);
    });
});

app.post('/approute', (req, res) => {
    axios.post("http://localhost:" + configModelPort + "/api/ui/approute/endpoint?accessUrl=" + req.query.accessUrl + "&username=" +
        req.query.username + "&password=" + req.query.password).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /resource", error.response.status);
        res.send(error);
    });
});

app.put('/approute', (req, res) => {
    axios.put("http://localhost:" + configModelPort + "/api/ui/approute/endpoint?routeId=" + req.query.routeId + "&endpointId=" +
        req.query.endpointId + "&accessUrl=" + req.query.accessUrl + "&username=" +
        req.query.username + "&password=" + req.query.password).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /resource", error.response.status);
        res.send(error);
    });
});

app.delete('/approute', (req, res) => {
    console.log(">>> DELETE http://localhost:" + configModelPort + "/api/ui/approute?routeId=" + req.query.routeId);
    axios.delete("http://localhost:" + configModelPort + "/api/ui/approute?routeId=" + req.query.routeId).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on DELETE /approute", error.response.status);
        res.send(error);
    });
});

app.get('/apps', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/apps").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /apps", error.response.status);
        res.send(error);
    });
});

app.get('/test', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/configmodel").then(response => {
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
    axios.get("http://localhost:" + configModelPort + "/api/ui/brokers").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /brokers", error.response.status);
        res.send(error);
    });
});

app.post('/broker', (req, res) => {
    let params = "?brokerUri=" + req.query.brokerUri + "&title=" + req.query.title;
    axios.post("http://localhost:" + configModelPort + "/api/ui/broker" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /broker", error.response.status);
        res.send(error);
    });
});

app.post('/broker/register', (req, res) => {
    let params = "?brokerUri=" + req.query.brokerUri;
    axios.post("http://localhost:" + configModelPort + "/api/ui/broker/register" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /broker/register", error.response.status);
        res.send(error);
    });
});

app.put('/broker', (req, res) => {
    let params = "?brokerUri=" + req.query.brokerUri + "&title=" + req.query.title;
    axios.put("http://localhost:" + configModelPort + "/api/ui/broker" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /broker", error.response.status);
        res.send(error);
    });
});

app.delete('/broker', (req, res) => {
    axios.delete("http://localhost:" + configModelPort + "/api/ui/broker?brokerUri=" + req.query.brokerId).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on DELETE /broker", error.response.status);
        res.send(error);
    });
});

app.get('/offeredresourcesstats', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/resources").then(response => {
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

app.get('/sourcetypesstats', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/resources").then(response => {
        let resources = response.data;
        let sourceTypes = [];
        for (let resource of resources) {
            if (resource["ids:representation"] !== undefined) {
                if (resource["ids:representation"][0]["ids:sourceType"] !== undefined) {
                    let type = resource["ids:representation"][0]["ids:sourceType"];
                    if (sourceTypes[type] === undefined) {
                        sourceTypes[type] = 1;
                    } else {
                        sourceTypes[type] = sourceTypes[type] + 1;
                    }
                }
            }
        }
        let labels = [];
        let series = [];
        for (let sourceType in sourceTypes) {
            labels.push(sourceType);
            series.push(sourceTypes[sourceType]);
        }
        res.send({
            labels: labels,
            series: series
        });
    }).catch(error => {
        console.log("Error on GET /offeredresourcesstats", error);
        res.send(error);
    });
});

app.get('/filetypesstats', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/resources").then(response => {
        let resources = response.data;
        let filetypes = [];
        for (let resource of resources) {
            if (resource["ids:representation"] !== undefined) {
                if (resource["ids:representation"][0]["ids:sourceType"] !== undefined) {
                    let type = resource["ids:representation"][0]["ids:mediaType"]["ids:filenameExtension"];
                    if (filetypes[type] === undefined) {
                        filetypes[type] = 1;
                    } else {
                        filetypes[type] = filetypes[type] + 1;
                    }
                }
            }
        }
        let labels = [];
        let series = [];
        for (let filetype in filetypes) {
            labels.push(filetype);
            series.push(filetypes[filetype]);
        }
        res.send({
            labels: labels,
            series: series
        });
    }).catch(error => {
        console.log("Error on GET /offeredresourcesstats", error);
        res.send(error);
    });
});

app.get('/proxy', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/configmodel/proxy").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /configmodel/proxy", error.response.status);
        res.send(error);
    });
});

app.put('/proxy', (req, res) => {
    let params = "?proxyUri=" + req.query.proxyUri + "&noProxyUri=" + req.query.noProxyUri + "&username=" +
        req.query.username + "&password=" + req.query.password;
    console.log(">>> PUT http://localhost:" + configModelPort + "/api/ui/configmodel/proxy" + params);
    axios.put("http://localhost:" + configModelPort + "/api/ui/configmodel/proxy" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on PUT /configmodel/proxy", error.response.status);
        res.send(error);
    });
});

app.get('/route/deploymethod', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/route/deploymethod").then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /route/deploymethod", error.response.status);
        res.send(error);
    });
});

app.post('/route/deploymethod', (req, res) => {
    let params = "?deployMethod=" + req.query.deployMethod;
    axios.put("http://localhost:" + configModelPort + "/api/ui/route/deploymethod" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /route/deploymethod", error.response.status);
        res.send(error);
    });
});

app.get('/enum', (req, res) => {
    axios.get("http://localhost:" + configModelPort + "/api/ui/enum/" + req.query.enumName).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on GET /enum", error.response.status);
        res.send(error);
    });
});

app.post('/createnewroute', (req, res) => {
    console.log(">>> POST http://localhost:" + configModelPort + "/api/ui/approute?routeDeployMethod=custom");
    axios.post("http://localhost:" + configModelPort + "/api/ui/approute?routeDeployMethod=custom").then(response => {
        console.log(">>> new route response: ", response.data);
        res.send(response.data.id);
    }).catch(error => {
        console.log("Error on POST /createnewroute", error.response.status);
        res.send(error);
    });
});

app.post('/approute/step', (req, res) => {
    let params;
    if (req.query.resourceId == null) {
        params = "?routeId=" + req.query.routeId + "&startId=" + req.query.startId + "&startCoordinateX=" + req.query.startCoordinateX +
            "&startCoordinateY=" + req.query.startCoordinateY + "&endId=" + req.query.endId + "&endCoordinateX=" + req.query.endCoordinateX +
            "&endCoordinateY=" + req.query.endCoordinateY;
    } else {
        params = "?routeId=" + req.query.routeId + "&startId=" + req.query.startId + "&startCoordinateX=" + req.query.startCoordinateX +
            "&startCoordinateY=" + req.query.startCoordinateY + "&endId=" + req.query.endId + "&endCoordinateX=" + req.query.endCoordinateX +
            "&endCoordinateY=" + req.query.endCoordinateY + "&resourceId=" + req.query.resourceId;
    }
    console.log(">>> POST http://localhost:" + configModelPort + "/api/ui/approute/step" + params);
    axios.post("http://localhost:" + configModelPort + "/api/ui/approute/step" + params).then(response => {
        res.send(response.data);
    }).catch(error => {
        console.log("Error on POST /approute/step", error.response.status);
        res.send(error);
    });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
