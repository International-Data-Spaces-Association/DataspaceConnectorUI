import DashboardCard from "@/components/cards/dashboardcard/DashboardCard.vue";
import dataUtils from "../../../utils/dataUtils";

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
        this.getSourceTypes();
    },
    methods: {
        async getSourceTypes() {
            dataUtils.getResources(resources => {
                if (resources.length == 0) {
                    this.$data.chartVisible = false;
                } else {
                    this.$data.chartVisible = true;
                    let sourceTypes = [];
                    for (let resource of resources) {
                        let type = resource.sourceType;
                        if (sourceTypes[type] === undefined) {
                            sourceTypes[type] = 1;
                        } else {
                            sourceTypes[type] = sourceTypes[type] + 1;
                        }
                    }
                    let labels = [];
                    let series = [];
                    for (let sourceType in sourceTypes) {
                        labels.push(sourceType);
                        series.push(sourceTypes[sourceType]);
                    }
                    this.$data.options = {
                        chart: {
                            type: "donut"
                        },
                        labels: labels
                    }
                    this.$data.series = series;
                }
            });
        }
    }

};
