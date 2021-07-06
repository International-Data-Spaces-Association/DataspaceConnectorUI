import express from "express";
import cors from "cors";
import axios from "axios";
import https from "https";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
const port = 8083;
let connectorUrl = "https://localhost:8080"
let configManagerUrl = "http://localhost:8081";
let auth = {
    username: 'admin',
    password: 'password'
}
let httpsAgent = new https.Agent({
    maxVersion: "TLSv1.2",
    minVersion: "TLSv1.2",
    rejectUnauthorized: false
    //ca: fs.readFileSync('dsc.crt')
});

console.log("CONNECTOR_URL", process.env.CONNECTOR_URL);
if (process.env.CONNECTOR_URL !== undefined) {
    connectorUrl = process.env.CONNECTOR_URL;
}

console.log("CONFIGMANAGER_URL", process.env.CONFIGMANAGER_URL);
if (process.env.CONFIGMANAGER_URL !== undefined) {
    configManagerUrl = process.env.CONFIGMANAGER_URL;
}

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

function post(url, data) {
    console.log(">>> POST " + url);
    console.log(">>> DATA: ", data);
    return axios.post(url, data, {
        headers: { 'content-type': 'application/json' },
        auth,
        httpsAgent
    });
}

function put(url, data) {
    console.log(">>> PUT " + url);
    console.log(">>> DATA: ", data);
    return axios.put(url, data, {
        headers: { 'content-type': 'application/json' },
        auth,
        httpsAgent
    });
}

function get(url) {
    console.log(">>> GET " + url);
    return axios.get(url, {
        headers: { 'content-type': 'application/json' },
        auth,
        httpsAgent
    });
}

function del(url) {
    console.log(">>> DELETE " + url);
    return axios.delete(url, {
        headers: { 'content-type': 'application/json' },
        auth,
        httpsAgent
    });
}

function escape(text) {
    return encodeURIComponent(text);
}

function stringifySafe(obj, replacer, spaces, cycleReplacer) {
    return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
}

function serializer(replacer, cycleReplacer) {
    var stack = [], keys = []

    if (cycleReplacer == null) cycleReplacer = function (key, value) {
        if (stack[0] === value) return "[Circular ~]"
        return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
    }

    return function (key, value) {
        if (stack.length > 0) {
            var thisPos = stack.indexOf(this)
            ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
            ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
            if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
        }
        else stack.push(value)

        return replacer == null ? value : replacer.call(this, key, value)
    }
}

app.post('/', (req, res) => {
    let call = req.body.url;
    let i = 0;
    for (let key in req.body.params) {
        if (i == 0) {
            call += "?" + key + "=" + escape(req.body.params[key]);
        } else {
            call += "&" + key + "=" + escape(req.body.params[key]);
        }
        i++;
    }
    let url = req.body.toConnector ? connectorUrl : configManagerUrl;
    if (req.body.type == "POST") {
        post(url + call, req.body.body).then(response => {
            res.send(response.data);
        }).catch(error => {
            if (error.response === undefined) {
                console.log("Error on POST " + req.body.url, error);
                res.send(stringifySafe(error));
            } else {
                console.log("Error on POST " + req.body.url, stringifySafe(error.response));
                res.send(stringifySafe(error.response));
            }

        });
    } else if (req.body.type == "PUT") {
        put(url + call, req.body.body).then(response => {
            res.send(response.data);
        }).catch(error => {
            if (error.response === undefined) {
                console.log("Error on PUT " + req.body.url, error);
                res.send(stringifySafe(error));
            } else {
                console.log("Error on PUT " + req.body.url, stringifySafe(error.response));
                res.send(stringifySafe(error.response));
            }
        });
    } else if (req.body.type == "GET") {
        get(url + call).then(response => {
            res.send(response.data);
        }).catch(error => {
            if (error.response === undefined) {
                console.log("Error on GET " + req.body.url, error);
                res.send(stringifySafe(error));
            } else {
                console.log("Error on GET " + req.body.url, stringifySafe(error.response));
                res.send(stringifySafe(error.response));
            }
        });
    } else if (req.body.type == "DELETE") {
        del(url + call).then(response => {
            res.send(response.data);
        }).catch(error => {
            if (error.response === undefined) {
                console.log("Error on DELETE " + req.body.url, error);
                res.send(stringifySafe(error));
            } else {
                console.log("Error on DELETE " + req.body.url, stringifySafe(error.response));
                res.send(stringifySafe(error.response));
            }
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
