import AddBrokerDialog from "@/pages/brokers/dialog/AddBrokerDialog.vue";
import ConfirmationDialog from "@/components/confirmationdialog/ConfirmationDialog.vue";
import dataUtils from "../../utils/dataUtils";


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
            let response = await dataUtils.getBrokers();

            if (response.name !== undefined && response.name == "Error") {
                this.$root.$emit('error', "Get brokers failed.");
            } else {
                this.$data.brokers = [];
                for (var broker of response) {
                    this.$data.brokers.push({
                        broker: broker,
                        title: broker[1]["title"],
                        url: broker[1]["brokerUri"],
                        registerStatus: this.toRegisterStatusClass(broker[1]["brokerRegistrationStatus"])
                    });
                }

                this.$forceUpdate();
                this.$root.$emit('showBusyIndicator', false);
            }
        },
        toRegisterStatusClass(brokerStatus) {
            let statusClass = "notRegisteredAtBroker";
            if (brokerStatus == "REGISTERED") {
                statusClass = "registeredAtBroker";
            }
            return statusClass;
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
                this.deleteBroker(callbackData.item.broker[1]["brokerUri"]);
            }
        },
        async deleteBroker(brokerId) {
            let response = await dataUtils.deleteBroker(brokerId);
            if (response.name !== undefined && response.name == "Error") {
                this.$root.$emit('error', "Delete broker failed.");
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
                    console.log("Error on API call: ", error.details);
                    this.$root.$emit('error', "Register connector at broker failed.");
                }
                this.getBrokers();
            } else {
                try {
                    await dataUtils.unregisterConnectorAtBroker(item.url);
                } catch (error) {
                    console.log("Error on API call: ", error.details);
                    this.$root.$emit('error', "Unregister connector at broker failed.");
                }
                this.getBrokers();
            }
        }
    }
};
