export default {
    components: {},
    data() {
        return {
            description: {
                "type": "USAGE_LOGGING"
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
        },
    }
};
