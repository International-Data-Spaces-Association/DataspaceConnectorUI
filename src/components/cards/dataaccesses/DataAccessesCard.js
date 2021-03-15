// import Axios from "axios";
import DashboardCard from "@/components/cards/dashboardcard/DashboardCard.vue";

export default {
    components: {
        DashboardCard
    },
    data() {
        return {
            options: {
                chart: {
                    type: 'line'
                },
                xaxis: {
                    categories: ["01.10", "02.10", "03.10", "04.10", "05.10", "06.10", "07.10", "08.10"]
                },
                colors: [this.$vuetify.theme.currentTheme.primary, this.$vuetify.theme.currentTheme.accent, this.$vuetify.theme.currentTheme.accent3, this.$vuetify.theme.currentTheme.primary3]
            },
            series: [{
                name: 'series-1',
                data: [91, 11, 21, 7, 33, 60, 22, 91]
            }]
        };
    },
    mounted: function () {
        this.getDataAccesses();
    },
    methods: {
        async getDataAccesses() {
        }
    }

};
