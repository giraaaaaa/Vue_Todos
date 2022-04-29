<template>
    <div class="form-group">
        <label for="">{{ label }}</label>
        <input 
        :value="subject"
        @input="onInput"
        type="text" 
        class="form-control">
        <div v-if="subjectError" class="text-red">
            {{error}}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            tyle: String,
            requried: true
        },
        error: {
            tyle: String,
            requried: true
        },
        subject: {
            tyle: String,
            requried: true
        }
    },
    setup(props, { emit}) {
        const onInput = (e) => {
            emit('update:subject', e.target.value);
        }
        return {
            onInput
        }
    }
}
</script>

<style scoped>
    .text-red {
        color: red;
    }
</style>