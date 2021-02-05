import AddResourceFilePage from "@/pages/dataoffering/resources/addresource/file/AddResourceFilePage.vue";
import AddResourceDatabasePage from "@/pages/dataoffering/resources/addresource/database/AddResourceDatabasePage.vue";
import AddBackendConnectionDialog from "@/pages/dataoffering/backendconnections/dialog/AddBackendConnectionDialog.vue";
import dataUtils from "@/utils/dataUtils";

export default {
    components: {
        AddResourceFilePage,
        AddResourceDatabasePage,
        AddBackendConnectionDialog
    },
    props: ['fromRoutePage'],
    data() {
        return {
            search: '',
            headers: [{
                text: 'URL',
                value: 'url'
            }],
            backendConnections: [],
            sourceType: "",
            sourceTypeItems: [],
            selected: [],
            valid: false,
            defaultRule: [
                v => !!v || 'This data is required'
            ],
            allValid: false
        };
    },
    watch: {
        valid: function () {
            this.$data.allValid = this.$data.valid && (this.fromRoutePage == 'true' || this.$data.selected.length > 0);
        },
        selected: function () {
            this.$data.allValid = this.$data.valid && (this.fromRoutePage == 'true' || this.$data.selected.length > 0);
        }
    },
    mounted: function () {
        this.getBackendConnections();
        this.loadSourceTypes();
    },
    methods: {
        gotVisible() {
            this.getBackendConnections();
        },
        async loadSourceTypes() {
            dataUtils.getSourceTypes(sourceTypes => {
                this.$data.sourceTypeItems = sourceTypes;
            });
        },
        previousPage() {
            this.$emit('previousPage')
        },
        save() {
            this.$emit('save')
        },
        backendConnectionSaved() {
            this.getBackendConnections();
        },
        getBackendConnections() {
            dataUtils.getBackendConnections(backendConnections => {
                this.$data.backendConnections = backendConnections;

                if (this.$parent.$parent.$parent.$parent.currentResource != null) {
                    this.loadResource(this.$parent.$parent.$parent.$parent.currentResource);
                }

                if (this.$parent.$parent.$parent.$parent.currentNode != null) {
                    this.set(this.$parent.$parent.$parent.$parent.currentNode);
                }

                this.$forceUpdate();
                this.$root.$emit('showBusyIndicator', false);
            });
        },
        loadResource(resource) {
            if (resource["ids:representation"] !== undefined && resource["ids:representation"].length > 0) {
                this.$data.sourceType = resource["ids:representation"][0]["ids:sourceType"];
            }
            this.$data.selected = [];
            for (var backendConnection of this.$data.backendConnections) {
                for (var res of backendConnection.appRouteOutput) {
                    if (res["@id"] == resource["@id"]) {
                        this.$data.selected.push(backendConnection);
                    }
                }
            }
        },
        set(node) {
            if (node.sourceType === undefined) {
                this.$refs.form.reset();
            } else {
                this.$data.sourceType = node.sourceType;
            }
            // TODO this.$data.brokerList = brokerList;
        }
    }
};
