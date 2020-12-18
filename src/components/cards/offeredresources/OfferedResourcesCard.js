import Axios from "axios";
import DashboardCard from "@/components/cards/dashboardcard/DashboardCard.vue";


export default {
    components: {
        DashboardCard
    },
    data() {
        return {
            totalNumber: "",
            totalNumberType: "",
            totalSize: "",
            totalSizeType: ""
        };
    },
    mounted: function () {
        this.getOfferedResourcesStats();
    },
    methods: {
        async getOfferedResourcesStats() {
            this.$data.numberOfAssignedData = 0;
            const response = (await Axios.get("http://localhost:80/offeredresourcesstats")).data;
            this.$data.totalNumber = response.totalNumber;
            if (response.totalNumber > 1) {
                this.$data.totalNumberType = "resources"
            } else {
                this.$data.totalNumberType = "resource"
            }
            this.$data.totalSize = this.getTotalSize(response.totalSize);
            this.$data.totalSizeType = this.getTotalSizeType(response.totalSize);
            this.$forceUpdate();
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
