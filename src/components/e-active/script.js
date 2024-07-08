export default {
  name: 'e-active',
  data() {
    return {
      entity: this.skeleton()
    };
  },
  methods: {
    skeleton() {
      return {
        organization: "",
        expiration: "",
        status: "",
        serial: "",
      }
    }
  },
};