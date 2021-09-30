import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";
import ConfirmationDialog from "@/components/confirmationdialog/ConfirmationDialog.vue";
import AddCatalogDialog from "./dialog/AddCatalogDialog.vue";

export default {
    components: {
        ConfirmationDialog,
        AddCatalogDialog
    },
    props: {
        inAddResourcesPage: Boolean
    },
    data() {
        return {
            search: '',
            headers: [{
                text: 'Title',
                value: 'title'
            },
            {
                text: '',
                value: 'actions',
                sortable: false,
                align: 'right'
            }
            ],
            sortBy: 'title',
            sortDesc: false,
            selected: [],
            lastSelected: [],
            catalogs: [],
            readonly: false,
            valid: false
        };
    },
    watch: {
        selected: function () {
            this.$data.valid = this.$data.selected.length > 0;
        }
    },
    mounted: function () {
        this.getCatalogs();
    },
    methods: {
        gotVisible() {
            this.getCatalogs();
            this.$data.readonly = this.$parent.$parent.$parent.$parent.readonly;
        },
        previousPage() {
            this.$emit('previousPage')
        },
        nextPage() {
            this.$emit('nextPage');
        },
        async getCatalogs() {
            this.$root.$emit('showBusyIndicator', true);
            try {
                let idsCatalogs = await dataUtils.getCatalogs();
                let catalogs = [];
                for (let idsCatalog of idsCatalogs) {
                    catalogs.push({
                        id: dataUtils.getIdOfConnectorResponse(idsCatalog),
                        title: idsCatalog.title,
                        description: idsCatalog.description
                    });
                }
                this.$data.catalogs = catalogs;
            } catch (error) {
                errorUtils.showError(error, "Get catalogs");
            }
            this.$forceUpdate();
            this.$root.$emit('showBusyIndicator', false);

        },
        async loadResource(resource) {
            this.$data.selected = [];
            this.$data.lastSelected = [];
            if (resource.catalogs === undefined) {
                for (let catalogId of resource.catalogIds) {
                    let catalog = this.getCatalog(catalogId);
                    this.$data.selected.push(catalog);
                    this.$data.lastSelected.push(catalog);
                }
            } else {
                for (let idsCatalog of resource.catalogs) {
                    let catalog = {
                        id: dataUtils.getIdOfConnectorResponse(idsCatalog),
                        title: idsCatalog.title,
                        description: idsCatalog.description
                    };
                    this.$data.selected.push(catalog);
                    this.$data.lastSelected.push(catalog);
                }
            }
        },
        getCatalog(id) {
            let catalog = null;
            for (let cat of this.$data.catalogs) {
                if (cat.id == id) {
                    catalog = cat;
                    break;
                }
            }
            return catalog;
        },
        catalogSaved() {
            this.getCatalogs();
        },
        deleteItem(item) {
            this.$refs.confirmationDialog.title = "Delete Catalog";
            this.$refs.confirmationDialog.text = "Are you sure you want to delete the catalog?";
            this.$refs.confirmationDialog.callbackData = {
                item: item
            };
            this.$refs.confirmationDialog.callback = this.deleteCallback;
            this.$refs.confirmationDialog.dialog = true;
        },
        deleteCallback(choice, callbackData) {
            if (choice == "yes") {
                this.$root.$emit('showBusyIndicator', true);
                this.deleteCatalog(callbackData.item.id);
            }
        },
        async deleteCatalog(catalogId) {
            try {
                await dataUtils.deleteCatalog(catalogId);
            } catch (error) {
                errorUtils.showError(error, "Delete catalog");
            }
            this.getCatalogs();
        },
        editItem(item) {
            this.$refs.addCatalogDialog.edit(item);
        },
        getCatalogIds() {
            let catalogIds = [];
            for (let catalog of this.$data.catalogs) {
                catalogIds.push(catalog.id);
            }
            return catalogIds;
        },
        getSelectedCatalogsList() {
            let catalogIds = [];
            for (let catalog of this.$data.selected) {
                catalogIds.push(catalog.id);
            }
            return catalogIds;
        },
        getCatalogsDeleteList() {
            let catalogsDeleteList = [];
            for (let lastSel of this.$data.lastSelected) {
                let stillSelected = false;
                for (let sel of this.$data.selected) {
                    if (sel.id == lastSel.id) {
                        stillSelected = true;
                        break;
                    }
                }
                if (!stillSelected) {
                    catalogsDeleteList.push(lastSel.id);
                }
            }
            return catalogsDeleteList;
        }
    }
};
