import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";
import validationUtils from "@/utils/validationUtils";
import ResourceDetailsDialog from "@/pages/dataoffering/resources/resourcedetailsdialog/ResourceDetailsDialog.vue";

export default {
    components: {
        ResourceDetailsDialog
    },
    data() {
        return {
            recipientId: "",
            receivedCatalogs: [],
            selectedCatalog: "",
            resourcesInSelectedCatalog: [],
            valid: false,
            urlRule: validationUtils.getUrlRequiredRule(),
            headers: [{
                text: 'Creation date',
                value: 'creationDate',
                width: 135
            }, {
                text: 'Title',
                value: 'title'
            },
            {
                text: 'Keywords',
                value: 'keywords'
            },
            {
                text: 'Publisher',
                value: 'publisher'
            }, {
                text: 'License',
                value: 'standardlicense'
            },
            {
                text: '',
                value: 'actions',
                sortable: false,
                align: 'right'
            }
            ],
            sortBy: 'creationDate',
            sortDesc: true
        };
    },
//    mounted: function () {
//
//    },
    methods: {
        getConnectorSelfDescription() {
            // this.$root.$emit('showBusyIndicator', true);
            // TODO Get resources 
        },
        async receiveCatalogs() {
            this.$root.$emit('showBusyIndicator', true);
            try {
                this.$data.receivedCatalogs = await dataUtils.receiveCatalogs(this.$data.recipientId);
            } catch (error) {
                errorUtils.showError(error, "Receive Catalogs");
            }
            this.$root.$emit('showBusyIndicator', false);
        },

        async receiveResources(catalogID){
            this.$root.$emit('showBusyIndicator', true);
            try {
                this.$data.resourcesInSelectedCatalog = await dataUtils.receiveResourcesInCatalog(this.$data.recipientId, catalogID);
            } catch (error) {
                errorUtils.showError(error, "Receive Resources in Catalog");
            }
            this.$root.$emit('showBusyIndicator', false);
        },

        selectCatalog(catalog) {
            this.selectedCatalog = catalog;
            this.receiveResources(catalog)
        },

        async showItem(item) {
            this.$root.$emit('showBusyIndicator', true);
            this.$root.$emit('showBusyIndicator', false);
            this.$refs.resourceDetailsDialog.showResource(item);
        },

        async showContract(item) {
            this.$root.$emit('showBusyIndicator', true);
            this.$root.$emit('showBusyIndicator', false);
            this.$refs.resourceDetailsDialog.showResource(item);
        }
    },
};
