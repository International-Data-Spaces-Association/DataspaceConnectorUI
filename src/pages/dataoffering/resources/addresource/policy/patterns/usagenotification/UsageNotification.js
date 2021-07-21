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
            this.$data.value = contract["ids:postDuty"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"];
            this.tfChange();
        },
        setPolicyByDescription(policyDescription) {
            this.$data.value = policyDescription.url;
            this.tfChange();
        },
        tfChange() {
            this.$data.description = {
                "type": "USAGE_NOTIFICATION",
                "url": this.$data.value
            };
        },
    }
};
