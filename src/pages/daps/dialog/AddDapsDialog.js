import dataUtils from "../../../utils/dataUtils";
import validationUtils from "../../../utils/validationUtils";

export default {
    components: {},
    data() {
        return {
            id: null,
            title: null,
            location: null,
            description: null,
            whitelisted: null,
            dialogTitle: "",
            dialog: false,
            currentDaps: null,
            valid: false,
            defaultRule: validationUtils.getRequiredRule(),
            urlRule: validationUtils.getUrlRequiredRule()
        };
    },
    methods: {
        addButtonClicked() {
            this.$data.title = "";
            this.$data.description = "";
            this.$data.location = "";
            this.$data.whitelisted = "true";

            this.$data.currentDaps = null;
            this.$data.dialogTitle = "Add Daps";
        },
        async saveDaps() {
            if (this.$data.currentDaps == null) {
                this.$root.$emit('showBusyIndicator', true);
                this.$data.dialog = false;
                await dataUtils.createDaps(
                    this.$data.title,
                    this.$data.description,
                    this.$data.location,
                    this.$data.whitelisted === "true"
                );
            } else {
                this.$root.$emit('showBusyIndicator', true);
                this.$data.dialog = false;
                await dataUtils.updateDaps(
                    this.$data.id,
                    this.$data.title,
                    this.$data.description,
                    this.$data.location,
                    this.$data.whitelisted === "true"
                );
            }
            this.$emit('dapsSaved');
        },
        edit(daps) {
            this.$data.id = daps.id;
            this.$data.title = daps.title;
            this.$data.description = daps.description;
            this.$data.location = daps.location;
            this.$data.whitelisted = daps.whitelisted === true ? "true" : "false";

            this.$data.dialogTitle = "Edit Daps"
            this.$data.currentDaps = daps;
            this.$data.dialog = true;
        }
    }
}

