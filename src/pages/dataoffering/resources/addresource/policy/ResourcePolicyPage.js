import PolicyLine from "@/components/policy/PolicyLine.vue";

export default {
    components: {
        PolicyLine
    },
    data() {
        return {
            policyType: null,
            readonly: false,
            valid: true,
            policyLines: []
        };
    },
    mounted: function () {
        this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
        this.$data.policyLines.push({
            "name": Date.now()
        });
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
            }
        },
        getDescriptions() {
            let descriptions = [];
            for (let policyLine of this.$data.policyLines) {
                descriptions.push(this.$refs[policyLine.name][0].getDescription());
            }
            return descriptions;
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
                this.$data.valid = this.$refs[policyLine.name][0].isValid();
            }
        }
    }
};
