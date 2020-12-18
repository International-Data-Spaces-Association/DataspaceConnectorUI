import * as d3 from "d3";
import NodeDialog from "@/pages/dataoffering/routes/dialog/NodeDialog.vue";


export default {
    components: {
        NodeDialog
    },
    data() {
        return {
            nodes: [],
            connections: []
        };
    },
    mounted: function () {},
    methods: {
        handleEditNode(node) {
            console.log(">>> handleEditNode: ", node);
            this.$refs.nodeDialog.title = "Edit " + node.name;
            this.$refs.nodeDialog.dialog = true;
        },
        handleEditConnection(connection) {
            console.log(">>> handleEditConnection: ", connection);
        },
        addBackend() {
            this.$refs.chart.add({
                id: +new Date(),
                x: 20,
                y: 150,
                name: 'Backend',
                type: 'backendnode',
                approvers: [],
            });
        },
        addApp() {
            this.$refs.chart.add({
                id: +new Date(),
                x: 300,
                y: 150,
                name: 'App',
                type: 'appnode',
                approvers: [],
            });
        },
        render: function (g, node, isSelected) {
            console.log(">>> ", g);
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
        }
    }
};
