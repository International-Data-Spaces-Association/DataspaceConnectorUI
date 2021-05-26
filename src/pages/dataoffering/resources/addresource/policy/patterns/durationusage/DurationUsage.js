import validationUtils from "../../../../../../../utils/validationUtils";

export default {
    components: {},
    data() {
        return {
            pattern: "DURATION_USAGE",
            contractJson: "",
            durationUsageValue: null,
            numberRule: validationUtils.getNumberRequiredRule(),
            durationValid: false,
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
            this.$data.durationUsageValue = contract["ids:permission"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"].replace("PT", "").replace("H", "");
            this.durationUsageTfChange();
        },
        durationUsageTfChange() {
            this.$data.contractJson = {
                "number": this.$data.durationUsageValue
            };
        },
    }
};
