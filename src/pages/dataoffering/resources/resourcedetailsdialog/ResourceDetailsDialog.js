import AddResourcePage from "@/pages/dataoffering/resources/addresource/AddResourcePage.vue";
import clientDataModel from "@/datamodel/clientDataModel";

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
    mounted: function () {},
    methods: {
        show(resource) {
            this.$refs.addResourcePage.set(clientDataModel.createResource(resource.id, resource.title, resource.description,
                resource.language, resource.keywords, resource.version, resource.standardlicense, resource.publisher,
                resource.contract, resource.sourceType));
            this.$refs.addResourcePage.setReadOnly(true);
            this.$data.dialog = true;
        }
    }
};
