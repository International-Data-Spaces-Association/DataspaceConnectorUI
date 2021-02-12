export default {
    components: {},
    props: ['readonly'],
    data() {
        return {
            contractJson: "",
            durationUsageValue: null,
            numberRule: [
                v => !!v || 'This data is required',
                v => /^[0-9.]+$/.test(v) || 'Only numbers and "." allowed',
            ],
            durationValid: false,
            visibleclass: ""
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
            this.$data.durationUsageValue = contract["ids:permission"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"].replace("PT", "").replace("H", "");
        },
        durationUsageTfChange() {
            this.$data.contractJson = {
                "@context": {
                    "ids": "https://w3id.org/idsa/core/"
                },
                "@type": "ids:DurationOffer",
                "@id": "https://w3id.org/idsa/autogen/contractOffer/71cda710-673f-4535-95bd-a04bb2ec2a10",
                "ids:permission": [{
                    "@type": "ids:Permission",
                    "@id": "https://w3id.org/idsa/autogen/permission/c9ed9830-26b1-4a16-ad88-ceca0b3701b4",
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
                        "@id": "https://w3id.org/idsa/autogen/constraint/f8eb5fae-e2ae-416c-8de3-8e462f93ec4f",
                        "ids:operator": {
                            "@id": "idsc:SHORTER_EQ"
                        },
                        "ids:leftOperand": {
                            "@id": "idsc:ELAPSED_TIME"
                        },
                        "ids:rightOperand": {
                            "@value": "PT" + this.$data.durationUsageValue + "H",
                            "@type": "xsd:duration"
                        }
                    }]
                }]
            };
        },
    }
};
