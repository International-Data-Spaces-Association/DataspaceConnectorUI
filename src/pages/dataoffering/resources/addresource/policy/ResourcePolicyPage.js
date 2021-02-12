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
    props: ['readonly'],
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
            if (this.$parent.$parent.$parent.$parent.currentResource != null) {
                this.loadResource(this.$parent.$parent.$parent.$parent.currentResource);
            }
        },
        loadResource(resource) {
            console.log(">>> LOAD: ", resource);
            if (resource.contract === undefined) {
                this.$data.policyType = "N Times Usage";
                this.$refs.form.reset();
            } else {
                this.setPolicy(resource.contract);
            }
        },
        setPolicy(contract) {
            console.log(">>> policy page setPolicy: ", contract);
            if (contract == "") {
                this.$data.policyType = dataUtils.POLICY_N_TIMES_USAGE;
            } else {
                this.$data.policyType = dataUtils.convertTypeToPolicyName(contract["@type"]);
                console.log(">>> ", this.$refs[this.$data.policyType]);
            }
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
