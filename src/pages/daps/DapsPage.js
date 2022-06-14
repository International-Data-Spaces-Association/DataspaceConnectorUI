import AddDapsDialog from "@/pages/daps/dialog/AddDapsDialog.vue";
import ConfirmationDialog from "@/components/confirmationdialog/ConfirmationDialog.vue";
import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";


export default {
    components: {
        AddDapsDialog,
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
                value: 'location'
            }, {
                text: 'Whitelisted',
                value: 'whitelisted'
            },
                {
                    text: '',
                    value: 'actions',
                    sortable: false,
                    align: 'right'
                }
            ],
            daps: [],
            selected: []
        };
    },
    mounted: function () {
        this.getDaps();
    },
    methods: {
        async getDaps() {
            this.$root.$emit('showBusyIndicator', true);
            try {
                let response = (await dataUtils.getDaps());
                this.$data.daps = [];
                for (var daps of response) {
                    this.$data.daps.push({
                        id: dataUtils.getIdOfConnectorResponse(daps),
                        location: daps.location,
                        title: daps.title,
                        description: daps.description,
                        whitelisted: daps.whitelisted,
                    });
                }
            } catch (error) {
                errorUtils.showError(error, "Error getting Daps");
            }
            this.$forceUpdate();
            this.$root.$emit('showBusyIndicator', false);

        },
        dapsSaved() {
            this.getDaps();
        },
        deleteItem(item) {
            this.$refs.confirmationDialog.title = "Delete Daps";
            this.$refs.confirmationDialog.text = "Are you sure you want to delete the Daps?";
            this.$refs.confirmationDialog.callbackData = {item: item};
            this.$refs.confirmationDialog.callback = this.deleteCallback;
            this.$refs.confirmationDialog.dialog = true;
        },
        deleteCallback(choice, callbackData) {
            if (choice === "yes") {
                this.$root.$emit('showBusyIndicator', true);
                this.deleteDaps(callbackData.item.id);
            }
        },
        async deleteDaps(id) {
            try {
                await dataUtils.deleteDaps(id);
            } catch (error) {
                errorUtils.showError(error, "Delete Daps");
            }
            this.getDaps();
        },
        editItem(item) {
            console.log(item);
            this.$refs.addDapsDialog.edit(item);
        }
    }
};
