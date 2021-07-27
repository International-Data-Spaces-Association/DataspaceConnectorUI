import validationUtils from "@/utils/validationUtils";

export default {
    // TODO ui components to select time
    components: {},
    props: ["readonly"],
    data() {
        return {
            description: "",
            usageDuringIntervalFromMenu: false,
            usageDuringIntervalFromValue: null,
            usageDuringIntervalToMenu: false,
            usageDuringIntervalToValue: null,
            defaultRule: validationUtils.getRequiredRule(),
            valid: false,
            visibleclass: ""
        };
    },
    mounted: function () {

    },
    watch: {
        valid: function () {
            this.$emit('validationChanged');
        },
        usageDuringIntervalFromValue: function () {
            this.createDescription();
        },
        usageDuringIntervalToValue: function () {
            this.createDescription();
        }
    },
    methods: {
        setPolicy(contract) {
            // TODO correct timezone conversion
            this.$data.usageDuringIntervalFromValue = contract["ids:constraint"][0]["ids:rightOperand"]["@value"].replace("T00:00:00Z", "");
            this.$data.usageDuringIntervalToValue = contract["ids:constraint"][1]["ids:rightOperand"]["@value"].replace("T00:00:00Z", "");
            this.createDescription();
        },
        setPolicyByDescription(policyDescription) {
            this.$data.usageDuringIntervalFromValue = policyDescription.start.replace("T00:00:00Z", "");
            this.$data.usageDuringIntervalToValue = policyDescription.end.replace("T00:00:00Z", "");
            this.createDescription();
        },
        createDescription() {
            this.$data.description = {
                "type": "USAGE_DURING_INTERVAL",
                "start": this.$data.usageDuringIntervalFromValue + "T00:00:00Z",
                "end": this.$data.usageDuringIntervalToValue + "T00:00:00Z"
            };
        }
    }
};
