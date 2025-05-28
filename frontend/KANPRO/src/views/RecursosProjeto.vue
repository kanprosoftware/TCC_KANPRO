<template>
    <Navbar :search="searchQuery" @update:search="searchQuery = $event" @go-home="goToHome" />
    <div class="sidebar">
      <Sidebar @navigate="handleSidebarClick" />
    </div>
    <div class="page-title">
        <!-- <h1 class="name-project" v-if="nameProject()">{{this.namedProject}}</h1> -->
        <h1 style="color: white">Recursos do Projeto</h1>
    </div>
</template>
<script>
import Navbar from "../components/Navbar.vue";
import Sidebar from '../components/Sidebar.vue';
export default {
  components: {
    Navbar,
    Sidebar,
  },
}
</script>
<style scoped>
.sidebar {
    /* margin-top: 15px; */
    margin-top: 13px;
}

.page-title {
  position: flex;
  text-align: center;
  /* align-items: center; */
  margin-top: -80px;
}
</style>