import Axios from "axios";
import dataUtils from "../../../../utils/dataUtils";
import ResourceMetaDataPage from "./metadata/ResourceMetaDataPage.vue";
import ResourcePolicyPage from "./policy/ResourcePolicyPage.vue";
import ResourceRepresentationPage from "./representation/ResourceRepresentationPage.vue";
import ResourceBrokersPage from "./brokers/ResourceBrokersPage.vue";

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
            currentNode: null,
            active_tab: 0,
            resourceAttributes: null,
            resourceRequiredAttributes: null,
            representationAttributes: null,
            representationRequiredAttributes: null,
            fileAttributes: null,
            fileRequiredAttributes: null
        };
    },
    mounted: function () {
        if (this.fromRoutePage || this.$route.query.id === undefined) {
            this.$data.currentResource = null;
        } else {
            this.loadResource(this.$route.query.id);
        }
        this.$data.currentNode = null;
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
            console.log(this.$refs.pagestab, this.$data.active_tab);
            if (this.$data.active_tab == 1) {
                if (this.$refs.policyPage !== undefined) {
                    this.$refs.policyPage.gotVisible();
                }
            } else if (this.$data.active_tab == 2) {
                if (this.$refs.representationPage !== undefined) {
                    this.$refs.representationPage.gotVisible();
                }
            }
        },
        loadResource(id) {
            this.$root.$emit('showBusyIndicator', true);
            Axios.get("http://localhost:80/resource?resourceId=" + id).then(response => {
                this.$data.currentResource = response.data;
                this.$refs.metaDataPage.loadResource(this.$data.currentResource);
                this.$root.$emit('showBusyIndicator', false);
                this.$forceUpdate();
            }).catch(error => {
                console.log("Error in loadResource(): ", error);
                this.$root.$emit('showBusyIndicator', false);
            });
        },
        set(node) {
            this.$data.currentNode = node;
            this.$refs.metaDataPage.set(node);
            this.$data.active_tab = 0;
        },
        save() {
            var endpointId = null;
            if (this.$refs.representationPage.selected.length > 0) {
                endpointId = this.$refs.representationPage.selected[0].id;
            }
            var title = this.$refs.metaDataPage.title;
            var description = this.$refs.metaDataPage.description;
            var language = this.$refs.metaDataPage.language;
            var keywords = this.$refs.metaDataPage.keywords;
            var version = this.$refs.metaDataPage.version;
            var standardlicense = this.$refs.metaDataPage.standardlicense;
            var publisher = this.$refs.metaDataPage.publisher;
            var contractJson = "";
            if (this.$refs.policyPage !== undefined) {
                contractJson = this.$refs.policyPage.contractJson;
            } else if (this.$data.currentResource != null) {
                contractJson = this.$data.currentResource["ids:contractOffer"][0];
            }
            var sourceType = this.$refs.representationPage.sourceType;
            var brokerList = [];
            for (let brokerItem of this.$refs.brokersPage.selected) {
                brokerList.push(brokerItem.url);
            }

            console.log(">>> brokerList: ", brokerList);

            if (this.fromRoutePage == 'true') {
                // On route page this data is initially stored only in the node and will be saved with the route.
                this.$emit("saved", title, description, language, keywords, version, standardlicense, publisher, contractJson, sourceType, brokerList);
            } else {
                this.$root.$emit('showBusyIndicator', true);
                if (this.$data.currentResource == null) {
                    dataUtils.createResource(title, description, language, keywords, version, standardlicense, publisher, contractJson, sourceType, brokerList, endpointId, () => {
                        this.$router.push('idresourcesoffering');
                        this.$root.$emit('showBusyIndicator', false);
                    });
                } else {
                    // TODO EDIT RESOURCE
                    // let params = "?resourceId=" + this.$data.currentResource["@id"] + "&title=" + title +
                    //     "&description=" + description + "&language=" + language + "&keyword=" + keyword + "&version=" + version +
                    //     "&standardlicense=" + standardlicense + "&publisher=" + publisher;
                    // Axios.put("http://localhost:80/resource" + params, contractJson).then(() => {
                    //     this.$router.push('idresourcesoffering');
                    //     this.$root.$emit('showBusyIndicator', false);
                    // }).catch(error => {
                    //     console.log("Error in saveResource(): ", error);
                    //     this.$root.$emit('showBusyIndicator', false);
                    // });
                }
            }
        },
        async getResourceAttributes() {
            this.$data.resourceAttributes = (
                await Axios.get("http://localhost:80/attributes?type=resource")
            ).data;
            for (let att of this.$data.resourceAttributes) {
                if (att[2] == "true") {
                    this.$data.resourceRequiredAttributes[
                        this.$data.resourceRequiredAttributes.length
                    ] = att;
                }
            }
            this.attributesReceived();
        },
        async getRepresentationAttributes() {
            this.$data.representationAttributes = (
                await Axios.get("http://localhost:80/attributes?type=representation")
            ).data;
            for (let att of this.$data.representationAttributes) {
                if (att[2]) {
                    this.$data.representationRequiredAttributes[
                        this.$data.representationRequiredAttributes.length
                    ] = att;
                }
            }
            this.attributesReceived();
        },
        async getFileAttributes() {
            this.$data.fileAttributes = (
                await Axios.get("http://localhost:80/attributes?type=file")
            ).data;
            for (let att of this.$data.fileAttributes) {
                if (att[2]) {
                    this.$data.fileRequiredAttributes[
                        this.$data.fileRequiredAttributes.length
                    ] = att;
                }
            }
            this.attributesReceived();
        },
        attributesReceived() {
            if (
                this.$data.resourceAttributes != null &&
                this.$data.representationAttributes != null &&
                this.$data.fileAttributes != null
            ) {
                this.$forceUpdate();
            }
        },
        async postResource(resource) {
            this.$data.alldata = [];
            const response = (
                await Axios.post("http://localhost:80/resource", resource)
            ).data;
            console.log("RESPONSE: ", response);
        },
    },
};
