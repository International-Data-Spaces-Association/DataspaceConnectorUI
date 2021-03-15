import dataUtils from "@/utils/dataUtils";
import NTimesUsage from "./patterns/ntimesusage/NTimesUsage.vue";
import DurationUsage from "./patterns/durationusage/DurationUsage.vue";
import UsageDuringInterval from "./patterns/usageduringinterval/UsageDuringInterval.vue";
import ProvideAccess from "./patterns/provideaccess/ProvideAccess.vue";
import ProhibitAccess from "./patterns/prohibitaccess/ProhibitAccess.vue";
import UsageUntilDeletion from "./patterns/usageuntildeletion/UsageUntilDeletion.vue";
import UsageLogging from "./patterns/usagelogging/UsageLogging.vue";
import UsageNotification from "./patterns/usagenotification/UsageNotification.vue";


export default {
    components: {
        NTimesUsage,
        DurationUsage,
        UsageDuringInterval,
        ProvideAccess,
        ProhibitAccess,
        UsageUntilDeletion,
        UsageLogging,
        UsageNotification
    },
    data() {
        return {
            policyType: null,
            contractJson: "",
            readonly: false
        };
    },
    mounted: function () {
        this.$data.policyType = dataUtils.POLICY_PROVIDE_ACCESS;
        this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
    },
    watch: {
        policyType: function () {
            for (let name of dataUtils.getPolicyNames()) {
                if (name == this.$data.policyType) {
                    this.$refs[name].visibleclass = "";
                    this.$refs[name].readonly = this.$data.readonly;
                } else {
                    this.$refs[name].visibleclass = "invisible-policy";
                }
            }
        }
    },
    methods: {
        gotVisible() {
            this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
        },
        loadResource(resource) {
            if (resource.contract === undefined) {
                this.$data.policyType = dataUtils.POLICY_PROVIDE_ACCESS;
            } else {
                this.setPolicy(resource.contract, resource.policyName);
            }
        },
        setPolicy(contract, policyName) {
            if (contract == "") {
                this.$data.policyType = dataUtils.POLICY_PROVIDE_ACCESS;
            } else {
                this.$data.policyType = policyName;
            }
            this.$refs[this.$data.policyType].setPolicy(contract);
        },
        getContractJson() {
            return this.$refs[this.$data.policyType].contractJson;
        },
        previousPage() {
            this.$emit('previousPage')
        },
        nextPage() {
            this.$emit('nextPage')
        }
    }
};
