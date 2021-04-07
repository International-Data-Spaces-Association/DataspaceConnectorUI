import DataUtils from "@/utils/dataUtils";
import validationUtils from "../../../../../../../utils/validationUtils";

export default {
    components: {},
    data() {
        return {
            pattern: "N_TIMES_USAGE",
            contractJson: "",
            nTimesUsageOperator: null,
            nTimesUsageValue: null,
            pipEndpoint: "",
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
                this.$data.nTimesUsageOperator = null;
                this.$data.nTimesUsageValue = null;
                this.$data.pipEndpoint = "";
            } else {
                this.$data.nTimesUsageOperator = DataUtils.convertOperatorTypeToSymbol(contract["ids:permission"][0]["ids:constraint"][0]["ids:operator"]["@id"]);
                this.$data.nTimesUsageValue = contract["ids:permission"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"];
                this.$data.pipEndpoint = contract["ids:permission"][0]["ids:constraint"][0]["ids:pipEndpoint"]["@id"];
            }
            this.nTimesUsageTfChange();
        },
        nTimesUsageTfChange() {
            this.$data.contractJson = {
                "binaryoperator": this.$data.nTimesUsageOperator,
                "number": this.$data.nTimesUsageValue,
                "pipendpoint": this.$data.pipEndpoint
            };
        }
    }
};
