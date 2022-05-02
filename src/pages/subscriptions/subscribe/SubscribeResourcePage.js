import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";
import validationUtils from "@/utils/validationUtils";

export default {
    data() {
        return {
            active_tab: 0,
            resource: {},
            recipientId: "",
            idsSubscribeLocation: "",
            nonIdsSubscribeLocationType: "Backend",
            nonIdsSubscribeLocationTypes: ["Backend", "Route"],
            nonIdsSubscribeLocationRoute: "",
            nonIdsSubscribeLocationRoutes: [],
            nonIdsSubscribeBackendUrl: "",
            push: false,
            nonIdsPush: false,
            requiredRule: validationUtils.getRequiredRule(),
            urlRule: validationUtils.getUrlRequiredRule(),
            valid: false,
            nonIdsValid: false
        };
    },
    mounted: function () {
        this.loadResource(this.$route.query.id);
        this.loadRoutes();
    },
    methods: {
        async loadResource(resourceId) {
            this.$data.resource = await dataUtils.getRequestedResource(resourceId);
            let configuration = await dataUtils.getConnectorConfiguration();
            this.$data.idsSubscribeLocation = configuration.endpoint;
        },

        async loadRoutes() {
            this.$root.$emit('showBusyIndicator', true);
            try {
                let response = await dataUtils.getRoutes();
                this.$data.routes = [];
                for (let route of response) {
                    let showInList = false;
                    if (route.deploy == "Camel") {
                        if (route.start === undefined || route.start == null) {
                            showInList = true;
                        }
                    }
                    if (showInList) {
                        this.$data.nonIdsSubscribeLocationRoutes.push({
                            display: route.description,
                            value: route._links.self.href
                        });
                    }
                }
            } catch (error) {
                errorUtils.showError(error, "Get routes");
            }
            this.$root.$emit('showBusyIndicator', false);
        },

        async subscribeIds() {
            this.$root.$emit('showBusyIndicator', true);
            try {
                await dataUtils.subscribeToResource(this.$data.recipientId, this.$data.resource.remoteId, this.$data.idsSubscribeLocation, this.$data.push);
            } catch (error) {
                errorUtils.showError(error, "Get routes");
            }
            this.$root.$emit('showBusyIndicator', false);
            this.$router.push('idsresourcesconsumption');
        },

        async subscribeNonIds() {

        }
    }
};
