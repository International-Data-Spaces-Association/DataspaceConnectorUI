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
                y: 20,
                name: 'Backend',
                type: 'backendnode',
                approvers: [],
            });
        },
        addApp() {
            this.$refs.chart.add({
                id: +new Date(),
                x: 300,
                y: 20,
                name: 'App',
                type: 'appnode',
                approvers: [],
            });
        },
        addResource() {
            this.$refs.chart.add({
                id: +new Date(),
                x: 600,
                y: 20,
                name: 'Resource',
                type: 'resourcenode',
                approvers: [],
            });
        },
        render: function (g, node, isSelected) {
            node.width = node.width || 120;
            node.height = node.height || 60;
            let borderColor = isSelected ? "#666666" : "#bbbbbb";
            let body = g.append("rect").attr("class", "body");
            body
                .style("width", node.width + "px")
            body
                .attr("x", node.x)
                .attr("y", node.y)
                .classed(node.type, true)
                .attr("rx", 30);
            body.style("height", node.height + "px");
            body.attr("stroke", borderColor);
            if (isSelected) {
                body.classed("selectedNode", true);
            }

            g.append("text")
                .attr("x", node.x + node.width / 2)
                .attr("y", node.y + 20)
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
