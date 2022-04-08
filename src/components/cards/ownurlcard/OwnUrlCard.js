import DashboardCard from "@/components/cards/dashboardcard/DashboardCard.vue";
import dataUtils from "../../../utils/dataUtils";
import errorUtils from "../../../utils/errorUtils";

export default {
    components: {
        DashboardCard
    },
    data() {
        return {
            defaultEndpoint: "No URL endpoint defined",
            text: "Copy to share your endpoint",
            copyText: ''
        };
    },
    mounted: function () {
        this.getOwnUrl();
        this.reset();
    },
    methods: {
        async copyCode() {
            await navigator.clipboard.writeText(this.$data.defaultEndpoint);
            this.$data.copyText = "Copied"
        },
        reset() {
            this.$data.copyText = this.$data.text
        },
        async getOwnUrl() {
            try {
                let configuration = await dataUtils.getConnectorConfiguration();
                this.$data.defaultEndpoint = configuration.endpoint;
            } catch (error) {
                errorUtils.showError(error, "Get configuration error");
            }
        }
    }

};
