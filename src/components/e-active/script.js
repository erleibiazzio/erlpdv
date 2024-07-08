import Licence from '../../models/Licence';
const Response = require('../../Helpers/Response').default;

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
        async checkActive() {
            const url = this.$api.createUrl('check-licences');
            const response = await this.$api.POST(url, { serial: this.entity.serial });
            return await response.json();
        },
        async active() {
            try {
                const licence = await Licence.findByPk(this.entity.id);
        
                // Verifica se a licença está ativa
                const licenceData = await this.checkActive();
                if (!licenceData.isActive) {
                    throw new Error('Licença expirada ou cancelada, fale com o administrador');
                }
        
                // Preenche os dados da licença a ser atualizada
                const data = {
                    status: licenceData.isActive,
                    organization: this.entity.organization,
                    serial: this.entity.serial,
                    expiration: licenceData.expiration
                };
        
                // Popula os dados na instância da licença e valida
                await licence.populate(data);
                await licence.validate();
        
                // Atualiza a licença no banco de dados
                await licence.update(data);
        
                // Define a mensagem de sucesso
                const response = new Response('success', 'Licença ativada com sucesso');
                this.response = response.render();
        
                // Redireciona após um intervalo de tempo
                setTimeout(() => {
                    this.$router.push('/');
                }, 1500);
            } catch (error) {
                // Trata os erros capturados
                if (error.errors && error.errors.length > 0) {
                    // Se houver erros de validação
                    const firstError = error.errors[0];
                    const errorMessage = `${firstError.message}`;
                    const response = new Response('danger', errorMessage);
                    this.response = response.render();
                } else {
                    // Trata outros tipos de erro
                    console.error('Erro na requisição:', error);
                    const response = new Response('danger', error.message);
                    this.response = response.render();
                }
            }
        }
    },
};
