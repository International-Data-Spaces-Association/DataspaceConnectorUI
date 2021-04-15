import dataUtils from "../../../utils/dataUtils";
import validationUtils from "../../../utils/validationUtils";

export default {
    components: {},
    data() {
        return {
            dialog: false,
            currentBroker: null,
            urlReadOnly: false,
            title: "",
            brokerTitle: null,
            url: null,
            valid: false,
            defaultRule: validationUtils.getRequiredRule(),
            urlRule: validationUtils.getUrlRequiredRule()
        };
    },
    mounted: function () {
        this.$data.urlReadOnly = false;
    },
    methods: {
        addButtonClicked() {
            this.$data.urlReadOnly = false;
            this.$data.currentBroker = null;
            this.$data.title = "Add Broker";
            this.$data.brokerTitle = "";
            this.$data.url = "";
        },
        async saveBroker() {
            if (this.$data.currentBroker == null) {
                this.$root.$emit('showBusyIndicator', true);
                this.$data.dialog = false;
                await dataUtils.createBroker(this.$data.url, this.$data.brokerTitle, this.$root);
            } else {
                this.$root.$emit('showBusyIndicator', true);
                this.$data.dialog = false;
                await dataUtils.updateBroker(this.$data.url, this.$data.brokerTitle, this.$root);
            }
            this.$emit('brokerSaved');
        },
        edit(broker) {
            this.$data.title = "Edit Broker"
            this.$data.urlReadOnly = true;
            this.$data.currentBroker = broker;
            this.$data.url = broker[1].brokerUri;
            this.$data.brokerTitle = broker[1].title;
            this.$data.dialog = true;
        }
    }
}

