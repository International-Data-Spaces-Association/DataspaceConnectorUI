import AddBrokerDialog from "@/pages/brokers/dialog/AddBrokerDialog.vue";
import ConfirmationDialog from "@/components/confirmationdialog/ConfirmationDialog.vue";
import dataUtils from "../../utils/dataUtils";
import errorUtils from "../../utils/errorUtils";


export default {
    components: {
        AddBrokerDialog,
        ConfirmationDialog
    },
    data() {
        return {
            search: '',
            headers: [{
                text: 'Title',
                value: 'title'
            }, {
                text: 'URL',
                value: 'url'
            },
            {
                text: '',
                value: 'actions',
                sortable: false,
                align: 'right'
            }
            ],
            brokers: [],
            selected: []
        };
    },
    mounted: function () {
        this.getBrokers();
    },
    methods: {
        async getBrokers() {
            this.$root.$emit('showBusyIndicator', true);
            try {
                let response = (await dataUtils.getBrokers())._embedded.brokers;
                this.$data.brokers = [];
                for (var broker of response) {
                    this.$data.brokers.push({
                        broker: broker,
                        id: dataUtils.getIdOfConnectorResponse(broker),
                        title: broker.title,
                        url: broker.location,
                        registerStatus: dataUtils.toRegisterStatusClass(broker.status)
                    });
                }
            } catch (error) {
                errorUtils.showError(error, "Get brokers");
            }
            this.$forceUpdate();
            this.$root.$emit('showBusyIndicator', false);

        },
        brokerSaved() {
            this.getBrokers();
        },
        deleteItem(item) {
            this.$refs.confirmationDialog.title = "Delete Broker";
            this.$refs.confirmationDialog.text = "Are you sure you want to delete the Broker?";
            this.$refs.confirmationDialog.callbackData = {
                item: item
            };
            this.$refs.confirmationDialog.callback = this.deleteCallback;
            this.$refs.confirmationDialog.dialog = true;
            // this.$root.$emit('showBusyIndicator', true);
            // this.deleteBroker(item.broker["@id"]);
        },
        deleteCallback(choice, callbackData) {
            if (choice == "yes") {
                this.$root.$emit('showBusyIndicator', true);
                this.deleteBroker(callbackData.item.id);
            }
        },
        async deleteBroker(brokerId) {
            try {
                await dataUtils.deleteBroker(brokerId);
            } catch (error) {
                errorUtils.showError(error, "Delete broker");
            }
            this.getBrokers();
        },
        editItem(item) {
            this.$refs.addBrokerDialog.edit(item.broker);
        },
        async registerUnregister(item) {
            this.$root.$emit('showBusyIndicator', true);
            if (item.registerStatus == "notRegisteredAtBroker") {
                try {
                    await dataUtils.registerConnectorAtBroker(item.url);
                } catch (error) {
                    errorUtils.showError(error, "Register connector at broker");
                }
                this.getBrokers();
            } else {
                try {
                    await dataUtils.unregisterConnectorAtBroker(item.url);
                } catch (error) {
                    errorUtils.showError(error, "Unregister connector at broker");
                }
                this.getBrokers();
            }
        }
    }
};
