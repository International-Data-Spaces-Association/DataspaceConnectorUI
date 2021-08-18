import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";
import validationUtils from "@/utils/validationUtils";
import ResourceDetailsDialog from "@/pages/dataoffering/resources/resourcedetailsdialog/ResourceDetailsDialog.vue";
import PolicyLine from "@/components/policy/PolicyLine.vue";


export default {
    components: {
        ResourceDetailsDialog,
        PolicyLine
    },
    data() {
        return {
            recipientId: "",
            receivedCatalogs: [],
            noCatalogsFound: false,
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
            downloadLink: "",
            dialog: false,
            valid: false,
            providerUrlRule: validationUtils.getUrlRequiredRule(),
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
        clear() {
            this.$data.receivedCatalogs = [];
            this.$data.noCatalogsFound = false;
            this.$data.selectedCatalog = "";
            this.$data.resourcesInSelectedCatalog = [];
            this.$data.idsResourceCatalog = {};
            this.$data.selectedResource = {};
            this.$data.selectedRepresentations = [];
            this.$data.selectedRepresentation = {};
            this.$data.selectedArtifacts = [];
            this.$data.selectedIdsArtifact = {};
            this.$data.idsContractOffer = {};
            this.$data.requestContractResponse = {};
            this.$data.downloadLink = "";
        },
        async receiveCatalogs() {
            this.$root.$emit('showBusyIndicator', true);
            this.clear();
            try {
                this.$data.receivedCatalogs = await dataUtils.receiveCatalogs(this.$data.recipientId);
            } catch (error) {
                errorUtils.showError(error, "Request Catalogs");
            }
            this.$data.noCatalogsFound = this.$data.receivedCatalogs.length == 0;
            this.$root.$emit('showBusyIndicator', false);
        },

        async receiveResources(catalogID) {
            this.$root.$emit('showBusyIndicator', true);
            try {
                this.$data.resourcesInSelectedCatalog = await dataUtils.receiveResourcesInCatalog(this.$data.recipientId, catalogID);
            } catch (error) {
                errorUtils.showError(error, "Request Resources in Catalog");
            }
            this.$root.$emit('showBusyIndicator', false);
        },

        async selectCatalog(catalogId) {
            this.selectedCatalog = catalogId;
            await this.receiveResources(catalogId);
            await this.getIdsResourceCatalog(catalogId);
        },

        async getIdsResourceCatalog(catalogId) {
            try {
                this.$data.idsResourceCatalog = await dataUtils.receiveIdsResourceCatalog(this.$data.recipientId, catalogId);
            } catch (error) {
                errorUtils.showError(error, "Request Resources in Catalog");
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
                        errorUtils.showError(error, "Request Artifact");
                    }
        
                    try{
                        this.$data.idsContractOffer = await dataUtils.receiveIdsContractOffer(this.$data.recipientId, artifact["@id"])
                    } catch (error) {
                        errorUtils.showError(error, "Request Contract Offer");
                    }
                }, */

        /*         showContract(artifact) {
                    this.$data.selectedResource["ids:contractOffer"][0];
                }, */

        async requestContract() {
            let download = "false";
            try {
                this.$data.requestContractResponse = await dataUtils.receiveContract(this.$data.recipientId,
                    this.$data.selectedResource["@id"], this.$data.selectedResource["ids:contractOffer"], this.$data.selectedIdsArtifact, download);
                let agreementId = await dataUtils.getIdOfAgreement(this.$data.requestContractResponse._links.artifacts.href);
                this.$data.downloadLink = (await dataUtils.getAgreementArtifacts(agreementId))[0]._links.data.href;
            } catch (error) {
                errorUtils.showError(error, "Request Contract");
            }
        },

        async subscribeToResource() {
            try {
                this.$data.subscribeToResourceResponse = await dataUtils.subscribeToResource(this.$data.recipientId, this.$data.selectedResource["@id"]);
            } catch (error) {
                errorUtils.showError(error, "subscribe to Resource");
            }
        },

        showRepresentations(item) {

            this.$data.idsResourceCatalog["ids:offeredResource"].forEach(element => {
                if (element["@id"].substring(element["@id"].lastIndexOf("/"), element["@id"].length) == item.id) {
                    this.$data.selectedRepresentations = element["ids:representation"];
                    this.$data.selectedResource = element;
                    for (let ruleJson of this.$data.selectedResource["ids:contractOffer"][0]["ids:permission"]) {
                        let ruleDescription = ruleJson["ids:description"][0]["@value"];
                        let ruleName = dataUtils.convertDescriptionToPolicyName(ruleDescription);
                        ruleJson.type = dataUtils.convertPolicyNameToType(ruleName);
                    }
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
            this.subscribeToResource();
        }

    }
};
