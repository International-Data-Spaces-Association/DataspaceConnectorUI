import NavigationMenu from "@/components/navigationmenu/NavigationMenu.vue";
import InfoBox from "@/components/infobox/InfoBox.vue";
import dataUtils from "@/utils/dataUtils";

// import BrokersPage from "@/pages/brokers/BrokersPage.vue";

export default {
    components: {
        NavigationMenu,
        InfoBox
    },
    data: () => ({
        drawer: null,
        breadcrumbs: [],
        showBusyIndicator: false,
        uiTitle: "IDS Configuration Manager",
        errorSnackbar: false,
        errorText: ""
    }),
    watch: {
        $route() {
            this.$data.breadcrumbs = this.$route.meta.breadcrumb;
        },
        uiTitle: function () {
            document.title = this.$data.uiTitle;
        }
    },
    mounted: function () {
        if (process.env.VUE_APP_UI_TITLE !== undefined && process.env.VUE_APP_UI_TITLE != "#UI_TITLE#") {
            this.$data.uiTitle = process.env.VUE_APP_UI_TITLE;
        }
        this.setTitleFromConnector();
        this.$data.breadcrumbs = this.$route.meta.breadcrumb;
        this.$root.$on('showBusyIndicator', (show) => {
            this.$data.showBusyIndicator = show;
        });
        this.$root.$on('error', (errorText) => {
            this.$data.errorText = errorText + " (See logs for details)";
            this.$data.errorSnackbar = true;
        });
    },
    methods: {
        async setTitleFromConnector() {
            try {
                let connectorData = (await dataUtils.getConnectorSettings());
                this.$data.uiTitle = connectorData.title;
            } catch (error) {
                console.log("Error on API call: ", error.details);
                this.$root.$emit('error', "Get connector settings failed.");
            }
        }
    }
};
