<template>
    <router-view></router-view>
  </template>

<script>

export default {
    name: 'App',
    data() {
        return {
            hasLicence: false,
        };
    },
    async mounted() {
        this.hasLicence = await this.$Licence.getLicence() ? true : false;
    }
}
</script>