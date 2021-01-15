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
                text: 'App title',
                value: 'title'
            }],
            selected: [],
            apps: []
        };
    },
    watch: {
        selected: function () {
            this.$data.valid = this.$data.selected.length > 0;
        }
    },
    mounted: function () {},
    methods: {
        show(apps) {
            this.$data.selected = [];
            this.$data.apps = apps;
            this.$data.dialog = true;
        },
        add() {
            this.$emit('addClicked', this.$data.selected[0].id);
            this.dialog = false;
        }
    }
};
