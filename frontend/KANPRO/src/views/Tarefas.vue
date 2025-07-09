<template>
  <Navbar :search="searchQuery" @update:search="searchQuery = $event" @go-home="goToHome" />
  <div class="name-project">
    <h1 class="name-project" v-if="nameProject()">{{this.namedProject}}</h1>
  </div>
  
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-flex-container">
      
      <div class="modal-content">
        <form class="form" @submit.prevent="updateTitle(element.id, novoTitulo)">
          <div class="title-edit-container">
            <template v-if="editandoTitulo">
              <input v-model="novoTitulo" class="input-editar-titulo" />
              <button @click="updateTitle(element.id, novoTitulo)"@click.stop>💾</button>
              <button @click="cancelarEdicaoTitulo"@click.stop>❌</button>
            </template>
            <template v-else>
              <h3>{{ element.title }}</h3>
              <button @click="iniciarEdicaoTitulo" @click.stop><img src="../assets/editIco.png" height="15"></button>
            </template>
          </div>
        </form>
        <p class="subtitle">na lista <b>{{ selectedListName }}</b></p>

        <p class="descriptionTask">Descrição da tarefa:</p>
        <textarea class="descriptionTaskElement" v-model="element.description"></textarea>

        <div class="modal-actions">
          <transition name="fade">
            <span v-if="descricaoAtualizada" class="success-icon">✅</span>
          </transition>
          <button @click="updateDescription(element.id, element.description)">Atualizar</button>
          
        </div>

        <label>Adicionar um comentário:</label>
        <form @submit.prevent="addComent()">
          <div class="comentario-container">
            <div class="dev-circle" v-if="getDevNameComent()">
              {{ devNameComent.charAt(0).toUpperCase() }}
            </div>
            <div class="quill-editor-container">
              <QuillEditor
                ref="quillRef"
                theme="snow"
                v-model:content="comment"
                content-type="html"
                    :toolbar="[
                      [{ 'size': ['small', false, 'large', 'huge'] }],  
                      ['bold', 'italic', 'underline', 'strike'],
                      ['link', 'image'],
                      [{ 'align': [] }], 
                      [{ 'indent': '-1' }, { 'indent': '+1' }],
                      ['clean']  
                    ]"
                    :modules="modules"
              />
            </div>
          </div>

          <div class="modal-actions-publicar">
            <button @click="addComent(element.id, comment)">Publicar</button>
          </div>
        </form>
        <div class="comentarios-lista">
          <h4>{{ comments.length > 0 ? 'Comentários' : '' }}</h4>
          <div class="comentarios-container">
            <div v-for="coment in comments" :key="coment.comentario_id" class="comentario-item" @contextmenu.prevent="abrirCommentMenu($event, coment)">
              <div class="dev-circle" :title="coment.usuario.nome">
                {{ coment.usuario.nome.charAt(0).toUpperCase() }}
              </div>
              <div class="comentario-conteudo">
                <div class="comentario-topo">
                  <span class="comentario-data">{{ formatDate(coment.data_hora) }}</span>
                </div>
                <div v-if="editandoComentarioId === coment.comentario_id" class="quill-editor-container">
                  <QuillEditor
                    theme="snow"
                    v-model:content="comentarioEditado"
                    content-type="html"
                    :toolbar="[
                      [{ 'size': ['small', false, 'large', 'huge'] }], 
                      ['bold', 'italic', 'underline', 'strike'],
                      ['link', 'image'],
                      [{ 'align': [] }],  
                      [{ 'indent': '-1' }, { 'indent': '+1' }],
                      ['clean'] 
                    ]"
                    :modules="modules"
                  />
                  <div class="modal-actions">
                    <button @click="salvarComentarioEditado(element.id)"@click.stop>Salvar</button>
                    <button @click="cancelarEdicao"@click.stop>Cancelar</button>
                  </div>
                </div>
                 <p v-else class="ql-editor" v-html="coment.comentario"></p>
                <div
                  v-if="commentMenuVisivel"
                  class="comment-menu"
                  :style="{ top: commentMenuY + 'px', left: commentMenuX + 'px' }"
                  @click="commentMenuVisivel = false"
                >
                  <ul>
                    <li @click="editarComentario()"@click.stop>Editar</li>
                    <li @click="excluirComentario(element.id)"@click.stop>Excluir</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-sidebar">
        <ul>
          <li @click="abrirJanelaParticipantes(element.id)">👥 Adicionar Participante</li>
        </ul>
        <div v-if="janelaParticipantesAberta" class="janela-participantes" @click.stop>
          <h4>Adicionar Participantes</h4>

          <div v-if="listaUsuarios.length === 0">Carregando participantes...</div>
          <div v-for="usuario in usuariosNaoParticipantes" :key="usuario.usuario.usuario_id">
            <label>
              <input 
                type="checkbox" 
                :value="usuario.usuario.usuario_id" 
                v-model="usuariosSelecionados"
              />
               {{ usuario.usuario.nome }}
               
            </label>
          </div>

          <button @click="adicionarParticipantes(element.id)">Adicionar</button>
          <button @click="janelaParticipantesAberta = false">Fechar</button>
        </div>
        <div class="participantes-lista">
          <h4 class="listParticipantes">Participantes:</h4>
          <dl class="participantes">
            <div 
              class="participante" 
              v-for="participante in participantes" 
              :key="participante.usuario.usuario_id"
            >
              <span>👤 {{ participante.usuario.nome }}</span>
              <span 
                @click="removerParticipante(participante.usuario.usuario_id, element.id)"
                style="color: red; cursor: pointer; font-weight: bold;"
              >
                ❌
              </span>
            </div>
          </dl>
        </div>
        <span>___________________________</span>
        <div>
          <ul>
            <li @click="openFileDialog">📎 Adicionar Arquivo</li>
          </ul>
          <input
            type="file"
            multiple
            ref="fileInput"
            @change="onFileChange"
            style="display: none"
          />
        </div>
        <div class="anexos-lista">
          
          <ul>
            
            <li 
              v-for="arquivo in attachments"
              :key="arquivo.anexoTarefa_id"
              @click="baixarArquivo(element.id, arquivo.anexoTarefa_id)"
              class="anexo-nome"
            >
              📎 {{ arquivo.nome }}<br>
              {{ formatDate(arquivo.created_at) }}
              <span 
                @click.stop="removerAttachment(arquivo.anexoTarefa_id, element.id)"
                style="color: red; cursor: pointer; font-weight: bold;"
              >
                ❌
              </span>
            </li>
            
          </ul>
        </div>
      </div>

    </div>
  </div>
  <div class="sidebar">
      <Sidebar @navigate="handleSidebarClick" />
    </div>
  <div class="board">
    <div v-for="(list, index) in filteredKanbanLists" :key="index" class="column">
      <h2>{{ list.name }}</h2>
      <draggable
        v-model="list.items"
        group="kanban"
        item-key="id"
        class="dropzone"
        :move="handleMove"
        @start="handleDragStart(list.name)"
        @end="handleDragEnd($event.to, $event.item, list.name)"
        :data-list="list.name"
      >
        <template #item="{ element }">
          <div
            class="card"
            @contextmenu.prevent="openContextMenu($event, element, list.name, element.devName)"
            @click="openTask(element, list.name)"
            :title="element.description"
          >
          <div
    class="pausada-overlay"
    v-if="element.paused"
  >
    <img src="../assets/pausada.jpeg" class="imgPausada">
  </div>


            <div
              class="card-bar"
              :style="{ backgroundColor: element.barColor }"
            ></div>
            <div class="card-content">
              <span class="task-title">{{ element.title }}</span>
              <div class="dev-circles" v-if="element.devName" :title=element.devName>
                <div class="dev-circles" v-if="element.devName">
  <template v-for="(initial, index) in getFirstNameInitials(element.devName)" :key="index">
    <div v-if="index < 2" class="dev-circle">
      {{ initial }}
    </div>
  </template>
  <div v-if="getFirstNameInitials(element.devName).length > 3" class="dev-circle dev-circle-more">
    ...
  </div>
