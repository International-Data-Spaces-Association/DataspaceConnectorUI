import Axios from "axios";
 
export default {
    get(url){
        return Axios.get(url);
    },
    post(url){
        return Axios.post(url);
    },
    put(url){
        return Axios.put(url);
    },
    delete(url){
        return Axios.delete(url);
    },
}
 