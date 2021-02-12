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
            items: [],
            node: null
        };
    },
    watch: {
        selected: function () {
            this.$data.valid = this.$data.selected.length > 0;
        }
    },
    mounted: function () {},
    methods: {
        show(node) {
            this.$data.node = node;
            this.$refs.addResourcePage.set(clientDataModel.createResource(-1, node.title, node.description,
                node.language, node.keywords, node.version, node.standardlicense, node.publisher, node.contractJson,
                node.sourceType));
            this.$data.dialog = true;
        },
        saved(title, description, language, keywords, version, standardlicense, publisher, contractJson, sourceType, brokerList) {
            this.$data.node.title = title;
            this.$data.node.description = description;
            this.$data.node.language = language;
            this.$data.node.keywords = keywords;
            this.$data.node.version = version;
            this.$data.node.standardlicense = standardlicense;
            this.$data.node.publisher = publisher;
            this.$data.node.contractJson = contractJson;
            this.$data.node.sourceType = sourceType;
            this.$data.node.brokerList = brokerList;
            this.dialog = false;
        }
    }
};
