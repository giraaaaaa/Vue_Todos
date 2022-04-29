<template>
    <Modal>
        <template #title>
            삭제하기!!
        </template>
        <template #body>
            정말 삭제하시겠습니까?
        </template>
        <template #footer>
            <button @click="onClose" type="button" class="btn btn-secondary" data-dismiss="modal">취소</button>
            <button @click="onDelete" type="button" class="btn btn-danger">삭제하기</button>
        </template>
    </Modal>
</template>

<script>
import Modal from '@/components/Modal.vue'
export default {
        components: {
            Modal
        },
        setup(props, {emit}) {
        const onClose = () => {
            emit('close')
        }
        const onDelete = () => {
            emit('delete')
        }
        return {
            onClose,
            onDelete,
        }
    }
}
</script>

<style>

</style>