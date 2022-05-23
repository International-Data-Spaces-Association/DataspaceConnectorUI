import * as d3 from "d3";
import EditNodeDialog from "./dialog/EditNodeDialog.vue";
import EditIdsEndpointDialog from "./dialog/editidsendpointdialog/EditIdsEndpointDialog.vue";
import EditConnectionDialog from "./dialog/EditConnectionDialog.vue";
import AddNodeDialog from "./dialog/AddNodeDialog.vue";
import FlowChart from "@/components/flowchart/FlowChart.vue";
import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";

export default {
    components: {
        EditNodeDialog,
        EditIdsEndpointDialog,
        EditConnectionDialog,
        AddNodeDialog,
        FlowChart
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
            routeValid: true,
            numOfBackendNodes: 0,
            numOfIdsEndpointNodes: 0,
            isOffering: true
        };
    },
    watch: {
        $route() {
            this.init();
        }
    },
    mounted: function () {
        this.init();
    },
    methods: {
        async init() {
            this.$data.isOffering = this.$route.path.includes("offering");
            let response = [];
            try {
                response = await dataUtils.getGenericEndpoints();
            } catch (error) {
                errorUtils.showError(error, "Get backend connections");
            }
            this.$data.backendConnections = response;
            try {
                response = await dataUtils.getApps();
                response = await this.getOnlyRunningApps(response);
            } catch (error) {
                errorUtils.showError(error, "Get apps");
            }
            this.$data.apps = response;
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
        async getOnlyRunningApps(apps) {
            let runningApps = [];
            for (let app of apps) {
                let appID = dataUtils.getIdOfConnectorResponse(app);
                if (await dataUtils.isAppRunning(appID)) {
                    runningApps.push(app);
                }
            }
            return runningApps;
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
                let artifact;
                if (this.$data.isOffering) {
                    artifact = await dataUtils.getArtifactOfRoute(id);
                    if (typeof artifact !== "object") {
                        artifact = undefined;
                    }
                } else {
                    artifact = undefined;
                }

                if (routeSteps.length == 0) {
                    if (this.$data.isOffering) {
                        await this.addNode(route.start, undefined, 20, 150);
                        await this.addNode(undefined, artifact, 220, 210);
                        let startNodeId = await dataUtils.getNodeIdByObjectId(route.start.id, this.$refs.chart.internalNodes);
                        let endNodeId = await dataUtils.getNodeIdByObjectId(artifact.id, this.$refs.chart.internalNodes);
                        let isLeftToRight = true;
                        let startEndpointSelfLink = await dataUtils.getSelfLinkOfEndpoint(route.start.id);
                        this.loadConnection(startNodeId, startEndpointSelfLink, endNodeId, null, isLeftToRight);
                    } else {
                        // For Data Consumption only add an empty artifact node (no data needed).
                        let node = {
                            id: +new Date(),
                            x: 220,
                            y: 210,
                            name: 'Artifact',
                            type: 'idsendpointnode',
                            objectId: null,
                        };
                        this.$refs.chart.add(node);
                        let startNodeId = node.id;
                        await this.addNode(route.end, artifact, 20, 150);
                        let endNodeId = await dataUtils.getNodeIdByObjectId(route.end.id, this.$refs.chart.internalNodes);
                        let isLeftToRight = false;
                        let endEndpointSelfLink = await dataUtils.getSelfLinkOfEndpoint(route.end.id);
                        this.loadConnection(startNodeId, null, endNodeId, endEndpointSelfLink, isLeftToRight);
                    }
                } else {
                    for (let subRoute of routeSteps) {
                        if (this.$data.isOffering) {
                            let start = subRoute.start;
                            let end = subRoute.end;
                            let output = undefined;
                            await this.addNode(start, output, parseInt(subRoute.additional.startCoordinateX),
                                parseInt(subRoute.additional.startCoordinateY));
                            if (end == null) {
                                output = artifact;
                            }
                            await this.addNode(end, output, parseInt(subRoute.additional.endCoordinateX),
                                parseInt(subRoute.additional.endCoordinateY));
                            let startNodeObjectId = start.id;
                            let startEndpointSelfLink = await dataUtils.getSelfLinkOfEndpoint(start.id);

                            if (end == null) {
                                let startNodeId = await dataUtils.getNodeIdByObjectId(startNodeObjectId, this.$refs.chart.internalNodes);
                                let endNodeId = await dataUtils.getNodeIdByObjectId(artifact.id, this.$refs.chart.internalNodes);
                                let isLeftToRight = parseInt(subRoute.additional.startCoordinateX) < parseInt(subRoute.additional.endCoordinateX);
                                this.loadConnection(startNodeId, startEndpointSelfLink, endNodeId, null, isLeftToRight);
                            } else {
                                let endNodeObjectId = end.id;
                                let endEndpointSelfLink = await dataUtils.getSelfLinkOfEndpoint(end.id);
                                let startNodeId = await dataUtils.getNodeIdByObjectId(startNodeObjectId, this.$refs.chart.internalNodes);
                                let endNodeId = await dataUtils.getNodeIdByObjectId(endNodeObjectId, this.$refs.chart.internalNodes);
                                let isLeftToRight = parseInt(subRoute.additional.startCoordinateX) < parseInt(subRoute.additional.endCoordinateX);
                                this.loadConnection(startNodeId, startEndpointSelfLink, endNodeId, endEndpointSelfLink, isLeftToRight);
                            }
                        } else {
                            let start = subRoute.start;
                            let end = subRoute.end;
                            let output = undefined;
                            let startNodeId = null;
                            let startEndpointSelfLink = null;
                            if (start == null) {
                                // For Data Consumption only add an empty artifact node (no data needed).
                                let node = {
                                    id: +new Date(),
                                    x: parseInt(subRoute.additional.startCoordinateX),
                                    y: parseInt(subRoute.additional.startCoordinateY),
                                    name: 'Artifact',
                                    type: 'idsendpointnode',
                                    objectId: null,
                                };
                                this.$refs.chart.add(node);
                                startNodeId = node.id;
                            } else {
                                await this.addNode(start, output, parseInt(subRoute.additional.startCoordinateX),
                                    parseInt(subRoute.additional.startCoordinateY));
                                let startNodeObjectId = start.id;
                                startEndpointSelfLink = await dataUtils.getSelfLinkOfEndpoint(start.id);
                                startNodeId = await dataUtils.getNodeIdByObjectId(startNodeObjectId, this.$refs.chart.internalNodes);
                            }

                            await this.addNode(end, output, parseInt(subRoute.additional.endCoordinateX),
                                parseInt(subRoute.additional.endCoordinateY));


                            if (end == null) {
                                let endNodeId = await dataUtils.getNodeIdByObjectId(artifact.id, this.$refs.chart.internalNodes);
                                let isLeftToRight = parseInt(subRoute.additional.startCoordinateX) < parseInt(subRoute.additional.endCoordinateX);
                                this.loadConnection(startNodeId, startEndpointSelfLink, endNodeId, null, isLeftToRight);
                            } else {
                                let endNodeObjectId = end.id;
                                let endEndpointSelfLink = await dataUtils.getSelfLinkOfEndpoint(end.id);
                                let endNodeId = await dataUtils.getNodeIdByObjectId(endNodeObjectId, this.$refs.chart.internalNodes);
                                let isLeftToRight = parseInt(subRoute.additional.startCoordinateX) < parseInt(subRoute.additional.endCoordinateX);
                                this.loadConnection(startNodeId, startEndpointSelfLink, endNodeId, endEndpointSelfLink, isLeftToRight);
                            }
                        }
                    }
                }
            } catch (error) {
                errorUtils.showError(error, "Get route");
            }
            this.$root.$emit('showBusyIndicator', false);
            this.$forceUpdate();

        },
        async addNode(endpoint, output, x, y) {
            if (endpoint === undefined || endpoint == null) {
                if (output !== undefined) {
                    let artifactId = dataUtils.getIdOfConnectorResponse(output);
                    let idsResource = await dataUtils.getResourceOfArtifact(artifactId);
                    await this.addIdsEndpoint(output.id, x, y, dataUtils.getIdOfConnectorResponse(idsResource));
                }
            } else if (endpoint.type == "GENERIC") {
                if (!this.nodeExists(endpoint.id)) {
                    await this.addBackend(endpoint.id, x, y);
                }
            } else if (endpoint.type == null || endpoint.type == "APP") { // endpoint.type == null is a workaround, because AppEndpoints currently have type:null in DSC
                let appId = await dataUtils.getAppIdOfEndpointId(endpoint.id);
                if (!this.nodeExists(appId)) {
                    await this.addApp(appId, x, y);
                }
            }
        },
        loadConnection(startNodeId, startEndpointSelfLink, endNodeId, endEndpointSelfLink, isLeftToRight) {
            // TODO Load connector position from backend (currently not saved).
            let connectorId = +new Date();
            let connection = {
                source: {
                    id: startNodeId,
                    position: isLeftToRight ? "right" : "left",
                },
                sourceEndpointSelfLink: startEndpointSelfLink,
                destination: {
                    id: endNodeId,
                    position: isLeftToRight ? "left" : "right",
                },
                destinationEndpointSelfLink: endEndpointSelfLink,
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
                if (this.$data.isOffering) {
                    this.$refs.editIDSEndpointDialog.show(node);
                }
            } else {
                // this.$refs.editNodeDialog.title = "Edit " + node.name;
                // this.$refs.editNodeDialog.dialog = true;
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
            let y = 210;
            node.x = x;
            node.y = y;
            this.$refs.chart.add(node);
            this.validateRoute();
        },
        showAddBackendDialog() {
            this.$refs.addBackendDialog.show(this.$data.backendConnections, "Backend Connection", "URL", "accessUrl");
        },
        showAddAppDialog() {
            this.$refs.addAppDialog.show(this.$data.apps, "Running App", "App title", "title");
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
            if (x === undefined) {
                x = this.getXForNewNode();
            }
            if (y === undefined) {
                y = 150;
            }
            var app = await dataUtils.getApp(id);
            this.$refs.chart.add({
                id: +new Date(),
                x: x,
                y: y,
                name: 'App',
                type: 'appnode',
                text: app.title,
                objectId: id,
            });
            this.validateRoute();
        },
        showAddIdsEndpointDialog() {
            if (this.$data.isOffering) {
                this.$refs.editIDSEndpointDialog.show(null);
            } else {
                // For Data Consumption only add an empty artifact node (no data needed).
                let node = {
                    id: +new Date(),
                    x: 0,
                    y: 0,
                    name: 'Artifact',
                    type: 'idsendpointnode',
                    objectId: null,
                };
                this.newIdsEndpointNodeSaved(node);
            }
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
                name: 'Artifact',
                type: 'idsendpointnode',
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
            let hasError = false;
            let connectionsCopy = [];
            for (let connection of connections) {
                connectionsCopy.push(connection);
            }
            try {
                let response = await dataUtils.createNewRoute(this.$data.description);
                let routeId = dataUtils.getIdOfConnectorResponse(response);
                let routeSelfLink = response._links.self.href;

                if (this.$data.isOffering) {
                    let sourceNode = dataUtils.getNode(connections[0].source.id, nodes);
                    if (sourceNode.type == "backendnode") {
                        let genericEndpoint = sourceNode.genericEndpoint;
                        dataUtils.addRouteStart(routeId, genericEndpoint.selfLink);
                    } else if (sourceNode.type == "appnode") {
                        dataUtils.addRouteStart(routeId, connections[0].sourceEndpointSelfLink);
                    }
                    let destinationNode = dataUtils.getNode(connections[connections.length - 1].destination.id, nodes);
                    if (destinationNode.type == "idsendpointnode") {
                        await dataUtils.createResourceAndArtifact(destinationNode, routeSelfLink);
                    }
                }
                if (connections.length > 1) {
                    await this.saveRouteSteps(routeId, connections, nodes);
                }
                if (!this.$data.isOffering) {
                    dataUtils.addRouteEnd(routeId, connections[0].destinationEndpointSelfLink);
                }
            } catch (error) {
                errorUtils.showError(error, "Save route");
                hasError = true;
            }
            if (!hasError) {
                this.$data.receivedResults = [];
                this.$data.saveMessage = "Successfully saved."
            }
            this.$root.$emit('showBusyIndicator', false);
        },
        async saveRouteSteps(routeId, connections, nodes) {
            let error = false;
            // let genericEndpoint = null;
            for (var connection of connections) {
                var sourceNode = dataUtils.getNode(connection.source.id, nodes);
                var destinationNode = dataUtils.getNode(connection.destination.id, nodes);
                if (this.$data.isOffering) {
                    if (connection.sourceEndpointSelfLink != null) {
                        let err = await dataUtils.createSubRoute(routeId, connection.sourceEndpointSelfLink, sourceNode.x,
                            sourceNode.y, connection.destinationEndpointSelfLink, destinationNode.x, destinationNode.y);
                        if (err) {
                            error = true;
                            break;
                        }
                    }
                } else {
                    let err = await dataUtils.createSubRoute(routeId, connection.sourceEndpointSelfLink, sourceNode.x,
                        sourceNode.y, connection.destinationEndpointSelfLink, destinationNode.x, destinationNode.y);
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
                let sourceNode = dataUtils.getNode(connection.source.id, this.$refs.chart.internalNodes);
                let destinationNode = dataUtils.getNode(connection.destination.id, this.$refs.chart.internalNodes);
                if (this.$data.isOffering) {
                    if (sourceNode.type == "idsendpointnode") {
                        this.$data.saveMessage = "Artifact should not be a source node.";
                        this.$data.routeValid = false;
                        break;
                    } else if (destinationNode.type == "backendnode") {
                        this.$data.saveMessage = "Backend should not be a destination node.";
                        this.$data.routeValid = false;
                        break;
                    }
                } else {
                    if (sourceNode.type == "backendnode") {
                        this.$data.saveMessage = "Backend should not be a source node.";
                        this.$data.routeValid = false;
                        break;
                    } else if (destinationNode.type == "idsendpointnode") {
                        this.$data.saveMessage = "Artifact should not be a destination node.";
                        this.$data.routeValid = false;
                        break;
                    }
                }
            }

            if (this.$refs.chart.internalConnections.length > 0) {
                if (this.$data.isOffering) {
                    let destinationNode = dataUtils.getNode(this.$refs.chart.internalConnections[this.$refs.chart.internalConnections.length - 1].destination.id, this.$refs.chart.internalNodes);
                    if (destinationNode.type != "idsendpointnode") {
                        this.$data.saveMessage = "Route should end with an Artifact.";
                        this.$data.routeValid = false;
                    }
                } else {
                    let sourceNode = dataUtils.getNode(this.$refs.chart.internalConnections[0].source.id, this.$refs.chart.internalNodes);
                    if (sourceNode.type != "idsendpointnode") {
                        this.$data.saveMessage = "Route should start with an Artifact.";
                        this.$data.routeValid = false;
                    }
                }
            }

            this.$data.numOfBackendNodes = 0;
            this.$data.numOfIdsEndpointNodes = 0;
            for (let node of this.$refs.chart.internalNodes) {
                if (node.type == "backendnode") {
                    this.$data.numOfBackendNodes++;
                } else if (node.type == "idsendpointnode") {
                    this.$data.numOfIdsEndpointNodes++;
                }
            }
        },
        render: function (g, node, isSelected) {
            node.width = node.width || 120;
            if (node.type == "idsendpointnode") {
                node.height = node.height || 60;
            } else {
                node.height = node.height || 180;
            }
            let borderColor = isSelected ? "#666666" : "#bbbbbb";
            if (node.type != "idsendpointnode") {
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
            }
            let nodeRect = g.append("rect").classed(node.type, true);
            nodeRect
                .style("width", "120px");
            let textYOffset = 80;
            let nodeOffset = 60;
            if (node.type == "idsendpointnode") {
                nodeRect.style("height", "60px");
                textYOffset = 35;
                nodeOffset = 0;
            } else {
                nodeRect.style("height", "120px");
            }
            nodeRect.attr("stroke", borderColor);
            nodeRect
                .attr("x", node.x)
                .attr("y", node.y + nodeOffset);
            if (isSelected) {
                nodeRect.classed("selectedNode", true);
            }

            g.append("text")
                .attr("x", node.x + node.width / 2)
                .attr("y", node.y + textYOffset)
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

            if (node.type != "idsendpointnode") {
                g.append("defs").append("path").attr("id", "path1").attr("d", "M10,20 H100 M10,40 H100 M10,60 H100 M10,80 H100");
                g.append("text")
                    .attr("style", "font-size: 11px")
                    .attr("transform", "translate(" + (node.x) + ", " + (node.y + 100) + ")")
                    .attr("class", "unselectable")
                    .classed(node.type + "-text", true)
                    .append("textPath").attr("xlink:href", "#path1").text(node.text);
            }

        }
    }
};
