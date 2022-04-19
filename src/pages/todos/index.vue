<template>
    <div>
        <div class="d-flex justify-content-between mb-3">
      <h1>투두 리스트!</h1>
    <button 
      @click="moveToCreatePage"
      class="btn btn-primary" 
      type="">Create Todo</button>
  </div>

      <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <h4>count: {{count}}</h4>
  <h4>doubleCount: {{doubleCount}}</h4>
  <button @click="count++">Add on</button>
      <div class="flex-grow-1 me-2">
        <input 
          class="form-control" 
          type="text" 
          v-model="searchText" 
          @keyup.enter="searchTodo"
          placeholder="Search">
      </div>
      <hr>
      <!-- <TodoSimpleForm @add-todo="addTodo"/>       -->
      <div style="color: red">{{error}}</div>
      <div v-if="!todos.length">추가된 Todo가 없습니다.</div>
      <TodoList 
          :todos="todos" 
          @toggle-todo="toggleTodo" 
          @delete-todo="deleteTodo"/>
      <hr />
      <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li style="cursor: pointer" v-if="currentPage !== 1" class="page-item" @click="getTodos(currentPage -1)"><a class="page-link" href="#"> (( Previous</a></li>
        <li
            style="cursor: pointer"
            v-for="page in numberOfPages"
            :key="page" 
            class="page-item"
            :class="currentPage === page ? 'active' : '' "
        >
            <a class="page-link" @click="getTodos(page)">{{page}}</a>
        </li>
        <li style="cursor: pointer" v-if="numberOfPages !== currentPage" class="page-item" @click="getTodos(currentPage +1)"><a class="page-link" href="#">Next</a></li>
      </ul>
    </nav>
    <Toast /> 
    <div class="container">
        <router-view/>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
// import TodoSimpleForm from '@/components/TodoSimpleForm.vue';
import TodoList from '@/components/TodoList.vue';
import axios from 'axios'
import Toast from '@/components/Toast.vue'
import { useRouter } from 'vue-router'
import {useToast} from '@/composables/toast'
export default {
  components: {
    // TodoSimpleForm,
    TodoList,
  },
  setup() {
    // const name = 'gira';
    const router = useRouter();
    const error = ref('');
    const todoStyle = {
      textDecoration: 'line-through',
      color: 'gray'
    }
    const numberOfTodos = ref(0);
    const limit = 5;
    const currentPage = ref(1);
    const toggle = ref(false)

    // const toastMessage = ref('');
    // const toastAlert = ref('');
    // const showToast = ref(false)
    // const toastTiemout = ref(null)
    // const triggerToast = (message, type = 'success') => {
    //       showToast.value = true;
    //       toastAlert.value = type
    //       toastMessage.value = message;

    //       toastTiemout.value = setTimeout(() => {
    //         toastMessage.value = '';
    //         toastAlert.value = ''
    //         showToast.value = false;
    //       }, 3000)
    // }
    const {        
        toastMessage,
        toastAlert,
        showToast,
        triggerToast,
    } = useToast();
    const numberOfPages = computed(() => {
      return Math.ceil(numberOfTodos.value / limit);
    })
    const searchText = ref('');
    const moveToCreatePage = () => {
        router.push({
          name: "TodoCreate",
        })
    }
    const getTodos = async (page = currentPage.value) => {
      currentPage.value = page;
      try {
        // const res = await axios.get(`http://localhost:3000/todos?_page=${page}&_limit=${limit}`)
        const res = await axios.get(`http://localhost:3000/todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`)
        numberOfTodos.value = res.headers['x-total-count'];
        // console.log("todos",todos.value)
        // console.log("page",page)
        todos.value = res.data;
      } catch (err) {
        console.log(err)
        triggerToast('Something went wrong!', 'danger');
        error.value = "SOMTHING WORNG!!!@#!@#!!!"
      }

    }
    const todos = ref([])
    const update = () => {
      console.log('consloe.log')
    }

    const onToggle = () => {
      toggle.value = !toggle.value;
    }
    const deleteTodo = (index) =>{
      error.value = '';
      const id = todos.value[index].id;
      try {
          axios.delete('http://localhost:3000/todos/' + id)
          getTodos(1);
          // todos.value.splice(index, 1)
      } catch (err) {
          triggerToast('Something went wrong!', 'danger');
          console.log(err)
      }
      
    }
    getTodos();
    //PUT 데이터 전체를 업데이트
    //PATCH 부분 업데이트 !
    const addTodo = async (todo) => {
      error.value = '';
      //데이터 베이스에 투두를 저장
      try {
        // const res = await axios.post('http://localhost:3000/todos', {
        await axios.post('http://localhost:3000/todos', {
          subject: todo.subject,
          completed: todo.completed,
        })
        getTodos(1);
        // todos.value.push(res.data)
      } catch (err) {
        console.log(err);
        triggerToast('Something went wrong!', 'danger');

        error.value = "something Wrong Happen Now!"
      }
      // .then(res => {
      //   console.log('res', res)
      //   todos.value.push(res.data)
      // }).catch(err => {
      //   console.log(err);
      //   error.value = "something Wrong Happen Now!"
      // });
    }
    const toggleTodo = async (index, checked) => {
      error.value = '';
      const id = todos.value[index].id;
      try {
          await axios.patch('http://localhost:3000/todos/' + id, {
            completed: checked
          })
          todos.value[index].completed = checked
      } catch (error) {
          console.log(error);
          triggerToast('Something went wrong!', 'danger');

          error.value = "something Wrong Happen Now!"
      }
    }
   
    const count = ref(1);
    const doubleCount = computed(() => {
      return count.value * 2
    })
    //메소드는 인자로 받아서와 쓸수있지만
    // 컴퓨티드는 스테이트가 변경될때만 가능함
    // 컴퓨티드는 값을 저장하고 메소드는 저장하지않음
    let timeout = null;
    const searchTodo = () =>{
      clearTimeout(timeout)
      getTodos(1);
    }
    watch(searchText, () => {
      clearTimeout(timeout)
      timeout = setTimeout(()=>{
          getTodos(1);
      },1000)
    })

    // const filteredTodos = computed(() =>{
    //   if (searchText.value) {
    //     return todos.value.filter(todo =>{
    //       return todo.subject.includes(searchText.value);
    //     })
    //   }
    //   return todos.value;
    // })
    return {
      todos,
      update,
      toggle,
      onToggle,
      todoStyle,
      deleteTodo,
      addTodo,
      toggleTodo,
      count,
      doubleCount,
      searchText,
      searchTodo,
      // filteredTodos,
      moveToCreatePage,
      error,
      numberOfPages,
      currentPage,
      getTodos,
      Toast,
      toastMessage,
      toastAlert,
      showToast
    }
  }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    
  }
  .todo {
    color: gray;
    text-decoration: line-through;
  }
</style>
