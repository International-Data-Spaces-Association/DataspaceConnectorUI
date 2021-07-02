import * as d3 from "d3";
import EditNodeDialog from "./dialog/EditNodeDialog.vue";
import EditIdsEndpointDialog from "./dialog/editidsendpointdialog/EditIdsEndpointDialog.vue";
import EditConnectionDialog from "./dialog/EditConnectionDialog.vue";
import AddNodeDialog from "./dialog/AddNodeDialog.vue";
import Flowchart from "@/components/flowchart/Flowchart.vue";
import dataUtils from "@/utils/dataUtils";
import errorUtils from "@/utils/errorUtils";
import clientDataModel from "../../../../datamodel/clientDataModel";

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
                response = await dataUtils.getBackendConnections();
            } catch (error) {
                errorUtils.showError(error, "Get backend connections");
            }
            this.$data.backendConnections = response;
            response = await dataUtils.getApps();
            if (response.name !== undefined && response.name == "Error") {
                this.$root.$emit('error', "Get apps failed.");
            } else {
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
            }
        },
        async loadRoute(id) {
            this.$root.$emit('showBusyIndicator', true);
            this.$refs.chart.clear();
            console.log("GET ROUTE: ", id);
            let response = await dataUtils.getRoute(id);
            if (response.name !== undefined && response.name == "Error") {
                this.$root.$emit('error', "Get route failed.");
            } else {
                let route = response;
                this.$data.currentRoute = route;
                this.$data.description = route["ids:routeDescription"];
                for (let subRoute of route["ids:hasSubRoute"]) {
                    let start = subRoute["ids:appRouteStart"][0];
                    let end = subRoute["ids:appRouteEnd"][0];
                    let output = undefined;
                    if (subRoute["ids:appRouteOutput"] !== undefined) {
                        output = subRoute["ids:appRouteOutput"][0];
                    }
                    let sourceEndpointInfo = await this.addNode(id, start, output);
                    let destinationEndpointInfo = await this.addNode(id, end, output);

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
                    let isLeftToRight = sourceEndpointInfo.xcoordinate < destinationEndpointInfo.xcoordinate;
                    this.loadConnection(startNodeId, start["@id"], endNodeId, end["@id"], isLeftToRight);
                }
                this.$root.$emit('showBusyIndicator', false);
                this.$forceUpdate();
            }
        },
        async addNode(routeId, endpoint, output) {
            let response = await dataUtils.getEndpointInfo(routeId, endpoint["@id"]);
            if (response.name !== undefined && response.name == "Error") {
                this.$root.$emit('error', "Get endpoint info failed.");
            } else {
                let endpointInfo = response;
                if (endpoint["@type"] == "ids:GenericEndpoint") {
                    if (!this.nodeExists(endpoint["@id"])) {
                        this.addBackend(endpoint["@id"], endpointInfo.xcoordinate, endpointInfo.ycoordinate);
                    }
                } else if (endpoint["@type"] == "ids:AppEndpoint") {
                    let appId = dataUtils.getAppIdOfEndpointId(endpoint["@id"]);
                    if (!this.nodeExists(appId)) {
                        this.addApp(appId, endpointInfo.xcoordinate, endpointInfo.ycoordinate);
                    }
                } else if (endpoint["@type"] == "ids:ConnectorEndpoint") {
                    if (!this.nodeExists(endpoint["@id"])) {
                        this.addIdsEndpoint(endpoint["@id"], endpointInfo.xcoordinate, endpointInfo.ycoordinate, output);
                    }
                }
                return endpointInfo;
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
            if (backend == null) {
                this.$root.$emit('error', "Backend connection not found.");
            } else {
                this.$refs.chart.add({
                    id: +new Date(),
                    x: x,
                    y: y,
                    name: 'Backend',
                    type: 'backendnode',
                    text: backend.url,
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
            this.validateRoute();
        },
        showAddIdsEndpointDialog() {
            this.$refs.editIDSEndpointDialog.show(null);
        },
        addIdsEndpoint(id, x, y, output) {
            if (x === undefined) {
                x = this.getXForNewNode();
            }
            if (y === undefined) {
                y = 150;
            }
            let resource = {};
            if (output !== undefined) {
                resource = clientDataModel.convertIdsResource(output);
            }
            this.$refs.chart.add({
                id: +new Date(),
                x: x,
                y: y,
                name: 'IDS Endpoint',
                type: 'idsendpointnode',
                text: "IDS Endpoint",
                objectId: id,
                title: resource.title,
                description: resource.description,
                language: resource.language,
                keywords: resource.keywords,
                version: resource.version,
                standardlicense: resource.standardLicense,
                publisher: resource.publisher,
                contractJson: resource.contract,
                filetype: resource.fileType,
                bytesize: resource.bytesize,
                brokerList: resource.brokerList
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
            let response = await dataUtils.createNewRoute(this.$data.description);
            if (response.name !== undefined && response.name == "Error") {
                this.$root.$emit('error', "Save route failed.");
            } else {
                let routeId = response;
                this.saveRouteSteps(routeId, connections, nodes);
            }
        },
        async saveRouteSteps(routeId, connections, nodes) {
            let error = false;
            let genericEndpointId = null;
            for (var connection of connections) {
                var sourceNode = dataUtils.getNode(connection.source.id, nodes);
                var destinationNode = dataUtils.getNode(connection.destination.id, nodes);
                if (sourceNode.type == "backendnode") {
                    genericEndpointId = sourceNode.objectId;
                }
                if (destinationNode.type == "idsendpointnode") {
                    let err = await dataUtils.createResourceIdsEndpointAndAddSubRoute(destinationNode.title,
                        destinationNode.description, destinationNode.language, destinationNode.keywords,
                        destinationNode.version, destinationNode.standardlicense,
                        destinationNode.publisher, destinationNode.pattern, destinationNode.contractJson, destinationNode.filetype, destinationNode.bytesize,
                        destinationNode.brokerList, genericEndpointId, routeId, connection.sourceEndpointId, sourceNode.x,
                        sourceNode.y, destinationNode.x, destinationNode.y);
                    if (err) {
                        this.$root.$emit('error', "Save route step failed.");
                        error = true;
                        break;
                    }
                } else {
                    let response = await dataUtils.createSubRoute(routeId, connection.sourceEndpointId, sourceNode.x,
                        sourceNode.y, connection.destinationEndpointId, destinationNode.x, destinationNode.y, null);
                    if (response.name !== undefined && response.name == "Error") {
                        this.$root.$emit('error', "Save route step failed.");
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
