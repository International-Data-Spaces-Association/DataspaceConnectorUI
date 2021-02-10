import DataUtils from "@/utils/dataUtils";
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
        };
    },
    mounted: function () {
        this.$data.policyType = DataUtils.POLICY_N_TIMES_USAGE;
        if (this.$parent.$parent.$parent.$parent.currentResource != null) {
            this.loadResource(this.$parent.$parent.$parent.$parent.currentResource);
        }
        if (this.$parent.$parent.$parent.$parent.currentNode != null) {
            this.set(this.$parent.$parent.$parent.$parent.currentNode);
        }
    },
    methods: {
        gotVisible() {
            if (this.$parent.$parent.$parent.$parent.currentNode != null) {
                this.set(this.$parent.$parent.$parent.$parent.currentNode);
            }
        },
        loadResource(resource) {
            this.setPolicy(resource["ids:contractOffer"]);
        },
        set(node) {
            if (node.contractJson === undefined) {
                this.$data.policyType = "N Times Usage";
                this.$refs.form.reset();
            } else {
                this.setPolicy(node.contractJson);
            }
        },
        setPolicy(contract) {
            this.$data.policyType = DataUtils.convertTypeToPolicyName(contract["@type"]);
            this.$data.policies[this.$data.policyType].setPolicy(contract);
        },
        previousPage() {
            this.$emit('previousPage')
        },
        nextPage() {
            console.log(">>> REF", this.$refs[this.$data.policyType].contractJson);
            this.$data.contractJson = this.$refs[this.$data.policyType].contractJson;
            this.$emit('nextPage')
        }
    }
};
