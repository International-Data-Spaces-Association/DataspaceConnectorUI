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
            policyDisplayName: null,
            readonly: false
        };
    },
    mounted: function () {
        this.$data.policyDisplayName = dataUtils.POLICY_PROVIDE_ACCESS;
        this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
    },
    watch: {
        policyDisplayName: function () {
            for (let name of dataUtils.getPolicyNames()) {
                if (name == this.$data.policyDisplayName) {
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
                this.$data.policyDisplayName = dataUtils.POLICY_PROVIDE_ACCESS;
            } else {
                this.setPolicy(resource.contract, resource.policyName, resource.policyDescription);
            }
        },
        setPolicy(contract, policyType, policyDescription) {
            if (policyType == "") {
                this.$refs[dataUtils.getPolicyNames()[0]].setPolicy(contract);
            } else {
                this.$data.policyDisplayName = dataUtils.getPolicyDisplayName(policyType);
                if (contract == "") {
                    this.$refs[this.$data.policyDisplayName].setPolicyByDescription(policyDescription);
                } else {
                    this.$refs[this.$data.policyDisplayName].setPolicy(contract);
                }
            }
        },
        getDescription() {
            return this.$refs[this.$data.policyDisplayName].description;
        },
        previousPage() {
            this.$emit('previousPage')
        },
        nextPage() {
            this.$emit('nextPage')
        }
    }
};
