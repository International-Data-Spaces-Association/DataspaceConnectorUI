import PolicyLine from "@/components/policy/PolicyLine.vue";
import dataUtils from "@/utils/dataUtils";
import validationUtils from "@/utils/validationUtils";

export default {
    components: {
        PolicyLine
    },
    data() {
        return {
            policyType: null,
            readonly: false,
            valid: true,
            contractPeriodValid: false,
            policyLines: [],
            contractPeriodFromMenu: false,
            contractPeriodFromValue: null,
            contractPeriodToMenu: false,
            contractPeriodToValue: null,
            defaultRule: validationUtils.getRequiredRule()
        };
    },
    mounted: function () {
        this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
        this.$data.policyLines.push({
            "name": Date.now()
        });
    },
    watch: {
        contractPeriodValid: function () {
            this.validationChanged();
        },
    },
    methods: {
        gotVisible() {
            this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
        },
        loadResource(resource) {
            this.$data.policyLines = [];
            if (resource.id == -1) {
                // resource.id == -1 means this is a new IDS Endpoint node at the route page.
                // For this new node one policy line is added, so the user can save the first click on "+".
                this.$data.policyLines.push({
                    "name": Date.now()
                });
            } else {
                if (resource.policyNames !== undefined) {
                    for (let i = 0; i < resource.policyNames.length; i++) {
                        let policyLine = {
                            "name": Date.now() + i,
                            "ruleId": resource.ruleIds[i],
                            "ruleJson": resource.ruleJsons[i],
                            "policyName": resource.policyNames[i]
                        };

                        this.$data.policyLines.push(policyLine);
                    }
                } else if (resource.policyDescriptions !== undefined) {
                    for (let i = 0; i < resource.policyDescriptions.length; i++) {
                        let policyLine = {
                            "name": Date.now() + i,
                            "policyDescription": resource.policyDescriptions[i]
                        };
                        this.$data.policyLines.push(policyLine);
                    }
                }
                this.$data.contractPeriodFromValue = resource.contractPeriodFromValue;
                this.$data.contractPeriodToValue = resource.contractPeriodToValue;
            }
        },
        async loadRequestedResource(resource) {
            this.$data.policyLines = [];
            let agreements = await dataUtils.getArtifactAgreements(resource.artifactId);
            if (agreements.length > 0) {
                let agreement = JSON.parse(agreements[0].value);
                let i = 0;
                for (let permission of agreement["ids:permission"]) {
                    permission["@context"] = {
                        "ids": "https://w3id.org/idsa/core/",
                        "idsc": "https://w3id.org/idsa/code/"
                    };
                    let policyName = await dataUtils.getPolicyNameByPattern(JSON.stringify(permission));
                    let policyLine = {
                        "name": Date.now() + i,
                        "ruleJson": permission,
                        "policyName": policyName
                    };
                    this.$data.policyLines.push(policyLine);
                    i++;
                }
            }
        },
        getDescriptions() {
            let descriptions = [];
            for (let policyLine of this.$data.policyLines) {
                descriptions.push(this.$refs[policyLine.name][0].getDescription());
            }
            return descriptions;
        },
        getContractPeriodFromValue() {
            return this.$data.contractPeriodFromValue + "T00:00:00Z";
        },
        getContractPeriodToValue() {
            return this.$data.contractPeriodToValue + "T00:00:00Z";
        },
        previousPage() {
            this.$emit('previousPage')
        },
        nextPage() {
            this.$emit('nextPage')
        },
        addPolicy() {
            this.$data.policyLines.push({
                "name": Date.now()
            });
        },
        removePolicy(name) {
            let index = -1;
            for (let i = 0; i < this.$data.policyLines.length; i++) {
                if (this.$data.policyLines[i].name == name) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                this.$data.policyLines.splice(index, 1);
            }
            this.validationChanged();
        },
        validationChanged() {
            for (let policyLine of this.$data.policyLines) {
                if (this.$refs[policyLine.name] !== undefined) {
                    this.$data.valid = this.$refs[policyLine.name][0].isValid() && this.$data.contractPeriodValid;
                    if (!this.$data.valid) {
                        break;
                    }
                }
            }
        }
    }
};
