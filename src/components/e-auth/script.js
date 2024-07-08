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
  async mounted() {
    console.log(await this.$Licence.isActive())
  }
};