<template>
    <Navbar :search="searchQuery" @update:search="searchQuery = $event" @go-home="goToHome" />
    <div class="sidebar">
      <Sidebar @navigate="handleSidebarClick" />
    </div>
    <div class="page-title">
        <h1 style="color: white">Propriedades do Projeto</h1>
    </div>
    <div class="profile-container">
      <div class="profile-card">
  
        <div class="form">
          <div class="form-group">
                <label for="nomeProjeto">Nome do projeto:</label>

                <div class="input-wrapper">
                    <input
                    id="nomeProjeto"
                    type="text"
                    v-model="nomeProjeto"
                    placeholder="Nome do projeto"
                    class="input"
                    :disabled="!editandoNomeProjeto"
                    />

                    <div v-if="editandoNomeProjeto" class="botoes-edicao">
                        <button class="botao-editar" @click="salvarNomeProjeto(nomeProjeto)">💾</button>
                        <button class="botao-editar" @click="cancelarEdicaoNomeProjeto">❌</button>
                    </div>

                    <div v-else class="botoes-edicao">
                        <button class="botao-editar" @click="editandoNomeProjeto = true">
                            <img src="../assets/editIco.png" height="16" />
                        </button>
                    </div>
                </div>
            </div>
          <div class="form-group">
                <label for="descricaoProjeto">Descricao:</label>

                <div class="input-wrapper">
                    <input
                    id="descricaoProjeto"
                    type="text"
                    v-model="descricaoProjeto"
                    placeholder="Descricao"
                    class="input"
                    :disabled="!editandoDescricaoProjeto"
                    @keydown.enter="forgotPassword"
                    />

                    <div v-if="editandoDescricaoProjeto" class="botoes-edicao">
                        <button class="botao-editar" @click="salvarDescricaoProjeto">💾</button>
                        <button class="botao-editar" @click="cancelarDescricaoProjeto">❌</button>
                    </div>

                    <div v-else class="botoes-edicao">
                        <button class="botao-editar" @click="editandoDescricaoProjeto = true">
                            <img src="../assets/editIco.png" height="16" />
                        </button>
                    </div>
                </div>
            </div>

<div class="form-group" v-if="!editandoTecnologias">
  <label>Tecnologias:</label>
  <div class="tecnologia-tags-container">
    <div class="tecnologia-tags">
      <span class="tag" v-for="tec in tecnologias" :key="tec">{{ tec.tecnologia.descricao }}</span>
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



          <div class="form-group">
  <div class="participantes-header">
    <label>Participantes:</label>
    <button class="botao-adicionar" @click="adicionarParticipanteModal">Adicionar Participantes</button>
  </div>

  <div class="lista-participantes">
    <div class="participante" v-for="p in participantes" :key="p.id">
        {{ console.log("p: ", p) }}
      <span class="nome-participante">{{ p.usuario.nome }}</span>
      <div class="acoes-participante">
        <button @click="confirmarRemocao(p)">Remover</button>
      </div>
    </div>
  </div>
</div>
<div v-if="showSugestaoModal" class="modal-overlay">
    <div class="modal">
      <div class="flex items-center gap-2 mb-2">
        <h2 class="text-lg font-semibold">
          Sugestões de desenvolvedores:
          <i
            class="fas fa-info-circle text-blue-500 cursor-pointer text-xs"
            title="Esses são os desenvolvedores que trabalham com a(s) mesma(s) tecnologia(s) do projeto"
          ></i>
        </h2>
      </div>

      <div
        v-for="dev in devSugestoesFiltrados"
        :key="'sugestao-' + dev.usuario_id"
        class="modal-checkbox-item"
      >
        <label class="modal-checkbox-label">
          <input
            type="checkbox"
            :value="dev.usuario_id"
            v-model="devsSelecionados"
            class="checkbox-input"
          />
          <span class="checkbox-nome">{{ dev.nome }}</span>
        </label>
      </div>

      <div class="flex items-center gap-2 mt-4 mb-2">
        <h2 class="text-lg font-semibold">
          Outros desenvolvedores:
          <i
            class="fas fa-info-circle text-blue-500 cursor-pointer text-xs"
            title="Esses são os outros desenvolvedores que não trabalham com a(s) mesma(s) tecnologia(s) do projeto"
          ></i>
        </h2>
      </div>

      <div
        v-for="dev in allUsersFiltrados"
        :key="'outros-' + dev.usuario_id"
        class="modal-checkbox-item"
      >
        <label class="modal-checkbox-label">
          <input
            type="checkbox"
            :value="dev.usuario_id"
            v-model="devsSelecionados"
            class="modal-checkbox-input"
          />
          <span class="checkbox-nome">{{ dev.nome }}</span>
        </label>
      </div>

      <div class="modal-actions mt-4">
        <button @click="adicionarDevsAoProjeto" :disabled="devsSelecionados.length === 0">
          Adicionar Selecionados
        </button>
        <button @click="fecharModal">Fechar</button>
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
            };
        },
        mounted() {
            this.buscarParticipantes();
            this.buscarDetalhesProjeto();
            fetch('http://localhost:3000/tecnologys/listTecnologys')
            .then(res => res.json())
            .then(data => {
            this.todasTecnologias = data;
            });
        },
        computed: {
    participantesIds() {
      return this.participantes.map(p => p.usuario_id);
    },
    devSugestoesFiltrados() {
      return this.devSugestoes.filter(dev => !this.participantesIds.includes(dev.usuario_id));
    },
    allUsersFiltrados() {
      return this.allUsers.filter(dev => !this.participantesIds.includes(dev.usuario_id));
    },
  },
        methods: {
            async buscarDetalhesProjeto() {
                try {
                    const response = await axios.get(`http://localhost:3000/project/${this.$route.params.id}`, {
                        withCredentials: true,
                    });
                    console.log("response project: ", response.data);
                    this.nomeProjeto = response.data.nome;
                    this.descricaoProjeto = response.data.descricao;
                    this.tecnologias = response.data.tecnologias;
                } catch (error) {
                    alert("Faça login para continuar")
                    this.$router.push("/login");
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
                this.tecnologiasSelecionadas = this.tecnologias.map(t => t.tecnologia_id);
                this.tecnologiasBackup = [...this.tecnologiasSelecionadas]; 
                this.editandoTecnologias = true;
            },
            async salvarTecnologias() {
                this.editandoTecnologias = false;
                console.log("tenologiasSelecionadas: ", this.tecnologiasSelecionadas);
                const response = await axios.put(`http://localhost:3000/project/updateTecsProject`, {
                    projeto_id: this.$route.params.id,
                    tecnologias: this.tecnologiasSelecionadas,
                    }, {
                    withCredentials: true,
                });
                this.buscarDetalhesProjeto();
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

  abrirPermissoes(participante) {
    alert(`Abrir permissões para ${participante.nome}`);
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
    width: 100%;
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

</style>