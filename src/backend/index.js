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
    if (req.body.type == "POST") {
        post(configModelUrl + call, req.body.body).then(response => {
            res.send(response.data);
        }).catch(error => {
            console.log("Error on POST " + req.body.url, error.response.status);
            res.send(error);
        });
    } else if (req.body.type == "PUT") {
        put(configModelUrl + call, req.body.body).then(response => {
            res.send(response.data);
        }).catch(error => {
            console.log("Error on PUT " + req.body.url, error.response.status);
            res.send(error);
        });
    } else if (req.body.type == "GET") {
        get(configModelUrl + call).then(response => {
            res.send(response.data);
        }).catch(error => {
            console.log("Error on GET " + req.body.url, error.response.status);
            res.send(error);
        });
    } else if (req.body.type == "DELETE") {
        del(configModelUrl + call).then(response => {
            res.send(response.data);
        }).catch(error => {
            console.log("Error on DELETE " + req.body.url, error.response.status);
            res.send(error);
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
