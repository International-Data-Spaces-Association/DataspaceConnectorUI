export default {
    components: {},
    data() {
        return {
            contractJson: "",
            visibleclass: "",
            readonly: false
        };
    },
    mounted: function () {
        this.$data.contractJson = {
            "@context": {
                "ids": "https://w3id.org/idsa/core/",
                "idsc": "https://w3id.org/idsa/code/"
            },
            "@type": "ids:ContractOffer",
            "@id": "https://w3id.org/idsa/autogen/contractOffer/bd4d0cf0-683d-4770-b0b8-5204e03c3bf4",
            "ids:permission": [{
                "@type": "ids:Permission",
                "@id": "https://w3id.org/idsa/autogen/permission/d5e58997-3337-49e9-bc01-d10aae3db52b",
                "ids:description": [{
                    "@value": "usage-logging",
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
                    "@id": "https://w3id.org/idsa/autogen/duty/e9728a46-91a2-4bd2-b210-4c142f41c715",
                    "ids:action": [{
                        "@id": "idsc:LOG"
                    }]
                }]
            }]
        };
    },
    methods: {
        previousPage() {
            this.$emit('previousPage');
        },
        nextPage() {
            this.$emit('nextPage');
        },
        setPolicy() {
            // nothing to do.
        }
    }
};
