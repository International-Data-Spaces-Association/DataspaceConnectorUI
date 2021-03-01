import validationUtils from "../../../../../../../utils/validationUtils";

export default {
    // TODO ui components to select time
    components: {},
    data() {
        return {
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
                "@context": {
                    "ids": "https://w3id.org/idsa/core/",
                    "idsc": "https://w3id.org/idsa/code/"
                },
                "@type": "ids:ContractOffer",
                "@id": "https://w3id.org/idsa/autogen/contractOffer/4cc74797-d45c-4a14-ba9d-f9c7ccb00007",
                "ids:permission": [{
                    "@type": "ids:Permission",
                    "@id": "https://w3id.org/idsa/autogen/permission/ed3103a8-1cd9-44f6-9baa-8dddbcb1c6a5",
                    "ids:description": [{
                        "@value": "usage-during-interval",
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
                        "@id": "https://w3id.org/idsa/autogen/constraint/0b7c4ca7-1f9e-4e30-8fa1-7551700c1980",
                        "ids:rightOperand": {
                            "@value": this.$data.usageDuringIntervalFromValue + "T00:00:00Z"
                        },
                        "ids:operator": {
                            "@id": "idsc:AFTER"
                        },
                        "ids:leftOperand": {
                            "@id": "idsc:POLICY_EVALUATION_TIME"
                        }
                    }, {
                        "@type": "ids:Constraint",
                        "@id": "https://w3id.org/idsa/autogen/constraint/9f2e0197-2ad9-442b-806b-5bb4951a2943",
                        "ids:rightOperand": {
                            "@value": this.$data.usageDuringIntervalToValue + "T00:00:00Z"
                        },
                        "ids:operator": {
                            "@id": "idsc:BEFORE"
                        },
                        "ids:leftOperand": {
                            "@id": "idsc:POLICY_EVALUATION_TIME"
                        }
                    }]
                }]
            };
        }
    }
};
