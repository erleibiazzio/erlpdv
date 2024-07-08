export default {
  name: 'e-theme',
  data() {
    return {
      licenceActive: false,
      info: {}
    };
  },
  methods: {},
  async mounted() {
    this.licenceActive = await this.$licenceActive;
    this.info = await this.$Licence.getLicence();
  }
};