<template>
  <Navbar :search="searchQuery" @update:search="searchQuery = $event" @go-home="goToHome" />
    <div class="page-title">
        <!-- <h1 class="name-project" v-if="nameProject()">{{this.namedProject}}</h1> -->
        <h1 style="color: white">Gerenciar Permissões</h1>
    </div>
  <div class="profile-container">
    <div class="profile-card">
      <ul v-if="usuarios.length">
        <li v-for="usuario in usuarios" :key="usuario.usuario.usuario_id" class="user-item">
  <div class="user-info">
    <span class="user-name">{{ usuario.usuario.nome }}</span>
    <div class="action-buttons">
      <button @click="selecionarUsuario(usuario)">Editar</button>
      <button @click="excluirUsuario(usuario.usuario.usuario_id, usuario.usuario.nome)">Desativar</button>
    </div>
  </div>

  <div v-if="usuarioSelecionado?.usuario?.usuario_id === usuario.usuario.usuario_id" class="permissoes-box">
    <h4>Alterar cargo:</h4>
    <div class="roles">
    <select name="roles" id="roles" v-model="usuarioSelecionado.usuario.roule">
        <option value="super">Super</option>
        <option value="admin">Admin</option>
        <option value="gestor">Gestor</option>
        <option value="user">User</option>
    </select>
    </div>
    <button @click="salvarPermissoes">Salvar</button>
  </div>
</li>

      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '../components/Navbar.vue';

export default {
    components: {
        Navbar
    },
  data() {
    return {
      usuarios: [],
      usuarioSelecionado: null
    };
  },
  methods: {
    async carregarUsuarios() {
      try {
        const res = await axios.get('http://localhost:3000/auth/getUsers', {
            withCredentials: true
        });
        
        this.usuarios = res.data.geAlltUsers;
        console.log("res: ", res.data.geAlltUsers);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        alert("Faça login para continuar")
        this.$router.push("/login");
      }
    //   
    },
    selecionarUsuario(usuario) {
        if (this.usuarioSelecionado?.usuario?.usuario_id === usuario.usuario.usuario_id) {
            // Se já está selecionado, desseleciona (fecha o box)
            this.usuarioSelecionado = null;
        } else {
            // Seleciona um novo usuário (abre o box)
            this.usuarioSelecionado = JSON.parse(JSON.stringify(usuario));
        }
    },
    async salvarPermissoes() {
      try {
        console.log("this.usuarioSelecionado: ", this.usuarioSelecionado.usuario.roule);
        await axios.put(`http://localhost:3000/auth//updateRouleUser`, {
                role: this.usuarioSelecionado.usuario.roule,
                usuario_id: this.usuarioSelecionado.usuario.usuario_id
            }, {
                withCredentials: true
            });
        this.usuarioSelecionado = null;
        this.carregarUsuarios();
      } catch (error) {
        console.error('Erro ao salvar permissões:', error);
      }
    },
    async excluirUsuario(id, nome) {
        if (!confirm(`Tem certeza que deseja desativar o usuario `+nome+`??`)) return;
      try {
        await axios.put(`http://localhost:3000/auth/disableUserById`, {
            usuario_id: id,
        }, {
            withCredentials: true
        });
        this.carregarUsuarios();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
      }
    },
    formatarPermissao(permissao) {
      // Converte camelCase para algo mais legível: ex: acessoFinanceiro -> Acesso Financeiro
      return permissao.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
  },
  mounted() {
    this.carregarUsuarios();
    this.interval = setInterval(this.carregarUsuarios, 5000);
  },
  beforeUnmount() {
    clearInterval(this.interval);
  }
};
</script>

<style>
.page-title {
  position: flex;
  text-align: center;
  /* align-items: center; */
  margin-top: -80px;
}

.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1f1f1f;
}

.profile-card {
  background-color: #2f2f2f;
  padding: 25px 90px 20px 90px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  text-align: center;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -150px;
}

.user-item {
  width: 100%;
  margin-top: 15px;
  background: #3a3a3a;
  padding: 10px;
  border-radius: 8px;
  color: white;
  list-style: none;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-name {
  font-weight: bold;
}

.action-buttons button {
  margin-left: 5px;
  background-color: #4f4f4f;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.action-buttons button:hover {
  background-color: #666;
}

.permissoes-box {
    display: flex;
  margin-top: 10px;
  background-color: #4b4b4b;
  padding: 10px;
  border-radius: 8px;
  text-align: left;
}

.permissoes-box button{
    margin-top: 23px;
    margin-left: 2px;
    height: 22px;
}

.checkbox-list {
  list-style: none;
  padding-left: 0;
}

.checkbox-list li {
  margin: 5px 0;
}

.roles {
    margin-top: 21px;
    margin-left: 5px;
}
</style>
