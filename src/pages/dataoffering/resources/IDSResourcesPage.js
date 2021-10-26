import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";
import ConfirmationDialog from "@/components/confirmationdialog/ConfirmationDialog.vue";
import ResourceDetailsDialog from "./resourcedetailsdialog/ResourceDetailsDialog.vue";
import ResourceReferenceDialog from "./resourcereferencedialog/ResourceReferenceDialog.vue";

export default {
    components: {
        ConfirmationDialog,
        ResourceDetailsDialog,
        ResourceReferenceDialog
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
                text: 'Brokers',
                value: 'brokerNames'
            },
            {
                text: '',
                value: 'actions',
                sortable: false,
                align: 'right',
                width: 170
            }
            ],
            catalogs: [],
            catalogId: -1,
            resources: [],
            sortBy: 'creationDate',
            sortDesc: true,
        };
    },
    mounted: async function () {
        await this.getCatalogs();
        await this.getResources();
    },
    methods: {
        async getCatalogs() {
            this.$root.$emit('showBusyIndicator', true);
            this.$data.catalogs = [];
            try {
                let response = await dataUtils.getCatalogs();
                this.$data.catalogs.push({
                    id: -1,
                    title: "Show all resources"
                });
                for (let catalog of response) {
                    this.$data.catalogs.push({
                        id: dataUtils.getIdOfConnectorResponse(catalog),
                        title: catalog.title
                    });
                }
            } catch (error) {
                errorUtils.showError(error, "Get resources");
            }
            this.$forceUpdate();
            this.$root.$emit('showBusyIndicator', false);
        },
        async getResources() {
            this.$root.$emit('showBusyIndicator', true);
            try {
                let response;
                if (this.$data.catalogId == -1) {
                    response = await dataUtils.getResources();
                } else {
                    response = await dataUtils.getResourcesOfCatalog(this.$data.catalogId);
                }
                this.$data.resources = response;
                for (let resource of this.$data.resources) {
                    let brokers = await dataUtils.getBrokersOfResource(resource.id);
                    resource.brokerNames = brokers.map(x => x.title);
                }
            } catch (error) {
                errorUtils.showError(error, "Get resources");
            }
            this.$forceUpdate();
            this.$root.$emit('showBusyIndicator', false);
        },
        catalogChanged() {
            this.getResources();
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
        async deleteCallback(choice, callbackData) {
            if (choice == "yes") {
                let resourceId = callbackData.item.id;
                this.$root.$emit('showBusyIndicator', true);

                try {
                    await dataUtils.deleteResource(resourceId);
                } catch (error) {
                    errorUtils.showError(error, "Delete resource");
                }

                this.getResources();
                this.$root.$emit('showBusyIndicator', false);
            }
        },
        editItem(item) {
            this.$router.push('editresource?id=' + item.id);
        },
        editItemReferences(item) {
            this.$refs.resourceReferenceDialog.show(item.id);
        },
        showItem(item) {
            this.$refs.resourceDetailsDialog.show(item.id);
        }
    },
};
