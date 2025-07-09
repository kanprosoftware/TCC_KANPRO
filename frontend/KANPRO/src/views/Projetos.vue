<template>
  <div>
    <Navbar :search="searchQuery" @update:search="searchQuery = $event" @go-home="goToHome" />
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Criar Novo Projeto</h3>
        <label>Nome:</label>
        <input v-model="newProject.name" placeholder="Nome do projeto" />

        <label>Descrição:</label>
        <textarea v-model="newProject.description" placeholder="Descreva o projeto"></textarea>

        <label>Tecnologias:</label>
        <div class="tech-grid">
          <div
            v-for="(tecnologiasList, index) in tecnologiasList"
            :key="index"
            class="tecnologia-item"
          >
            <label>
              <input
                type="checkbox"
                :value="tecnologiasList.descricao"
                v-model="tecnologias"
              />
              {{ tecnologiasList.descricao }}
            </label>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="criarProjetoESugerir">Criar</button>
          <button @click="fecharModal">Cancelar</button>
        </div>
      </div>
    </div>
    <div v-if="showSugestaoModal" class="modal-overlay">
    <div class="modal">
  <div class="flex items-center gap-2">
    <h2 class="text-lg font-semibold">
      Sugestões de desenvolvedores: 
      <i
        class="fas fa-info-circle text-blue-500 cursor-pointer text-xs"
        title="Esses são os desenvolvedores que trabalham com a(s) mesma(s) tecnologia(s) do projeto"
      ></i>
    </h2>
  </div>

  <div
    v-for="dev in devSugestoes"
    :key="'sugestao-' + dev.usuario_id"
    class="checkbox-item"
  >
    <label class="checkbox-label">
      <input
        type="checkbox"
        :value="dev.usuario_id"
        v-model="devsSelecionados"
        class="checkbox-input"
      />
      <span class="checkbox-nome">{{ dev.nome }}</span>
    </label>
  </div>

  <div class="flex items-center gap-2">
    <h2 class="text-lg font-semibold">
      Outros desenvolvedores: 
      <i
        class="fas fa-info-circle text-blue-500 cursor-pointer text-xs"
        title="Esses são os outros desenvolvedores que nao trabalham com a(s) mesma(s) tecnologia(s) do projeto"
      ></i>
    </h2>
  </div>

  <div
    v-for="dev in allUsers"
    :key="'outros-' + dev.usuario_id"
    class="checkbox-item"
  >
    <label class="checkbox-label">
      <input
        type="checkbox"
        :value="dev.usuario_id"
        v-model="devsSelecionados"
        class="checkbox-input"
      />
      <span class="checkbox-nome">{{ dev.nome }}</span>
    </label>
  </div>

  <div class="modal-actions">
    <button @click="adicionarDevsAoProjeto" :disabled="devsSelecionados.length === 0">
      Adicionar Selecionados
    </button>
    <button @click="showSugestaoModal = false">Fechar</button>
  </div>
</div>
  </div>

    <main class="project-container">
      <div class="section">
        <div class="section-header">
          <h2>Meus Projetos</h2>
          <div class="button-group">
            <button @click="toggleDeleteMode">{{ showDeleteMode ? 'Cancelar' : 'Excluir Projeto' }}</button>
            <button @click="criarProjeto">Criar Projeto</button>
          </div>
        </div>
        <div class="grid">
          <div v-if="filteredUserProjects.length === 0" class="no-projects">Sem projetos</div>
          <router-link
            v-for="(project, index) in filteredUserProjects"
            :key="'user-' + index"
            :to="`/projeto/${project.id}`"
            class="project-card-link"
            :title="project.description"
          >
          <div class="project-card">
            {{ project.name }}
            <button
              v-if="showDeleteMode"
              class="delete-button"
              @click.stop.prevent="confirmarExclusaoProjeto(project.id)"
            >
              -
            </button>
          </div>
          </router-link>
        </div>
      </div>

      <div class="section">
        <h2>Projetos da Equipe</h2>
        <div class="grid">
          <div v-if="filteredTeamProjects.length === 0" class="no-projects">Sem projetos</div>
          <router-link
            v-for="(project, index) in filteredTeamProjects"
            :key="'team-' + index"
            :to="`/projeto/${project.id}`"
            class="project-card-link"
            :title="project.description"
          >
            <div class="project-card">
              {{ project.name }}
            </div>
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import axios from "axios";

