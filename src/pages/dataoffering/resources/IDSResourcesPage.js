import dataUtils from "@/utils/dataUtils";
import ConfirmationDialog from "@/components/confirmationdialog/ConfirmationDialog.vue";
import ResourceDetailsDialog from "./resourcedetailsdialog/ResourceDetailsDialog.vue";


export default {
    components: {
        ConfirmationDialog,
        ResourceDetailsDialog
    },
    data() {
        return {
            search: '',
            headers: [{
                text: 'Title',
                value: 'title'
            },
            {
                text: 'Description',
                value: 'description'
            },
            {
                text: 'Type',
                value: 'sourceType'
            }, {
                text: 'Policy',
                value: 'policyName'
            },
            {
                text: '',
                value: 'actions',
                sortable: false,
                align: 'right',
                width: 150
            }
            ],
            resources: [],
            filteredResources: [],
            filterResourceType: null
        };
    },
    mounted: function () {
        this.getResources();
    },
    methods: {
        getResources() {
            this.$root.$emit('showBusyIndicator', true);
            dataUtils.getResources(resources => {
                this.$data.resources = resources;
                this.filterChanged();
                this.$forceUpdate();
                this.$root.$emit('showBusyIndicator', false);
            });
        },
        filterChanged() {
            if (this.$data.filterResourceType == null | this.$data.filterResourceType == "All") {
                this.$data.filteredResources = this.$data.resources;
            } else {
                this.$data.filteredResources = [];
                for (var resource of this.$data.resources) {
                    if (resource.type == this.$data.filterResourceType) {
                        this.$data.filteredResources.push(resource);
                    }
                }
            }
        },
        deleteItem(item) {
            this.$refs.confirmationDialog.title = "Delete Resource";
            this.$refs.confirmationDialog.text = "Are you sure you want to delete the resource '" + item.title + "'?";
            this.$refs.confirmationDialog.callbackData = {
                item: item
            };
            this.$refs.confirmationDialog.callback = this.deleteCallback;
            this.$refs.confirmationDialog.dialog = true;
        },
        deleteCallback(choice, callbackData) {
            if (choice == "yes") {
                let resourceId = callbackData.item.id;
                this.$root.$emit('showBusyIndicator', true);
                dataUtils.getResourceRegistrationStatus(resourceId).then(data => {
                    let brokerUris = [];
                    for (let status of data) {
                        brokerUris.push(status.brokerId);
                    }
                    dataUtils.deleteResource(resourceId, () => {
                        dataUtils.updateResourceAtBrokers(brokerUris, resourceId, () => {
                            this.getResources();
                            this.$root.$emit('showBusyIndicator', false);
                        });
                    });

                });
            }
        },
        editItem(item) {
            this.$router.push('editresource?id=' + item.id);
        },
        showItem(item) {
            this.$refs.resourceDetailsDialog.show(item);
        }
    },
};
