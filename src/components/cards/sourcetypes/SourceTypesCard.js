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
            series: []
        };
    },
    mounted: function () {
        this.getSourceTypes();
    },
    methods: {
        async getSourceTypes() {
            // dataUtils.getSourceTypesStats().then(stats => {
            //     this.$data.options = {
            //         chart: {
            //             type: "donut"
            //         },
            //         labels: stats.labels
            //     }
            //     this.$data.series = stats.series;
            //     this.$forceUpdate();
            // }).catch(error => {
            //     console.log("Error in getSourceTypes(): ", error);
            // });

            //     let resources = response.data;
            // let sourceTypes = [];
            // for (let resource of resources) {
            //     if (resource["ids:representation"] !== undefined) {
            //         if (resource["ids:representation"][0]["ids:sourceType"] !== undefined) {
            //             let type = resource["ids:representation"][0]["ids:sourceType"];
            //             if (sourceTypes[type] === undefined) {
            //                 sourceTypes[type] = 1;
            //             } else {
            //                 sourceTypes[type] = sourceTypes[type] + 1;
            //             }
            //         }
            //     }
            // }
            // let labels = [];
            // let series = [];
            // for (let sourceType in sourceTypes) {
            //     labels.push(sourceType);
            //     series.push(sourceTypes[sourceType]);
            // }
            // res.send({
            //     labels: labels,
            //     series: series
            // });

            dataUtils.getResources(resources => {
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
            });
        }
    }

};
