import PolicyLine from "@/components/policy/PolicyLine.vue";

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
            this.$data.callback = callback;
            this.$data.dialog = true;
        },
        clickAcceptContract() {
            this.$data.dialog = false;
            this.$data.callback(this.$data.artifact, this.$data.subscribe);
        }
    }
};
