import NavigationMenu from "@/components/navigationmenu/NavigationMenu.vue";
import InfoBox from "@/components/infobox/InfoBox.vue";
import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";
import { VSwitch } from "vuetify/lib/components";
// import BrokersPage from "@/pages/brokers/BrokersPage.vue";

export default {
    components: {
        NavigationMenu,
        InfoBox,
        VSwitch
    },
    data: () => ({
        drawer: null,
        breadcrumbs: [],
        showBusyIndicator: false,
        blockNavigationMenu: false,
        uiTitle: "Dataspace Connector",
        description: "IDS Connector reference implementation",
        errorSnackbar: false,
        errorText: "",
        advancedView: false,
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
        errorUtils.setVueRoot(this.$root);
        if (process.env.VUE_APP_UI_TITLE !== undefined && process.env.VUE_APP_UI_TITLE !== "#UI_TITLE#") {
            this.$data.uiTitle = process.env.VUE_APP_UI_TITLE;
        }
        this.setTitleFromConnector();
        this.$data.breadcrumbs = this.$route.meta.breadcrumb;
        this.$root.$on('showBusyIndicator', (show) => {
            this.$data.showBusyIndicator = show;
        });
        this.$root.$on('blockNavigationMenu', (block) => {
            this.$data.blockNavigationMenu = block;
        });
        this.$root.$on('error', (errorText) => {
            this.$data.errorText = errorText + " (See logs for details)";
            this.$data.errorSnackbar = true;
        });
    },
    methods: {
        async setTitleFromConnector() {
            try {
                let connectorData = (await dataUtils.getConnectorConfiguration());
                this.$data.uiTitle = connectorData.title;
                this.$data.description = connectorData.description;
            } catch (error) {
                errorUtils.showError(error, "Get connector settings");
            }
        }
    }
};
