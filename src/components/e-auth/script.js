export default {
    name: 'e-auth',
    data() {
      return {
        entity: this.skeleton()
      };
    },
    methods: {
        skeleton() {
            return {
                user: "",
                password: ""
            }
        }
    },
  };