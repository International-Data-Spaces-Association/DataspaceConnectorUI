import validationUtils from "@/utils/validationUtils";

export default {
    components: {},
    props: ["readonly"],
    data() {
        return {
            description: "",
            durationUsageValue: null,
            numberRule: validationUtils.getNumberRequiredRule(),
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
            this.$data.durationUsageValue = contract["ids:constraint"][0]["ids:rightOperand"]["@value"].replace("PT", "").replace("H", "");
            this.durationUsageTfChange();
        },
        setPolicyByDescription(policyDescription) {
            this.$data.durationUsageValue = policyDescription.duration.replace("PT", "").replace("H", "");
            this.durationUsageTfChange();
        },
        durationUsageTfChange() {
            this.$data.description = {
                "type": "DURATION_USAGE",
                "duration": "PT" + this.$data.durationUsageValue + "H"
            };
        },
    }
};
