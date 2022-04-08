export default {
    components: {},
    data() {
        return {
            dialog: false,
            title: "",
            text: "",
            text2: null,
            callback: null,
            callbackData: null
        };
    },
    mounted: function () { },
    methods: {
        yesClicked() {
            this.dialog = false;
            this.$data.callback("yes", this.$data.callbackData);
        },
        noClicked() {
            this.dialog = false;
            this.$data.callback("no", this.$data.callbackData);
        }
    }
}
