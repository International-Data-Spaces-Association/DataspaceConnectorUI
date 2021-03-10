import Axios from "axios";

export default {
    get(url) {
        return Axios.get(url);
    },
    post(url, data) {
        return Axios.post(url, data);
    },
    put(url, data) {
        return Axios.put(url, data);
    },
    delete(url) {
        return Axios.delete(url);
    },
}
