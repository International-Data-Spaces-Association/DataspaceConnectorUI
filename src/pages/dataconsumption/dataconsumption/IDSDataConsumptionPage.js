import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";
import validationUtils from "@/utils/validationUtils";
import ResourceDetailsDialog from "@/pages/dataoffering/resources/resourcedetailsdialog/ResourceDetailsDialog.vue";
import ArtifactDialog from "@/pages/dataconsumption/dataconsumption/artifactdialog/ArtifactDialog.vue";
import moment from 'moment'

export default {
    components: {
        ResourceDetailsDialog,
        ArtifactDialog
    },
    data() {
        return {
            active_tab: 0,
            brokerUri: "",
            brokerUris: [],
            search: "",
            recipientId: "",
            selectedCatalog: "",
            searchResult: [],
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
            agreementArtifact: null,
            artifactDialog: false,
            valid: false,
            validSearch: false,
            defaultRule: validationUtils.getRequiredRule(),
            providerUrlRule: validationUtils.getUrlRequiredRule(),
            headersSearch: [{
                text: 'Title / Description / Keywords',
                value: 'title'
            },
            {
                text: 'Connector',
                value: 'accessUrl'
            },
            {
                text: '',
                value: 'actions',
                sortable: false,
                align: 'right'
            }
            ],
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
                value: 'standardLicense'
            }, {
                text: 'Endpoint Documentation',
                value: 'endpointDocumentation'
            }, {
                text: 'Offered from',
                value: 'contractPeriodFromValue'
            }, {
                text: 'Offered until',
                value: 'contractPeriodToValue'
            },
            {
                text: '',
                value: 'actions',
                sortable: false,
                align: 'right',
                width: 100
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
            sortDesc: true,
            routes: [],
            selectedRoutes: []
        };
    },
    mounted: function () {
        this.init();
    },
    methods: {
        momentDiff: function (date,format) {
            return moment(date,format).diff(moment());
        },
        async init() {
            await this.getBrokers();
            await this.getRoutes();
        },
        async getBrokers() {
            this.$root.$emit('showBusyIndicator', true);
            try {
                let response = (await dataUtils.getBrokers())._embedded.brokers;
                this.$data.brokerUris = [];
                for (var broker of response) {
                    this.$data.brokerUris.push(broker.location);
                }
            } catch (error) {
                errorUtils.showError(error, "Get brokers");
            }
            this.$forceUpdate();
            this.$root.$emit('showBusyIndicator', false);

        },
        async getRoutes() {
            this.$root.$emit('showBusyIndicator', true);
            try {
                let response = await dataUtils.getRoutes();
                this.$data.routes = [];
                for (let route of response) {
                    let showInList = false;
                    if (route.deploy == "Camel") {
                        if (route.start === undefined || route.start == null) {
                            showInList = true;
                        }
                    }
                    if (showInList) {
                        this.$data.routes.push({
                            selfLink: route._links.self.href,
                            description: route.description
                        });
                    }
                }
            } catch (error) {
                errorUtils.showError(error, "Get routes");
            }
            this.$root.$emit('showBusyIndicator', false);

        },
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
            this.$data.agreementArtifact = null;
        },
        async searchResources() {
            this.$root.$emit('showBusyIndicator', true);
            this.clear();
            try {
                this.$data.searchResult = await dataUtils.searchResources(this.$data.brokerUri, this.$data.search);
            } catch (error) {
                errorUtils.showError(error, "Request Catalogs");
            }

            this.$root.$emit('showBusyIndicator', false);
        },
        async requestSearchResult(item) {
            this.$root.$emit('showBusyIndicator', true);
            console.trace();
            this.$data.recipientId = item.accessUrl;
            await this.receiveCatalogs();
            let filterdResources = [];
            for (let resource of this.$data.resources) {
                if (resource.id == item.resourceId) {
                    filterdResources.push(resource);
                }
            }
            this.$data.resources = filterdResources;
            this.$data.active_tab = 0;
            this.$root.$emit('showBusyIndicator', false);
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
            this.$data.agreementArtifact = null;
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
                this.$data.agreementArtifact = (await dataUtils.getAgreementArtifacts(agreementId))[0];
                this.$data.downloadLink = this.$data.agreementArtifact._links.data.href;
                this.$vuetify.goTo(".data-consumption-page-bottom");
            } catch (error) {
                errorUtils.showError(error, "Request Contract");
            }
        },

        async subscribeToResource(subscriptionLocation) {
            try {
                this.$data.subscribeToResourceResponse = await dataUtils.subscribeToResource(this.$data.recipientId, this.$data.selectedResource["@id"], subscriptionLocation, true);
            } catch (error) {
                errorUtils.showError(error, "subscribe to Resource");
            }
        },

        async showRepresentations(item) {
            for (let element of this.$data.resources) {
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
                        ruleJson["@context"] = {
                            "xsd": "http://www.w3.org/2001/XMLSchema#",
                            "ids": "https://w3id.org/idsa/core/",
                            "idsc": "https://w3id.org/idsa/code/"
                        };
                        ruleJson.type = await dataUtils.getPolicyNameByPattern(JSON.stringify(ruleJson));
                    }
                }
            }
            this.$data.selectedRepresentation = {};
            this.$data.selectedArtifacts = [];
            this.$data.selectedIdsArtifact = {};
            this.$data.idsContractOffer = {};
            this.$data.requestContractResponse = {};
            this.$data.downloadLink = "";
            this.$data.agreementArtifact = null;
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

        async requestArtifact(item) {
            this.$refs.artifactDialog.show(
                this.$data.selectedResource["ids:contractOffer"][0]["ids:permission"],
                this.$data.selectedResource["ids:standardLicense"]["@id"],
                item,
                this.clickAcceptContract
            );
        },

        clickAcceptContract(artifact, subscribe, subscriptionLocation) {
            this.$data.selectedIdsArtifact = artifact;
            this.requestContract();
            if (subscribe) {
                this.subscribeToResource(subscriptionLocation);
            }
        },
        async dispatchViaRoutes() {
            this.$root.$emit('showBusyIndicator', true);
            let artifactId = dataUtils.getIdOfConnectorResponse(this.$data.agreementArtifact);
            await dataUtils.dispatchViaRoutes(artifactId, this.$data.selectedRoutes);
            this.$root.$emit('showBusyIndicator', false);
        }
    }
};
