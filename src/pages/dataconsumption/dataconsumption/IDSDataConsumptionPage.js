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
            idsResourceCatalog: {},
            selectedResource: {},
            selectedRepresentations: [],
            selectedRepresentation: {},
            selectedArtifacts: [],
            selectedIdsArtifact: {},
            idsContractOffer: {},
            requestContractResponse: {},
            dialog: false,
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
            headersArtifacts: [{
                text: 'Creation date',
                value: 'ids:creationDate.@value',
                width: 135
            },
            {
                text: 'File Name',
                value: 'ids:fileName'
            },
            {
                text: 'Byte Size',
                value: 'ids:byteSize'
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

        selectCatalog(catalogId) {
            this.selectedCatalog = catalogId;
            this.receiveResources(catalogId)
            this.getIdsResourceCatalog(catalogId)
        },

        async getIdsResourceCatalog(catalogId) {
            try {
                this.$data.idsResourceCatalog = await dataUtils.receiveIdsResourceCatalog(this.$data.recipientId, catalogId);
            } catch (error) {
                errorUtils.showError(error, "Receive Resources in Catalog");
            }
        },

        async showItem(item) {
            this.$root.$emit('showBusyIndicator', true);
            this.$root.$emit('showBusyIndicator', false);
            this.$refs.resourceDetailsDialog.showResource(item);
        },

/*         async getContractOffer(artifact) {
            this.$root.$emit('showBusyIndicator', true);
            this.$root.$emit('showBusyIndicator', false);
            try{
                this.$data.selectedIdsArtifact = await dataUtils.receiveIdsArtifact(this.$data.recipientId, artifact["@id"])
            } catch (error) {
                errorUtils.showError(error, "Receive Artifact");
            }

            try{
                this.$data.idsContractOffer = await dataUtils.receiveIdsContractOffer(this.$data.recipientId, artifact["@id"])
            } catch (error) {
                errorUtils.showError(error, "Receive Contract Offer");
            }
        }, */

/*         showContract(artifact) {
            this.$data.selectedResource["ids:contractOffer"][0];
        }, */

        async requestContract(){
            let download = "false";
            try {
                this.$data.requestContractResponse = await dataUtils.receiveContract(this.$data.recipientId, 
                    this.$data.selectedResource["@id"], this.$data.selectedResource["ids:contractOffer"], this.$data.selectedIdsArtifact, download);
            } catch (error) {
                errorUtils.showError(error, "Receive Contract");
            }
        },

        showRepresentations(item) {

            this.$data.idsResourceCatalog["ids:offeredResource"].forEach(element => {
                if ( element["@id"].substring(element["@id"].lastIndexOf("/"), element["@id"].length) == item.id ) {
                    this.$data.selectedRepresentations = element["ids:representation"];
                    this.$data.selectedResource = element;
                }
            }); 

        },

        selectRepresentation(representation) {
            this.$data.selectedRepresentation = representation;
            this.getArtifacts(representation);
        },

        getArtifacts(representation) {
            this.$data.selectedArtifacts = representation["ids:instance"];
        },

        clickAcceptContract(artifact) {
            this.$data.selectedIdsArtifact = artifact;
            this.requestContract();
        }

    }
};
