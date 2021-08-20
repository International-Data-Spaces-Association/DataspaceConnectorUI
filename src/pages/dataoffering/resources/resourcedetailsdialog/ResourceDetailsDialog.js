import AddResourcePage from "@/pages/dataoffering/resources/addresource/AddResourcePage.vue";

export default {
    components: {
        AddResourcePage
    },
    data() {
        return {
            dialog: false,
            nodeType: "",
            search: '',
            valid: false,
            itemKey: "id",
            headers: [],
            selected: [],
            items: []
        };
    },
    watch: {
        selected: function () {
            this.$data.valid = this.$data.selected.length > 0;
        }
    },
    mounted: function () { },
    methods: {
        show(resourceId) {
            this.$refs.addResourcePage.loadResource(resourceId);
            this.$refs.addResourcePage.setReadOnly(true);
            this.$data.dialog = true;
        },
        showRequest(resourceId) {
            this.$refs.addResourcePage.loadRequestedResource(resourceId);
            this.$refs.addResourcePage.setReadOnly(true);
            this.$data.dialog = true;
        },
        showResource(resource) {
            this.$refs.addResourcePage.set(resource, true);
            this.$refs.addResourcePage.setReadOnly(true);
            this.$data.dialog = true;
        }
    }
};
