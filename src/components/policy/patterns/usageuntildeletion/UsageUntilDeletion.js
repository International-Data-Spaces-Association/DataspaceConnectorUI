import validationUtils from "@/utils/validationUtils";

export default {
    // TODO ui components to select time
    components: {},
    props: ["readonly"],
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
            visibleclass: ""
        };
    },
    mounted: function () {

    },
    watch: {
        valid: function () {
            this.$emit('validationChanged');
        },
        startValue: function () {
            this.createDescription();
        },
        endValue: function () {
            this.createDescription();
        },
        deleteAtValue: function () {
            this.createDescription();
        }
    },
    methods: {
        setPolicy(contract) {
            // TODO correct timezone conversion
            this.$data.startValue = contract["ids:constraint"][0]["ids:rightOperand"]["@value"].replace("T00:00:00Z", "");
            this.$data.endValue = contract["ids:constraint"][1]["ids:rightOperand"]["@value"].replace("T00:00:00Z", "");
            this.$data.deleteAtValue = contract["ids:postDuty"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"].replace("T00:00:00Z", "");
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
