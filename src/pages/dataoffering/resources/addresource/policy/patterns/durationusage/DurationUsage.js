export default {
    components: {},
    data() {
        return {
            contractJson: "",
            durationUsageValue: null,
            numberRule: [
                v => !!v || 'This data is required',
                v => /^[0-9.]+$/.test(v) || 'Only numbers and "." allowed',
            ],
            durationValid: false,
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
            this.$data.durationUsageValue = contract["ids:permission"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"].replace("PT", "").replace("H", "");
            this.durationUsageTfChange();
        },
        durationUsageTfChange() {
            this.$data.contractJson = {
                "@context": {
                    "ids": "https://w3id.org/idsa/core/",
                    "idsc": "https://w3id.org/idsa/code/"
                },
                "@type": "ids:ContractOffer",
                "@id": "https://w3id.org/idsa/autogen/contractOffer/a2f9fa88-7753-4227-8170-9365d20b189f",
                "ids:permission": [{
                    "@type": "ids:Permission",
                    "@id": "https://w3id.org/idsa/autogen/permission/6b8abe49-6a31-4df4-80c6-764ad16d4c29",
                    "ids:description": [{
                        "@value": "duration-usage",
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
                        "@id": "https://w3id.org/idsa/autogen/constraint/a5aa4243-432f-4360-aff4-c95da99eb266",
                        "ids:rightOperand": {
                            "@value": "PT" + this.$data.durationUsageValue + "H"
                        },
                        "ids:operator": {
                            "@id": "idsc:SHORTER_EQ"
                        },
                        "ids:leftOperand": {
                            "@id": "idsc:ELAPSED_TIME"
                        }
                    }]
                }]
            };
        },
    }
};
