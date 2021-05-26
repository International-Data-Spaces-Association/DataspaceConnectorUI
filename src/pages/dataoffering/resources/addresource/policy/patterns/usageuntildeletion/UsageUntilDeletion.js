import validationUtils from "../../../../../../../utils/validationUtils";

export default {
    // TODO ui components to select time
    components: {},
    data() {
        return {
            pattern: "USAGE_UNTIL_DELETION",
            contractJson: "",
            startMenu: false,
            startValue: null,
            endMenu: false,
            endValue: null,
            deleteAtMenu: false,
            deleteAtValue: null,
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
            this.$data.startValue = contract["ids:permission"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"].replace("T00:00:00Z", "");
            this.$data.endValue = contract["ids:permission"][0]["ids:constraint"][1]["ids:rightOperand"]["@value"].replace("T00:00:00Z", "");
            this.$data.deleteAtValue = contract["ids:permission"][0]["ids:postDuty"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"].replace("T00:00:00Z", "");
            this.createContractJson();
        },
        createContractJson() {
            this.$data.contractJson = {
                "startDate": this.$data.startValue + "T00:00:00Z",
                "endDate": this.$data.endValue + "T00:00:00Z",
                "deletionDate": this.$data.deleteAtValue + "T00:00:00Z"
            };
        }
    }
};
