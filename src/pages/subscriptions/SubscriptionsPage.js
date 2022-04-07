import ConfirmationDialog from "@/components/confirmationdialog/ConfirmationDialog.vue";
import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";


export default {
    components: {
        ConfirmationDialog
    },
    data() {
        return {
            search: '',
            headers: [{
                text: 'Creation date',
                value: 'creationDate',
                width: 135
            },
            {
                text: 'Target',
                value: 'target'
            }, {
                text: 'Location',
                value: 'location'
            },
            {
                text: '',
                value: 'actions',
                sortable: false,
                align: 'right',
                width: 50
            }
            ],
            subscriptions: [],
            selected: []
        };
    },
    mounted: function () {
        this.getSubscriptions();
    },
    methods: {
        async getSubscriptions() {
            try {
                this.$data.subscriptions = await dataUtils.getSubscriptions();
                this.$forceUpdate();
                this.$root.$emit('showBusyIndicator', false);
            } catch (error) {
                errorUtils.showError(error, "Get subscriptions");
            }
        },
        subscriptionSaved() {
            this.getSubscriptions();
        },
        deleteItem(item) {
            this.$refs.confirmationDialog.title = "Delete Subscription";
            this.$refs.confirmationDialog.text = "Are you sure you want to delete the Subscription?";
            this.$refs.confirmationDialog.callbackData = {
                item: item
            };
            this.$refs.confirmationDialog.callback = this.deleteCallback;
            this.$refs.confirmationDialog.dialog = true;
        },
        deleteCallback(choice, callbackData) {
            if (choice == "yes") {
                this.$root.$emit('showBusyIndicator', true);
                this.deleteSubscription(dataUtils.getIdOfConnectorResponse(callbackData.item));
            }
        },
        async deleteSubscription(id) {
            try {
                await dataUtils.deleteSubscription(id);
            }
            catch (error) {
                console.log("Error on deleteSubscription(): ", error);
                this.$root.$emit('error', "Delete subscription failed.");
            }
            this.getSubscriptions();
        }
    }
};
