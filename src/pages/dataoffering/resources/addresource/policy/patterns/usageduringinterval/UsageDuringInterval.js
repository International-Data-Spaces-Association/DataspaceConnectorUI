export default {
    components: {},
    data() {
        return {
            contractJson: "",
            usageDuringIntervalFromValue: null,
            usageDuringIntervalToValue: null,
            defaultRule: [
                v => !!v || 'This data is required'
            ],
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
            this.$emit('nextPage')
        },
        setPolicy(contract) {
            this.$data.usageDuringIntervalFromValue = contract["ids:permission"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"];
            this.$data.usageDuringIntervalToValue = contract["ids:permission"][0]["ids:constraint"][1]["ids:rightOperand"]["@value"];
            this.usageDuringIntervalTfChange();
        },
        usageDuringIntervalTfChange() {
            this.$data.contractJson = {
                "@context": {
                    "ids": "https://w3id.org/idsa/core/"
                },
                "@type": "ids:IntervalUsageOffer",
                "@id": "https://w3id.org/idsa/autogen/contractOffer/baab6df3-9846-4372-bb6a-bb83e4e806c0",
                "ids:permission": [{
                    "@type": "ids:Permission",
                    "@id": "https://w3id.org/idsa/autogen/permission/379eba2c-89fe-4700-806d-54ed7f48b2f7",
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
                        "@id": "https://w3id.org/idsa/autogen/constraint/13499f28-c255-4e28-9ed0-d74f64f11f55",
                        "ids:operator": {
                            "@id": "idsc:AFTER"
                        },
                        "ids:leftOperand": {
                            "@id": "idsc:POLICY_EVALUATION_TIME"
                        },
                        "ids:rightOperand": {
                            "@value": this.$data.usageDuringIntervalFromValue,
                            "@type": "xsd:dateTimeStamp"
                        }
                    }, {
                        "@type": "ids:Constraint",
                        "@id": "https://w3id.org/idsa/autogen/constraint/3fd86a34-c05b-402d-aa2a-b088e8670e39",
                        "ids:operator": {
                            "@id": "idsc:BEFORE"
                        },
                        "ids:leftOperand": {
                            "@id": "idsc:POLICY_EVALUATION_TIME"
                        },
                        "ids:rightOperand": {
                            "@value": this.$data.usageDuringIntervalToValue,
                            "@type": "xsd:dateTimeStamp"
                        }
                    }]
                }]
            };
        }
    }
};
