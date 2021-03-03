import validationUtils from "../../../../../../../utils/validationUtils";

export default {
    // TODO ui components to select time
    components: {},
    data() {
        return {
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
                "@context": {
                    "ids": "https://w3id.org/idsa/core/",
                    "idsc": "https://w3id.org/idsa/code/"
                },
                "@type": "ids:ContractOffer",
                "@id": "https://w3id.org/idsa/autogen/contractOffer/cbb9fbd1-ce14-4513-9cc1-7b98a0355653",
                "ids:permission": [{
                    "@type": "ids:Permission",
                    "@id": "https://w3id.org/idsa/autogen/permission/03d35035-b293-43d9-8194-93776c402031",
                    "ids:description": [{
                        "@value": "usage-until-deletion",
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
                        "@id": "https://w3id.org/idsa/autogen/constraint/a53b746d-f838-4db0-b5bc-414edec7cee1",
                        "ids:rightOperand": {
                            "@value": this.$data.startValue + "T00:00:00Z"
                        },
                        "ids:operator": {
                            "@id": "idsc:AFTER"
                        },
                        "ids:leftOperand": {
                            "@id": "idsc:POLICY_EVALUATION_TIME"
                        }
                    }, {
                        "@type": "ids:Constraint",
                        "@id": "https://w3id.org/idsa/autogen/constraint/7db8bb0b-06d0-4af0-86c7-f23c334c4a7e",
                        "ids:rightOperand": {
                            "@value": this.$data.endValue + "T00:00:00Z"
                        },
                        "ids:operator": {
                            "@id": "idsc:BEFORE"
                        },
                        "ids:leftOperand": {
                            "@id": "idsc:POLICY_EVALUATION_TIME"
                        }
                    }],
                    "ids:postDuty": [{
                        "@type": "ids:Duty",
                        "@id": "https://w3id.org/idsa/autogen/duty/770e6abb-dbe5-4ea3-bff5-aa4c29d29fb5",
                        "ids:action": [{
                            "@id": "idsc:DELETE"
                        }],
                        "ids:constraint": [{
                            "@type": "ids:Constraint",
                            "@id": "https://w3id.org/idsa/autogen/constraint/f2acf67f-bc4c-4e64-87fc-499eec24bc57",
                            "ids:rightOperand": {
                                "@value": this.$data.deleteAtValue + "T00:00:00Z"
                            },
                            "ids:operator": {
                                "@id": "idsc:TEMPORAL_EQUALS"
                            },
                            "ids:leftOperand": {
                                "@id": "idsc:POLICY_EVALUATION_TIME"
                            }
                        }]
                    }]
                }]
            };
        }
    }
};
