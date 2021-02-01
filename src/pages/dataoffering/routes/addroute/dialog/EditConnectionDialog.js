import dataUtils from "@/utils/dataUtils";

export default {
    components: {

    },
    data() {
        return {
            dialog: false,
            title: "",
            connection: null,
            outputId: null,
            outputs: [],
            inputId: null,
            inputs: []
        };
    },
    mounted: function () {},
    methods: {
        setConnection(connection, nodes) {
            console.log(">>> EDIT CONN: ", connection);
            this.$data.connection = connection;
            var source = dataUtils.getNode(connection.source.id, nodes);
            var destination = dataUtils.getNode(connection.destination.id, nodes);
            let sourceEndpoints = dataUtils.getEndpointList(source, "idsc:OUTPUT_ENDPOINT");
            this.$data.outputs = [];
            for (let endpoint of sourceEndpoints) {
                this.$data.outputs.push(this.getItem(endpoint));
            }
            let destEndpoints = dataUtils.getEndpointList(destination, "idsc:INPUT_ENDPOINT");
            this.$data.inputs = [];
            for (let endpoint of destEndpoints) {
                this.$data.inputs.push(this.getItem(endpoint));
            }

            if (connection.sourceEndpointId !== undefined) {
                this.$data.outputId = connection.sourceEndpointId;
            }
            if (connection.destinationEndpointId !== undefined) {
                this.$data.inputId = connection.destinationEndpointId;
                console.log(">>> SET INPUT: ", connection.destinationEndpointId);
                for (let input of this.$data.inputs) {
                    console.log(">>> ID: ", input.id);
                }
            }
        },
        save() {
            this.$data.connection.sourceEndpointId = this.$data.outputId;
            this.$data.connection.destinationEndpointId = this.$data.inputId;
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
