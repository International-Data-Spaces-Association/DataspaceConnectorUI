import validationUtils from "../../../../../../../utils/validationUtils";

export default {
    // TODO ui components to select time
    components: {},
    data() {
        return {
            pattern: "USAGE_DURING_INTERVAL",
            contractJson: "",
            usageDuringIntervalFromMenu: false,
            usageDuringIntervalFromValue: null,
            usageDuringIntervalToMenu: false,
            usageDuringIntervalToValue: null,
            defaultRule: validationUtils.getRequiredRule(),
            usageDuringIntervalValid: false,
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
            this.createContractJson();
            this.$emit('nextPage')
        },
        setPolicy(contract) {
            // TODO correct timezone conversion
            this.$data.usageDuringIntervalFromValue = contract["ids:permission"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"].replace("T00:00:00Z", "");
            this.$data.usageDuringIntervalToValue = contract["ids:permission"][0]["ids:constraint"][1]["ids:rightOperand"]["@value"].replace("T00:00:00Z", "");
            this.createContractJson();
        },
        createContractJson() {
            this.$data.contractJson = {
                "fromDate": this.$data.usageDuringIntervalFromValue + "T00:00:00Z",
                "toDate": this.$data.usageDuringIntervalToValue + "T00:00:00Z"
            };
        }
    }
};