</div>
              </div>
            </div>
          </div> 

        </template>
      </draggable>
      <button
        v-if="list.name !== 'Done'"
        class="add-btn"
        @click="addTask(index)"
      >+ Nova Tarefa</button>
    </div>
  </div>

  <div v-if="showColorPicker" class="color-picker" :style="{ top: pickerY + 'px', left: pickerX + 'px' }">
    <select v-model="color">
      <option value="#e0e0e0">Sem Prioridade</option>
      <option value="#dc3545">Urgente</option>
      <option value="#fd7e14">Alta</option>
      <option value="#ffc107">Media</option>
      <option value="#28a745">Baixa</option>
    </select>
    <button @click="applyColor">Aplicar Cor</button>
  </div>
  <div
  v-if="showContextMenu"
  class="context-menu"
  :style="{ top: contextY + 'px', left: contextX + 'px' }"
>
  <ul>
    <li @click="handleMenuOption('openTask')">Abrir tarefa</li>
    <li @click="handleMenuOption('color')">Definir Prioridade</li>
    <li @click="handleMenuOption(contextCard.paused ? 'resumeTask' : 'pauseTask')">
      {{ contextCard.paused ? 'Continuar tarefa' : 'Pausar tarefa' }}
    </li>
    <li @click="handleMenuOption('delete')">Excluir tarefa</li>
  </ul>
</div>

</template>

