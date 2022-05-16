import PolicyLine from "@/components/policy/PolicyLine.vue";
import dataUtils from "@/utils/dataUtils";

export default {
    components: {
        PolicyLine
    },
    data() {
        return {
            dialog: false,
            rules: [],
            license: "",
            artifact: null,
            callback: null,
            subscribe: false
        };
    },
    mounted: function () { },
    methods: {
        show(rules, license, artifact, callback) {
            this.$data.rules = rules;
            this.$data.license = license;
            this.$data.artifact = artifact;
            this.$data.subscribe = false;
            this.$data.callback = callback;
            this.$data.dialog = true;
        },
        async clickAcceptContract() {
            this.$data.dialog = false;
            let configuration = await dataUtils.getConnectorConfiguration();
            this.$data.callback(this.$data.artifact, this.$data.subscribe, configuration.endpoint);
        }
    }
};
