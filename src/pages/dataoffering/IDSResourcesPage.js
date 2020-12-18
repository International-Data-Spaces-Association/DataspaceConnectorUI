import Axios from "axios";
import DataUtils from "@/utils/dataUtils";
import ConfirmationDialog from "@/components/confirmationdialog/ConfirmationDialog.vue";


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
                },
                {
                    text: 'Description',
                    value: 'description'
                },
                {
                    text: 'Type',
                    value: 'type'
                }, {
                    text: 'Policy',
                    value: 'policy'
                },
                {
                    text: '',
                    value: 'actions',
                    sortable: false,
                    align: 'right'
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
            Axios.get("http://localhost:80/resources").then(response => {
                this.$data.resources = [];
                for (var resource of response.data) {
                    this.$data.resources.push({
                        id: resource["@id"],
                        title: resource["ids:title"][0]["@value"],
                        description: resource["ids:description"][0]["@value"],
                        type: resource["ids:representation"][0]["ids:sourceType"],
                        policy: DataUtils.convertTypeToPolicyName(resource["ids:contractOffer"][0]["@type"])
                    });
                }
                this.filterChanged();
                this.$forceUpdate();
                this.$root.$emit('showBusyIndicator', false);
            }).catch(error => {
                console.log(error);
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
                this.$root.$emit('showBusyIndicator', true);
                this.deleteResource(callbackData.item.id);
            }
        },
        deleteResource(id) {
            Axios.delete("http://localhost:80/resource?resourceId=" + id).then(() => {
                this.getResources();
                this.$root.$emit('showBusyIndicator', false);
            }).catch(error => {
                console.log(error);
                this.$root.$emit('showBusyIndicator', false);
            });

        },
        editItem(item) {
            this.$router.push('editresource?id=' + item.id);
        }
    },
};
