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
            console.log(">>> PolicyPage.loadResource: ", resource);
            // if (resource.contract === undefined) {
            //     this.$data.policyDisplayName = dataUtils.POLICY_PROVIDE_ACCESS;
            // } else {
            //     this.setPolicy(resource.contract, resource.policyName, resource.policyDescription);
            // }
            this.$data.policyLines = [];
            for (let i = 0; i < resource.policyNames.length; i++) {
                this.$data.policyLines.push({
                    "name": Date.now() + i,
                    "ruleJson": resource.ruleJsons[i],
                    "policyName": resource.policyNames[i]
                });
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
