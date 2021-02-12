import dataUtils from "@/utils/dataUtils";

export default {
    components: {},
    props: ['fromRoutePage', 'readonly'],
    data() {
        return {
            search: '',
            headers: [{
                text: 'Title',
                value: 'title'
            }, {
                text: 'URL',
                value: 'url'
            }],
            brokers: [],
            sourceType: "",
            sourceTypeItems: [],
            selected: []
        };
    },
    mounted: function () {
        this.getBrokers();
        this.loadSourceTypes();
    },
    methods: {
        gotVisible() {
            this.getBrokers();
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
            this.getBrokers();
        },
        getBrokers() {
            dataUtils.getBrokers(brokers => {
                this.$data.brokers = [];
                for (var broker of brokers) {
                    this.$data.brokers.push({
                        broker: broker,
                        title: broker[1]["title"],
                        url: broker[1]["brokerUri"]
                    });
                }

                this.$forceUpdate();
                this.$root.$emit('showBusyIndicator', false);
            });
        },
        loadResource(resource) {
            console.log(">>> loadResource: ", resource);
            // if (resource["ids:representation"] !== undefined && resource["ids:representation"].length > 0) {
            //     this.$data.sourceType = resource["ids:representation"][0]["ids:sourceType"];
            // }
            // this.$data.selected = [];
            // for (var backendConnection of this.$data.brokers) {
            //     for (var res of backendConnection.appRouteOutput) {
            //         if (res["@id"] == resource["@id"]) {
            //             this.$data.selected.push(backendConnection);
            //         }
            //     }
            // }
        },
        set(node) {
            console.log(">>> set: ", node);
            // TODO this.$data.brokerList = brokerList;
        }
    }
};
