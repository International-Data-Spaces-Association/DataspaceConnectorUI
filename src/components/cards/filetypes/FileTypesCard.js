import DashboardCard from "@/components/cards/dashboardcard/DashboardCard.vue";
import dataUtils from "@/utils/dataUtils";

export default {
    components: {
        DashboardCard
    },
    data() {
        return {
            options: {
                labels: ['JSON', 'CSV', 'PDF', 'XML'],
                colors: [this.$vuetify.theme.currentTheme.primary, this.$vuetify.theme.currentTheme.accent, this.$vuetify.theme.currentTheme.accent3, this.$vuetify.theme.currentTheme.primary3]
            },
            series: [5, 3, 2, 1]
        };
    },
    mounted: function () {
        this.getFileTypes();
    },
    methods: {
        async getFileTypes() {
            dataUtils.getResources(resources => {
                let filetypes = [];
                for (let resource of resources) {
                    let type = resource.fileType;
                    if (filetypes[type] === undefined) {
                        filetypes[type] = 1;
                    } else {
                        filetypes[type] = filetypes[type] + 1;
                    }
                }
                let labels = [];
                let series = [];
                for (let filetype in filetypes) {
                    labels.push(filetype);
                    series.push(filetypes[filetype]);
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
