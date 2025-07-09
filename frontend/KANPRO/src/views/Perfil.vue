<template>
    <Navbar :search="searchQuery" @update:search="searchQuery = $event" @go-home="goToHome" :profileImageUpdated="profileImageUpdated"/>
    <div class="page-title">
        <h1>Perfil do usuário {{ this.name }}</h1>
    </div>
    <div class="profile-container">
      <div class="profile-card">
          <img :src="profileImage || 'https://st4.depositphotos.com/11574170/25191/v/450/depositphotos_251916955-stock-illustration-user-glyph-color-icon.jpg'" class="logo" />
          <button class="edit-profile-image" @click="openFileDialog" title="Editar Imagem de Perfil">
                    🖉
                </button>
    <input
      type="file"
      ref="fileInput"
      style="display: none"
      accept="image/*"
      @change="handleFileChange"
    />
      <h1 class="title">Perfil</h1>
        <div class="form">
          <div class="form-group">
                <label for="nomeProjeto">Nome:</label>

                <div class="input-wrapper">
                    <input
                    id="nomeUsuario"
                    type="text"
                    v-model="name"
                    placeholder="Nome"
                    class="input"
                    :disabled="!editandoNome"
                    />

                    <div v-if="editandoNome" class="botoes-edicao">
                        <button class="botao-editar" @click="salvarNovoNome">💾</button>
                        <button class="botao-editar" @click="cancelarNovoNome">❌</button>
                    </div>

                    <div v-else class="botoes-edicao">
                        <button class="botao-editar" @click="editarNome">
                            <img src="../assets/editIco.png" height="16" />
                        </button>
                    </div>
                </div>
            </div>
          <div class="form-group">
                <label for="descricaoProjeto">Email:</label>

                <div class="input-wrapper">
                    <input
                    id="emailUsuario"
                    type="email"
                    v-model="email"
                    placeholder="Email"
                    class="input"
                    :disabled="!editandoEmail"
                    @keydown.enter="forgotPassword"
                    />

                    <div v-if="editandoEmail" class="botoes-edicao">
                        <button class="botao-editar" @click="salvarNovoEmail">💾</button>
                        <button class="botao-editar" @click="cancelarNovoEmail">❌</button>
                    </div>

                    <div v-else class="botoes-edicao">
                        <button class="botao-editar" @click="editarEmail">
                            <img src="../assets/editIco.png" height="16" />
                        </button>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="descricaoProjeto">Senha:</label>

                <div class="input-wrapper">
                    <input
                    id="Senha"
                    type="password"
                    v-model="password"
                    placeholder="Descricao"
                    class="input"
                    v-if="!editandoSenha"
                    />
                    <div class="form-group-senhas">
                    <input
                    id="SenhaAtual"
                    :type="showPasswordActual ? 'text' : 'password'"
                    v-model="senhaAtual"
                    placeholder="Senha Atual"
                    class="inputSenha"
                    v-if="editandoSenha"
                    />
                    <div class="password-toggle" @click="togglePasswordVisibility('actual')">
                        <i :class="showPasswordActual ? 'fas fa-eye-slash' : 'fas fa-eye'" v-if="editandoSenha"></i>
                    </div>
                    <input
                    id="SenhaNova"
                    :type="showPasswordNew ? 'text' : 'password'"
                    v-model="senhaNova"
                    placeholder="Nova Senha"
                    class="inputSenha"
                    v-if="editandoSenha"
                    />
                    <div class="password-toggle" @click="togglePasswordVisibility('new')">
                        <i :class="showPasswordNew ? 'fas fa-eye-slash' : 'fas fa-eye'" v-if="editandoSenha"></i>
                    </div>
                    <input
                    id="ConfirmaSenha"
                    :type="showPasswordConfirm ? 'text' : 'password'"
                    v-model="confirmaSenha"
                    placeholder="Confirmar Nova Senha"
                    class="inputSenha"
                    v-if="editandoSenha"
                    />
                    <div class="password-toggle" @click="togglePasswordVisibility('confirm')">
                        <i :class="showPasswordConfirm ? 'fas fa-eye-slash' : 'fas fa-eye'" v-if="editandoSenha"></i>
                    </div>
                      </div>
                    <div v-if="editandoSenha" class="botoes-edicao">
                        <button class="botao-editar" @click="salvarNovaSenha">💾</button>
                        <button class="botao-editar" @click="cancelarNovaSenha">❌</button>
                    </div>

                    <div v-else class="botoes-edicao" style="margin-left: 3px;">
                        <button class="botao-editar" @click="editarSenha">
                            <img src="../assets/editIco.png" height="16" />
                        </button>
                    </div>
                </div>
            </div>

