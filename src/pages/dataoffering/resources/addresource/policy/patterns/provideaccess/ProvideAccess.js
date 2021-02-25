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
            "@id": "https://w3id.org/idsa/autogen/contractOffer/0abdf773-3d1e-48fc-a1e9-b6dd9b61b300",
            "ids:permission": [{
                "@type": "ids:Permission",
                "@id": "https://w3id.org/idsa/autogen/permission/ae138d4f-f01d-4358-89a7-73e7c560f3de",
                "ids:description": [{
                    "@value": "provide-access",
                    "@type": "http://www.w3.org/2001/XMLSchema#string"
                }],
                "ids:action": [{
                    "@id": "idsc:USE"
                }],
                "ids:title": [{
                    "@value": "Example Usage Policy",
                    "@type": "http://www.w3.org/2001/XMLSchema#string"
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
