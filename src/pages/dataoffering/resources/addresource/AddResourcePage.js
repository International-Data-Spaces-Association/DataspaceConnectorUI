import dataUtils from "../../../../utils/dataUtils";
import ResourceMetaDataPage from "./metadata/ResourceMetaDataPage.vue";
import ResourcePolicyPage from "./policy/ResourcePolicyPage.vue";
import ResourceRepresentationPage from "./representation/ResourceRepresentationPage.vue";
import ResourceBrokersPage from "./brokers/ResourceBrokersPage.vue";
import ResourceCatalogsPage from "./catalog/ResourceCatalogsPage.vue";
import errorUtils from "../../../../utils/errorUtils";

export default {
    components: {
        ResourceMetaDataPage,
        ResourcePolicyPage,
        ResourceRepresentationPage,
        ResourceCatalogsPage,
        ResourceBrokersPage
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
            hideBrokers: false
        };
    },
    mounted: function () {
        if (this.$route.query.id === undefined) {
            this.$data.currentResource = null;
            this.$data.isNewResource = true;
        } else {
            this.loadResource(this.$route.query.id);
        }
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
            if (this.$data.active_tab == 1) {
                if (this.$refs.policyPage !== undefined) {
                    this.$refs.policyPage.gotVisible();
                }
            } else if (this.$data.active_tab == 2) {
                if (this.$refs.representationPage !== undefined) {
                    this.$refs.representationPage.gotVisible();
                }
            } else if (this.$data.active_tab == 3) {
                if (this.$refs.catalogsPage !== undefined) {
                    this.$refs.catalogsPage.gotVisible();
                }
            } else if (this.$data.active_tab == 4) {
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
                let response = await dataUtils.getResource(id);
                this.$data.currentResource = response;
                this.$data.isNewResource = false;
                this.$refs.metaDataPage.loadResource(this.$data.currentResource, this.$data.onlyMetaData);
                this.$refs.policyPage.loadResource(this.$data.currentResource);
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
                let response = await dataUtils.getRequestedResource(id);
                this.$data.currentResource = response;
                this.$data.isNewResource = false;
                this.$refs.metaDataPage.loadResource(this.$data.currentResource, this.$data.onlyMetaData);
                await this.$refs.policyPage.loadRequestedResource(this.$data.currentResource);
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
            if (!onlyMetaData) {
                this.$refs.policyPage.loadResource(this.$data.currentResource);
                this.$refs.representationPage.loadResource(this.$data.currentResource, false);
                this.$refs.catalogsPage.loadResource(this.$data.currentResource);
                this.$refs.brokersPage.loadResource(this.$data.currentResource);
            }
            this.$data.active_tab = 0;
        },
        setReadOnly(readonly) {
            this.$data.readonly = readonly;
            this.$refs.metaDataPage.readonly = readonly;
            this.$refs.policyPage.readonly = readonly;
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
            let standardlicense = this.$refs.metaDataPage.standardlicense;
            let publisher = this.$refs.metaDataPage.publisher;
            let samples = this.$refs.metaDataPage.samples;
            let policyDescriptions = this.$refs.policyPage.getDescriptions();
            let contractPeriodFromValue = this.$refs.policyPage.getContractPeriodFromValue();
            let contractPeriodToValue = this.$refs.policyPage.getContractPeriodToValue();
            let fileData = this.$refs.representationPage.fileData;
            let filetype = this.$refs.representationPage.filetype;
            let brokerList = this.$refs.brokersPage.getSelectedBrokerList()
            let brokerDeleteList = this.$refs.brokersPage.getBrokerDeleteList();
            let catalogIds = this.$refs.catalogsPage.getSelectedCatalogsList();
            let deletedCatalogIds = this.$refs.catalogsPage.getCatalogsDeleteList();

            if (this.fromRoutePage == 'true') {
                // On route page this data is initially stored only in the node and will be saved with the route.
                this.$emit("saved", catalogIds, title, description, language, paymentMethod, keywords, 0, standardlicense, publisher,
                    policyDescriptions, contractPeriodFromValue, contractPeriodToValue, filetype, 0, brokerList);
            } else {
                this.$root.$emit('showBusyIndicator', true);
                this.$root.$emit('blockNavigationMenu', true);
                if (this.$data.currentResource == null) {
                    await dataUtils.createResourceAndUpdateAtBroker(catalogIds, title, description, language, paymentMethod, keywords, standardlicense, publisher,
                        policyDescriptions, contractPeriodFromValue, contractPeriodToValue, filetype, brokerList, fileData);
                    this.$router.push('idsresourcesoffering');
                    this.$root.$emit('showBusyIndicator', false);
                    this.$root.$emit('blockNavigationMenu', false);
                } else {
                    await dataUtils.editResource(this.$data.currentResource.id, this.$data.currentResource.representationId, catalogIds, deletedCatalogIds,
                        title, description, language, paymentMethod, keywords, standardlicense, publisher, samples, policyDescriptions, contractPeriodFromValue,
                        contractPeriodToValue, filetype, brokerList, brokerDeleteList, fileData, this.$data.currentResource.ruleId,
                        this.$data.currentResource.artifactId);
                    this.$router.push('idsresourcesoffering');
                    this.$root.$emit('showBusyIndicator', false);
                    this.$root.$emit('blockNavigationMenu', false);
                }
            }
        }
    },
};
