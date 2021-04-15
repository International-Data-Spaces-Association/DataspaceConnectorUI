import validationUtils from "../../../../../../../utils/validationUtils";

export default {
    components: {},
    data() {
        return {
            pattern: "USAGE_NOTIFICATION",
            contractJson: "",
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
            this.$data.value = contract["ids:permission"][0]["ids:postDuty"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"];
            this.tfChange();
        },
        tfChange() {
            this.$data.contractJson = {
                "url": this.$data.value
            };
        },
    }
};
