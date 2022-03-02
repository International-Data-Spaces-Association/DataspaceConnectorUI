import DashboardCard from "@/components/cards/dashboardcard/DashboardCard.vue";
import dataUtils from "@/utils/dataUtils";

export default {
    components: {
        DashboardCard
    },
    data() {
        return {
            totalNumber: 0,
        };
    },
    mounted: function () {
        this.getData();
    },
    methods: {
        async getData() {
            this.$data.totalNumber = await dataUtils.getNumberOfActiveIncomingAgreements();
        },
    }
};