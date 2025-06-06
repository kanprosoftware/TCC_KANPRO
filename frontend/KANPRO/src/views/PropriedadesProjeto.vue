<template>
    <Navbar :search="searchQuery" @update:search="searchQuery = $event" @go-home="goToHome" />
    <div class="sidebar">
      <Sidebar @navigate="handleSidebarClick" />
    </div>
    <div class="page-title">
        <!-- <h1 class="name-project" v-if="nameProject()">{{this.namedProject}}</h1> -->
        <h1 style="color: white">Propriedades do Projeto</h1>
    </div>
    <div class="profile-container">
      <div class="profile-card">
        <!-- <h1 class="title">Perfil</h1> -->
  
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

          <!-- Exibição normal (sem edição) -->
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


<!-- Edição -->
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
    <!-- Botões no mesmo lugar do botão de editar -->
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
        <!-- <button @click="abrirPermissoes(p)">Permissões</button> -->
        <button @click="confirmarRemocao(p)">Remover</button>
      </div>
    </div>
  </div>
</div>
<div v-if="showSugestaoModal" class="modal-overlay">
    <div class="modal">
      <!-- Cabeçalho -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Adicionar desenvolvedores</h2>
        <button class="text-gray-500 hover:text-red-600" @click="fecharModal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Sugestões de Desenvolvedores -->
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

      <!-- Outros Desenvolvedores -->
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

      <!-- Ações -->
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
                nomeProjeto: '',       // nome salvo
                novoNomeProjeto: '',   // edição temporária
                editandoNomeProjeto: false,
                descricaoProjeto: '',       // nome salvo
                novaDescricaoProjeto: '',   // edição temporária
                editandoDescricaoProjeto: false,
                todasTecnologias: [],
                tecnologiasSelecionadas: [], // Estado atual
                tecnologiasBackup: [], // Armazena backup durante edição
                editandoTecnologias: false,
                participantes: [],
                tecnologias: [],
                idProjeto: 87, // Substitua com a lógica correta para obter o ID do projeto atual
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
                    // Aqui você pode redirecionar para login se quiser
                    this.$router.push("/login");
                }
            },
            async salvarNomeProjeto() {
                console.log("this.nomeNomeProjeto: ", this.novoNomeProjeto);
                // this.nomeProjeto = this.novoNomeProjeto;
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
                // console.log("this.nomeNomeProjeto: ", this.novoNomeProjeto);
                // this.nomeProjeto = this.novoNomeProjeto;
                // this.editandoNomeProjeto = false;
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
                this.tecnologiasBackup = [...this.tecnologiasSelecionadas]; // cria backup antes de editar
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
                this.tecnologiasSelecionadas = [...this.tecnologiasBackup]; // restaura do backup
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
                //console.log("participante: ", participante)
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
            // Recarrega a lista
            this.buscarParticipantes();
            } catch (error) {
            console.error("Erro ao remover participante:", error);
            }
  },

  abrirPermissoes(participante) {
    // Abre modal ou redireciona para tela de permissões
    alert(`Abrir permissões para ${participante.nome}`);
  },

  async adicionarParticipanteModal() {
    // Abre modal ou redireciona para tela de adicionar participante
    // alert("Abrir modal de adicionar participante");
    const sugestoesRes = await fetch(`http://localhost:3000/project/devSugestionProject/${this.$route.params.id}`, {
        credentials: "include"
      });
      // const allUsersRes = await fetch(`http://localhost:3000/auth/getUsers`, {
      //   credentials: "include"
      // });
      
      
      if (!sugestoesRes.ok) throw new Error("Erro ao buscar sugestões de devs");

      const sugestoes = await sugestoesRes.json();
      //const users = await allUsersRes.json();
      console.log("allUsersRes: ", sugestoes);
      //console.log("sugestoes: ", sugestoes);
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
      //this.showSugestaoModal = false;
    }
  },
  
        }
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
.profile-container {
    display: flex;
    justify-content: center;
    align-items: center;
    /* height: 500px; */
    background: transparent ;
    margin-top: 56px;
    /* overflow: auto; */
  }
  
  .profile-card {
    background-color: #2f2f2f;
    padding: 25px 90px 20px 90px;
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
    text-align: center;
    width: 100%;
    /* max-width: 800px; */
    /* max-height: 450px; */
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
  flex-shrink: 0;       /* impede o input de encolher */
  width: 100%;          /* ocupa todo o espaço possível */
  max-width: 400px;     /* limite máximo para manter o layout controlado */
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
  margin-left: 12px;  /* espaçamento entre o input e os botões */
  flex-shrink: 0;
}

.botoes-editar {
  position: relative;
  left: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: -40px;  /* espaçamento entre o input e os botões */
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
  /* left: -60px; */
  width: 900px;
  gap: 8px;
  border: 1px solid transparent;          /* borda padrão */
  border-radius: 6px;              /* borda arredondada igual inputs */
  padding: 5px 10px;
  margin: 10px;               /* espaço interno para "respirar" */
  background-color: #444;          /* mesma cor de fundo dos inputs */
  min-height: 38px;                /* altura mínima semelhante a input */
  cursor: default;                 /* cursor padrão, não editável */
  box-sizing: border-box;          /* para padding não aumentar tamanho */
  flex-shrink: 0;       /* impede o input de encolher */
  width: 100%;          /* ocupa todo o espaço possível */
  max-width: 430px;     /* limite máximo para manter o layout controlado */
}

.tecnologia-tags-container {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  position: relative;
  gap: 1px;
  width: 123%;
  /* max-width: 3000px; */
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
    /* flex-direction: column; */
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
  /* max-width: 1000px; */
  box-sizing: border-box;
  /* flex: 1; */
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
  /* margin-left: -10px; */
  margin-bottom: 10px;
}

.botao-adicionar {
  /* background-color: #4CAF50;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer; */
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
  width: 600px; /* aumentei um pouco a largura para comportar 4 colunas */
  height: 85vh;
  overflow-y: auto; /* scroll automático se passar da tela */
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
  /* display: flex; */
  align-items: center;
  gap: 8px; /* espaço entre checkbox e nome */
  cursor: pointer;
}

</style>