import dataUtils from "@/utils/dataUtils";
import errorUtils from "../../../../utils/errorUtils";

export default {
    data() {
        return {
            dialog: false,
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
            resource: {},
            resources: [],
            selected: []
        };
    },
    mounted: function () { },
    methods: {
        async show(resourceId) {
            this.$root.$emit('showBusyIndicator', true);
            this.$data.selected = [];
            try {
                let allResources = await dataUtils.getResources();
                this.$data.resources = [];
                for (let resource of allResources) {
                    if (resourceId != resource.id) {
                        this.$data.resources.push(resource);
                    }
                }
                this.$data.resource = await dataUtils.getResource(resourceId);
                if (this.$data.resource.samples !== undefined) {
                    for (let sample of this.$data.resource.samples) {
                        this.$data.selected.push({
                            "id": sample.substring(sample.lastIndexOf("/") + 1, sample.length),
                            "url": sample
                        })
                    }
                }
                this.$data.dialog = true;
            } catch (error) {
                errorUtils.showError(error, "Get resources");
            }
            this.$root.$emit('showBusyIndicator', false);
        },
        async save() {
            let samples = [];
            for (let selectedResource of this.$data.selected) {
                samples.push(selectedResource.url);
            }
            try {
                dataUtils.updateResourceReferences(this.$data.resource, samples);
            } catch (error) {
                errorUtils.showError(error, "Update resource");
            }
            this.$data.dialog = false;
        }
    }
};
