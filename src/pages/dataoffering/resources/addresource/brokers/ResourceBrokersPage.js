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
                let response = (await dataUtils.getBrokers())._embedded.brokerViewList;
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
            if (resource.id == -1) {
                if (resource.brokerList !== undefined) {
                    for (let brokerUri of resource.brokerList) {
                        let broker = this.getBroker(brokerUri);
                        this.$data.selected.push(broker);
                        this.$data.lastSelected.push({
                            url: brokerUri
                        });
                    }
                }
            } else {
                let brokers = await dataUtils.getBrokersOfResource(resource.id);
                for (let status of brokers) {
                    let broker = this.getBroker(status.brokerId);
                    this.$data.selected.push(broker);
                    this.$data.lastSelected.push({
                        url: status.brokerId
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
