import DataUtils from "@/utils/dataUtils";

export default {
    components: {},
    data() {
        return {
            contractJson: "",
            policyType: null,
            active_tab_types: 0,
            nTimesUsageOperator: null,
            nTimesUsageValue: null,
            durationUsageValue: null,
            usageDuringIntervalFromValue: null,
            usageDuringIntervalToValue: null,
            defaultRule: [
                v => !!v || 'This data is required'
            ],
            numberRule: [
                v => !!v || 'This data is required',
                v => /^[0-9.]+$/.test(v) || 'Only numbers and "." allowed',
            ],
            nTimesUsageValid: false,
            durationValid: false,
            usageDuringIntervalValid: false
        };
    },
    mounted: function () {
        this.$data.policyType = DataUtils.POLICY_N_TIMES_USAGE;
        if (this.$parent.$parent.$parent.$parent.currentResource != null) {
            this.loadResource(this.$parent.$parent.$parent.$parent.currentResource);
        }
    },
    methods: {
        policyTypeChanged() {
            if (this.$data.policyType == DataUtils.POLICY_N_TIMES_USAGE) {
                this.$data.active_tab_types = 0;
            } else if (this.$data.policyType == DataUtils.POLICY_DURATION_USAGE) {
                this.$data.active_tab_types = 1;
            } else if (this.$data.policyType == DataUtils.POLICY_USAGE_DURING_INTERVAL) {
                this.$data.active_tab_types = 2;
            }
        },
        loadResource(resource) {
            this.$data.policyType = DataUtils.convertTypeToPolicyName(resource["ids:contractOffer"][0]["@type"]);
            this.policyTypeChanged();
            if (this.$data.policyType == DataUtils.POLICY_N_TIMES_USAGE) {
                this.$data.nTimesUsageOperator = DataUtils.convertOperatorTypeToSymbol(resource["ids:contractOffer"][0]["ids:permission"][0]["ids:constraint"][0]["ids:operator"]["@id"]);
                this.$data.nTimesUsageValue = resource["ids:contractOffer"][0]["ids:permission"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"];
            } else if (this.$data.policyType == DataUtils.POLICY_DURATION_USAGE) {
                this.$data.durationUsageValue = resource["ids:contractOffer"][0]["ids:permission"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"].replace("PT", "").replace("H", "");
            } else if (this.$data.policyType == DataUtils.POLICY_USAGE_DURING_INTERVAL) {
                this.$data.usageDuringIntervalFromValue = resource["ids:contractOffer"][0]["ids:permission"][0]["ids:constraint"][0]["ids:rightOperand"]["@value"];
                this.$data.usageDuringIntervalToValue = resource["ids:contractOffer"][0]["ids:permission"][0]["ids:constraint"][1]["ids:rightOperand"]["@value"];
            }
        },
        previousPage() {
            this.$emit('previousPage')
        },
        nextPage() {
            this.$emit('nextPage')
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
