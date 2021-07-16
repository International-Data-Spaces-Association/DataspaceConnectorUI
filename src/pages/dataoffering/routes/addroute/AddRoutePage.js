import * as d3 from "d3";
import EditNodeDialog from "./dialog/EditNodeDialog.vue";
import EditIdsEndpointDialog from "./dialog/editidsendpointdialog/EditIdsEndpointDialog.vue";
import EditConnectionDialog from "./dialog/EditConnectionDialog.vue";
import AddNodeDialog from "./dialog/AddNodeDialog.vue";
import Flowchart from "@/components/flowchart/Flowchart.vue";
import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";

export default {
    components: {
        EditNodeDialog,
        EditIdsEndpointDialog,
        EditConnectionDialog,
        AddNodeDialog,
        Flowchart
    },
    data() {
        return {
            nodes: [],
            connections: [],
            backendConnections: [],
            apps: [],
            endpoints: [],
            currentRoute: null,
            description: "",
            saveMessage: "",
            isNewRoute: false,
            routeValid: true
        };
    },
    mounted: function () {
        this.init();
    },
    methods: {
        async init() {
            let response = [];
            try {
                response = await dataUtils.getGenericEndpoints();
            } catch (error) {
                errorUtils.showError(error, "Get backend connections");
            }
            this.$data.backendConnections = response;
            this.$data.saveMessage = "";
            this.validateRoute();
            if (this.$route.query.routeId === undefined) {
                this.$data.isNewRoute = true;
                this.$data.currentRoute = null;
                this.description = dataUtils.getCurrentDate() + " - Unnamed";
            } else {
                this.loadRoute(this.$route.query.routeId);
            }
        },
        async loadRoute(id) {
            this.$root.$emit('showBusyIndicator', true);
            this.$refs.chart.clear();
            try {
                let response = await dataUtils.getRoute(id);
                let route = response;
                this.$data.currentRoute = route;
                this.$data.description = route.description;
                let routeSteps = await dataUtils.getRouteSteps(id);
                for (let subRoute of routeSteps) {
                    let subRouteId = dataUtils.getIdOfConnectorResponse(subRoute);
                    let start = subRoute.start;
                    let end = subRoute.end;
                    let output = undefined;
                    let outputs = await dataUtils.getRouteOutput(subRouteId);
                    if (outputs.length > 0) {
                        output = outputs[0];
                    }
                    await this.addNode(start, output, parseInt(subRoute.additional.startCoordinateX),
                        parseInt(subRoute.additional.startCoordinateY));
                    await this.addNode(end, output, parseInt(subRoute.additional.endCoordinateX),
                        parseInt(subRoute.additional.endCoordinateY));
                    let startNodeObjectId = start.id;
                    if (start.type == "APP") {
                        // startNodeObjectId = dataUtils.getAppIdOfEndpointId(start.id);
                    }
                    let endNodeObjectId = end.id;
                    if (end.type == "APP") {
                        // endNodeObjectId = dataUtils.getAppIdOfEndpointId(end.id);
                    }
                    let startNodeId = dataUtils.getNodeIdByObjectId(startNodeObjectId, this.$refs.chart.internalNodes);
                    let endNodeId = dataUtils.getNodeIdByObjectId(endNodeObjectId, this.$refs.chart.internalNodes);
                    let isLeftToRight = parseInt(subRoute.additional.startCoordinateX) < parseInt(subRoute.additional.endCoordinateX);
                    this.loadConnection(startNodeId, start.id, endNodeId, end.id, isLeftToRight);
                }
            } catch (error) {
                errorUtils.showError(error, "Get route");
            }
            this.$root.$emit('showBusyIndicator', false);
            this.$forceUpdate();

        },
        async addNode(endpoint, output, x, y) {
            if (endpoint.type == "GENERIC") {
                if (!this.nodeExists(endpoint.id)) {
                    await this.addBackend(endpoint.id, x, y);
                }
            } else if (endpoint.type == "APP") {
                // let appId = dataUtils.getAppIdOfEndpointId(endpoint.id);
                // if (!this.nodeExists(appId)) {
                //     await this.addApp(appId, x, y);
                // }
            } else if (endpoint.type == "CONNECTOR") {
                if (!this.nodeExists(endpoint.id)) {
                    let artifactId = dataUtils.getIdOfConnectorResponse(output);
                    let idsResource = await dataUtils.getResourceOfArtifact(artifactId);
                    await this.addIdsEndpoint(endpoint.id, x, y, dataUtils.getIdOfConnectorResponse(idsResource));
                }
            }
        },
        loadConnection(startNodeId, startEndpointId, endNodeId, endEndpointId, isLeftToRight) {
            // TODO Load connector position from backend (currently not saved).
            let connectorId = +new Date();
            let connection = {
                source: {
                    id: startNodeId,
                    position: isLeftToRight ? "right" : "left",
                },
                sourceEndpointId: startEndpointId,
                destination: {
                    id: endNodeId,
                    position: isLeftToRight ? "left" : "right",
                },
                destinationEndpointId: endEndpointId,
                id: connectorId,
                type: "pass",
                name: "Pass",
            };
            this.$refs.chart.internalConnections.push(connection);
        },
        nodeExists(id) {
            let result = false;
            for (let node of this.$refs.chart.internalNodes) {
                if (node.objectId == id) {
                    result = true;
                    break;
                }
            }
            return result;
        },
        handleEditNode(node) {
            if (node.type == "idsendpointnode") {
                this.$refs.editIDSEndpointDialog.show(node);
            } else {
                this.$refs.editNodeDialog.title = "Edit " + node.name;
                this.$refs.editNodeDialog.dialog = true;
            }
        },
        addConnection(connection) {
            // Connection added in chart by mouse click.
            // Show edit connection dialog to configure input/output.
            this.$refs.editConnectionDialog.title = "Edit Connection";
            this.$refs.editConnectionDialog.show(connection, this.$refs.chart.internalNodes, true);
        },
        editConnection(connection) {
            this.$refs.editConnectionDialog.title = "Edit Connection";
            this.$refs.editConnectionDialog.show(connection, this.$refs.chart.internalNodes, false);
        },
        newConnectionSaved(connection) {
            // New connection saved for the first time.
            this.$refs.chart.internalConnections.push(connection);
            this.validateRoute();
        },
        newIdsEndpointNodeSaved(node) {
            let x = this.getXForNewNode();
            let y = 150;
            node.x = x;
            node.y = y;
            this.$refs.chart.add(node);
            this.validateRoute();
        },
        showAddBackendDialog() {
            this.$refs.addBackendDialog.show(this.$data.backendConnections, "Backend Connection", "URL", "accessUrl");
        },
        showAddAppDialog() {
            this.$refs.addAppDialog.show(this.$data.apps, "App", "App title", "title");
        },
        async addBackend(id, x, y) {
            if (x === undefined) {
                x = this.getXForNewNode();
            }
            if (y === undefined) {
                y = 150;
            }
            var backend = await dataUtils.getGenericEndpoint(id);
            if (backend == null) {
                this.$root.$emit('error', "Backend connection not found.");
            } else {
                this.$refs.chart.add({
                    id: +new Date(),
                    x: x,
                    y: y,
                    name: 'Backend',
                    type: 'backendnode',
                    text: backend.accessUrl,
                    genericEndpoint: backend,
                    objectId: id,
                });
            }
            this.validateRoute();
        },
        getXForNewNode() {
            let x = 20;
            for (let node of this.$refs.chart.internalNodes) {
                if (node.x >= x) {
                    x = node.x + 200;
                }
            }
            return x;
        },
        async addApp(id, x, y) {
            console.log(">>> addApp: ", id, x, y);
            // if (x === undefined) {
            //     x = this.getXForNewNode();
            // }
            // if (y === undefined) {
            //     y = 150;
            // }
            // var app = await dataUtils.getApp(id);
            // this.$refs.chart.add({
            //     id: +new Date(),
            //     x: x,
            //     y: y,
            //     name: 'App',
            //     type: 'appnode',
            //     text: app.title,
            //     objectId: id,
            // });
            // this.validateRoute();
        },
        showAddIdsEndpointDialog() {
            this.$refs.editIDSEndpointDialog.show(null);
        },
        async addIdsEndpoint(id, x, y, resourceId) {
            if (x === undefined) {
                x = this.getXForNewNode();
            }
            if (y === undefined) {
                y = 150;
            }
            let resource = {};
            if (resourceId !== undefined) {
                resource = await dataUtils.getResource(resourceId);
            }
            this.$refs.chart.add({
                id: +new Date(),
                x: x,
                y: y,
                name: 'IDS Endpoint',
                type: 'idsendpointnode',
                text: "IDS Endpoint",
                objectId: id,
                resource: resource
            });

            this.validateRoute();
        },
        saveRoute() {
            this.$data.saveMessage = "";
            this.$root.$emit('showBusyIndicator', true);
            this.$refs.chart.save();
        },
        resetRoute() {
            this.loadRoute(this.$data.currentRoute["@id"]);
        },
        cancelRoute() {
            this.resetRoute();
            this.$router.go(-1);
        },
        connectionAdded(connection) {
            // Connection added in chart by mouse click.
            this.addConnection(connection);
        },
        async handleChartSave(nodes, connections) {
            var connectionsCopy = [];
            for (var connection of connections) {
                connectionsCopy.push(connection);
            }
            try {
                let response = await dataUtils.createNewRoute(this.$data.description);
                let routeId = dataUtils.getIdOfConnectorResponse(response);
                await this.saveRouteSteps(routeId, connections, nodes);
            } catch (error) {
                errorUtils.showError(error, "Save route");
            }
        },
        async saveRouteSteps(routeId, connections, nodes) {
            let error = false;
            let genericEndpoint = null;
            for (var connection of connections) {
                var sourceNode = dataUtils.getNode(connection.source.id, nodes);
                var destinationNode = dataUtils.getNode(connection.destination.id, nodes);

                if (sourceNode.type == "backendnode") {
                    genericEndpoint = sourceNode.genericEndpoint;
                }
                if (destinationNode.type == "idsendpointnode") {
                    let err = await dataUtils.createResourceIdsEndpointAndAddSubRoute(sourceNode, destinationNode, genericEndpoint, routeId, connection.sourceEndpointId);
                    if (err) {
                        error = true;
                        break;
                    }
                } else {
                    let err = await dataUtils.createSubRoute(routeId, connection.sourceEndpointId, sourceNode.x,
                        sourceNode.y, connection.destinationEndpointId, destinationNode.x, destinationNode.y, null);
                    if (err) {
                        error = true;
                        break;
                    }
                }
            }

            if (!error) {
                this.$data.receivedResults = [];
                this.$data.saveMessage = "Successfully saved."
            }
            this.$root.$emit('showBusyIndicator', false);
        },
        connectionRemoved() {
            this.validateRoute();
        },
        nodeRemoved() {
            this.validateRoute();
        },
        validateRoute() {
            this.$data.saveMessage = "";
            this.$data.routeValid = true;
            if (this.$refs.chart.internalNodes.length < 2 || this.$refs.chart.internalConnections.length < 1) {
                this.$data.saveMessage = "At least two connected nodes required.";
                this.$data.routeValid = false;
            }
            for (let connection of this.$refs.chart.internalConnections) {
                var sourceNode = dataUtils.getNode(connection.source.id, this.$refs.chart.internalNodes);
                var destinationNode = dataUtils.getNode(connection.destination.id, this.$refs.chart.internalNodes);
                if (sourceNode.type == "idsendpointnode") {
                    this.$data.saveMessage = "IDS Endpoint should not be a source node.";
                    this.$data.routeValid = false;
                    break;
                } else if (destinationNode.type == "backendnode") {
                    this.$data.saveMessage = "Backend should not be a destination node.";
                    this.$data.routeValid = false;
                    break;
                }
            }
        },
        render: function (g, node, isSelected) {
            node.width = node.width || 120;
            node.height = node.height || 180;
            let borderColor = isSelected ? "#666666" : "#bbbbbb";
            let resourceNode = g.append("rect").attr("class", "resourcenode");
            resourceNode
                .style("width", "100px");
            resourceNode.style("height", "50px");
            resourceNode
                .attr("x", node.x + 10)
                .attr("y", node.y);
            resourceNode.attr("stroke", borderColor);

            g.append("text")
                .attr("x", node.x + node.width / 2)
                .attr("y", node.y + 30)
                .attr("text-anchor", "middle")
                .attr("class", "unselectable")
                .text(() => "Resource");

            g.append("line").attr("class", "resourceline").attr("x1", node.x + 60)
                .attr("y1", node.y + 60)
                .attr("x2", node.x + 60)
                .attr("y2", node.y + 50);

            let nodeRect = g.append("rect").classed(node.type, true);
            nodeRect
                .style("width", "120px");
            nodeRect.style("height", "120px");
            nodeRect.attr("stroke", borderColor);
            nodeRect
                .attr("x", node.x)
                .attr("y", node.y + 60);
            if (isSelected) {
                nodeRect.classed("selectedNode", true);
            }

            g.append("text")
                .attr("x", node.x + node.width / 2)
                .attr("y", node.y + 80)
                .attr("text-anchor", "middle")
                .attr("class", "unselectable")
                .classed(node.type + "-text", true)
                .text(() => node.name)
                .each(function wrap() {
                    let self = d3.select(this),
                        textLength = self.node().getComputedTextLength(),
                        text = self.text();
                    while (textLength > node.width - 2 * 4 && text.length > 0) {
                        text = text.slice(0, -1);
                        self.text(text + "...");
                        textLength = self.node().getComputedTextLength();
                    }
                });

            // < defs >
            //     <
            //     !--define lines
            // for text lies on-- >
            // <
            // path id = "path1"
            // d = "M10,30 H100 M10,60 H100 M10,90 H100 M10,120 H100" > < /path> <
            //     /defs>  <
            //     text transform = "translate(80,255)"
            // fill = "red"
            // font - size = "20" >
            //     <
            //     textPath xlink: href = "#path1" > This is a long long long text...... < /textPath> <
            //     /text>

            g.append("defs").append("path").attr("id", "path1").attr("d", "M10,20 H100 M10,40 H100 M10,60 H100 M10,80 H100");
            g.append("text")
                .attr("style", "font-size: 11px")
                .attr("transform", "translate(" + (node.x) + ", " + (node.y + 100) + ")")
                .attr("class", "unselectable")
                .classed(node.type + "-text", true)
                .append("textPath").attr("xlink:href", "#path1").text(node.text);

        }
    }
};
