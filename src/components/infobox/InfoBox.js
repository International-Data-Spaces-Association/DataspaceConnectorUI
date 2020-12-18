import PageStructure from "@/pages/PageStructure";

export default {
    props: [],
    data() {
        return {
            title: "",
            text: "",
            currentRoute: ""
        }
    },
    mounted: function () {
        this.update(this.$route);
    },
    watch: {
        $route() {
            this.update(this.$route);
        }
    },
    methods: {
        update(route) {
            this.$data.title = PageStructure.getDisplayName(route.name);
            this.$data.currentRoute = route.path.replace("/", "");
        }
    }
}
