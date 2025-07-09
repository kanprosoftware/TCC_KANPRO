<template>
  <Navbar :search="searchQuery" @update:search="searchQuery = $event" @go-home="goToHome" />
  <div class="page-title">
    <h1>Perfil do usuário {{ this.name }}</h1>
  </div>
  <div class="profile-container">
    <div class="profile-card">
      {{ console.log("profileImame: ", profileImage) }}
      <img :src="profileImage" class="logo" alt="Imagem de perfil" />
      <h1 class="title">Perfil</h1>

      <div class="form">
        <!-- Nome -->
        <div class="form-group">
          <div class="form-info">
            <label>Nome:</label>
            <input type="text" v-model="name" placeholder="Nome" class="input" :disabled="!editandoNome" />
          </div>
          <div class="botoes-edicao">
            <template v-if="editandoNome">
              <button class="botao-editar" @click="salvarNovoNome">💾</button>
              <button class="botao-editar" @click="cancelarNovoNome">❌</button>
            </template>
            <template v-else>
              <button class="botao-editar" @click="editarNome">
                <img src="../assets/editIco.png" height="16" />
              </button>
            </template>
          </div>
        </div>

        <!-- Email -->
        <div class="form-group">
          <div class="form-info">
            <label>Email:</label>
            <input type="email" v-model="email" placeholder="Email" class="input" :disabled="!editandoEmail" />
          </div>
          <div class="botoes-edicao">
            <template v-if="editandoEmail">
              <button class="botao-editar" @click="salvarNovoEmail">💾</button>
              <button class="botao-editar" @click="cancelarNovoEmail">❌</button>
            </template>
            <template v-else>
              <button class="botao-editar" @click="editarEmail">
                <img src="../assets/editIco.png" height="16" />
              </button>
            </template>
          </div>
        </div>

        <!-- Senha -->
<!-- Senha -->
<div class="form-group">
  <div class="form-info" style="flex-direction: column;">
    <label>Senha:</label>
    <input type="password" v-model="password" v-if="!editandoSenha" placeholder="Senha" class="input" disabled />
    <input type="password" v-model="senhaAtual" v-if="editandoSenha" placeholder="Senha atual" class="input" style="margin-bottom: 10px;"/>
    <input type="password" v-model="senhaNova" v-if="editandoSenha" placeholder="Nova senha" class="input" style="margin-bottom: 10px;"/>
    <input type="password" v-model="confirmaSenha" v-if="editandoSenha" placeholder="Confirmar nova senha" class="input" />
  </div>
  <div class="botoes-edicao">
    <template v-if="editandoSenha" class="botoes-editar">
      <button class="botao-editar" @click="salvarNovaSenha">💾</button>
      <button class="botao-editar" @click="cancelarNovaSenha">❌</button>
    </template>
    <template v-else>
      <button class="botao-editar" @click="editarSenha">
        <img src="../assets/editIco.png" height="16" />
      </button>
    </template>
  </div>
