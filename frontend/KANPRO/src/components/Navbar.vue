<template>
    <nav class="navbar">
      <div class="nav-left">
        <img src="../assets/icon.png" class="logo" @click.prevent="goToHome" title="Tela Inicial" />
        <input
          v-if="showSearchBar"
          type="text"
          :placeholder="searchPlaceholder"
          class="search-input"
          v-model="searchQuery"
          @input="$emit('update:search', searchQuery)"
        />
      </div>
      <div class="nav-center">
        <slot name="titulo"></slot>
      </div>
      <div class="nav-right">
        <div class="user-menu" ref="menu" @click="toggleDropdown">
          <img :src="profileImage || 'https://st4.depositphotos.com/11574170/25191/v/450/depositphotos_251916955-stock-illustration-user-glyph-color-icon.jpg'" class="user-avatar" />

          <div class="dropdown" v-if="showDropdown">
            <a @click.prevent="goToProfile">Perfil</a>
            <a href="/permissoes" v-if="showPermission">Permissões</a>
            <a href="#" @click.prevent="logout">Logout</a>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    props: {
      search: String,
      profileImageUpdated: Number,
    },
    data() {
      return {
        searchQuery: this.search || "",
        showDropdown: false,
        userRole: '',
        showPermission: false,
        profileImage: '',
      };
    },
    watch: {
      '$route.path'() {
        this.searchQuery = ""; 
      },
      search(newVal) {
        this.searchQuery = newVal;
      },
      userRole(novo) {
        this.showPermission = ['super', 'admin', 'gestor'].includes(novo);
      },
      profileImageUpdated() {
        this.fetchUserRole();
      }
    },
    methods: {
      goToProfile() {
        this.$router.push('/perfil');
      },
      async goToHome() {
        this.$router.push("/projetos");
      },
      toggleDropdown() {
        this.showDropdown = !this.showDropdown;
      },
      handleClickOutside(event) {
        if (
          this.showDropdown &&
          this.$refs.menu &&
          !this.$refs.menu.contains(event.target)
        ) {
          this.showDropdown = false;
        }
      },
      async logout() {
        console.log("Logout clicado"); 
        try {
          const response = await fetch("http://localhost:3000/auth/logout", {
            method: "POST",
            credentials: "include" 
          });
  
          if (response.ok) {
            const jsonResponse = await response.json();
      
            window.location.href = "/";
          } else {
            const jsonResponse = await response.json();
      
            console.error("Erro ao fazer logout");
            console.error(jsonResponse);
          }
        } catch (error) {
          console.error("Erro na requisição de logout:", error);
        }
      },
      async fetchUserRole() {
        try {
          const response = await axios.get('http://localhost:3000/profile', {
            withCredentials: true
          });
          console.log("responseNavBar: ", response.data);
          this.userRole = response.data.roule; 
          this.profileImage = response.data.login.profile_image;
        } catch (error) {
          console.error('Erro ao buscar role do usuário:', error);
        }
      }
    },
    mounted() {
      document.addEventListener("click", this.handleClickOutside);
      this.fetchUserRole();
    },
    beforeUnmount() {
      document.removeEventListener("click", this.handleClickOutside);
    },
    computed: {
      searchPlaceholder() {
        const path = this.$route.path;
        console.log("path: ", path);
        if (path.includes("/projetos")) return "Pesquisar projetos...";
        if (path.includes("/projeto/")) return "Pesquisar tarefa...";
        return null;
      },
      showSearchBar() {
        return this.searchPlaceholder !== null;
      },
      profileImage() {
        console.log("profileImage: ", this.profileImage.conteudo);
        const image = this.profileImage.conteudo;
        console.log("conteudo: ", image);
        if (
          this.profileImage
        ) {
          const bytes = new Uint8Array(this.profileImage.conteudo.data);
          console.log("bytes: ", bytes);
          const blob = new Blob([bytes], { type: this.profileImage.tipo });
          console.log("blob: ", blob);
          return URL.createObjectURL(blob);
        }

      }
    }
  };
  </script>
  
  <style scoped>
  .navbar {
    background: #2f2f2f;
    color: white;
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 97.3%;
  }
  
  
  .nav-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .logo {
    height: 32px;
    width: 32px;
    cursor: pointer;
    background: white;
  }
  
  .search-input {
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    outline: none;
    width: 250px;
  }
  
  .nav-right {
    display: flex;
    align-items: center;
    position: relative;
  }
  
  .nav-center {
    /* display: flex; */
    align-items: center;
    position:fixed;
    left: 640px;
    top: -17px;
    font-size: 21.4px;
  }

  .user-menu {
    cursor: pointer;
    position: relative;
  }
  
  .user-avatar {
    height: 40px;
    width: 40px;
    border-radius: 50%;
  }
  
  .dropdown {
    position: absolute;
    right: 0;
    top: 50px;
    background: #2f2f2f;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    z-index: 999;
  }
  
  .dropdown a {
    display: block;
    padding: 10px 15px;
    color: white;
    text-decoration: none;
    transition: background 0.2s;
  }
  .dropdown a:hover {
    background: #444;
  }

@media (max-width: 1017px) {
  .navbar {
    width: 30%;
  }
}

@media (max-width: 1500px) {
  .navbar {
    width: 97.1%;
  }
  .search-input {
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    outline: none;
    width: 100%;
  }
}
  </style>
  