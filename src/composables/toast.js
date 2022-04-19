import { ref, onUnmounted} from 'vue'

export const useToast = () => {
    const toastMessage = ref('');
    const toastAlert = ref('');
    const showToast = ref(false)
    const toastTiemout = ref(null)
    const triggerToast = (message, type = 'success') => {
          showToast.value = true;
          toastAlert.value = type
          toastMessage.value = message;

          toastTiemout.value = setTimeout(() => {
            toastMessage.value = '';
            toastAlert.value = ''
            showToast.value = false;
          }, 3000)
    }
    onUnmounted(() => {
        clearTimeout(toastTiemout.value);
      })
    return {
        toastMessage,
        toastAlert,
        showToast,
        triggerToast,
    }
}