</div>


        <!-- Habilidades -->
        <div class="form-group">
          <div class="form-info">
            <label>Habilidades:</label>
            <div class="tecnologia-tags">
              <span class="tag" v-for="tec in skills" :key="tec">{{ tec.tecnologia.descricao }}</span>
            </div>
          </div>
          <div class="botoes-edicao">
            <button class="botao-editar" @click="editarTecnologias">
              <img src="../assets/editIco.png" height="16" />
            </button>
          </div>
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
      oldName: '',
      email: '',
      oldEmail: '',
      password: '*********************',
      senhaAtual: '',
      senhaNova: '',
      confirmaSenha: '',
      skills: [],
      editandoNome: false,
      editandoEmail: false,
      editandoSenha: false,
      editandoTecnologias: false,
      profileImage: '',
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
        this.name = response.data.nome;
        this.email = response.data.login.email;
        this.skills = response.data.habilidades;
        this.profileImage = response.data.login.profile_image
      } catch (error) {
        alert("Faça login para continuar");
        this.$router.push("/login");
      }
    },
    editarNome() {
      this.editandoNome = true;
      this.oldName = this.name;
    },
    async salvarNovoNome() {
      console.log('Salvar clicado');
      try {
        const response = await axios.put('http://localhost:3000/profile/updateProfileName', {
          nome: this.name
        }, {
          withCredentials: true
        });
        this.editandoNome = false;
      } catch (error) {
        console.error('Erro ao salvar nome:', error);
        alert('Erro ao salvar nome. Tente novamente.');
      }
    },
    cancelarNovoNome() {
      this.name = this.oldName; // Reset to original name
      this.editandoNome = false;
    },
    editarEmail() {
      this.editandoEmail = true;
      this.oldEmail = this.email;
    },
    async salvarNovoEmail() {
      console.log('Salvar clicado');
      try {
        this.editandoEmail = false;
        const response = await axios.put('http://localhost:3000/profile/updateProfileEmail', {
          emailAtual: this.oldEmail,
          emailNovo: this.email
        }, {
          withCredentials: true
        });
      
        console.log('Email salvo com sucesso:', response);
        
        alert('Um email de verificação foi enviado. Por favor, verifique sua caixa de entrada.');
        
        
      } catch (error) {
        console.error('Erro ao salvar email:', error);
        alert('Erro ao salvar email. Tente novamente.');
      }
    },
    cancelarNovoEmail() {
      this.email = this.oldEmail; // Reset to original email
      this.editandoEmail = false;
    },
    editarSenha() {
      this.editandoSenha = true;
    },
    async salvarNovaSenha() {
      console.log("this.senhaAtual: ", this.senhaAtual);
      console.log("this.senhaNova: ", this.senhaNova);
      console.log("this.confirmaSenha: ", this.confirmaSenha);
      if (!this.senhaAtual || !this.senhaNova || !this.confirmaSenha) {
          alert("Preencha todos os campos de senha!");
          return;
      }
      if (this.senhaNova.length < 6 || this.confirmaSenha.length < 6) {
        alert("A nova senha deve ter pelo menos 6 caracteres!");
        return;
      }
      if (this.senhaNova !== this.confirmaSenha) {
        alert("As novas senhas não coincidem!");
        return;
      }
      try {
        const response = await axios.put('http://localhost:3000/profile/updateProfileSenha', {
          senhaAtual: this.senhaAtual,
          senhaNova: this.senhaNova
        }, {
          withCredentials: true
        });
        console.log('Senha atualizada com sucesso:', response);
        alert('Senha atualizada com sucesso!');
      } catch (error) {
        console.log('Erro ao atualizar senha:', error);
        alert(error.response.data.error);
      }
      this.editandoSenha = false;
    },
    cancelarNovaSenha() {
      this.editandoSenha = false;
    },
    editarTecnologias() {
      this.editandoTecnologias = true;
    }
  }
};
</script>

<style scoped>
.page-title {
  text-align: center;
}

.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1f1f1f;
  margin-top: 20px;
  height: 800px;
  overflow: auto  ;
}

.profile-card {
  background-color: #2f2f2f;
  padding: 25px 90px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  text-align: center;
  height: 550px;
  max-width: 500px;
  width: 100%;
  margin-top: -150px;
  overflow: auto;
}

.logo {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
}

.title {
  font-size: 40px;
  color: white;
  margin-top: -5px;
  margin-bottom: 32px;
}

.form {
  width: 100%;
  margin-top: -20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.form-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  font-weight: bold;
  margin-bottom: 4px;
  color: white;
}

.input {
  flex-shrink: 0;       /* impede o input de encolher */
  width: 110%;          /* ocupa todo o espaço possível */
  max-width: 420px;     /* limite máximo para manter o layout controlado */
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  background-color: #444;
  color: white;
}

.input:disabled {
  opacity: 0.8;
}

.botoes-edicao {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-left: 5px;  /* espaçamento entre o input e os botões */
  margin-top: 30px;
  flex-shrink: 0;
}

.botao-editar {
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #444;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* .botoes-edicao {
  position: relative;
  left: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  /* margin-left: -40px;  espaçamento entre o input e os botões 
  flex-shrink: 0;
} */

.botao-editar:hover {
  background: #555;
}

.tecnologia-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 5px 10px;
  background-color: #444;
  border-radius: 6px;
  color: white;
}

.tag {
  background-color: #666;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 14px;
}
</style>