<div class="form-group" v-if="!editandoTecnologias">
  <label>Tecnologias:</label>
  <div class="tecnologia-tags-container">
    <div class="tecnologia-tags">
      <span class="tag" v-for="tec in skills" :key="tec">{{ tec.tecnologia.descricao }}</span>
    </div>
    <button class="botao-editar" @click="editarTecnologias">
      <img src="../assets/editIco.png" height="16" />
    </button>
  </div>
</div>


<div class="form-group" v-else>
  <label>Tecnologias:</label>
  <div class="tecnologia-tags-container">
    <div class="checkbox-list">
      <label v-for="tec in todasTecnologias" :key="tec.tecnologia_id" class="checkbox-item">
        <input
          type="checkbox"
          :value="tec.tecnologia_id"
          v-model="tecnologiasSelecionadas"
        />
        {{ tec.descricao }}
      </label>
    </div>
    <div class="botoes-editar">
      <button class="botao-editar" @click="salvarTecnologias">💾</button>
      <button class="botao-editar" @click="cancelarEdicaoTecnologias">❌</button>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
    
</template>
<script>
    import Navbar from "../components/Navbar.vue";
    import Sidebar from '../components/Sidebar.vue';
    import axios from 'axios';
    export default {
        components: {
            Navbar,
            Sidebar,
        },
        data() {
            return {
                nomeProjeto: '',       
                novoNomeProjeto: '',   
                editandoNomeProjeto: false,
                descricaoProjeto: '',       
                novaDescricaoProjeto: '',   
                editandoDescricaoProjeto: false,
                todasTecnologias: [],
                tecnologiasSelecionadas: [], 
                tecnologiasBackup: [], 
                editandoTecnologias: false,
                participantes: [],
                tecnologias: [],
                idProjeto: 87, 
                showSugestaoModal: false,
                devSugestoes: [],
                allUsers: [],
                participantes: [],
                devsSelecionados: [],

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
                showPasswordActual: false,
                showPasswordNew: false,
                showPasswordConfirm: false,
                 profileImageUpdated: 0,
            };
        },
        mounted() {
            this.fetchProfile();
            fetch('http://localhost:3000/tecnologys/listTecnologys')
            .then(res => res.json())
            .then(data => {
            this.todasTecnologias = data;
            });
        },
        methods: {
          async fetchProfile() { 
      try {
        const response = await axios.get('http://localhost:3000/profile', {
          withCredentials: true
        });
        console.log("responsePerfil: ", response.data);
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
      this.name = this.oldName; 
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
        this.email = this.oldEmail
        alert(error.response.data.error);
      }
    },
    cancelarNovoEmail() {
      this.email = this.oldEmail; 
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
    togglePasswordVisibility(option) {
      if (option === 'actual') {
        this.showPasswordActual = !this.showPasswordActual;
      } else if (option === 'new') {
        this.showPasswordNew = !this.showPasswordNew;
      } else if (option === 'confirm') {
        console.log("option: ", option);
        console.log("this.showPasswordConfirm: ", this.showPasswordConfirm)
        this.showPasswordConfirm = !this.showPasswordConfirm;
      }
    },
    openFileDialog() {
      this.$refs.fileInput.click(); 
    },
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;
      console.log('Arquivo selecionado:', file);

      const formData = new FormData();
      formData.append('foto', file);
      console.log('FormData criado:', formData);
      try {
        const response = await axios.put(
          'http://localhost:3000/profile/includeUpdateProfileFoto',
          formData,
          {
            withCredentials: true
          });

        console.log('Upload realizado com sucesso:');
        this.profileImageUpdated++;  
        this.fetchProfile();
      } catch (error) {
        console.error('Erro no upload:', error);
      }
    },
            async salvarNomeProjeto() {
                console.log("this.nomeNomeProjeto: ", this.novoNomeProjeto);
                this.editandoNomeProjeto = false;
                const response = await axios.put(`http://localhost:3000/project/updateNameProject`, {
                    projeto_id: this.$route.params.id,
                    nomeProjeto: this.nomeProjeto,
                    }, {
                    withCredentials: true,
                });
            },
            cancelarEdicaoNomeProjeto() {
                this.novoNomeProjeto = this.nomeProjeto;
                this.editandoNomeProjeto = false;
            },
            async salvarDescricaoProjeto() {
                
                this.editandoDescricaoProjeto = false;
                const response = await axios.put(`http://localhost:3000/project/updateDescriptionProject`, {
                    projeto_id: this.$route.params.id,
                    descricaoProjeto: this.descricaoProjeto,
                    }, {
                    withCredentials: true,
                });
            },
            cancelarDescricaoProjeto() {
                this.novaDescricaoProjeto = this.descricaoProjeto;
                this.editandoDescricaoProjeto = false;
            },
            editarTecnologias() {
                this.tecnologiasSelecionadas = this.skills.map(t => t.tecnologia_id);
                this.tecnologiasBackup = [...this.tecnologiasSelecionadas];
                this.editandoTecnologias = true;
            },
            async salvarTecnologias() {
                this.editandoTecnologias = false;
                console.log("tenologiasSelecionadas: ", this.tecnologiasSelecionadas);
                const response = await axios.put(`http://localhost:3000/profile/updateProfileHabilidades`, {
                    habilidades: this.tecnologiasSelecionadas,
                    }, {
                    withCredentials: true,
                });
                this.fetchProfile(); 
            },
            cancelarEdicaoTecnologias() {
                this.tecnologiasSelecionadas = [...this.tecnologiasBackup]; 
                this.editandoTecnologias = false;
            },
            async buscarParticipantes() {
    try {
      const response = await axios.get(`http://localhost:3000/project/listParticipantes/${this.$route.params.id}`, {
        withCredentials: true,
      });
      console.log("response: ", response.data);
      this.participantes = response.data;
    } catch (error) {
      console.error("Erro ao buscar participantes:", error);
    }
  },
            async confirmarRemocao(participante) {
            const confirmacao = confirm(`Deseja realmente remover participante do projeto?`);
            if (!confirmacao) return;

            try {
            const response = await axios.delete(`http://localhost:3000/project/removeParticipante`, {
                data: {
                    projeto_id: this.$route.params.id,
                    usuario_id: participante.usuario_id,
                    projetoUsuario_id: participante.projetoUsuario_id
                },
                withCredentials: true
            });
            console.log("responseDeleteUser: ", response);
            if (response.statusText != "OK") throw new Error("Erro ao remover participante.");
            alert("Participante removido com sucesso!");
            this.buscarParticipantes();
            } catch (error) {
            console.error("Erro ao remover participante:", error);
            }
  },


  async adicionarParticipanteModal() {
    const sugestoesRes = await fetch(`http://localhost:3000/project/devSugestionProject/${this.$route.params.id}`, {
        credentials: "include"
      });      
      
      if (!sugestoesRes.ok) throw new Error("Erro ao buscar sugestões de devs");

      const sugestoes = await sugestoesRes.json();
      console.log("allUsersRes: ", sugestoes);
      this.devSugestoes = sugestoes.sugestaoDevs;
      this.allUsers = sugestoes.desenvolvedoresRestantes;
    this.showSugestaoModal = true;
  },

  fecharModal() {
    this.showSugestaoModal = false;
  },
  async adicionarDevsAoProjeto() {
    if (this.devsSelecionados.length <= 0){
      alert("Selecione pelo menos um participante!");
      return
    }
    try {
      const payload = {
        projeto_id: parseInt(this.$route.params.id),
        participantes_ids: this.devsSelecionados
      };

      const response = await axios.post('http://localhost:3000/project/addParticipantesProject', payload, {
        withCredentials: true
      });
      console.log("response: ", response.data);
      alert('Participantes adicionados com sucesso!');
      this.showSugestaoModal = false;
      this.devsSelecionados = [];
      this.buscarParticipantes();
    } catch (error) {
      console.error('Erro ao adicionar participantes:', error);
      alert(`Erro: ${error.response.data.error}`);
    }
  },
  
        },
        computed: {
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
    }
</script>
<style scoped>
.sidebar {
    margin-top: 13px;
}

.page-title {
  position: flex;
  text-align: center;
  margin-top: -80px;
}
.profile-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent ;
    margin-top: 56px;
    overflow-x: hidden;
  }
  
  .profile-card {
    background-color: #2f2f2f;
    padding: 25px 90px 20px 90px;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
    text-align: center;
    width: 100%;
    height: 549px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -150px;
    overflow: auto;
    overflow-x: hidden;
  }
  
  .logo {
  width: 150px;
  height: 150px;
  border-radius: 100px;
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
    width: 100%;
  }
  .form-group-senhas {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: -900px;
  }

  .form-group label {
    margin-bottom: 4px;
    font-weight: bold;
    text-align: left;
    margin-left: -50px;
    margin-bottom: -5px;
  }
  
  .input {
    max-width: 450px;
    padding: 10px 15px;
    margin: 10px 0;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    background-color: #444;
    color: white;
    margin-left: -50px;
  }
  
  .input:disabled {
    opacity: 0.8;
  }
  
    .input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}

