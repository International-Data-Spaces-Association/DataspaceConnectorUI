// import dataUtils from "@/utils/dataUtils";
import ConfirmationDialog from "@/components/confirmationdialog/ConfirmationDialog.vue";
import dataUtils from "../../../utils/dataUtils";



export default {
    components: {
        ConfirmationDialog
    },
    data() {
        return {
            search: '',
            headers: [{
                text: 'Description',
                value: 'description'
            }, {
                text: '',
                value: 'actions',
                sortable: false,
                align: 'right'
            }],
            sortBy: 'description',
            sortDesc: true,
            routes: []
        };
    },
    mounted: function () {
        this.getRoutes();
    },
    methods: {
        async getRoutes() {
            this.$root.$emit('showBusyIndicator', true);
            let response = await dataUtils.getRoutes();
            if (response.name !== undefined && response.name == "Error") {
                this.$root.$emit('error', "Get routes failed.");
            } else {
                this.$data.routes = [];
                for (let route of response) {
                    this.$data.routes.push({
                        id: route["@id"],
                        description: route["ids:routeDescription"]
                    });
                }
                this.$root.$emit('showBusyIndicator', false);
            }
        },
        deleteItem(item) {
            this.$refs.confirmationDialog.title = "Delete Route";
            this.$refs.confirmationDialog.text = "Are you sure you want to delete the route '" + item.description + "'?";
            this.$refs.confirmationDialog.callbackData = {
                item: item
            };
            this.$refs.confirmationDialog.callback = this.deleteCallback;
            this.$refs.confirmationDialog.dialog = true;
        },
        async deleteCallback(choice, callbackData) {
            if (choice == "yes") {
                this.$root.$emit('showBusyIndicator', true);
                let response = await dataUtils.deleteRoute(callbackData.item.id);
                if (response.name !== undefined && response.name == "Error") {
                    this.$root.$emit('error', "Delete route failed.");
                } else {
                    this.getRoutes();
                }
            }
        },
        editItem(item) {
            this.$router.push('editroute?routeId=' + item.id);
        }
    }
};
