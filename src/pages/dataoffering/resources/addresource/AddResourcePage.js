import dataUtils from "../../../../utils/dataUtils";
import ResourceMetaDataPage from "./metadata/ResourceMetaDataPage.vue";
import ResourcePolicyPage from "./policy/ResourcePolicyPage.vue";
import ResourceRepresentationPage from "./representation/ResourceRepresentationPage.vue";
import ResourceBrokersPage from "./brokers/ResourceBrokersPage.vue";
import errorUtils from "../../../../utils/errorUtils";

export default {
    components: {
        ResourceMetaDataPage,
        ResourcePolicyPage,
        ResourceRepresentationPage,
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
                this.$refs.brokersPage.loadResource(this.$data.currentResource);
            }
            this.$data.active_tab = 0;
        },
        setReadOnly(readonly) {
            this.$data.readonly = readonly;
            this.$refs.metaDataPage.readonly = readonly;
            this.$refs.policyPage.readonly = readonly;
            this.$refs.representationPage.readonly = readonly;
            this.$refs.brokersPage.readonly = readonly;
        },
        async save() {
            var genericEndpoint = null;
            if (this.$refs.representationPage.selected.length > 0) {
                genericEndpoint = this.$refs.representationPage.selected[0];
            }
            var title = this.$refs.metaDataPage.title;
            var description = this.$refs.metaDataPage.description;
            var language = this.$refs.metaDataPage.language;
            var paymentMethod = this.$refs.metaDataPage.paymentMethod;
            var keywords = dataUtils.commaSeperatedStringToArray(this.$refs.metaDataPage.keywords);
            var standardlicense = this.$refs.metaDataPage.standardlicense;
            var publisher = this.$refs.metaDataPage.publisher;
            var policyDescriptions = this.$refs.policyPage.getDescriptions();
            var filetype = this.$refs.representationPage.filetype;
            var brokerList = this.$refs.brokersPage.getSelectedBrokerList()
            let brokerDeleteList = this.$refs.brokersPage.getBrokerDeleteList();

            if (this.fromRoutePage == 'true') {
                // On route page this data is initially stored only in the node and will be saved with the route.
                this.$emit("saved", title, description, language, paymentMethod, keywords, 0, standardlicense, publisher,
                    policyDescriptions, filetype, 0, brokerList);
            } else {
                this.$root.$emit('showBusyIndicator', true);
                if (this.$data.currentResource == null) {
                    await dataUtils.createResourceWithMinimalRoute(title, description, language, paymentMethod, keywords, standardlicense, publisher,
                        policyDescriptions, filetype, brokerList, genericEndpoint);
                    this.$router.push('idresourcesoffering');
                    this.$root.$emit('showBusyIndicator', false);
                } else {
                    await dataUtils.editResource(this.$data.currentResource.id, this.$data.currentResource.representationId,
                        title, description, language, paymentMethod, keywords, standardlicense, publisher, policyDescriptions,
                        filetype, brokerList, brokerDeleteList, genericEndpoint, this.$data.currentResource.ruleId,
                        this.$data.currentResource.artifactId);
                    this.$router.push('idresourcesoffering');
                    this.$root.$emit('showBusyIndicator', false);
                }
            }
        }
    },
};
