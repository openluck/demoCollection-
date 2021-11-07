<template>
    <svg class="icon" aria-hidden="true" @click="handleClick">
        <use :xlink:href="'#icon-'+name"></use>
    </svg>
</template>

<script>
    export default {
        name: 'Icon',
        props: {
            name: String
        },
        methods: {
            handleClick(evt) {
                this.$emit('click', evt);
            }
        }
    }
</script>
