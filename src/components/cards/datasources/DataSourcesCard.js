import DashboardCard from "@/components/cards/dashboardcard/DashboardCard.vue";
import dataUtils from "@/utils/dataUtils";
import {VBtn} from "vuetify/lib";

export default {
    components: {
        DashboardCard,
        VBtn
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
            this.$data.totalNumber = await dataUtils.getNumberOfDataSources();
        },
    }
};