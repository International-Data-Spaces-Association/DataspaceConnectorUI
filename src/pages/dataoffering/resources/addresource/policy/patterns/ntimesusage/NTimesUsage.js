import DataUtils from "@/utils/dataUtils";

export default {
    components: {},
    data() {
        return {
            contractJson: "",
            nTimesUsageOperator: null,
            nTimesUsageValue: null,
            defaultRule: [
                v => !!v || 'This data is required'
            ],
            numberRule: [
                v => !!v || 'This data is required',
                v => /^[0-9.]+$/.test(v) || 'Only numbers and "." allowed',
            ],
            nTimesUsageValid: false
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
            this.$data.nTimesUsageOperator = DataUtils.convertOperatorTypeToSymbol(contract["ids:permission"][0]["ids:constraint"][0]["ids:operator"]["@id"]);
            this.$data.nTimesUsageValue = contract["ids:permission"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"];
        },
        nTimesUsageTfChange() {
            this.$data.contractJson = {
                "@context": {
                    "ids": "https://w3id.org/idsa/core/"
                },
                "@type": "ids:NotMoreThanNOffer",
                "@id": "https://w3id.org/idsa/autogen/notMoreThanNOffer/ebabc07d-b1c4-4a0a-9b90-20691ef84561",
                "ids:permission": [{
                    "@type": "ids:Permission",
                    "@id": "https://w3id.org/idsa/autogen/permission/69114862-8d4e-4c91-8ff8-c76215154a94",
                    "ids:description": [{
                        "@value": "n-times-usage",
                        "@type": "http://www.w3.org/2001/XMLSchema#string"
                    }],
                    "ids:action": [{
                        "@id": "idsc:USE"
                    }],
                    "ids:title": [{
                        "@value": "Example Usage Policy",
                        "@type": "http://www.w3.org/2001/XMLSchema#string"
                    }],
                    "ids:constraint": [{
                        "@type": "ids:Constraint",
                        "@id": "https://w3id.org/idsa/autogen/constraint/d97dd711-2997-4308-8082-075be10b4374",
                        "ids:operator": {
                            "@id": DataUtils.convertOperatorSymbolToType(this.$data.nTimesUsageOperator)
                        },
                        "ids:leftOperand": {
                            "@id": "idsc:COUNT"
                        },
                        "ids:rightOperand": {
                            "@value": this.$data.nTimesUsageValue,
                            "@type": "xsd:double"
                        },
                        "ids:pipEndpoint": {
                            "@id": "https://localhost:8080/admin/api/resources/"
                        }
                    }]
                }]
            };
        }
    }
};
