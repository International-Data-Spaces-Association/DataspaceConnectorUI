import validationUtils from "../../../../../../../utils/validationUtils";

export default {
    components: {},
    data() {
        return {
            contractJson: "",
            value: null,
            urlRule: validationUtils.getUrlRequiredRule(),
            valid: false,
            visibleclass: "",
            readonly: false
        };
    },
    mounted: function () {

    },
    methods: {
        previousPage() {
            this.$emit('previousPage');
        },
        nextPage() {
            this.$emit('nextPage');
        },
        setPolicy(contract) {
            this.$data.value = contract["ids:permission"][0]["ids:postDuty"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"];
            this.tfChange();
        },
        tfChange() {
            this.$data.contractJson = {
                "@context": {
                    "ids": "https://w3id.org/idsa/core/",
                    "idsc": "https://w3id.org/idsa/code/"
                },
                "@type": "ids:ContractOffer",
                "@id": "https://w3id.org/idsa/autogen/contractOffer/76971cd1-2d98-4aee-929c-07091c39ced7",
                "ids:permission": [{
                    "@type": "ids:Permission",
                    "@id": "https://w3id.org/idsa/autogen/permission/467f86d5-d89d-46b2-baa2-bf5ced8151b2",
                    "ids:description": [{
                        "@value": "usage-notification",
                        "@type": "http://www.w3.org/2001/XMLSchema#string"
                    }],
                    "ids:action": [{
                        "@id": "idsc:USE"
                    }],
                    "ids:title": [{
                        "@value": "Example Usage Policy",
                        "@type": "http://www.w3.org/2001/XMLSchema#string"
                    }],
                    "ids:postDuty": [{
                        "@type": "ids:Duty",
                        "@id": "https://w3id.org/idsa/autogen/duty/33c8a7be-6119-4e44-bb33-de4ad22f928a",
                        "ids:action": [{
                            "@id": "idsc:NOTIFY"
                        }],
                        "ids:constraint": [{
                            "@type": "ids:Constraint",
                            "@id": "https://w3id.org/idsa/autogen/constraint/7c475c19-7b3a-4e0c-a00c-2d8abdcd466c",
                            "ids:rightOperand": {
                                "@value": this.$data.value
                            },
                            "ids:operator": {
                                "@id": "idsc:DEFINES_AS"
                            },
                            "ids:leftOperand": {
                                "@id": "idsc:ENDPOINT"
                            }
                        }]
                    }]
                }]
            };
        },
    }
};
