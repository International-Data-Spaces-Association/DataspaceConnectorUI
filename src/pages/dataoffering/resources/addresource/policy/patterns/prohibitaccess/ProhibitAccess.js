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
            "@id": "https://w3id.org/idsa/autogen/contractOffer/6dc1ca18-1a6b-4cf0-a84a-f374d50fe82d",
            "ids:prohibition": [{
                "@type": "ids:Prohibition",
                "@id": "https://w3id.org/idsa/autogen/prohibition/ff1b43b9-f3b1-44b1-a826-2efccc199a76",
                "ids:description": [{
                    "@value": "prohibit-access",
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
