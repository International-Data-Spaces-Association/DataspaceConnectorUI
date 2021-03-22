import Axios from "axios";

let backendUrl = "http://localhost:80";

console.log("VUE_APP_UI_BACKEND_URL: ", process.env.VUE_APP_UI_BACKEND_URL);

if (process.env.VUE_APP_UI_BACKEND_URL !== undefined && process.env.VUE_APP_UI_BACKEND_URL != "#UI_BACKEND_URL#") {
    backendUrl = process.env.VUE_APP_UI_BACKEND_URL;
}

export default {
    post(url, data) {
        return Axios.post(url, data);
    },

    call(type, url, params, body) {
        return this.post(backendUrl + "/", {
            "type": type,
            "url": url,
            "params": params,
            "body": body
        })
    }
}
