import Axios from "axios";

let backendUrl = "http://localhost:8083";

console.log("VUE_APP_UI_BACKEND_URL: ", process.env.VUE_APP_UI_BACKEND_URL);

if (process.env.VUE_APP_UI_BACKEND_URL !== undefined && process.env.VUE_APP_UI_BACKEND_URL != "#UI_BACKEND_URL#") {
    backendUrl = process.env.VUE_APP_UI_BACKEND_URL;
}

export default {
    post(url, data) {
        return Axios.post(url, data);
    },

    async call(type, url, params, body) {
        return await this.callAndCheckError(false, type, url, params, body);
    },

    async callConnector(type, url, params, body) {
        return await this.callAndCheckError(true, type, url, params, body);
    },

    async callAndCheckError(toConnector, type, url, params, body) {
        let response = (await this.post(backendUrl + "/", {
            "toConnector": toConnector,
            "type": type,
            "url": url,
            "params": params,
            "body": body
        })).data;

        if (this.isError(response)) {
            throw {
                name: "Error",
                details: this.getErrorDetails(response)
            }
        }

        return response;
    },

    isError(response) {
        return (response.name !== undefined && response.name == "Error") || response.error !== undefined || (response.status !== undefined && response.status == 500) || (response.length == 2 && response[1].error !== undefined);
    },

    getErrorDetails(response) {
        let errorDetails = {};
        if (response.length == 2) {
            errorDetails = response[1];
        } else {
            errorDetails = response;
        }
        return errorDetails;
    }
}
