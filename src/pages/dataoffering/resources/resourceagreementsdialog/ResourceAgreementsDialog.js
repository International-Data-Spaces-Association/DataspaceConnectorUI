import moment from 'moment';

export default {
    data() {
        return {
            dialog: false,
            search: '',
            headers: [{
                text: 'Consumer',
                value: 'consumer'
            }, {
                text: 'Start',
                value: 'start',
                width: 150
            },
            {
                text: 'End',
                value: 'end',
                width: 150
            }
            ],
            agreements: [],
            expiredAgreements: [],
            resource: {}
        };
    },
    mounted: function () { },
    methods: {
        async show(resource) {
            this.$data.resource = resource;
            this.$root.$emit('showBusyIndicator', true);
            this.$data.agreements = [];
            this.$data.expiredAgreements = [];
            for (let agreement of resource.agreements) {
                let endDate = this.getDate(agreement["ids:contractEnd"]["@value"]);
                if (this.isExpired(endDate)) {
                    this.$data.expiredAgreements.push({
                        "consumer": agreement["ids:consumer"]["@id"],
                        "start": this.getDate(agreement["ids:contractStart"]["@value"]),
                        "end": endDate
                    });
                } else {
                    this.$data.agreements.push({
                        "consumer": agreement["ids:consumer"]["@id"],
                        "start": this.getDate(agreement["ids:contractStart"]["@value"]),
                        "end": endDate
                    });
                }
            }
            this.$root.$emit('showBusyIndicator', false);
            this.$data.dialog = true;
        },
        getDate(idsDate) {
            let date = idsDate.substring(0, 10);
            date += " " + idsDate.substring(11, 16);
            return date;
        },
        isExpired(endDate) {
            return moment(endDate, "YYYY-MM-DD hh:mm").diff(moment()) < 0;
        }
    }
};
