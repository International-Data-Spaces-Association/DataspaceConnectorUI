import dataUtils from "../../../../utils/dataUtils";
import ResourceDetailsDialog from "@/pages/dataoffering/resources/resourcedetailsdialog/ResourceDetailsDialog.vue";
import errorUtils from "../../../../utils/errorUtils";
import validationUtils from "@/utils/validationUtils";

export default {
    components: {
        ResourceDetailsDialog
    },
    data() {
        return {
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
                text: 'Publisher',
                value: 'publisher'
            }, {
                text: 'License',
                value: 'standardlicense'
            },
            {
                text: '',
                value: 'actions',
                sortable: false,
                align: 'right'
            }
            ],
            sortBy: 'creationDate',
            sortDesc: true,
            recipientId: "",
            receivedResources: [],
            valid: false,
            urlRule: validationUtils.getUrlRequiredRule()
        };
    },
    mounted: function () {

    },
    methods: {
        async receiveResources() {
            this.$root.$emit('showBusyIndicator', true);
            try {
                this.$data.receivedResources = await dataUtils.receiveResources(this.$data.recipientId);
            } catch (error) {
                errorUtils.showError(error, "Receive resources");
            }
            this.$root.$emit('showBusyIndicator', false);
        },
        async showItem(item) {
            this.$root.$emit('showBusyIndicator', true);
            this.$root.$emit('showBusyIndicator', false);
            this.$refs.resourceDetailsDialog.showResource(item);
        }
    },
};
