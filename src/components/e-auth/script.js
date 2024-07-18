const Response = require('../../Helpers/Response').default;
import User from '../../models/User';
import { verifyPassword } from '../../Helpers/Utils';
const { createSession } = require('../../session');

export default {
    name: 'e-auth',
    data() {
        return {
            error: [],
            hasError: false,
            entity: this.skeleton(),
            response: {}
        };
    },
    methods: {
        async login() {
            if (this.validate()) {
                this.setResponse('danger', this.error[0]);
                return;
            }

            try {
                let user = await User.findBy({ username: this.entity.username });

                if (user) {
                    if (user.status != 1) {
                        this.setResponse('danger', this.$__i('Acesso desativado fale com administrador'));
                    } else {
                        if (await verifyPassword(this.entity.password, user.password)) {
                            const sessionId = await createSession(user.id);
                            this.setResponse('success', this.$__i('Login efetuado com sucesso'));
                            localStorage.setItem('sessionId', sessionId);
                            this.$authStore.login({
                                user: user,
                                sessionId: sessionId
                            })

                            setTimeout(() => {
                                this.$router.push('/');
                            }, 1500);
                        } else {
                            this.setResponse('danger', this.$__i('Usuário ou senha inválido'));
                        }
                    }
                }




            } catch (error) {
                this.setResponse('danger', this.$__i('Ocorreu um erro ao tentar fazer login'));
                console.error(error);
            }
        },
        skeleton() {
            return {
                username: "",
                password: ""
            };
        },
        validate() {
            this.error = [];
            this.response = {};
            let hasError = false;

            if (!this.entity.username) {
                this.error.push(this.$__i('Informe seu usuário'));
                hasError = true;
            }

            if (!this.entity.password) {
                this.error.push(this.$__i('Informe sua senha'));
                hasError = true;
            }

            return hasError;
        },
        setResponse(status, message) {
            let response = new Response(status, message);
            this.response = response.render();
        }
    },
};
