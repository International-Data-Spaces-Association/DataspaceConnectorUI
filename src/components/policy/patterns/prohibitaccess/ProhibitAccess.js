export default {
    components: {},
    props: ["readonly"],
    data() {
        return {
            description: {
                "type": "PROHIBIT_ACCESS"
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
        }
    }
};
