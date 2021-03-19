import AddResourcePage from "@/pages/dataoffering/resources/addresource/AddResourcePage.vue";
import clientDataModel from "@/datamodel/clientDataModel";

export default {
    components: {
        AddResourcePage
    },
    data() {
        return {
            title: "",
            dialog: false,
            nodeType: "",
            search: '',
            valid: false,
            itemKey: "id",
            headers: [],
            selected: [],
            items: [],
            node: null,
            isNewNode: true,
        };
    },
    watch: {
        selected: function () {
            this.$data.valid = this.$data.selected.length > 0;
        }
    },
    mounted: function () { },
    methods: {
        show(node) {
            this.$data.node = node;
            let resource;
            if (node == null) {
                this.$data.title = "Add IDS Endpoint";
                resource = clientDataModel.createResource(-1);
            } else {
                this.$data.title = "Edit IDS Endpoint";
                resource = clientDataModel.createResource(-1, node.title, node.description,
                    node.language, node.keywords, node.version, node.standardlicense, node.publisher, node.contractJson,
                    node.sourceType);
                resource.brokerList = node.brokerList;
            }

            this.$refs.addResourcePage.set(resource);
            this.$data.dialog = true;
        },
        saved(title, description, language, keywords, version, standardlicense, publisher, contractJson, sourceType, brokerList) {
            let isNew = false;
            if (this.$data.node == null) {
                isNew = true;
                this.$data.node = {
                    id: +new Date(),
                    x: 0,
                    y: 0,
                    name: 'IDS Endpoint',
                    type: 'idsendpointnode',
                    text: "IDS Endpoint",
                    objectId: null,
                };

            }

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

            if (isNew) {
                this.$emit('newIdsEndpointNodeSaved', this.$data.node);
            }

            this.dialog = false;
        }
    }
};
