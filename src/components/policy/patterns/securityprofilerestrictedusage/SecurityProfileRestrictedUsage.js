import validationUtils from "@/utils/validationUtils";

export default {
    components: {},
    props: ["readonly"],
    data() {
        return {
            description: "",
            value: null,
            profiles: ["idsc:TRUST_SECURITY_PROFILE", "idsc:BASE_SECURITY_PROFILE", "idsc:TRUST_PLUS_SECURITY_PROFILE"],
            valid: false,
            defaultRule: validationUtils.getRequiredRule(),
            visibleclass: ""
        };
    },
    mounted: function () {

    },
    watch: {
        valid: function () {
            this.$emit('validationChanged');
        }
    },
    methods: {
        setPolicy(contract) {
            this.$data.value = contract["ids:constraint"][0]["ids:rightOperand"]["@value"].replace("https://w3id.org/idsa/code/", "idsc:");
            this.tfChange();
        },
        setPolicyByDescription(policyDescription) {
            this.$data.value = policyDescription.url;
            this.tfChange();
        },
        tfChange() {
            this.$data.description = {
                "type": "SECURITY_PROFILE_RESTRICTED_USAGE",
                "profile": this.$data.value
            };
        },
    }
};
