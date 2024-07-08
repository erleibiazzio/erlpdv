import Licence from '../../models/Licence';

export default {
    name: 'e-active',
    data() {
        return {
            licence: new Licence(),
            entity: this.skeleton(),
            response: {}
        };
    },
    async mounted() {
        const licence = await Licence.getLicence();
        this.entity = licence.dataValues;
    },
    methods: {
        skeleton() {
            return {
                organization: "",
                expiration: "",
                status: "",
                serial: "",
            };
        },
        async active() {
            try {
                const licence = await Licence.findByPk(this.entity.id);

                let data = {
                    organization: this.entity.organization,
                    serial: this.entity.serial
                }

                licence.update(data).then((response) => {
                    this.response = response;
                    
                    var self = this;
                    setTimeout(function() {
                        self.$router.push('/');
                    }, 1500);
                }).catch(response => {
                    this.response = response;
                })

            } catch (error) {
                console.error('Error active licence', error)
            }
        }
    },
};
