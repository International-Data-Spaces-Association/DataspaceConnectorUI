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
                text: 'Title',
                value: 'title'
            }, {
                text: '',
                value: 'actions',
                sortable: false,
                align: 'right'
            }],
            routes: []
        };
    },
    mounted: function () {
        this.getRoutes();
    },
    methods: {
        getRoutes() {
            this.$root.$emit('showBusyIndicator', true);

            dataUtils.getRoutes(routes => {
                this.$data.routes = [];
                for (let route of routes) {
                    this.$data.routes.push({
                        id: route["@id"],
                        title: route["@id"]
                    });
                }
                this.$root.$emit('showBusyIndicator', false);
            });
        },
        deleteItem(item) {
            this.$refs.confirmationDialog.title = "Delete Route";
            this.$refs.confirmationDialog.text = "Are you sure you want to delete the route '" + item.title + "'?";
            this.$refs.confirmationDialog.callbackData = {
                item: item
            };
            this.$refs.confirmationDialog.callback = this.deleteCallback;
            this.$refs.confirmationDialog.dialog = true;
        },
        deleteCallback(choice, callbackData) {
            if (choice == "yes") {
                this.$root.$emit('showBusyIndicator', true);
                dataUtils.deleteRoute(callbackData.item.id, () => {
                    this.getRoutes();
                })
            }
        },
        editItem(item) {
            this.$router.push('editroute?id=' + item.id);
        }
    }
};
