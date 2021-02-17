import dataUtils from "@/utils/dataUtils";

export default {
    components: {},
    props: ['fromRoutePage'],
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
            selected: [],
            lastSelected: [],
            readonly: false
        };
    },
    mounted: function () {
        this.getBrokers();
        this.loadSourceTypes();
        this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
    },
    methods: {
        gotVisible() {
            this.getBrokers();
            this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
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

                if (this.$parent.$parent.$parent.$parent.currentResource != null) {
                    this.loadResource(this.$parent.$parent.$parent.$parent.currentResource);
                }

                this.$forceUpdate();
                this.$root.$emit('showBusyIndicator', false);
            });
        },
        loadResource(resource) {
            this.$data.selected = [];
            dataUtils.getResourceRegistrationStatus(resource.id).then(data => {
                for (let status of data) {
                    this.$data.selected.push({
                        url: status.brokerId
                    });
                    this.$data.lastSelected.push({
                        url: status.brokerId
                    });
                }
            });
        },
        getBrokerNewList() {
            let brokerNewList = [];
            for (let sel of this.$data.selected) {
                let newSelected = true;
                for (let lastSel of this.$data.lastSelected) {
                    if (sel.url == lastSel.url) {
                        newSelected = false;
                        break;
                    }
                }
                if (newSelected) {
                    brokerNewList.push(sel.url);
                }
            }


            return brokerNewList;
        },
        getBrokerDeleteList() {
            let brokerDeleteList = [];
            for (let lastSel of this.$data.lastSelected) {
                let stillSelected = false;
                for (let sel of this.$data.selected) {
                    if (sel.url == lastSel.url) {
                        stillSelected = true;
                        break;
                    }
                }
                if (!stillSelected) {
                    brokerDeleteList.push(lastSel.url);
                }
            }
            return brokerDeleteList;
        }
    }
};
