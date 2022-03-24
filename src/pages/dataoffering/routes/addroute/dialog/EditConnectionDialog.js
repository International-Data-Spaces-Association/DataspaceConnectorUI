import dataUtils from "@/utils/dataUtils";
import validationUtils from "../../../../../utils/validationUtils";

export default {
    components: {

    },
    data() {
        return {
            dialog: false,
            title: "",
            connection: null,
            isNewConnection: true,
            outputSelfLink: null,
            outputs: [],
            inputSelfLink: null,
            inputs: [],
            valid: false,
            defaultRule: validationUtils.getRequiredRule(),
            sourceNode: null,
            destinationNode: null
        };
    },
    mounted: function () { },
    methods: {
        async show(connection, nodes, isNewConnection) {
            let autoSetInput = false;
            let autoSetOutput = false;
            this.$data.isNewConnection = isNewConnection;
            this.$data.connection = connection;
            this.$data.sourceNode = dataUtils.getNode(connection.source.id, nodes);
            this.$data.destinationNode = dataUtils.getNode(connection.destination.id, nodes);
            let sourceEndpoints = await dataUtils.getEndpointList(this.$data.sourceNode, "OUTPUT_ENDPOINT");
            this.$data.outputs = [];
            for (let endpoint of sourceEndpoints) {
                this.$data.outputs.push(this.getItem(endpoint));
            }
            let destEndpoints = await dataUtils.getEndpointList(this.$data.destinationNode, "INPUT_ENDPOINT");
            this.$data.inputs = [];
            for (let endpoint of destEndpoints) {
                this.$data.inputs.push(this.getItem(endpoint));
            }

            if (connection.sourceEndpointSelfLink === undefined) {
                if (sourceEndpoints.length == 1) {
                    this.$data.outputSelfLink = this.getItem(sourceEndpoints[0]).selfLink;
                    autoSetOutput = true;
                } else {
                    this.$data.outputSelfLink = null;
                }
            } else {
                this.$data.outputSelfLink = connection.sourceEndpointSelfLink;
            }
            if (connection.destinationEndpointSelfLink === undefined) {
                if (destEndpoints.length == 1) {
                    this.$data.inputSelfLink = this.getItem(destEndpoints[0]).selfLink;
                    autoSetInput = true;
                } else {
                    this.$data.inputSelfLink = null;
                }
            } else {
                this.$data.inputSelfLink = connection.destinationEndpointSelfLink;
            }
            this.dialog = true;
            this.$refs.form.resetValidation();
            // If there are no alternative inputs/outputs for the user to select, then automatically save connection settings.
            if (((autoSetInput || this.$data.destinationNode.type == "idsendpointnode") && (autoSetOutput || this.$data.sourceNode.type == "idsendpointnode"))) {
                this.save();
            }
        },
        save() {
            this.$data.connection.sourceEndpointSelfLink = this.$data.outputSelfLink;
            this.$data.connection.destinationEndpointSelfLink = this.$data.inputSelfLink;

            if (this.$data.isNewConnection) {
                this.$emit('newConnectionSaved', this.$data.connection);
            }
            this.dialog = false;
        },
        getItem(endpoint) {
            let item = null;
            if (endpoint.type == "GENERIC") {
                item = {
                    id: endpoint.id,
                    selfLink: endpoint.selfLink,
                    text: endpoint.accessUrl
                };
            } else if (endpoint.type == "APP") {
                item = {
                    id: endpoint.id,
                    selfLink: endpoint.selfLink,
                    text: endpoint.location
                };
            }
            return item;
        }
    }
};
