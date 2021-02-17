import dataUtils from "@/utils/dataUtils";
import NTimesUsage from "./patterns/ntimesusage/NTimesUsage.vue";
import DurationUsage from "./patterns/durationusage/DurationUsage.vue";
import UsageDuringInterval from "./patterns/usageduringinterval/UsageDuringInterval.vue";

export default {
    components: {
        NTimesUsage,
        DurationUsage,
        UsageDuringInterval
    },
    data() {
        return {
            policyType: null,
            contractJson: "",
            readonly: false
        };
    },
    mounted: function () {
        this.$data.policyType = dataUtils.POLICY_N_TIMES_USAGE;
        if (this.$parent.$parent.$parent.$parent.currentResource != null) {
            this.loadResource(this.$parent.$parent.$parent.$parent.currentResource);
        }
        this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
    },
    watch: {
        policyType: function () {
            for (let name of dataUtils.getPolicyNames()) {
                if (name == this.$data.policyType) {
                    this.$refs[name].visibleclass = "";
                } else {
                    this.$refs[name].visibleclass = "invisible-policy";
                }
            }
        }
    },
    methods: {
        gotVisible() {
            if (this.$parent.$parent.$parent.$parent.currentResource != null) {
                this.loadResource(this.$parent.$parent.$parent.$parent.currentResource);
            }
            this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
        },
        loadResource(resource) {
            if (resource.contract === undefined) {
                this.$data.policyType = "N Times Usage";
                this.$refs.form.reset();
            } else {
                this.setPolicy(resource.contract, resource.policyName);
            }
        },
        setPolicy(contract, policyName) {
            if (contract == "") {
                this.$data.policyType = dataUtils.POLICY_N_TIMES_USAGE;
            } else {
                this.$data.policyType = policyName;
            }
            this.$refs[this.$data.policyType].setPolicy(contract);
        },
        previousPage() {
            this.$emit('previousPage')
        },
        nextPage() {
            this.$data.contractJson = this.$refs[this.$data.policyType].contractJson;
            this.$emit('nextPage')
        }
    }
};