export default {
  components: {
    Navbar
  },
  data() {
    return {
      searchQuery: "",
      showDropdown: false,
      userProjects: [],
      teamProjects: [],
      tecnologiasList: [],
      tecnologias: [],
      showModal: false,
      newProject: {
        name: "",
        description: "",
        technologiesInput: ""
      },
      showDeleteMode: false,
      projectName: "",
      projetoCriadoId: null,
      devSugestoes: [],
      allUsers: [],
      devsSelecionados: [],
      showSugestaoModal: false,
    };
  },
  async mounted() {
    try {
      const userRes = await fetch(`http://localhost:3000/project/listProjectsByDevId`, {
        method: "GET",
        credentials: "include"
      });
      const userData = await userRes.json();
      this.userProjects = userData.map(projeto => ({
        id: projeto.projeto_id,
        name: projeto.projeto.nome,
        description: projeto.projeto.descricao
      }));
      const teamRes = await fetch(`http://localhost:3000/project/listProjectsTeamByDevId`, {
        method: "GET",
        credentials: "include"
      });
      const teamData = await teamRes.json();
      console.log("teamData", teamData);
      this.teamProjects = teamData.map(projeto => ({
        id: projeto.projeto_id,
        name: projeto.projeto.nome,
        description: projeto.projeto.descricao
      }));
      console.log("userProjects", this.userProjects);
      const techRes = await fetch('http://localhost:3000/tecnologys/listTecnologys', {
        method: "GET",
        credentials: "include"
      });
      const techData = await techRes.json();
      this.tecnologiasList = techData;
    } catch (err) {
      console.error("Erro ao carregar projetos:", err);
      alert("Faça login para continuar")
      this.$router.push("/login");
    }
    document.addEventListener("click", (event) => {
      if (!this.$refs.dropdown.contains(event.target)) {
        this.showDropdown = false;
      }
    });
  },
  computed: {
    filteredUserProjects() {
      return this.userProjects.filter((p) =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    filteredTeamProjects() {
      return this.teamProjects.filter((p) =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    goToHome() {
      window.location.href = "/";
    },
    criarProjeto() {
      const nome = prompt("Nome do novo projeto:");
      if (nome) {
        const novoId = Date.now();
        this.userProjects.push({ id: novoId, name: nome });
      }
    },
    criarProjeto() {
      this.showModal = true;
      this.newProject = {
        name: "",
        description: "",
        technologiesInput: ""
      };
      this.tecnologias = [];
    },
    fecharModal() {
  this.showModal = false;
  this.newProject = {
    name: "",
    description: "",
    technologiesInput: ""
  };
  this.habilidades = [];
},
  criarProjetoESugerir() {
    if (!this.newProject.name || !this.newProject.description) {
      return alert("Preencha o nome e descrição do projeto");
    }

    const payload = {
      nome: this.newProject.name,
      descricao: this.newProject.description,
      tecnologias: this.tecnologias 
    };

    fetch('http://localhost:3000/project/createProject', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", 
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao criar projeto");
      return res.json();
    })
    .then(async data => {
      console.log("Projeto criado com sucesso:", data);
      const projetoId = data.projeto_id;
      this.projetoCriadoId = projetoId;

      const sugestoesRes = await fetch(`http://localhost:3000/project/devSugestionProject/${projetoId}`, {
        credentials: "include"
      });

      
      
      if (!sugestoesRes.ok) throw new Error("Erro ao buscar sugestões de devs");

      const sugestoes = await sugestoesRes.json();
      console.log("allUsersRes: ", sugestoes);
      this.devSugestoes = sugestoes.sugestaoDevs;
      this.allUsers = sugestoes.desenvolvedoresRestantes;
      this.fecharModal();
      this.showSugestaoModal = true;

      this.userProjects.push({
        id: data.projeto_id || Date.now(), 
        name: payload.nome,
        description: payload.descricao
      });
    })
    .catch(err => {
      console.error(err);
      alert("Erro ao criar o projeto");
    });
  },
  toggleDeleteMode() {
    this.showDeleteMode = !this.showDeleteMode;
  },
  async adicionarDevsAoProjeto() {
    if (this.devsSelecionados.length <= 0){
      alert("Selecione pelo menos um participante!");
      return
    }
    try {
      const payload = {
        projeto_id: this.projetoCriadoId,
        participantes_ids: this.devsSelecionados
      };

      const response = await axios.post('http://localhost:3000/project/addParticipantesProject', payload, {
        withCredentials: true
      });
      console.log("response: ", response.data);
      alert('Participantes adicionados com sucesso!');
      this.showSugestaoModal = false;
      this.devsSelecionados = [];
    } catch (error) {
      console.error('Erro ao adicionar participantes:', error);
      alert(`Erro: ${error.response.data.error}`);
    }
  },
  confirmarExclusaoProjeto(id) {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      this.excluirProjeto(id);
    }
  },

  async excluirProjeto(id) {
    try {
      const response = await axios.delete('http://localhost:3000/project/deleteProject', {
        data: {
          projeto_id: id
        },
        withCredentials: true
      });
      console.log("response", response);

      if (response.status != 200) throw new Error("Erro ao excluir projeto");

      this.userProjects = this.userProjects.filter(p => p.id !== id);
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir projeto.");
    }
  }

  }
};
</script>


<style scoped>
.project-container {
  padding: 30px;
  box-sizing: border-box;
}

.section {
  margin-bottom: 50px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header button {
  background-color: #444;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}
.section-header button:hover {
  background-color: #555;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.project-card-link {
  text-decoration: none;
  color: inherit;
  display: block; 
}

.project-card {
  background: #2f2f2f;
  color: white;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: background 0.3s;
  cursor: pointer; 
  position: relative;
}

.project-card:hover {
  background: #3c3c3c;
}

.no-projects {
  color: #999;
  font-style: italic;
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

.tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tecnologia-item {
  background: #2a2a2a;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}


.tecnologia-item label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.button-group {
  display: flex;
  gap: 10px;
}

.delete-button {
  position: absolute;
  top: -10px;
  left: -10px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  z-index: 10;
}

.checkbox-item {
  margin: 8px 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  cursor: pointer;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin-left: -300px;
}

.checkbox-nome {
  user-select: none;
  margin-left: -270px;
}
</style>
