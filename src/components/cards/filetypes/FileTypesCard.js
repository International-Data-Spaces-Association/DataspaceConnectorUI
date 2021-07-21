import DashboardCard from "@/components/cards/dashboardcard/DashboardCard.vue";
import dataUtils from "../../../utils/dataUtils";
import errorUtils from "../../../utils/errorUtils";

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
            series: [],
            chartVisible: false
        };
    },
    mounted: function () {
        this.getFileTypes();
    },
    methods: {
        async getFileTypes() {
            try {
                let fileTypes = await dataUtils.getOfferedResourcesFileTypes();
                this.$data.chartVisible = true;
                let labels = [];
                let series = [];
                for (let fileType in fileTypes) {
                    labels.push(fileType);
                    series.push(fileTypes[fileType]);
                }
                this.$data.options = {
                    chart: {
                        type: "donut"
                    },
                    labels: labels
                }
                this.$data.series = series;
            } catch (error) {
                errorUtils.showError(error, "Get file type statistics");
            }
        }
    }

};
