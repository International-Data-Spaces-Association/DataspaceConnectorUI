export default {
    components: {},
    data() {
        return {
            description: {
                "type": "PROVIDE_ACCESS"
            },
            visibleclass: "",
            readonly: false
        };
    },
    mounted: function () {
    },
    methods: {
        previousPage() {
            this.$emit('previousPage');
        },
        nextPage() {
            this.$emit('nextPage');
        },
        setPolicy() {
            // nothing to do.
        },
        setPolicyByDescription() {
            // nothing to do.
        }
    }
};
