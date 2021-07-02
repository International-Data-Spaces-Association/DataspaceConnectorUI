import DashboardCard from "@/components/cards/dashboardcard/DashboardCard.vue";
import dataUtils from "../../../utils/dataUtils";


export default {
    components: {
        DashboardCard
    },
    data() {
        return {
            totalNumber: "",
            totalNumberType: "",
            totalSize: "",
            totalSizeType: "",
            offeredResourcesAvailable: false
        };
    },
    mounted: function () {
        this.getOfferedResourcesStats();
    },
    methods: {
        async getOfferedResourcesStats() {
            this.$data.numberOfAssignedData = 0;
            try {
                let response = (await dataUtils.getOfferedResourcesStats());
                if (response.totalNumber === undefined) {
                    this.$data.offeredResourcesAvailable = false;
                    this.$root.$emit('error', "Get offered resources failed.");
                } else {
                    this.$data.offeredResourcesAvailable = true;
                    this.$data.totalNumber = response.totalNumber;
                    if (response.totalNumber > 1) {
                        this.$data.totalNumberType = "resources"
                    } else {
                        this.$data.totalNumberType = "resource"
                    }
                    this.$data.totalSize = this.getTotalSize(response.totalSize);
                    this.$data.totalSizeType = this.getTotalSizeType(response.totalSize);
                }
                this.$forceUpdate();
            } catch (error) {
                console.log("Error on API call: ", error.details);
                this.$root.$emit('error', "Get resource statistics failed.");
            }
        },
        getTotalSize(totalSize) {
            let totalSizeNew = -1;
            if (totalSize < 1000) {
                totalSizeNew = totalSize;
            } else if (totalSize < 1000000) {
                totalSizeNew = totalSize / 1000;
            } else if (totalSize < 1000000000) {
                totalSizeNew = totalSize / 1000000;
            } else if (totalSize < 1000000000000) {
                totalSizeNew = totalSize / 1000000000;
            } else if (totalSize < 1000000000000000) {
                totalSizeNew = totalSize / 1000000000000;
            }
            return Math.round(totalSizeNew * 10) / 10;
        },
        getTotalSizeType(totalSize) {
            let type = "-";
            if (totalSize < 1000) {
                type = "bytes";
            } else if (totalSize < 1000000) {
                type = "kB";
            } else if (totalSize < 1000000000) {
                type = "MB";
            } else if (totalSize < 1000000000000) {
                type = "GB";
            } else if (totalSize < 1000000000000000) {
                type = "TB";
            }
            return type;
        }
    }

};
