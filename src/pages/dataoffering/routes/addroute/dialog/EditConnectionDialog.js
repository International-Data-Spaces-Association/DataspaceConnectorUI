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
            outputId: null,
            outputs: [],
            inputId: null,
            inputs: [],
            valid: false,
            defaultRule: validationUtils.getRequiredRule(),
            sourceNode: null,
            destinationNode: null
        };
    },
    mounted: function () { },
    methods: {
        show(connection, nodes, isNewConnection) {
            this.$data.isNewConnection = isNewConnection;
            this.$data.connection = connection;
            this.$data.sourceNode = dataUtils.getNode(connection.source.id, nodes);
            this.$data.destinationNode = dataUtils.getNode(connection.destination.id, nodes);
            let sourceEndpoints = dataUtils.getEndpointList(this.$data.sourceNode, "idsc:OUTPUT_ENDPOINT");
            this.$data.outputs = [];
            for (let endpoint of sourceEndpoints) {
                this.$data.outputs.push(this.getItem(endpoint));
            }
            let destEndpoints = dataUtils.getEndpointList(this.$data.destinationNode, "idsc:INPUT_ENDPOINT");
            this.$data.inputs = [];
            for (let endpoint of destEndpoints) {
                this.$data.inputs.push(this.getItem(endpoint));
            }

            if (connection.sourceEndpointId === undefined) {
                this.$data.outputId = null;
            } else {
                this.$data.outputId = connection.sourceEndpointId;
            }
            if (connection.destinationEndpointId === undefined) {
                this.$data.inputId = null;
            } else {
                this.$data.inputId = connection.destinationEndpointId;
            }
            this.dialog = true;
            this.$refs.form.resetValidation();
        },
        save() {
            this.$data.connection.sourceEndpointId = this.$data.outputId;
            this.$data.connection.destinationEndpointId = this.$data.inputId;

            if (this.$data.isNewConnection) {
                this.$emit('newConnectionSaved', this.$data.connection);
            }
            this.dialog = false;
        },
        getItem(endpoint) {
            let item = null;
            if (endpoint["@type"] == "ids:GenericEndpoint") {
                item = {
                    id: endpoint["@id"],
                    text: endpoint["ids:accessURL"]["@id"]
                };
            } else if (endpoint["@type"] == "ids:AppEndpoint") {
                item = {
                    id: endpoint["@id"],
                    text: endpoint["ids:accessURL"]
                };
            }
            return item;
        }
    }
};
