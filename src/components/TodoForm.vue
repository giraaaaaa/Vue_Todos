<template>
<div>
  <!-- <h1>Todo Page</h1> -->
  <div v-if="loading">loading...</div>
  <form 
    v-else
    @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <!-- <div class="form-group">
          <label for="">Subject</label>
          <input 
            v-model="todo.subject" 
            type="text" 
            class="form-control">
        </div>
        <div v-if="subjectError" class="text-red">{{subjectError}}</div> -->
        <Input 
            label="Subject" 
            v-model:subejct="todo.subject"
            :error="subjectError" 
        />
      </div>
      <div class="col-6">
        <div class="form-group">
          <label for="">Status</label>
          <Text> 123</Text>
        </div>
      </div>
      <div  class="col-12">
        <div class="form-group">
          <label for="">Body</label>
          <textarea v-model="todo.body" class="form-control" cols="30" rows="10"></textarea>
        </div>
      </div>
    </div>
    <button 
      type="submit" 
      class="btn btn-primary"
      :disabled="!todoUpdated"
      >{{editing ? '수정' : '저장'}}</button>
    <button 
        type="button" 
      class="btn btn-outline-dark ms-2"
      @click="moveToTodoListPage">취소</button>
  </form>
  <transition name="fade">
    <Toast 
        v-if="showToast"
        :message="toastMessage"
        :type="toastAlert" />
  </transition>
  </div>
</template>
<script>
import {useRoute, useRouter} from 'vue-router'
import axios from 'axios'
import { ref, computed, onUpdated } from 'vue'
import _ from 'lodash'
import Toast from '@/components/Toast.vue'
import Input from '@/components/Input.vue'
import {useToast} from '@/composables/toast'

export default {
    components: {
      Toast,
      Input
    },
    props: {
        editing: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const todo = ref({
            subject: '',
            completed: false,
            body: '',
        })
        const subjectError = ref('');
        const originalTodo = ref(null)
        const loading = ref(false)
        const router = useRouter();
        const route = useRoute();
        const todoId = route.params.id;
        
        onUpdated(() => {
            console.log(todo.value.subject)
        })
        // const showToast = ref(false)
        // const toastMessage = ref('');
        // const toastAlert = ref('');
        // const tiemout = ref(null)
        // const triggerToast = (message, type = 'success') => {
        //   showToast.value = true;
        //   toastAlert.value = type
        //   toastMessage.value = message;

        //   tiemout.value = setTimeout(() => {
        //     toastMessage.value = '';
        //     toastAlert.value = ''
        //     showToast.value = false;
        //   }, 3000)
        // }

        const {        
            toastMessage,
            toastAlert,
            showToast,
            triggerToast,
        } = useToast();


        const todoUpdated =  computed(() => {
          return !_.isEqual(todo.value, originalTodo.value)
        })
        const getTodo = async () => {
            loading.value = true;
          try {
            const res = await axios.get(`http://localhost:3000/todos/${todoId}`)
            console.log(res)
            todo.value = {...res.data}
            originalTodo.value = {...res.data}
            loading.value = false;
            
          } catch (error) {
            loading.value = false;
            console.log(error)
              triggerToast('Something went wrong!', 'danger');
          }
        }
        if (props.editing) {
            getTodo();
        }
        const toggleTodoStatus = () => {
          todo.value.completed = !todo.value.completed;
        }

        const onSave = async () => {
            subjectError.value = ''
            if (!todo.value.subject) {
                subjectError.value = 'Subject is required'
                return;
            }
            try {
                let res;
                const data = {
                        subject: todo.value.subject,
                        completed: todo.value.complted,
                        body: todo.value.body
                }
                if (props.editing) {
                    res = await axios.put(`http://localhost:3000/todos/${todoId}`, data)
                    originalTodo.value = {...res.data}

                } else {
                    res = await axios.post(`http://localhost:3000/todos`, data)
                    todo.value.subject = '';
                    todo.value.body = '';
                }
            const message = props.editing ? '수정' : '저장' + '이 완료되었습니다.'
             
            triggerToast(message);

          } catch (error) {
            console.log(error)
            triggerToast('Something went wrong!', 'danger');
          }
                  }
        const moveToTodoListPage = () => {
          router.push({
            name: 'Todos'
          })
        }
        
        return {
            todo,
            loading,
            onSave,
            toggleTodoStatus,
            moveToTodoListPage,
            todoUpdated,
            showToast,
            toastMessage,
            toastAlert,
            subjectError
        }
    }
}
</script>

<style scoped>
    .text-red {
        color: red;
    }
    .fade-enter-active,
    .fade-leave-active {
        transition: all 0.5s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
        transform: translateY(-30px);
    }

    .fade-enter-to,
    .fade-leave-from {
        opacity: 1;
        transform: translateY(0px);
    }
</style>