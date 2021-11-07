<template></template>

<script>
    'use strict';
    export default {
        created: function () {
            const page = this.getQueryStringByName('redirect');
            if (page) {
                this.$router.replace({
                    path: page, query: {}
                });
            } else {
                this.$router.replace({ name: 'index' })
            }
        },
        methods: {
            getQueryStringByName: function (name) {
                const result = location.search.match(
                    new RegExp('[?&]' + name + '=([^&]+)', 'i')
                );
                if (result == null || result.length < 1) {
                    return '';
                }
                return result[1];
            }
        }
    };
</script>