<script>
import draggable from 'vuedraggable';
import Navbar from "../components/Navbar.vue";
import Sidebar from '../components/Sidebar.vue';
import axios from 'axios';
import { nextTick } from 'vue';
import { addComent, getParticipantes, listAttachment, updateTitle } from '../../../../backend/src/services/todoService';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
  components: {
    Navbar,
    draggable,
    Sidebar,
    QuillEditor
  },
  data() {
    return {
      nextId: 1,
      kanbanLists: [
        { name: 'To Do', items: [] },
        { name: 'Doing', items: [] },
        { name: 'Done', items: [] }
      ],
      showColorPicker: false,
      selectedCard: null,
      pickerX: 0,
      pickerY: 0,
      currentList: null,
      devName: '',
      devNameComent: '',
      devIdParticipante: null,
      showContextMenu: false,
      contextX: 0,
      contextY: 0,
      contextCard: null,
      searchQuery: "",
      showModal: false,
      selectedListName: '',
      descricaoAtualizada: false,
      comment: '',
      comments: [],
      participantes: [],
      janelaParticipantesAberta: false,
      listaUsuarios: [],
      usuariosSelecionados: [],
      namedProject: "",
      attachments: [],
      editandoTitulo: false,
      novoTitulo: '',
      commentMenuVisivel: false,
      commentMenuX: 0,
      commentMenuY: 0,
      comentarioSelecionado: null,
      editandoComentarioId: null,
      comentarioEditado: '',
      profileImage: '',
    };
  },

  mounted() {
    this.devName = localStorage.getItem('nomeDesenvolvedor');
    this.getDevNameComent();
    this.fetchTasks();
    document.addEventListener('click', this.handleClickOutside);
    window.addEventListener('keydown', this.handleEsc);
    window.addEventListener('scroll', this.fecharCommentMenu, true);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('keydown', this.handleEsc);
    window.removeEventListener('scroll', this.fecharCommentMenu, true);
  },
  methods: {
    getFirstNameInitials(namesString) {
      return namesString
        .split(',')                          
        .map(name => name.trim())           
        .map(name => name.split(' ')[0])   
        .map(firstName => firstName.charAt(0).toUpperCase()) 
        .join('');
    },
    fecharCommentMenu() {
      this.commentMenuVisivel = false;
    },
    iniciarEdicaoTitulo() {
      this.editandoTitulo = true;
      this.novoTitulo = this.element.title;
    },
    cancelarEdicaoTitulo() {
      this.editandoTitulo = false;
      this.novoTitulo = '';
    },
    abrirCommentMenu(event, comentario) {
      this.comentarioSelecionado = comentario;
      this.commentMenuX = event.clientX;
      this.commentMenuY = event.clientY;
      this.commentMenuVisivel = true;
    },
    openFileDialog() {
      this.$refs.fileInput.click(); 
    },
    onFileChange(event) {
      const selectedFiles = Array.from(event.target.files);
      if (selectedFiles) {
        this.uploadFile(selectedFiles);
      }
    },
    async baixarArquivo(taskId, attachmentId){
      try {
        const response = await axios.get(`http://localhost:3000/todos/downloadAttachment/${attachmentId}`, {
          params: {
            projeto_id: this.$route.params.id,
            tarefa_id: taskId
          },
          responseType: 'blob', 
          withCredentials: true
        });
        const contentType = response.headers['content-type'];
        const contentDispositions = response.headers['content-disposition'];
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = URL.createObjectURL(blob);
        const isInlineType = contentType.startsWith('image/') || contentType === 'application/pdf';
        if (isInlineType) {
          const response = await axios.get(`http://localhost:3000/todos/downloadAttachment/${attachmentId}&inline=true`, {
            params: {
              projeto_id: this.$route.params.id,
              tarefa_id: taskId
            },
            responseType: 'blob', 
            withCredentials: true
          });
          window.open(response.request.responseURL, '_blank');
        } else {
          const link = document.createElement('a');
          link.href = url;

          const contentDisposition = response.headers['content-disposition'];
          const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
          const filename = filenameMatch ? filenameMatch[1] : 'arquivo';

          link.download = filename;
          link.click();
        }
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Erro ao baixar arquivo:', error);
      }
    },
    async uploadFile(files) {
      const formData = new FormData();

      formData.append("tarefa_id", this.element.id);    
      formData.append("projeto_id", this.$route.params.id);   

      for (const file of files) {
        formData.append("arquivos", file); 
      }

      try {
        const response = await axios.post(
          'http://localhost:3000/todos/addAttachment',
          formData,
          { withCredentials: true }
        );
        await this.listAttachments(this.element.id);
        if (response.status == 201) {
          alert('Arquivo enviado com sucesso!');
        } else {
          alert('Erro no envio do arquivo.');
        }
      } catch (error) {
        console.error(error);
        alert(`Erro: ${error.response.data.error}`);
      }
    },
    async   listAttachments(todoId) {
      try {
        const response = await axios.get(`http://localhost:3000/todos/listAttachment/${todoId}`, {
          withCredentials: true
        });
        this.attachments = response.data;
      } catch (error) {
        console.error('Erro ao buscar anexos:', error);
      }
    },
    async getDevNameComent() {
      const response = await axios.get('http://localhost:3000/profile', {
          withCredentials: true
        });
      this.devNameComent = response.data.nome;
      this.devIdParticipante = response.data.usuario_id;
      this.profileImage = response.data.login.profile_image;
    },
    async removerAttachment(attachmentId, taskId) {
      if (!confirm("Tem certeza que deseja remover este arquivo??")) return;
      try {
      const response = await axios.delete('http://localhost:3000/todos/exludeAttachment', {
          data: {
                anexoTarefa_id: attachmentId,
                tarefa_id: taskId,
                projeto_id: this.$route.params.id,
              },
          withCredentials: true
        });
        await this.listAttachments(taskId);
      } catch (error) {
        console.log("error exlcuir attachment: ", error);
      }
    },
    async fetchComments(todoId) {
      try {
        const response = await axios.get(`http://localhost:3000/todos/getComments/${todoId}`, {
          withCredentials: true
        });
        this.comments = response.data;
      } catch (error) {
        console.error('Erro ao buscar comentários:', error);
      }
    },
    async addComent(taskId, comment) {
      if (comment.length <= 0 || comment === '<p><br></p>') {
        alert("Por favor, escreva um comentário.");
        return;
      }
      try {
            const response = await axios.post('http://localhost:3000/todos/addComentTodo', {
              tarefa_id: taskId,
              comentario: comment,
              projeto_id: this.$route.params.id,
            }, {
              withCredentials: true
            });
            
            await this.fetchComments(taskId);
            this.comment = '';
            comment = '';
            if (this.$refs.quillRef && this.$refs.quillRef.getQuill) {
              const quill = this.$refs.quillRef.getQuill();
              quill.setContents([]); 
            }
          } catch (error) {
            console.error("Erro ao adicionar comentario", error.response.data.error);
            alert(`Erro: ${error.response.data.error}`);
            this.comment = '';
          }
    },
    editarComentario() {
      
      if (!this.comentarioSelecionado) return;

      const comentario = this.comentarioSelecionado;
      this.editandoComentarioId = comentario.comentario_id;
      this.comentarioEditado = comentario.comentario;

      this.commentMenuVisivel = false;
    },
    async salvarComentarioEditado(elementId) {
      if (this.comentarioEditado.length <= 0 || this.comentarioEditado === '<p><br></p>') {
        alert("Por favor, escreva um comentário.");
        return;
      }

      try {
        const response = await axios.put('http://localhost:3000/todos/editComentTodo', {
              comentario_id: this.comentarioSelecionado.comentario_id,
              tarefa_id: elementId,
              comentario: this.comentarioEditado,
              projeto_id: this.$route.params.id,
            }, {
              withCredentials: true
            });
            await this.fetchComments(elementId);
      } catch (error) {
        alert(`Erro: ${error.response.data.error}`);
      }
      this.editandoComentarioId = null;
      this.comentarioEditado = '';
    },
    cancelarEdicao() {
      this.editandoComentarioId = null;
      this.comentarioEditado = '';
    },
    async excluirComentario(elementId) {
      try {
        await axios.delete('http://localhost:3000/todos/deleteComentTodo', {
          data: {
                comentario_id: this.comentarioSelecionado.comentario_id,
                tarefa_id: elementId,
                projeto_id: this.$route.params.id,
              },
          withCredentials: true
        });
            await this.fetchComments(elementId);
            
      } catch (error) {
        alert(`Erro: ${error.response.data.error}`);
      }
      this.commentMenuVisivel = false;
    },
    async getParticipantes(taskId) {
      try {
        const response = await axios.get(`http://localhost:3000/todos/listParticipantes/${taskId}`, {
          withCredentials: true
        });
        return this.participantes = response.data;
      } catch (error) {
        console.error('Erro ao buscar participantes:', error);
      }
    },
    async nameProject() {
      const response = await axios.get('http://localhost:3000/project/detaisProject/{id}', {
          params: {
            projeto_id: this.$route.params.id,
          },
          withCredentials: true
        });
        return this.namedProject = response.data[0].nome;
    },
    openTask(card, listName, devName) {
      this.comment = '';
      setTimeout(() => {
        this.showModal = true;
      }, 50); 
      this.element = card;
      this.selectedListName = listName;
      this.fetchComments(card.id);
      this.getParticipantes(card.id);
      this.janelaParticipantesAberta = false;
      this.listAttachments(card.id);
    },
    handleEsc(event) {
      if (event.key === 'Escape') {
        this.fecharModal(); 
      }
    },
    async fecharModal() {
      await this.fetchTasks();
      this.showModal = false;
    },
    async fetchTasks() {
      try {
        const projectId = this.$route.params.id;
        const response = await axios.get('http://localhost:3000/todos', {
          params: {
            idProjeto: projectId
          },
          withCredentials: true
        });

        const tasks = response.data;
        this.kanbanLists.forEach(list => (list.items = []));

        const participantesPorTarefa = await Promise.all(tasks.map(async (task) => {
          const response = await axios.get(`http://localhost:3000/todos/listParticipantes/${task.tarefa_id}`, {
            withCredentials: true
          });
          return {
            tarefa_id: task.tarefa_id,
            participantes: response.data
          };
        }));

        tasks.forEach(task => {
          let status = '';

          if (!task.doing && !task.concludeAt) {
            status = 'To Do';
          } else if (task.doing && !task.concludeAt) {
            status = 'Doing';
          } else if (task.concludeAt) {
            status = 'Done';
          }

          const list = this.kanbanLists.find(l => l.name === status);
          if (list) {
            const entrada = participantesPorTarefa.find(p => p.tarefa_id === task.tarefa_id);
            const nomes = entrada 
            ? entrada.participantes.map(p => p.usuario.nome).join(', ') 
            : 'Sem participantes';
            if (task.pausas.some(pausa => pausa.fimPausa === null)) {
              list.items.push({
                id: task.tarefa_id,
                title: task.titulo,
                barColor: task.colorBar,
                description: task.descricao,
                devName: nomes,
                paused: true 
              });
            } else {
              list.items.push({
                id: task.tarefa_id,
                title: task.titulo,
                barColor: task.colorBar,
                description: task.descricao,
                devName: nomes,
                paused: false,
              });
            }
          }
        });
      } catch (error) {
        alert("Faça login para continuar")
        this.$router.push("/login");
      }
    },
    async addTask(index) {
    const title = prompt("Digite o título da nova tarefa:");
    if (!title) return;

    const descricao = prompt("Digite a descrição da tarefa:");
    if (descricao === null) return;

    try {
      const projectId = this.$route.params.id;
      const listName = this.kanbanLists[index].name;

      const payload = {
        titulo: title,
        descricao,
        projeto_id: projectId,
        colorBar: '#e0e0e0',
        nomeDesenvolvedor: this.nomeDesenvolvedor,
      };

      if (listName === "Doing") {
        payload.doing = true;
      }

      const response = await axios.post('http://localhost:3000/todos', payload, {
        data: {
          projetoId: projectId
        },
        withCredentials: true
      });

      const responseName = await axios.get('http://localhost:3000/profile', {
        withCredentials: true
      });


      const novaTarefa = response.data;
      this.kanbanLists[index].items.unshift({
        id: novaTarefa.tarefa_id,
        title: novaTarefa.titulo,
        barColor: novaTarefa.colorBar,
        description: novaTarefa.descricao,
        devName: responseName.data.nome,
        paused: false,
      });
    } catch (error) {
      console.error("Erro ao adicionar nova tarefa:", error);
      alert("Erro ao adicionar tarefa. Tente novamente.");
    }
  },
async excluirTarefa(card) {
  this.selectedCard = card;
  const projectId = this.$route.params.id;
  if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;
  try {
    await axios.delete('http://localhost:3000/todos', {
      data: {
        tarefa_id: this.selectedCard.id,
        projeto_id: projectId
      },
      withCredentials: true
    });
    this.fetchTasks();
  } catch (error) {
    alert(`Erro: ${error.response.data.error}`);
    console.error('Erro ao excluir tarefa:', error);
  }
},
    async updateDescription(taskId, description) {
          try {
            const response = await axios.put('http://localhost:3000/todos/description/:id', {
              tarefa_id: taskId,
              descricao: description,
              projeto_id: this.$route.params.id,
            }, {
              withCredentials: true
            });
            this.descricaoAtualizada = true;
            setTimeout(() => {
              this.descricaoAtualizada = false;
            }, 2000);
          } catch (error) {
            alert(`Erro: ${error.response.data.error}`);
            console.error("Erro ao atualizar descrição:", error);
          }
    },
    async updateTitle(taskId, title) {
          try {
            const response = await axios.put('http://localhost:3000/todos/title/', {
              tarefa_id: taskId,
              titulo: title,
              projeto_id: this.$route.params.id,
            }, {
              withCredentials: true
            });
            this.element.title = response.data.titulo;
              this.editandoTitulo = false;
          } catch (error) {
            alert(`Erro: ${error.response.data.error}`);
          }
    },
    openColorPicker(event, card) {
      this.pickerX = event.clientX;
      this.pickerY = event.clientY;
      this.selectedCard = card;
      this.color = card.barColor;
      this.showContextMenu = false;

  setTimeout(() => {
    this.showColorPicker = true;
  }, 50); 
    },
    async applyColor() {
      if (this.selectedCard) {
        const oldColor = this.selectedCard.barColor;
        this.selectedCard.barColor = this.color;
        try {
          await axios.patch('http://localhost:3000/todos/colorBar', {
            tarefaId: this.selectedCard.id,
            barColor: this.color
          }, {
            withCredentials: true
          });
        } catch (error) {
          console.error('Erro ao atualizar cor:', error);
          this.selectedCard.barColor = oldColor;
        }
      }
      this.showColorPicker = false;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
    },
    async updateTaskStatus(taskId, status, projectId, card) {
      if(card.paused === true) {
        throw new Error('Tarefa pausada, impossivel mover!');
      }
      if (status === 'Doing') {
        try {
          await axios.patch('http://localhost:3000/todos/doing', {
            tarefaId: taskId,
            status,
            projetoId: projectId
          }, {
            withCredentials: true
          });
        } catch (error) {
          throw error.response.data.error; 
        }
      }
      if (status === 'Done') {
        try {
          await axios.patch('http://localhost:3000/todos/conclude', {
            tarefaId: taskId,
            status,
            projetoId: projectId
          }, {
            withCredentials: true
          });
        } catch (error) {
          throw error.response.data.error; 
        }
      }
    },
    async goToHome() {
      this.$router.push("/projetos");
    },
    handleMove(evt) {
      const fromList = this.kanbanLists.find(list => list.name === this.currentList);
      const toList = this.kanbanLists.find(list => list.name === evt.to.dataset.list);

      if (fromList.name === 'Done') return false;
      if (
        (fromList.name === 'Doing' && toList.name === 'To Do') ||
        (fromList.name === 'Done' && toList.name === 'To Do')
      ) return false;

      return true;
    },
    moveTaskBackOnError(task, fromListName, toListName) {
  const fromList = this.kanbanLists.find(list => list.name === fromListName);
  const toList = this.kanbanLists.find(list => list.name === toListName);


  if (toList && fromList) {
    const index = toList.items.findIndex(item => item.id === task.__draggable_context.element.id);
    if (index !== -1) {
      const [removedTask] = toList.items.splice(index, 1); 
      fromList.items.push(removedTask); 
    }
  }
},
    handleDragStart(listName) {
      this.currentList = listName;
    },
    async handleDragEnd(listName, card, listNamePrevious) {
      this.selectedCard = card;
      const listElemente = listName;
      const listNamed = listElemente.dataset.list;
      const itemId = this.selectedCard.__draggable_context.element.id;
      const projectId = this.$route.params.id;
      try {
        const error = await this.updateTaskStatus(itemId, listNamed, projectId, this.selectedCard.__draggable_context.element);
      } catch (error) {
        console.error("catch: ", error);
        alert(`${error}`);
        this.moveTaskBackOnError(this.selectedCard, listNamePrevious, listNamed);
      }
      this.currentList = null;
    },
    async handleClickOutside(event) {
  const picker = document.querySelector('.color-picker');
  const contextMenu = document.querySelector('.context-menu');
  const modal = document.querySelector('.modal-flex-container');
  const commentMenu = document.querySelector('.comment-menu');
  if (this.showModal && modal && !modal.contains(event.target)) {
    await this.fetchTasks();
    this.showModal = false;
  }

  if (this.showColorPicker && picker && !picker.contains(event.target)) {
    this.showColorPicker = false;
  }

  if (this.showContextMenu && contextMenu && !contextMenu.contains(event.target)) {
    this.showContextMenu = false;
  }

  if (this.commentMenuVisivel && commentMenu && !commentMenu.contains(event.target)) {
    this.commentMenuVisivel = false;
  }
},
    openContextMenu(event, card, listName, devName) {
  this.contextX = event.clientX;
  this.contextY = event.clientY;
  this.contextCard = card;
  this.showContextMenu = true;
  this.contextListName = listName;
  this.devName = devName;
},
handleMenuOption(option) {
  if (option === 'color') {
    this.openColorPicker({ clientX: this.contextX, clientY: this.contextY }, this.contextCard);
  } else if (option === 'delete') {
    this.excluirTarefa(this.contextCard, this.currentList);
  } else if (option === 'openTask') {
    this.openTask(this.contextCard, this.contextListName, this.devName);
  } else if (option === 'pauseTask') {
    this.pauseTask(this.contextCard);
  } else if (option === 'resumeTask') {
    this.resumeTask(this.contextCard);
  } else {
    alert(`Opção '${option}' ainda não implementada.`);
  }
  this.showContextMenu = false;
},
abrirJanelaParticipantes(taskId) {
    this.janelaParticipantesAberta = true;
    this.buscarUsuarios(taskId); 
  },

  async buscarUsuarios(task_id) {
    const projeto_id =  this.$route.params.id;
    try {
      const taskId = task_id;
        const response = await axios.get(`http://localhost:3000/project/listParticipantes/${projeto_id}`, {
          withCredentials: true
        });
      this.listaUsuarios = response.data;
    } catch (error) {
      console.error('Erro ao buscar participantes:', error);
    }
  },

  async pauseTask(taskId) {
    if (!confirm("Tem certeza que deseja pausar esta tarefa?")) return;
    try {
      const response = await axios.post('http://localhost:3000/todos/pauseTask', {
        tarefa_id: taskId.id,
        projeto_id: this.$route.params.id
      }, {
        withCredentials: true
      });
      this.fetchTasks();
    } catch (error) {
      alert(`Erro: ${error.response.data.error}`);
    }
  },

  async resumeTask(taskId) {
    try {
      const response = await axios.put('http://localhost:3000/todos/continueTask', {
        tarefa_id: taskId.id,
        projeto_id: this.$route.params.id
      }, {
        withCredentials: true
      });
      this.fetchTasks();
    } catch (error) {
      console.error('Erro ao continuar tarefa:', error);
      alert(`Erro: ${error.response.data.error}`);
    }
  },

  async adicionarParticipantes(taskId) {
    if (this.usuariosSelecionados.length <= 0){
      alert("Selecione pelo menos um participante!");
      return
    }
    try {
      const payload = {
        projeto_id: this.$route.params.id,
        tarefa_id: taskId,
        participantes_ids: this.usuariosSelecionados
      };

      const response = await axios.put('http://localhost:3000/todos/addParticipantes', payload, {
        withCredentials: true
      });
      alert('Participantes adicionados com sucesso!');
      this.janelaParticipantesAberta = false;
      this.usuariosSelecionados = [];
      this.getParticipantes(taskId); 
    } catch (error) {
      alert(`Erro: ${error.response.data.error}`);
      this.janelaParticipantesAberta = false;
    }
  },
  async removerParticipante(usuario_id, tarefa_id) {

    if (!confirm("Tem certeza que deseja remover este participante?")) return;
    try {
      const payload = {
        projeto_id: this.$route.params.id,
        tarefa_id: tarefa_id,
        participante_id: usuario_id,
      };
      const response = await axios.delete('http://localhost:3000/todos/excludeParticipante', {
        data: payload,
        withCredentials: true
      });
      alert('Participante removido com sucesso!');
      this.getParticipantes(tarefa_id); 
    } catch (error) {
      console.error('Erro ao adicionar participantes:', error);
      alert(`Erro: ${error.response.data.error}`);
      this.janelaParticipantesAberta = false;
    }
  },
  },
  computed: {
  filteredKanbanLists() {
    if (!this.searchQuery) {
      const kanbanLists =  this.kanbanLists;
      return kanbanLists;

    }
    const query = this.searchQuery.toLowerCase();
    const filtered = this.kanbanLists.map(list => ({
      ...list,
      items: list.items.filter(task => task.title.toLowerCase().includes(query))
    }));
    return filtered;
  },
  usuariosNaoParticipantes() {
    const idsParticipantes = this.participantes.map(p => p.usuario.usuario_id);
    return this.listaUsuarios.filter(u => !idsParticipantes.includes(u.usuario.usuario_id));
  },
  profileImage() {
        const image = this.profileImage.conteudo;
        if (
          this.profileImage
        ) {
          const bytes = new Uint8Array(this.profileImage.conteudo.data);
          const blob = new Blob([bytes], { type: this.profileImage.tipo });
          return URL.createObjectURL(blob);
        }
      },
      
}
};
</script>

