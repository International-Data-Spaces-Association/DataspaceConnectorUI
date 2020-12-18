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
        showBusyIndicator: false
    }),
    watch: {
        $route() {
            this.$data.breadcrumbs = this.$route.meta.breadcrumb;
        },
    },
    mounted: function () {
        this.$data.breadcrumbs = this.$route.meta.breadcrumb;
        this.$root.$on('showBusyIndicator', (show) => {
            this.$data.showBusyIndicator = show;
        });
    },
};
