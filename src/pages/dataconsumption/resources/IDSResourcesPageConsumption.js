import dataUtils from "@/utils/dataUtils";
import ConfirmationDialog from "@/components/confirmationdialog/ConfirmationDialog.vue";
import errorUtils from "../../../utils/errorUtils";
import ResourceDetailsDialog from "../../dataoffering/resources/resourcedetailsdialog/ResourceDetailsDialog.vue";


export default {
    components: {
        ConfirmationDialog,
        ResourceDetailsDialog
    },
    data() {
        return {
            search: '',
            headers: [{
                text: 'Creation date',
                value: 'creationDate',
                width: 135
            }, {
                text: 'Title',
                value: 'title'
            },
            {
                text: 'Keywords',
                value: 'keywords'
            },
            {
                text: 'Subscribed',
                value: 'hasSubscription',
                width: 100
            },
            {
                text: '',
                value: 'actions',
                sortable: false,
                align: 'right',
                width: 130
            }
            ],
            resources: [],
            subscriptions: [],
            filteredResources: [],
            filterResourceType: null
        };
    },
    mounted: function () {
        this.getResources();
    },
    methods: {
        async getResources() {
            this.$root.$emit('showBusyIndicator', true);
            try {
                this.$data.subscriptions = await dataUtils.getSubscriptions();
            } catch (error) {
                errorUtils.showError(error, "Get subscriptions");
            }
            try {
                this.$data.resources = await dataUtils.getRequestedResources();
                for (let resource of this.$data.resources) {
                    resource.hasSubscription = false;
                    for (let subscription of this.$data.subscriptions) {
                        if (subscription.target.includes(resource.remoteId) || subscription.target.includes(resource.selfLink)) {
                            resource.hasSubscription = true;
                            break;
                        }
                    }
                }
            } catch (error) {
                errorUtils.showError(error, "Get resources");
            }
            this.filterChanged();
            this.$forceUpdate();
            this.$root.$emit('showBusyIndicator', false);
        },
        filterChanged() {
            if (this.$data.filterResourceType == null | this.$data.filterResourceType == "All") {
                this.$data.filteredResources = this.$data.resources;
            } else {
                this.$data.filteredResources = [];
                for (var resource of this.$data.resources) {
                    if (resource.fileType == this.$data.filterResourceType) {
                        this.$data.filteredResources.push(resource);
                    }
                }
            }
        },
        showItem(item) {
            this.$refs.resourceDetailsDialog.showRequest(item.id);
        },
        subscribeItem(item) {
            this.$router.push('subscriberesource?id=' + item.id);
        },
        deleteItem(item) {
            this.$refs.confirmationDialog.title = "Delete Requested Resource";
            this.$refs.confirmationDialog.text = "Are you sure you want to delete the requested resource '" + item.title + "'?";
            this.$refs.confirmationDialog.callbackData = {
                item: item
            };
            this.$refs.confirmationDialog.callback = this.deleteCallback;
            this.$refs.confirmationDialog.dialog = true;
        },
        async deleteCallback(choice, callbackData) {
            if (choice == "yes") {
                let resourceId = callbackData.item.id;
                this.$root.$emit('showBusyIndicator', true);

                try {
                    await dataUtils.deleteRequestedResource(resourceId);
                } catch (error) {
                    errorUtils.showError(error, "Delete requested resource");
                }

                this.getResources();
                this.$root.$emit('showBusyIndicator', false);
            }
        },
    },
};
