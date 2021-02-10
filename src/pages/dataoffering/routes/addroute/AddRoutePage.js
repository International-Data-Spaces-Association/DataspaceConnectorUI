import * as d3 from "d3";
import EditNodeDialog from "./dialog/EditNodeDialog.vue";
import EditIdsEndpointDialog from "./dialog/editidsendpointdialog/EditIdsEndpointDialog.vue";
import EditConnectionDialog from "./dialog/EditConnectionDialog.vue";
import AddNodeDialog from "./dialog/AddNodeDialog.vue";
import Flowchart from "@/components/flowchart/Flowchart.vue";
import dataUtils from "@/utils/dataUtils";

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
            receivedResults: [],
            numberOfResultsToWaitFor: 0,
            saveMessage: ""
        };
    },
    mounted: function () {
        this.getBackendConnections(() => {
            this.getApps(() => {
                this.$data.saveMessage = "";
                if (this.$route.query.id === undefined) {
                    this.$data.currentRoute = null;
                    this.description = dataUtils.getCurrentDate() + " - Unnamed";
                } else {
                    this.loadRoute(this.$route.query.id);
                }
            });
        });

    },
    methods: {
        loadRoute(id) {
            this.$root.$emit('showBusyIndicator', true);
            this.$refs.chart.clear();
            dataUtils.getRoute(id, route => {
                this.$data.currentRoute = route;
                console.log("LOAD ROUTE: ", route);
                this.$data.description = route["ids:routeDescription"];
                for (let subRoute of route["ids:hasSubRoute"]) {
                    let start = subRoute["ids:appRouteStart"][0];
                    let end = subRoute["ids:appRouteEnd"][0];
                    this.addNode(id, start, () => {
                        this.addNode(id, end, () => {
                            let startNodeObjectId = start["@id"];
                            if (start["@type"] == "ids:AppEndpoint") {
                                startNodeObjectId = dataUtils.getAppIdOfEndpointId(start["@id"]);
                            }
                            let endNodeObjectId = end["@id"];
                            if (end["@type"] == "ids:AppEndpoint") {
                                endNodeObjectId = dataUtils.getAppIdOfEndpointId(end["@id"]);
                            }
                            let startNodeId = dataUtils.getNodeIdByObjectId(startNodeObjectId, this.$refs.chart.internalNodes);
                            let endNodeId = dataUtils.getNodeIdByObjectId(endNodeObjectId, this.$refs.chart.internalNodes);
                            this.loadConnection(startNodeId, start["@id"], endNodeId, end["@id"]);
                        });
                    });


                }
                this.$root.$emit('showBusyIndicator', false);
                this.$forceUpdate();
            });
        },
        addNode(routeId, endpoint, callback) {
            dataUtils.getEndpointInfo(routeId, endpoint["@id"], endpointInfo => {
                if (endpoint["@type"] == "ids:GenericEndpoint") {
                    if (!this.nodeExists(endpoint["@id"])) {
                        this.addBackend(endpoint["@id"], endpointInfo.xCoordinate, endpointInfo.yCoordinate);
                    }
                } else if (endpoint["@type"] == "ids:AppEndpoint") {
                    let appId = dataUtils.getAppIdOfEndpointId(endpoint["@id"]);
                    if (!this.nodeExists(appId)) {
                        this.addApp(appId, endpointInfo.xCoordinate, endpointInfo.yCoordinate);
                    }
                }
                callback();
            });
        },
        loadConnection(startNodeId, startEndpointId, endNodeId, endEndpointId) {
            // TODO Load connector position from backend (currently not saved).
            let connectorId = +new Date();
            let connection = {
                source: {
                    id: startNodeId,
                    position: "right",
                },
                sourceEndpointId: startEndpointId,
                destination: {
                    id: endNodeId,
                    position: "left",
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
        getBackendConnections(callback) {
            dataUtils.getBackendConnections(backendConnections => {
                this.$data.backendConnections = backendConnections;
                callback();
            });
        },
        getApps(callback) {
            dataUtils.getApps(apps => {
                this.$data.apps = apps;
                callback();
            });
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
        },
        showAddBackendDialog() {
            this.$refs.addBackendDialog.show(this.$data.backendConnections, "Backend Connection", "URL", "url");
        },
        showAddAppDialog() {
            this.$refs.addAppDialog.show(this.$data.apps, "App", "App title", "title");
        },
        addBackend(id, x, y) {
            if (x === undefined) {
                x = this.getXForNewNode();
            }
            if (y === undefined) {
                y = 150;
            }
            var backend = dataUtils.getBackendConnection(id);
            this.$refs.chart.add({
                id: +new Date(),
                x: x,
                y: y,
                name: 'Backend',
                type: 'backendnode',
                text: backend.url,
                objectId: id,
            });
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
        addApp(id, x, y) {
            if (x === undefined) {
                x = this.getXForNewNode();
            }
            if (y === undefined) {
                y = 150;
            }
            var app = dataUtils.getApp(id);
            this.$refs.chart.add({
                id: +new Date(),
                x: x,
                y: y,
                name: 'App',
                type: 'appnode',
                text: app.title,
                objectId: id,
            });
        },
        addEndpoint(event, x, y) {
            if (x === undefined) {
                x = this.getXForNewNode();
            }
            if (y === undefined) {
                y = 150;
            }
            console.log("X Y: ", x, y);
            this.$refs.chart.add({
                id: +new Date(),
                x: x,
                y: y,
                name: 'IDS Endpoint',
                type: 'idsendpointnode',
                text: "IDS Endpoint",
                objectId: null,
            });
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
        handleChartSave(nodes, connections) {
            var connectionsCopy = [];
            for (var connection of connections) {
                connectionsCopy.push(connection);
            }
            this.$data.numberOfResultsToWaitFor = connections.length + 1;
            dataUtils.createNewRoute(this.$data.description, routeId => {
                this.resultReceived(routeId);
                for (var connection of connections) {
                    var sourceNode = dataUtils.getNode(connection.source.id, nodes);
                    var destinationNode = dataUtils.getNode(connection.destination.id, nodes);
                    dataUtils.createSubRoute(routeId, connection.sourceEndpointId, sourceNode.x, sourceNode.y,
                        connection.destinationEndpointId, destinationNode.x, destinationNode.y, null, () => {
                            this.resultReceived("");
                        });
                }
            });
        },
        resultReceived(result) {
            this.$data.receivedResults.push(result);
            if (this.$data.receivedResults.length == this.$data.numberOfResultsToWaitFor) {
                this.allResultsReceived();
            }
        },
        allResultsReceived() {
            this.$root.$emit('showBusyIndicator', false);
            this.$data.receivedResults = [];
            this.$data.saveMessage = "Successfully saved."
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
