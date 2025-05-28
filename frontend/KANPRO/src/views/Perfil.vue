<template>
  <Navbar :search="searchQuery" @update:search="searchQuery = $event" @go-home="goToHome" />
    <div class="page-title">
        <!-- <h1 class="name-project" v-if="nameProject()">{{this.namedProject}}</h1> -->
        <h1>Perfil do usuario {{ this.name }}</h1>
    </div>
    <div class="profile-container">
      <div class="profile-card">
        <img src="../assets/icon.png" class="logo" alt="Logo" />
        <h1 class="title">Perfil</h1>
  
        <div class="form">
          <div class="form-group">
            <label>Usuário:</label>
            <input type="text" v-model="name" placeholder="Nome" class="input" disabled />
          </div>

          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="email" placeholder="Email" class="input" disabled />
          </div>

          <div class="form-group">
            <label>Habilidades:</label>
            <input type="text" v-model="skills" placeholder="Habilidades" class="input" disabled />
          </div>

          <div class="button-group">
            <button class="edit-button" @click="editProfile">Editar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Navbar from "../components/Navbar.vue";
  export default {
    data() {
      return {
        name: '',
        email: '',
        skills: [],
      };
    },
      components: {
      Navbar
    },
    mounted() {
      this.fetchProfile();
    },
    methods: {
        async fetchProfile() {
          try {
                const response = await axios.get('http://localhost:3000/profile', {
                withCredentials: true
                
            });
            //console.log("response: ", response);
            this.name = response.data.nome;
            this.email = response.data.login.email;
            // response.data.habilidades.forEach(skill => {
            //     this.skills.push(skill.tecnologia.descricao);
            // });
            this.skills = response.data.habilidades
              .map(skill => skill.tecnologia.descricao)
              .join(', ');
          } catch (error) {
            alert("Faça login para continuar")
            this.$router.push("/login");
          }
    },
      editProfile() {
        window.location.href = '/editar-perfil';
      },
      logout() {
        fetch('http://localhost:3000/auth/logout', {
          method: 'POST',
          credentials: 'include',
        }).then(() => {
          window.location.href = '/';
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .page-title {
    position: flex;
    text-align: center;
    /* align-items: center; */
    /* margin-top: -80px; */
  }
  .profile-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 770px;
    background-color: #1f1f1f;
    margin-top: 43px;
    overflow: auto;
  }
  
  .profile-card {
    background-color: #2f2f2f;
    padding: 25px 90px 20px 90px;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
    text-align: center;
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -150px;
  }
  
  .logo {
    width: 100px;
    height: 100px;
    margin-bottom: 10px;
  }
  
  .title {
    font-size: 40px;
    color: white;
    margin-bottom: 32px;
  }
  
  .form {
    width: 100%;
    max-width: 400px;
    margin: auto;
    display: flex;
    flex-direction: column;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
  }

  .form-group label {
    margin-bottom: 4px;
    font-weight: bold;
    text-align: left;
  }
  
  .input {
    width: 100%;
    padding: 10px 15px;
    margin: 10px 0;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    background-color: #444;
    color: white;
  }
  
  .input:disabled {
    opacity: 0.8;
  }
  
  .button-group {
    display: flex;
    width: 100%;
    gap: 10px;
    margin-top: 10px;
  }
  
  .edit-button,
  .logout-button {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .edit-button {
    background-color: #4caf50;
    color: white;
  }
  
  .edit-button:hover {
    background-color: #45a049;
  }
  
  .logout-button {
    background-color: #f44336;
    color: white;
  }
  
  .logout-button:hover {
    background-color: #e53935;
  }
  </style>
  