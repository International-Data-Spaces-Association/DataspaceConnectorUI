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
                this.$data.title = "Add Artifact";
                resource = clientDataModel.createResource("", -1);
            } else {
                this.$data.title = "Edit Artifact";
                resource = node.resource;
            }

            resource.contractPeriodFromValue = resource.contractPeriodFromValue.substring(0, 10);
            resource.contractPeriodToValue = resource.contractPeriodToValue.substring(0, 10);

            this.$refs.addResourcePage.set(resource, false);
            this.$data.dialog = true;
        },
        saved(catalogIds, title, description, language, paymentMethod, keywords, version, standardLicense, publisher, templateTitle, policyDescriptions,
            contractPeriodFromValue, contractPeriodToValue, filetype, bytesize, brokerList, endpointDocumentation) {
            let isNew = false;
            if (this.$data.node == null) {
                isNew = true;
                this.$data.node = {
                    id: +new Date(),
                    x: 0,
                    y: 0,
                    name: 'Artifact',
                    type: 'idsendpointnode',
                    objectId: null,
                };

            }

            let resource = {};
            resource.catalogIds = catalogIds;
            resource.title = title;
            resource.description = description;
            resource.language = language;
            resource.paymentMethod = paymentMethod;
            resource.keywords = keywords;
            resource.version = version;
            resource.standardLicense = standardLicense;
            resource.endpointDocumentation = endpointDocumentation;
            resource.publisher = publisher;
            resource.title = templateTitle;
            resource.policyDescriptions = policyDescriptions;
            resource.contractPeriodFromValue = contractPeriodFromValue;
            resource.contractPeriodToValue = contractPeriodToValue;
            resource.fileType = filetype;
            resource.bytesize = bytesize;
            resource.brokerUris = brokerList;
            this.$data.node.resource = resource;

            if (isNew) {
                this.$emit('newIdsEndpointNodeSaved', this.$data.node);
            }

            this.dialog = false;
        }
    }
};
