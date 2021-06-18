import dataUtils from "@/utils/dataUtils";

export default {
    components: {},
    data() {
        return {
        };
    },
    mounted: function () {
        this.test();
    },
    methods: {
        async test() {
            await dataUtils.createResource("Resource No Sov", "This is the first test with DSC.", "EN", ["test"], "1.0", "http://license", "http://pub",
                "", "", "json", 1234, [], "", this.$root);
        }
    }
};
