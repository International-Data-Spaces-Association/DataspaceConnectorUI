import dataUtils from "../../../../utils/dataUtils";
import ResourceDetailsDialog from "@/pages/dataoffering/resources/resourcedetailsdialog/ResourceDetailsDialog.vue";

export default {
    components: {
        ResourceDetailsDialog
    },
    data() {
        return {
            headers: [{
                text: 'Title',
                value: 'title'
            },
            {
                text: 'Description',
                value: 'description'
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
            recipientId: "",
            receivedResources: []
        };
    },
    mounted: function () {

    },
    methods: {
        async receiveResources() {
            this.$root.$emit('showBusyIndicator', true);
            this.$data.receivedResources = [];
            let resources = (await dataUtils.receiveResources(this.$data.recipientId)).data;
            for (let resource of resources) {
                this.$data.receivedResources.push(resource[1]);
            }
            this.$root.$emit('showBusyIndicator', false);
        },
        async showItem(item) {
            this.$root.$emit('showBusyIndicator', true);
            let resource = (await dataUtils.receiveResource(this.$data.recipientId, item.resourceId));
            this.$root.$emit('showBusyIndicator', false);
            this.$refs.resourceDetailsDialog.show(resource);
        }
    },
};
