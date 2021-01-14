export default {
    components: {

    },
    data() {
        return {
            dialog: false,
            title: "",
            search: '',
            valid: false,
            headers: [{
                text: 'URL',
                value: 'url'
            }],
            selected: [],
            backendConnections: []
        };
    },
    watch: {
        selected: function () {
            this.$data.valid = this.$data.selected.length > 0;
        }
    },
    mounted: function () {},
    methods: {
        show(backendConnections) {
            this.$data.backendConnections = backendConnections;
            this.$data.dialog = true;
        },
        add() {
            this.$emit('addClicked', this.$data.selected[0].routeId);
            this.dialog = false;
        }
    }
};
