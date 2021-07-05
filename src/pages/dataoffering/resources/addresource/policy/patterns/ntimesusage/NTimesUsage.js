import validationUtils from "../../../../../../../utils/validationUtils";

export default {
    components: {},
    data() {
        return {
            description: "",
            nTimesUsageValue: null,
            defaultRule: validationUtils.getRequiredRule(),
            numberRule: validationUtils.getNumberRequiredRule(),
            urlRule: validationUtils.getUrlRequiredRule(),
            nTimesUsageValid: false,
            visibleclass: "",
            readonly: false
        };
    },
    mounted: function () {

    },
    methods: {
        previousPage() {
            this.$emit('previousPage')
        },
        nextPage() {
            this.$emit('nextPage')
        },
        setPolicy(contract) {
            if (contract == "") {
                this.$data.nTimesUsageValue = null;
            } else {
                this.$data.nTimesUsageValue = contract["ids:constraint"][0]["ids:rightOperand"]["@value"];
            }
            this.nTimesUsageTfChange();
        },
        nTimesUsageTfChange() {
            this.$data.description = {
                "type": "N_TIMES_USAGE",
                "value": this.$data.nTimesUsageValue
            };
        }
    }
};
