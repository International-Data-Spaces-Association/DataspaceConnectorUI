import dataUtils from "@/utils/dataUtils";
import validationUtils from "@/utils/validationUtils";

export default {
    components: {},
    data() {
        return {
            dialog: false,
            currentCatalog: null,
            title: "",
            catalogTitle: null,
            description: null,
            valid: false,
            defaultRule: validationUtils.getRequiredRule()
        };
    },
    mounted: function () {
    },
    methods: {
        addButtonClicked() {
            this.$data.currentCatalog = null;
            this.$data.title = "Add Catalog";
            this.$data.catalogTitle = "";
            this.$data.description = "";
        },
        async saveCatalog() {
            if (this.$data.currentCatalog == null) {
                this.$root.$emit('showBusyIndicator', true);
                this.$data.dialog = false;
                await dataUtils.createCatalog(this.$data.catalogTitle, this.$data.description);
            } else {
                this.$root.$emit('showBusyIndicator', true);
                this.$data.dialog = false;
                await dataUtils.updateCatalog(this.$data.currentCatalog.id, this.$data.catalogTitle, this.$data.description,);
            }
            this.$emit('catalogSaved');
        },
        edit(catalog) {
            this.$data.title = "Edit Catalog"
            this.$data.currentCatalog = catalog;
            this.$data.catalogTitle = catalog.title;
            this.$data.description = catalog.description;
            this.$data.dialog = true;
        }
    }
}