.input {
  flex-shrink: 0;      
  width: 100%;        
  max-width: 400px;     
  padding: 10px 15px;
  margin: 10px 0;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  background-color: #444;
  color: white;
  margin-left: -50px;
}

.inputSenha {
    max-width: 450px;
    width: 405px;
    padding: 10px 12px;
    margin: 10px 0;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    background-color: #444;
    color: white;
    margin-left: -50px;
}

.botoes-edicao {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;  
  flex-shrink: 0;
}

.botoes-editar {
  position: relative;
  left: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: -40px; 
  flex-shrink: 0;
}

.botao-editar {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #444;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.botoes-edicao-direita {
  justify-content: flex-end;
  width: 100%;
  margin-top: 10px;
}


.botao-editar:hover {
  background: #555;
}

.botao-editar img {
  pointer-events: none;
}

.tecnologia-tags {
  display: flex;
  position:relative;
  flex-wrap: wrap;
  width: 900px;
  gap: 8px;
  border: 1px solid transparent;          
  border-radius: 6px;             
  padding: 5px 10px;
  margin: 10px;              
  background-color: #444;          
  min-height: 38px;                
  cursor: default;                 
  box-sizing: border-box;          
  flex-shrink: 0;       
  width: 100%;        
  max-width: 430px;    
}

