export default {
    components: {},
    props: ["readonly"],
    data() {
        return {
            description: {
                "type": "USAGE_LOGGING"
            },
            visibleclass: "",
            valid: true
        };
    },
    mounted: function () {
    },
    methods: {
        setPolicy() {
            // nothing to do.
        },
        setPolicyByDescription() {
            // nothing to do.
        },
    }
};