<style scoped>
body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
  background: #1f1f1f;
}

.board {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  height: 80vh; 
}

.column {
  background: #2f2f2f;
  padding: 10px;
  border-radius: 10px;
  width: 300px;
  flex-shrink: 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  color: #ffffff;
  max-height: 100%;
}

.dropzone {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 1px;
  max-height: 100%;
  overflow: auto;
}

.card {
  background: #e0e0e0;
  padding: 10px;
  border-radius: 5px;
  cursor: grab;
  color: black;
  position: relative;
  overflow: hidden;
  z-index: 1;
  flex-shrink: 0;
  flex-grow: 0;
  max-height: 60px;
}

.card-bar {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5%;
  height: 400%;
  background-color: transparent;
  transform: rotate(-0deg);
  transform-origin: 0 100%;
  z-index: -1;
}

.add-btn {
  margin-top: 10px;
  background-color: #444;
  color: #fff;
  border: none;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.add-btn:hover {
  background-color: #555;
}

.color-picker {
  display: flex;
  position: fixed;
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  gap: 10px;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
}

.task-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;       
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word;
  max-width: 100%; 
}

.dev-circles {
  display: flex;
  -webkit-line-clamp: 2;
  word-break: break-word;
  gap: 3px;
  flex-direction: row-reverse;
  justify-items: start;
  flex-wrap: wrap;
  max-width: 100px;
  max-height: 30px;
}

