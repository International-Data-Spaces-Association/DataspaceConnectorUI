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
    return axios.put(url, data, { auth, httpsAgent });
}

function get(url) {
    console.log(">>> GET " + url);
    return axios.get(url, { auth, httpsAgent });
}

function del(url) {
    console.log(">>> DELETE " + url);
    return axios.delete(url, { auth, httpsAgent });
}

function escape(text) {
    return encodeURIComponent(text);
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
            } else {
                console.log("Error on POST " + req.body.url, error.response.status);
                console.log(error.response.data);
            }
            res.send(error);
        });
    } else if (req.body.type == "PUT") {
        put(url + call, req.body.body).then(response => {
            res.send(response.data);
        }).catch(error => {
            if (error.response === undefined) {
                console.log("Error on PUT " + req.body.url, error);
                res.send(error);
            } else {
                console.log("Error on PUT " + req.body.url, error.response.status);
                console.log(error.response.data);
                res.send(error.response.data);
            }
        });
    } else if (req.body.type == "GET") {
        get(url + call).then(response => {
            res.send(response.data);
        }).catch(error => {
            if (error.response === undefined) {
                console.log("Error on GET " + req.body.url, error);
            } else {
                console.log("Error on GET " + req.body.url, error.response.status);
                console.log(error.response.data);
            }
            res.send(error);
        });
    } else if (req.body.type == "DELETE") {
        del(url + call).then(response => {
            res.send(response.data);
        }).catch(error => {
            if (error.response === undefined) {
                console.log("Error on DELETE " + req.body.url, error);
            } else {
                console.log("Error on DELETE " + req.body.url, error.response.status);
                console.log(error.response.data);
            }
            res.send(error);
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
