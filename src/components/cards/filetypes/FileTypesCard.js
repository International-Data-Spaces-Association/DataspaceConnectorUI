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
        this.getFileTypes();
    },
    methods: {
        async getFileTypes() {
            dataUtils.getResources(resources => {
                if (resources.length == 0) {
                    this.$data.chartVisible = false;
                } else {
                    this.$data.chartVisible = true;
                    let fileTypes = [];
                    for (let resource of resources) {
                        let type = resource.fileType;
                        if (fileTypes[type] === undefined) {
                            fileTypes[type] = 1;
                        } else {
                            fileTypes[type] = fileTypes[type] + 1;
                        }
                    }
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
                }
            });
        }
    }

};
