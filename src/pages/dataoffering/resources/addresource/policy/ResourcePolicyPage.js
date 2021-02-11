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
        };
    },
    mounted: function () {
        this.$data.policyType = dataUtils.POLICY_N_TIMES_USAGE;
        if (this.$parent.$parent.$parent.$parent.currentResource != null) {
            this.loadResource(this.$parent.$parent.$parent.$parent.currentResource);
        }
        if (this.$parent.$parent.$parent.$parent.currentNode != null) {
            this.set(this.$parent.$parent.$parent.$parent.currentNode);
        }
    },
    watch: {
        policyType: function () {
            for (let name of dataUtils.getPolicyNames()) {
                if (name == this.$data.policyType) {
                    this.$refs[name].visibleclass = "";
                } else {
                    this.$refs[name].visibleclass = "invisible-policy";
                }
                console.log(">>> ref: ", this.$refs[name]);
            }
        }
    },
    methods: {
        gotVisible() {
            if (this.$parent.$parent.$parent.$parent.currentNode != null) {
                this.set(this.$parent.$parent.$parent.$parent.currentNode);
            }
        },
        loadResource(resource) {
            console.log(">>> policy page loadResource: ", resource);
            this.setPolicy(resource["ids:contractOffer"][0]);
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
            console.log(">>> policy page setPolicy: ", contract);
            this.$data.policyType = dataUtils.convertTypeToPolicyName(contract["@type"]);
            console.log(">>> ", this.$refs[this.$data.policyType]);
            this.$refs[this.$data.policyType].setPolicy(contract);
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
