import dataUtils from "../../../../utils/dataUtils";
import ResourceDetailsDialog from "@/pages/dataoffering/resources/resourcedetailsdialog/ResourceDetailsDialog.vue";

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
                value: 'standardLicense'
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
            receivedResources: []
        };
    },
    mounted: function () {

    },
    methods: {
        async receiveResources() {
            this.$root.$emit('showBusyIndicator', true);
            this.$data.receivedResources = await dataUtils.receiveResources(this.$data.recipientId);
            this.$root.$emit('showBusyIndicator', false);
        },
        async showItem(item) {
            this.$root.$emit('showBusyIndicator', true);
            this.$root.$emit('showBusyIndicator', false);
            this.$refs.resourceDetailsDialog.showResource(item);
        }
    },
};
