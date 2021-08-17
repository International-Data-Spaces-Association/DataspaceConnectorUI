export default {
    getRequiredRule() {
        return [
            v => !!v || 'This data is required'
        ];
    },

    getNumberRequiredRule() {
        return [
            v => !!v || 'This data is required',
            v => /^[0-9]+$/.test(v) || 'Only numbers allowed',
        ];
    },

    getVersionRule() {
        return [
            v => /^[0-9.]+$/.test(v) || 'Only numbers and "." allowed',
        ];
    },

    getVersionRequiredRule() {
        return [
            v => !!v || 'This data is required',
            v => /^[0-9.]+$/.test(v) || 'Only numbers and "." allowed',
        ];
    },

    getUrlListRule() {
        return [
            v => {
                let valid = true;
                if (v.trim() != "") {
                    let split = v.split(',');
                    for (let url of split) {
                        if (!(/^[h][t][t][p][s]{0,1}[:][/][/].*$/.test(url.trim()))) {
                            valid = /^[h][t][t][p][s]{0,1}[:][/][/].*$/.test(url.trim()) || 'Only URIs (http://... or https://...) allowed';
                            break;
                        }
                    }
                }
                return valid;
            }
        ];
    },

    getUrlRequiredRule() {
        return [
            v => !!v || 'This data is required',
            v => /^[h][t][t][p][s]{0,1}[:][/][/][^ ]+$/.test(v == null ? v : v.trim()) || 'Only URIs (http://... or https://...) allowed',
        ];
    },

    getUrlNotRequiredRule() {
        return [
            v => {
                if (v) return /^[h][t][t][p][s]{0,1}[:][/][/][^ ]+$/.test(v == null ? v : v.trim()) || 'Only URIs (http://... or https://...) allowed'
                else return true;
            }
        ];
    }
}
