import NavigationMenu from "@/components/navigationmenu/NavigationMenu.vue";
import InfoBox from "@/components/infobox/InfoBox.vue";
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
        uiTitle: "IDS Configuration Manager"
    }),
    watch: {
        $route() {
            this.$data.breadcrumbs = this.$route.meta.breadcrumb;
        },
    },
    mounted: function () {
        if (process.env.VUE_APP_UI_TITLE !== undefined && process.env.VUE_APP_UI_TITLE != "#UI_TITLE#") {
            this.$data.uiTitle = process.env.VUE_APP_UI_TITLE;
        }
        this.$data.breadcrumbs = this.$route.meta.breadcrumb;
        this.$root.$on('showBusyIndicator', (show) => {
            this.$data.showBusyIndicator = show;
        });
    },
};
