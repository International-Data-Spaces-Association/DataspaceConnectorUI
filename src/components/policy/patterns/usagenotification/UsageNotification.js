import validationUtils from "@/utils/validationUtils";

export default {
    components: {},
    props: ["readonly"],
    data() {
        return {
            description: "",
            value: null,
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
            this.$data.value = contract["ids:postDuty"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"];
            this.tfChange();
        },
        setPolicyByDescription(policyDescription) {
            this.$data.value = policyDescription.url;
            this.tfChange();
        },
        tfChange() {
            this.$data.description = {
                "type": "USAGE_NOTIFICATION",
                "url": this.$data.value
            };
        },
    }
};