.dev-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%; 
  background-color: #194664;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.dev-circleModal {
  width: 24px;
  height: 24px;
  background-color: #888;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  margin-left: -2px;
}
.context-menu {
  position: fixed;
  background-color: #fff;
  color: black;
  border: 1px solid #ccc;
  border-radius: 6px;
  z-index: 1001;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  width: 180px;
}

.context-menu ul {
  list-style: none;
  margin: 0;
  padding: 8px 0;
}

.context-menu li {
  padding: 10px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.context-menu li:hover {
  background-color: #f0f0f0;
}

.modal-flex-container {
  display: flex;
  gap: 20px;
  background: #1f1f1f;
  border-radius: 10px;
  padding: 20px;
  min-width: 50%;
  max-width: 70%;
  margin: auto;
  overflow: auto;
}

.modal-content {
  flex: 3;
  overflow: auto;
}

.modal-sidebar {
  flex: 1;
  background-color: #2f2f2f;
  border-left: 1px solid #ccc;
  border-top: 1px solid #ccc;
  padding: 5px;
  border-radius: 8px;
}

.modal-sidebar ul {
  list-style: none;
  padding: 0;
  margin-top: 0;
}

.participante dl {
  list-style:circle;
  margin-top: 5px;
}

.participantes dl {
  list-style:armenian;
}

.modal-sidebar li {
  padding: 8px 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.modal-sidebar li:hover {
  background-color: #444;
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
  overflow: auto;
}

.modal {
  background: #1f1f1f;
  color: white;
  padding: 20px;
  border-radius: 10px;
  width: 600px; 
  height: 100px;
  max-height: 90vh;
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

.modal-actions-publicar {
  display: flex;
  justify-content: flex-end;
  margin-top: -2%;
  gap: 10px;
}

.modal-actions-publicar button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #444;
  color: white;
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


.subtitle {
  margin-top: -15px;
  font-size: 0.9em;
}

.descriptionTaskElement {
  margin-top: -10px;
  height: 100px;
  width: 98.5%;
  border-radius: 6px;
  white-space: pre-wrap; 
  word-wrap: break-word; 
  overflow-wrap: break-word;
}

.comentario-container {
  display: flex;
  align-items: center;
  gap: 8px; 
  margin-bottom: 1rem;
  margin-top: 1px;
}

.inputModalComentario {
  height: 20px;
  width: 98.5%;
  border-radius: 6px;
}

.success-icon {
  margin-top: 2px;
  margin-right: -5px;
  font-size: 1.3em;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.comentarios-lista {
  margin-top: 0.5rem;
  max-height: 350px;
  overflow-y: auto;
  padding-right: 10px;
}

.comentarios-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comentario-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: black;
}

.comentario-conteudo {
  background-color: #ffffff;
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 90%;
  flex: 1;
  
}

.comentario-topo {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.comentario-data {
  color: #888;
}

.comentario-texto {
  white-space: pre-wrap; 
  word-wrap: break-word; 
  overflow-wrap: break-word;
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  margin-top: 4px;
  word-break: break-word;
  
  transition: 0.2s ease-in-out;
}

.comentario-texto img {
  opacity: 0.85;
  cursor: pointer;
  max-width: 98%;
}

.listParticipantes {
  margin-top: -16px;
  margin-bottom: 10px;
}

.janela-participantes {
  position: fixed;
  top: 100px;
  right: 50px;
  width: 300px;
  padding: 15px;
  background-color: rgb(0, 0, 0);
  border: 1px solid #ccc;
  box-shadow: 0 0 8px rgba(0,0,0,0.2);
  z-index: 9999;
}

.name-project {
  position: flex;
  text-align: center;
  margin-top: -60px;
}

.quill-editor-container {
  width: 97%;
  max-width: 92%;
  min-height: 10px;
  border-radius: 6px;
  background-color: #1f1f1f;
  padding: 10px;
  margin-top: 10px;
  color: white;
}

.ql-container {
  background-color: #2f2f2f;
}

.ql-editor {
  padding: 10px;
  min-height: 50px;
  white-space: pre-wrap; 
  word-wrap: break-word; 
  overflow-wrap: break-word;
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  margin-top: 4px;
  word-break: break-word;
  
  transition: 0.2s ease-in-out;
}

.ql-toolbar {
  background-color: #a0a0a0;
  border-radius: 6px;
  border: none;
}

.ql-toolbar.ql-snow {
  border-radius: 6px;
}

.ql-picker,
.ql-picker-item {
  color: white;
}

.ql-picker-label {
  color: #000000;
}

.anexo-nome {
  white-space: pre-wrap; 
  word-wrap: break-word; 
  overflow-wrap: break-word;
  width: 250px;
}

.anexos-lista {
  height: 35rem;
  overflow-y: auto;
}

.title-edit-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-editar-titulo {
  font-size: 1.2em;
  padding: 8px;
  margin-bottom: 20px;
  height: 10px;
  margin-top: 14px;
}

.comment-menu {
  position: fixed;
  background-color: #fff;
  color: black;
  border: 1px solid #ccc;
  border-radius: 6px;
  z-index: 1000;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
  padding: 5px 0;
  width: 180px;
}
.comment-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.comment-menu li {
  padding: 8px 12px;
  cursor: pointer;
}
.comment-menu li:hover {
  background-color: #eee;
}

.ql-toolbar.ql-snow .ql-stroke,
.ql-toolbar.ql-snow .ql-fill,
.ql-toolbar.ql-snow .ql-fill.ql-invert {
  stroke: rgb(255, 255, 255) !important;  
}

.pausada-overlay {
  position: absolute;
  top: 200;
  left: 100;
  width: 30%;
  height: 10%;
  color: red;
  font-weight: bold;
  font-size: 1.2em;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  z-index: 1000;
  border-radius: 8px;
  margin-top: 5px;
  margin-left: 210PX;
}

.pausada-overlay img {
  width: 20px;
  height: 20px;
  margin-right: 13px;
  margin-bottom: 10px;
  border-radius: 50%; 
  border: 1px solid white; 
}

.devImg img{
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

@media (max-width: 710px) {
  .navbar {
    height: 130px;
  }
}

@media (max-width: 1017px) {
  .board {
    flex-direction: column;
    align-items: center;
    height: auto;
    overflow: auto;
  }
  .sidebar {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
}

@media (max-width: 1500px) {
  .sidebar {
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
}
</style>
