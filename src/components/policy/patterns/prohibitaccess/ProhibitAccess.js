export default {
    components: {},
    data() {
        return {
            description: {
                "type": "PROHIBIT_ACCESS"
            },
            visibleclass: "",
            readonly: false,
            valid: true
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
