import Axios from "axios";
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
        deleteBroker(brokerId) {
            Axios.delete("http://localhost:80/broker?brokerId=" + brokerId).then(() => {
                this.getBrokers();
            }).catch(error => {
                console.log(error);
                this.$root.$emit('showBusyIndicator', false);
            });

        },
        editItem(item) {
            this.$refs.addBrokerDialog.edit(item.broker);
        }
    }
};
