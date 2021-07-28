import validationUtils from "../../../../../../../utils/validationUtils";

export default {
    components: {},
    data() {
        return {
            description: "",
            value: null,
            urlRule: validationUtils.getUrlRequiredRule(),
            valid: false,
            visibleclass: "",
            readonly: false
        };
    },
    mounted: function () {

    },
    methods: {
        previousPage() {
            this.$emit('previousPage');
        },
        nextPage() {
            this.$emit('nextPage');
        },
        setPolicy(contract) {
            this.$data.value = contract["ids:constraint"][0]["ids:rightOperand"]["@value"];
            this.tfChange();
        },
        setPolicyByDescription(policyDescription) {
            this.$data.value = policyDescription.url;
            this.tfChange();
        },
        tfChange() {
            this.$data.description = {
                "type": "CONNECTOR_RESTRICTED_USAGE",
                "url": this.$data.value
            };
        },
    }
};
