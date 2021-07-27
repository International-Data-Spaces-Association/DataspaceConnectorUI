import validationUtils from "@/utils/validationUtils";

export default {
    components: {},
    props: ["readonly"],
    data() {
        return {
            description: "",
            nTimesUsageValue: null,
            defaultRule: validationUtils.getRequiredRule(),
            numberRule: validationUtils.getNumberRequiredRule(),
            urlRule: validationUtils.getUrlRequiredRule(),
            valid: false,
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
            if (contract == "") {
                this.$data.nTimesUsageValue = null;
            } else {
                this.$data.nTimesUsageValue = contract["ids:constraint"][0]["ids:rightOperand"]["@value"];
            }
            this.nTimesUsageTfChange();
        },
        setPolicyByDescription(policyDescription) {
            this.$data.nTimesUsageValue = policyDescription.value;
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
