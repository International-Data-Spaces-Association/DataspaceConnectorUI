import DataUtils from "@/utils/dataUtils";
import validationUtils from "../../../../../../../utils/validationUtils";

export default {
    components: {},
    data() {
        return {
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
            console.log(">>>");
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
                "@context": {
                    "ids": "https://w3id.org/idsa/core/",
                    "idsc": "https://w3id.org/idsa/code/"
                },
                "@type": "ids:NotMoreThanNOffer",
                "@id": "https://w3id.org/idsa/autogen/contractOffer/90e2bb48-c2eb-4723-ac8e-f404258173e7",
                "ids:permission": [{
                    "@type": "ids:Permission",
                    "@id": "https://w3id.org/idsa/autogen/permission/f0760bec-e888-4c03-88c7-0b509e147a52",
                    "ids:description": [{
                        "@value": "n-times-usage",
                        "@type": "http://www.w3.org/2001/XMLSchema#string"
                    }],
                    "ids:title": [{
                        "@value": "Example Usage Policy",
                        "@type": "http://www.w3.org/2001/XMLSchema#string"
                    }],
                    "ids:constraint": [{
                        "@type": "ids:Constraint",
                        "@id": "https://w3id.org/idsa/autogen/constraint/59000467-dc39-4e8c-a69e-2939a171df23",
                        "ids:operator": {
                            "@id": DataUtils.convertOperatorSymbolToType(this.$data.nTimesUsageOperator)
                        },
                        "ids:pipEndpoint": {
                            "@id": this.$data.pipEndpoint
                        },
                        "ids:leftOperand": {
                            "@id": "idsc:COUNT"
                        },
                        "ids:rightOperand": {
                            "@value": this.$data.nTimesUsageValue
                        }
                    }],
                    "ids:action": [{
                        "@id": "idsc:READ"
                    }]
                }]
            };
        }
    }
};
