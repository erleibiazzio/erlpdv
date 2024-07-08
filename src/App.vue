<template>
    <e-theme v-if="hasLicence"></e-theme>
    <e-active v-if="!hasLicence"></e-active>
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