.tecnologia-tags-container {
  display: flex;
  align-items: center;
  position: relative;
  gap: 1px;
  width: 123%;
  margin-left: -60px;
}

.tag {
  background-color: #666;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 14px;
}

 .tecnologias-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 20px;
    margin-top: 10px;
  }
  
  .tecnologia-item {
    background-color: #3a3a3a;
    padding: 10px;
    border-radius: 8px;
    text-align: center;
    min-width: 100px;
  }

.checkbox-list {
    columns: 4;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  background-color: #444;
  padding: 10px;
  border-radius: 6px;
  margin-left: 10px;
  margin-top: 10px;
  width: 87%;
  box-sizing: border-box;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: white;
  font-size: 14px;
  width: 45%;
}

.checkbox-list input[type="checkbox"] {
  accent-color: red;
}

.participantes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 380px;
  margin-bottom: 10px;
}

.botao-adicionar {
  margin-left: 8px;
  background-color: #666;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  color: white;
}

.lista-participantes {
  margin-left: -50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 430px;
}

.participante {
  background-color: #444;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.acoes-participante button {
  margin-left: 8px;
  background-color: #666;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #1f1f1f;
  color: white;
  padding: 20px;
  border-radius: 10px;
  width: 600px; 
  height: 85vh;
  overflow-y: auto; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}


.modal h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

.modal label {
  display: block;
  margin-top: 10px;
  margin-bottom: 4px;
  font-weight: bold;
}

.modal input,
.modal textarea {
  width: 97%;
  padding: 8px;
  background: #2f2f2f;
  color: white;
  border: 1px solid #444;
  border-radius: 5px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  gap: 10px;
}

.modal-actions button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #444;
  color: white;
}

.modal-actions button:hover {
  background: #555;
}

.modal-checkbox-item {
  margin-top: 10px;
}

.modal-checkbox-label {
  align-items: center;
  gap: 8px; 
  cursor: pointer;
}

.password-toggle {
  width: 10px;
  height: 10px;
  position: relative;
  left: 350px;
  bottom: 35px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #000000;
}

.password-toggle:hover i {
  color: #808080; 
}

.edit-profile-image {
  margin-top: -40px;
  margin-left: 70px;
  background-color: rgba(114, 114, 114, 0.6);
  border-radius: 50%;
  border: none;
  color: #000000;
}

.edit-profile-image:hover{
  background-color: #c4c4c4;
}
</style>