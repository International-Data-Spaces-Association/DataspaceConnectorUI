import validationUtils from "@/utils/validationUtils";

export default {
    // TODO ui components to select time
    components: {},
    data() {
        return {
            description: "",
            startMenu: false,
            startValue: null,
            endMenu: false,
            endValue: null,
            deleteAtMenu: false,
            deleteAtValue: null,
            defaultRule: validationUtils.getRequiredRule(),
            valid: false,
            visibleclass: "",
            readonly: false
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
        previousPage() {
            this.$emit('previousPage')
        },
        nextPage() {
            this.createDescription();
            this.$emit('nextPage')
        },
        setPolicy(contract) {
            // TODO correct timezone conversion
            this.$data.startValue = contract["ids:permission"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"].replace("T00:00:00Z", "");
            this.$data.endValue = contract["ids:permission"][0]["ids:constraint"][1]["ids:rightOperand"]["@value"].replace("T00:00:00Z", "");
            this.$data.deleteAtValue = contract["ids:permission"][0]["ids:postDuty"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"].replace("T00:00:00Z", "");
            this.createDescription();
        },
        setPolicyByDescription(policyDescription) {
            this.$data.startValue = policyDescription.start.replace("T00:00:00Z", "");
            this.$data.endValue = policyDescription.end.replace("T00:00:00Z", "");
            this.$data.deleteAtValue = policyDescription.date.replace("T00:00:00Z", "");
            this.createDescription();
        },
        createDescription() {
            this.$data.description = {
                "type": "USAGE_UNTIL_DELETION",
                "start": this.$data.startValue + "T00:00:00Z",
                "end": this.$data.endValue + "T00:00:00Z",
                "date": this.$data.deleteAtValue + "T00:00:00Z"
            };
        }
    }
};
