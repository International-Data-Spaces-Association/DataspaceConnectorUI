export default {
    components: {},
    data() {
        return {
            pattern: "PROHIBIT_ACCESS",
            contractJson: "",
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
        }
    }
};
