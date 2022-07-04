import Axios from "axios";

let backendUrl = "http://localhost:8083";

export default {
    get(url) {
        return Axios.get(backendUrl + "/" + url, {
            headers: { 'content-type': 'application/json' }
        });
    },

    post(url, data) {
        return Axios.post(url, data, {
            headers: { 'content-type': 'application/json' }
        });
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
        return (response.name !== undefined && response.name == "Error") || response.error !== undefined ||
            (response.status !== undefined && response.status >= 400) || (response.length == 2 && response[1].error !== undefined);
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
