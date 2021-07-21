let vueRoot = null;

export default {
    setVueRoot(root) {
        vueRoot = root;
    },

    showError(error, operation) {
        if (error.details === undefined) {
            console.log("Error on API call: ", error);
        } else {
            console.log("Error on API call: ", error.details);
        }
        if (vueRoot != null) {
            vueRoot.$emit('error', operation + " failed.");
        }
    }
}
