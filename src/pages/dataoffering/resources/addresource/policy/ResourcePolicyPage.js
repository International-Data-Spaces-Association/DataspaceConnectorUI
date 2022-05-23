import AddPolicyDialog from "@/pages/dataoffering/resources/addresource/policy/policyDialog/AddPolicyDialog.vue";
import ConfirmationDialog from "@/components/confirmationdialog/ConfirmationDialog.vue";
import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";
import { VDataTable, VIcon } from "vuetify/lib";

export default {
    components: {
        AddPolicyDialog,
        ConfirmationDialog,
        VDataTable,
        VIcon
    },
    data() {
        return {
            allContracts: [],
            selected: [],
            search: '',
            headers: [
                {
                    text: 'Title',
                    value: 'title'
                },
                {
                    text: 'Date created',
                    value: 'dateCreated'
                },
                {
                    text: 'Contract start date',
                    value: 'contractStart'
                },
                {
                    text: 'Contract end date',
                    value: 'contractEnd'
                },
                {
                    text: '',
                    value: 'actions',
                    sortable: false,
                    align: 'right'
                }
            ],
        };
    },
    mounted: function () {
        this.getAllContracts();
    },
    watch: {

    },
    methods: {
        async getAllContracts() {
            try {
                this.$data.allContracts = await dataUtils.getAllPolicyTemplates();
                this.$forceUpdate();
                this.$root.$emit('showBusyIndicator', false);
            } catch (error) {
                errorUtils.showError(error, "Get policy templates");
            }
        },
        policyTemplateSaved() {
            this.getAllContracts();
        },
        deletePolicyTemplate(item) {
            this.$refs.confirmationDialog.title = "Delete Policy";
            this.$refs.confirmationDialog.text = "Are you sure you want to delete the policy?";
            this.$refs.confirmationDialog.callbackData = {
                item: item
            };
            this.$refs.confirmationDialog.callback = this.deleteCallback;
            this.$refs.confirmationDialog.dialog = true;
        },
        deleteCallback(choice, callbackData) {
            if (choice === "yes") {
                this.$root.$emit('showBusyIndicator', true);
                this.deletePolicy(callbackData.item.id);
            }
        },
        async deletePolicy(id) {
            try {
                await dataUtils.deleteContract(id);
            }
            catch (error) {
                console.log("Error on deletePolicy(): ", error);
                this.$root.$emit('error', "Delete policy template failed.");
            }
            this.getAllContracts();
        },
        editPolicyTemplate(item) {
            this.$refs.addPolicyDialog.edit(item);
        }
    }
};
