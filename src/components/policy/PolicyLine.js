import NTimesUsage from "./patterns/ntimesusage/NTimesUsage.vue";
import DurationUsage from "./patterns/durationusage/DurationUsage.vue";
import UsageDuringInterval from "./patterns/usageduringinterval/UsageDuringInterval.vue";
import ProvideAccess from "./patterns/provideaccess/ProvideAccess.vue";
import ProhibitAccess from "./patterns/prohibitaccess/ProhibitAccess.vue";
import UsageUntilDeletion from "./patterns/usageuntildeletion/UsageUntilDeletion.vue";
import UsageLogging from "./patterns/usagelogging/UsageLogging.vue";
import UsageNotification from "./patterns/usagenotification/UsageNotification.vue";
import ConnectorRestrictedUsage from "./patterns/connectorrestrictedusage/ConnectorRestrictedUsage.vue";
import SecurityProfileRestrictedUsage from "./patterns/securityprofilerestrictedusage/SecurityProfileRestrictedUsage.vue";
import dataUtils from "../../utils/dataUtils";

export default {
    components: {
        NTimesUsage,
        DurationUsage,
        UsageDuringInterval,
        ProvideAccess,
        ProhibitAccess,
        UsageUntilDeletion,
        UsageLogging,
        UsageNotification,
        ConnectorRestrictedUsage,
        SecurityProfileRestrictedUsage
    },
    props: ["name", "ruleJson", "policyName", "readonly", "policyDescription"],
    watch: {
        policyDisplayName: function () {
            for (let name of dataUtils.getPolicyNames()) {
                if (name === this.$data.policyDisplayName) {
                    this.$refs[name].visibleclass = "";
                    // this.$refs[name].readonly = this.$data.readonly;
                } else {
                    this.$refs[name].visibleclass = "invisible-policy";
                }
            }
            this.$emit('validationChanged', this.name);
        }
    },
    data() {
        return {
            policyDisplayName: null,
        }
    },
    mounted: function () {
        this.$data.policyDisplayName = dataUtils.POLICY_PROVIDE_ACCESS;
        this.setPolicy();
    },
    methods: {
        setPolicy() {
            if ((this.policyName === undefined || this.policyName === "") && this.policyDescription === undefined) {
                this.$refs[dataUtils.getPolicyNames()[0]].setPolicy(this.ruleJson);
            } else {
                if (this.ruleJson === undefined) {
                    this.$data.policyDisplayName = dataUtils.getPolicyDisplayName(this.policyDescription.type);
                    this.$refs[this.$data.policyDisplayName].setPolicyByDescription(this.policyDescription);
                } else {
                    this.$data.policyDisplayName = dataUtils.getPolicyDisplayName(this.policyName);
                    this.$refs[this.$data.policyDisplayName].setPolicy(this.ruleJson);
                }
            }
        },
        removePolicy() {
            this.$emit('removePolicy', this.name);
        },
        validationChanged() {
            this.$emit('validationChanged', this.name);
        },
        isValid() {
            return this.$refs[this.$data.policyDisplayName].valid;
        },
        getDescription() {
            return this.$refs[this.$data.policyDisplayName].description;
        }
    }
}
