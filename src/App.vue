<template>
<div>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link class="navbar-brand" :to="{ name: 'Home'}">Gira Coder</router-link>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link class="nav-link active" aria-current="page" :to="{ name: 'Todos'}">Todos</router-link>
        </li>
      </ul>
    </div>
  </nav>

  <router-view/>

</div>
    
</template>

<script>

</script>

<style>

</style>
