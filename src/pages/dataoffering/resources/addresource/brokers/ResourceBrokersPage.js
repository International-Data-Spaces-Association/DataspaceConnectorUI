import dataUtils from "@/utils/dataUtils";
import errorUtils from "../../../../../utils/errorUtils";

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
            selected: [],
            lastSelected: [],
            readonly: false
        };
    },
    mounted: function () {
        this.getBrokers();
        this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
    },
    methods: {
        gotVisible() {
            this.getBrokers();
            this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
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
        async getBrokers() {
            try {
                let response = (await dataUtils.getBrokers())._embedded.brokers;
                this.$data.brokers = [];
                for (let broker of response) {
                    if (broker.status == "Registered") {
                        this.$data.brokers.push({
                            broker: broker,
                            id: dataUtils.getIdOfConnectorResponse(broker),
                            title: broker.title,
                            url: broker.location,
                            registerStatus: dataUtils.toRegisterStatusClass(broker.status)
                        });
                    }
                }
            } catch (error) {
                errorUtils.showError(error, "Get brokers");
            }
            this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
            this.$forceUpdate();

        },
        async loadResource(resource) {
            this.$data.selected = [];
            this.$data.lastSelected = [];
            if (resource.id === undefined || resource.id == -1) {
                if (resource.brokerUris !== undefined) {
                    for (let brokerUri of resource.brokerUris) {
                        let broker = this.getBroker(brokerUri);
                        this.$data.selected.push(broker);
                        this.$data.lastSelected.push({
                            url: brokerUri
                        });
                    }
                }
            } else {
                for (let brokerUri of resource.brokerUris) {
                    let broker = this.getBroker(brokerUri);
                    this.$data.selected.push(broker);
                    this.$data.lastSelected.push({
                        url: brokerUri
                    });
                }

            }
        },
        getBroker(brokerUri) {
            let broker = null;
            for (let br of this.$data.brokers) {
                if (br.url == brokerUri) {
                    broker = br;
                    break;
                }
            }
            return broker;
        },
        getSelectedBrokerList() {
            let selectedList = [];
            for (let sel of this.$data.selected) {
                selectedList.push(sel.url);
            }
            return selectedList;
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
