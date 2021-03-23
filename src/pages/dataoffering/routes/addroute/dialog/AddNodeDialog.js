export default {
    components: {

    },
    data() {
        return {
            dialog: false,
            nodeType: "",
            search: '',
            valid: false,
            itemKey: "id",
            headers: [],
            selected: [],
            items: [],
            noDataText: ""
        };
    },
    watch: {
        selected: function () {
            this.$data.valid = this.$data.selected.length > 0;
        }
    },
    mounted: function () { },
    methods: {
        show(items, nodeType, columnTitle, valueName) {
            this.$data.itemKey = valueName;
            this.$data.nodeType = nodeType;
            this.$data.headers = [{
                text: columnTitle,
                value: valueName
            }];

            this.$data.selected = [];
            this.$data.items = items;
            this.$data.noDataText = "No " + nodeType.toLowerCase() + "s available";
            this.$data.dialog = true;
        },
        add() {
            this.$emit('addClicked', this.$data.selected[0].id);
            this.dialog = false;
        }
    }
};
