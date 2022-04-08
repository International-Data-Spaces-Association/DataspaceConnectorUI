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
            subscribe: false,
            subscriptionLocations: [],
            subscriptionLocation: null
        };
    },
    mounted: function () { },
    methods: {
        show(rules, license, artifact, subscriptionLocations, callback) {
            this.$data.rules = rules;
            this.$data.license = license;
            this.$data.artifact = artifact;
            this.$data.subscribe = false;
            this.$data.subscriptionLocations = subscriptionLocations;
            if (subscriptionLocations !== undefined && subscriptionLocations != null && subscriptionLocations.length > 0) {
                this.$data.subscriptionLocation = subscriptionLocations[0].value;
            }
            this.$data.callback = callback;
            this.$data.dialog = true;
        },
        clickAcceptContract() {
            this.$data.dialog = false;
            this.$data.callback(this.$data.artifact, this.$data.subscribe, this.$data.subscriptionLocation);
        }
    }
};
