import AddResourcePage from "@/pages/dataoffering/resources/addresource/AddResourcePage.vue";


export default {
    components: {
        AddResourcePage
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
            items: []
        };
    },
    watch: {
        selected: function () {
            console.log(">>> SEL: ", this.$data.selected);
            this.$data.valid = this.$data.selected.length > 0;
        }
    },
    mounted: function () {},
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
            this.$data.dialog = true;
        },
        add() {
            this.$emit('addClicked', this.$data.selected[0].id);
            this.dialog = false;
        }
    }
};
