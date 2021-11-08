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
            selectedCatalog: "",
            catalogs: [],
            resources: [],
            filteredResources: [],
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
            this.$data.selectedCatalog = "";
            this.$data.catalogs = [];
            this.$data.resources = [];
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
                let receivedCatalogs = await dataUtils.receiveCatalogs(this.$data.recipientId);
                this.$data.catalogs = [];
                this.$data.resources = [];
                for (let catalog of receivedCatalogs) {
                    this.$data.catalogs.push(catalog);
                    await this.receiveResources(catalog);
                }
            } catch (error) {
                errorUtils.showError(error, "Request Catalogs");
            }
            this.$data.selectedResource = {};
            this.$data.selectedRepresentations = [];
            this.$data.selectedRepresentation = {};
            this.$data.selectedArtifacts = [];
            this.$data.selectedIdsArtifact = {};
            this.$data.idsContractOffer = {};
            this.$data.requestContractResponse = {};
            this.$data.downloadLink = "";
            this.$root.$emit('showBusyIndicator', false);
        },

        async receiveResources(catalogID) {
            try {
                let resources = await dataUtils.receiveResourcesInCatalog(this.$data.recipientId, catalogID);
                for (let resource of resources) {
                    this.$data.resources.push(resource);
                }
            } catch (error) {
                errorUtils.showError(error, "Request Resources in Catalog");
            }
        },

        async showItem(item) {
            this.$root.$emit('showBusyIndicator', true);
            this.$root.$emit('showBusyIndicator', false);
            this.$refs.resourceDetailsDialog.showResource(item);
        },

        async requestContract() {
            let download = "false";
            try {
                this.$data.requestContractResponse = await dataUtils.receiveContract(this.$data.recipientId,
                    this.$data.selectedResource["@id"], this.$data.selectedResource["ids:contractOffer"], this.$data.selectedIdsArtifact, download);
                let agreementId = await dataUtils.getIdOfAgreement(this.$data.requestContractResponse._links.artifacts.href);
                this.$data.downloadLink = (await dataUtils.getAgreementArtifacts(agreementId))[0]._links.data.href;
                this.$vuetify.goTo(".data-consumption-page-bottom");
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
            this.$data.resources.forEach(element => {
                if (element.id == item.id) {
                    let idsResource = element.idsResource;
                    this.$data.selectedRepresentations = [];
                    for (let representation of idsResource["ids:representation"]) {
                        if (representation["ids:title"] !== undefined && representation["ids:title"].length > 0) {
                            representation.display = representation["ids:title"];
                        } else {
                            representation.display = representation["@id"];
                        }
                        this.$data.selectedRepresentations.push(representation);
                    }
                    this.$data.selectedResource = idsResource;
                    for (let ruleJson of this.$data.selectedResource["ids:contractOffer"][0]["ids:permission"]) {
                        let ruleDescription = ruleJson["ids:description"][0]["@value"];
                        let ruleName = dataUtils.convertDescriptionToPolicyName(ruleDescription);
                        ruleJson.type = dataUtils.convertPolicyNameToType(ruleName);
                    }
                }
            });
            this.$data.selectedRepresentation = {};
            this.$data.selectedArtifacts = [];
            this.$data.selectedIdsArtifact = {};
            this.$data.idsContractOffer = {};
            this.$data.requestContractResponse = {};
            this.$data.downloadLink = "";
            this.$vuetify.goTo(".data-consumption-page-bottom");
        },


        selectRepresentation(representation) {
            this.$data.selectedRepresentation = representation;
            this.getArtifacts(representation);
            this.$vuetify.goTo(".data-consumption-page-bottom");
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
