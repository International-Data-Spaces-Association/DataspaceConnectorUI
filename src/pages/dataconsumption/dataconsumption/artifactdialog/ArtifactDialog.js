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
            callback: null
        };
    },
    mounted: function () { },
    methods: {
        show(rules, license, artifact, callback) {
            this.$data.dialog = true;
            this.$data.rules = rules;
            this.$data.license = license;
            this.$data.artifact = artifact;
            this.$data.callback = callback;
        },
        clickAcceptContract() {
            this.$data.dialog = false;
            this.$data.callback(this.$data.artifact);
        }
    }
};
