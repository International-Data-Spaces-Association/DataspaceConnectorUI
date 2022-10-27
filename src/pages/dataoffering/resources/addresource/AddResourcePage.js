import dataUtils from "../../../../utils/dataUtils";
import ResourceMetaDataPage from "./metadata/ResourceMetaDataPage.vue";
import ResourceOntologyPage from "./ontology/ResourceOntologyPage.vue";
import ResourcePolicyPage from "./policy/ResourcePolicyPage.vue";
import ResourceRepresentationPage from "./representation/ResourceRepresentationPage.vue";
import ResourceBrokersPage from "./brokers/ResourceBrokersPage.vue";
import ResourceCatalogsPage from "./catalog/ResourceCatalogsPage.vue";
import PolicyTab from "./policyTab/PolicyTab.vue";
import errorUtils from "../../../../utils/errorUtils";

export default {
    components: {
        ResourceMetaDataPage,
        ResourceOntologyPage,
        ResourcePolicyPage,
        ResourceRepresentationPage,
        ResourceCatalogsPage,
        ResourceBrokersPage,
        PolicyTab
    },
    props: ['fromRoutePage'],
    data() {
        return {
            currentResource: null,
            isNewResource: false,
            active_tab: 0,
            resourceAttributes: null,
            resourceRequiredAttributes: null,
            representationAttributes: null,
            representationRequiredAttributes: null,
            fileAttributes: null,
            fileRequiredAttributes: null,
            readonly: false,
            onlyMetaData: false,
            hideBrokers: false,
            displayOntologyPage: false
        };
    },
    mounted: function () {
        if (this.$route.query.id === undefined) {
            this.$data.currentResource = null;
            this.$data.isNewResource = true;
        } else {
            this.loadResource(this.$route.query.id);
        }

        //Check, if the ontology page shall be shown
        dataUtils.getOntology().then(ontology => {
            if ((Array.isArray(ontology.select) && ontology.select.length > 0) || (Array.isArray(ontology.text) && ontology.text.length > 0)) {
                this.$data.displayOntologyPage = true;
            }
        });
    },
    methods: {
        previousPage() {
            this.$data.active_tab--;
            this.tabChanged();
        },

        nextPage() {
            this.$data.active_tab++;
            this.tabChanged();
        },
        tabChanged() {
            if (this.$data.active_tab === 1) {
                if (this.$data.displayOntologyPage === true) {
                    this.$refs.ontologyPage.gotVisible();
                }
            } else if (this.$data.active_tab === 2) {
                if (this.$refs.policyTab !== undefined) {
                    this.$refs.policyTab.gotVisible();
                }
            } else if (this.$data.active_tab === 3) {
                if (this.$refs.representationPage !== undefined) {
                    this.$refs.representationPage.gotVisible();
                }
            } else if (this.$data.active_tab === 4) {
                if (this.$refs.catalogsPage !== undefined) {
                    this.$refs.catalogsPage.gotVisible();
                }
            } else if (this.$data.active_tab === 5) {
                if (this.$refs.brokersPage !== undefined) {
                    this.$refs.brokersPage.gotVisible();
                }
            }
        },
        async loadResource(id) {
            this.$data.onlyMetaData = false;
            this.$data.hideBrokers = false;
            this.$data.active_tab = 0;
            this.$root.$emit('showBusyIndicator', true);
            try {
                this.$data.currentResource = await dataUtils.getResource(id);
                this.$data.isNewResource = false;
                this.$refs.metaDataPage.loadResource(this.$data.currentResource, this.$data.onlyMetaData);
                if (this.$data.displayOntologyPage === true) {
                    this.$refs.ontologyPage.loadResource(this.$data.currentResource);
                }
                this.$refs.policyTab.loadResource(this.$data.currentResource);
                this.$refs.representationPage.loadResource(this.$data.currentResource, false);
                this.$refs.catalogsPage.loadResource(this.$data.currentResource);
                this.$refs.brokersPage.loadResource(this.$data.currentResource);
            } catch (error) {
                errorUtils.showError(error, "Get resource");
            }
            this.$root.$emit('showBusyIndicator', false);
            this.$forceUpdate();
        },
        async loadRequestedResource(id) {
            this.$data.onlyMetaData = false;
            this.$data.hideBrokers = true;
            this.$data.active_tab = 0;
            this.$root.$emit('showBusyIndicator', true);
            try {
                this.$data.currentResource = await dataUtils.getRequestedResource(id);
                this.$data.isNewResource = false;
                this.$refs.metaDataPage.loadResource(this.$data.currentResource, this.$data.onlyMetaData);
                if (this.$data.displayOntologyPage === true) {
                    this.$refs.ontologyPage.loadResource(this.$data.currentResource, this.$data.onlyMetaData);
                }
                await this.$refs.policyTab.loadRequestedResource(this.$data.currentResource);
                this.$refs.representationPage.loadResource(this.$data.currentResource, true);
                this.$refs.catalogsPage.loadResource(this.$data.currentResource);
                this.$refs.brokersPage.loadResource(this.$data.currentResource);
            } catch (error) {
                errorUtils.showError(error, "Get resource");
            }
            this.$root.$emit('showBusyIndicator', false);
            this.$forceUpdate();
        },
        set(resource, onlyMetaData) {
            this.$data.currentResource = resource;
            this.$data.onlyMetaData = onlyMetaData;
            this.$data.isNewResource = false;
            this.$refs.metaDataPage.loadResource(this.$data.currentResource, this.$data.onlyMetaData);
            if (this.$data.displayOntologyPage === true) {
                this.$refs.ontologyPage.loadResource(this.$data.currentResource, this.$data.onlyMetaData);
            }
            if (!onlyMetaData) {
                this.$refs.policyTab.loadResource(this.$data.currentResource);
                this.$refs.representationPage.loadResource(this.$data.currentResource, false);
                this.$refs.catalogsPage.loadResource(this.$data.currentResource);
                this.$refs.brokersPage.loadResource(this.$data.currentResource);
            }
            this.$data.active_tab = 0;
        },
        setReadOnly(readonly) {
            this.$data.readonly = readonly;
            this.$refs.metaDataPage.readonly = readonly;
            if (this.$data.displayOntologyPage === true) {
                this.$refs.ontologyPage.readonly = readonly;
            }
            this.$refs.policyTab.readonly = readonly;
            this.$refs.representationPage.readonly = readonly;
            this.$refs.catalogsPage.readonly = readonly;
            this.$refs.brokersPage.readonly = readonly;
        },
        async save() {
            let title = this.$refs.metaDataPage.title;
            let description = this.$refs.metaDataPage.description;
            let language = this.$refs.metaDataPage.language;
            let paymentMethod = this.$refs.metaDataPage.paymentMethod;
            let keywords = dataUtils.commaSeperatedStringToArray(this.$refs.metaDataPage.keywords);
            let standardLicense = this.$refs.metaDataPage.standardLicense;
            let endpointDocumentation = this.$refs.metaDataPage.endpointDocumentation;
            let publisher = this.$refs.metaDataPage.publisher;
            let samples = this.$refs.metaDataPage.samples;
            let additionalFields = {};
            if (this.$data.displayOntologyPage === true) {
                additionalFields = this.$refs.ontologyPage.formValues;
            }
            let templateTitle = this.$refs.policyTab.getTemplateTitle();
            let policyDescriptions = this.$refs.policyTab.getDescriptions();
            let contractPeriodFromValue = this.$refs.policyTab.getContractPeriodFromValue();
            let contractPeriodToValue = this.$refs.policyTab.getContractPeriodToValue();
            let file = null;
            let genericEndpoint = null;
            if (this.$refs.representationPage.isLocal()) {
                file = this.$refs.representationPage.file;
            } else {
                if (this.$refs.representationPage.selected.length > 0) {
                    genericEndpoint = this.$refs.representationPage.selected[0];
                }
            }
            let filetype = this.$refs.representationPage.filetype;
            let brokerList = this.$refs.brokersPage.getSelectedBrokerList()
            let brokerDeleteList = this.$refs.brokersPage.getBrokerDeleteList();
            let catalogIds = this.$refs.catalogsPage.getSelectedCatalogsList();
            let deletedCatalogIds = this.$refs.catalogsPage.getCatalogsDeleteList();

            if (this.fromRoutePage === 'true') {
                // On route page this data is initially stored only in the node and will be saved with the route.
                this.$emit("saved", catalogIds, title, description, language, paymentMethod, keywords, 0, standardLicense, publisher, templateTitle,
                    policyDescriptions, contractPeriodFromValue, contractPeriodToValue, filetype, 0, brokerList, endpointDocumentation);
            } else {
                this.$root.$emit('showBusyIndicator', true);
                this.$root.$emit('blockNavigationMenu', true);
                if (this.$data.currentResource == null) {
                    await dataUtils.createResourceWithMinimalRoute(catalogIds, title, description, language, paymentMethod, keywords, standardLicense, publisher,
                        templateTitle, policyDescriptions, contractPeriodFromValue, contractPeriodToValue, filetype, brokerList, file, genericEndpoint, additionalFields, endpointDocumentation);
                    await this.$router.push('idsresourcesoffering');
                    this.$root.$emit('showBusyIndicator', false);
                    this.$root.$emit('blockNavigationMenu', false);
                } else {
                    await dataUtils.editResource(this.$data.currentResource.id, this.$data.currentResource.representationId, catalogIds, deletedCatalogIds,
                        title, description, language, paymentMethod, keywords, standardLicense, publisher, samples, templateTitle, policyDescriptions, contractPeriodFromValue,
                        contractPeriodToValue, filetype, brokerList, brokerDeleteList, file, genericEndpoint, this.$data.currentResource.ruleId,
                        this.$data.currentResource.artifactId, additionalFields, endpointDocumentation);
                    this.$router.push('idsresourcesoffering');
                    this.$root.$emit('showBusyIndicator', false);
                    this.$root.$emit('blockNavigationMenu', false);
                }
            }
        }
    },
};
