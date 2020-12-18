import Axios from "axios";
import DashboardCard from "@/components/cards/dashboardcard/DashboardCard.vue";

export default {
    components: {
        DashboardCard
    },
    data() {
        return {
            options: {
                chart: {
                    type: "donut"
                },
                labels: [],
                colors: [this.$vuetify.theme.currentTheme.primary, this.$vuetify.theme.currentTheme.accent, this.$vuetify.theme.currentTheme.accent3, this.$vuetify.theme.currentTheme.primary3]
            },
            series: []
        };
    },
    mounted: function () {
        this.getSourceTypes();
    },
    methods: {
        async getSourceTypes() {
            Axios.get("http://localhost:80/sourcetypesstats").then(response => {
                var stats = response.data;
                this.$data.options = {
                    chart: {
                        type: "donut"
                    },
                    labels: stats.labels
                }
                this.$data.series = stats.series;
                this.$forceUpdate();
            }).catch(error => {
                console.log("Error in getSourceTypes(): ", error);
            });
        }
    }

};
