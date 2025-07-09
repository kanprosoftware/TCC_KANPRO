<template>
  <div class="sidebar">
    <ul v-if="!modoArquivosAtivo">
      <li @click.prevent="goToTasks" class="menu-item">
        <KanbanIcon />
        Tarefas
      </li>
      <li @click.prevent="mostrarArquivos" class="menu-item">📁 Arquivos do Projeto</li>
      <li @click.prevent="propriedadesProjeto" class="menu-item">⚙️ Propriedades do Projeto</li>
      <li @click.prevent="ganttProjeto" class="menu-item">📊 Gantt</li>
    </ul>
    <div v-else>
      <div class="file-header">
        <button @click="modoArquivosAtivo = false" class="botao-voltar">Voltar</button>
        <button @click="openFileDialog" class="botao-adicionar">Adicionar Arquivos</button>
        <input
            type="file"
            multiple
            ref="fileInput"
            @change="onFileChange"
            style="display: none"
          />
      </div>
      <div class="span"><h3>Arquivos do projeto</h3></div>
      <ul class="file-list">
        <li 
              v-for="arquivo in attachments"
              :key="arquivo.anexo_id"
              @click="baixarArquivo(arquivo.anexo_id)"
              class="anexo-nome"
            >
              📎 {{ arquivo.nome }}<br>
              {{ formatDate(arquivo.created_at) }}
              <span 
                @click.stop="removerAttachment(arquivo.anexo_id)"
                style="color: red; cursor: pointer; font-weight: bold;"
              >
                ❌
              </span>
            </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Sidebar',
  components: {
    KanbanIcon: {
      name: 'KanbanIcon',
      template: `
        <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round"
             stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="5" height="16" rx="1" ry="1" />
          <rect x="10" y="4" width="5" height="16" rx="1" ry="1" />
          <rect x="17" y="4" width="4" height="16" rx="1" ry="1" />
        </svg>
      `
    }
  },
  data() {
    return {
      modoArquivosAtivo: false,
      attachments: [],
    }
  },
  mounted() {
    this.listAttachments(this.$route.params.id);
  },
  methods: {
    goToTasks() {
      this.$router.push('/projeto/'+this.$route.params.id);
    },
    mostrarArquivos() {
      this.modoArquivosAtivo = true;
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
    async baixarArquivo(attachmentId){
      console.log("attachmentId: ", attachmentId);
      try {
        const response = await axios.get(`http://localhost:3000/project/downloadAttachment/${attachmentId}`, {
          params: {
            projeto_id: this.$route.params.id,
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

          const response = await axios.get(`http://localhost:3000/project/downloadAttachment/${attachmentId}&inline=true`, {
            params: {
              projeto_id: this.$route.params.id,
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
      console.log("chamou UploadFile");
      const formData = new FormData();

      formData.append("projeto_id", this.$route.params.id);   

      for (const file of files) {
        formData.append("arquivos", file); 
      }
      console.log("response files : ");

      try {
        const response = await axios.post(
          'http://localhost:3000/project/addAttachment',
          formData,
          { withCredentials: true }
        );
        await this.listAttachments(this.$route.params.id);
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
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
    },
    async   listAttachments() {
      try {
        const response = await axios.get(`http://localhost:3000/project/listAttachment/${this.$route.params.id}`, {
          withCredentials: true
        });
        console.log("response attach: ", response.data);
        this.attachments = response.data;
      } catch (error) {
        console.error('Erro ao buscar anexos:', error);
      }
    },
    async removerAttachment(attachmentId) {
      if (!confirm("Tem certeza que deseja remover este arquivo??")) return;
      console.log("attachmentId: ", attachmentId);
      try {
      const response = await axios.delete('http://localhost:3000/project/exludeAttachment', {
          data: {
                anexo_id: attachmentId,
                projeto_id: this.$route.params.id,
              },
          withCredentials: true
        });
        await this.listAttachments();
      } catch (error) {
        console.log("error exlcuir attachment: ", error);
      }
    },
    propriedadesProjeto() {
      this.$router.push('/projeto/'+this.$route.params.id+'/propriedades');
    },
    recursosProjeto() {
      this.$router.push('/projeto/'+this.$route.params.id+'/recursos');
    },
    ganttProjeto() {
      this.$router.push('/projeto/'+this.$route.params.id+'/gantt');
    },
  }
}
</script>

<style scoped>
.sidebar {
  background-color: #2f2f2f;
  border-radius: 5px;
  position: absolute;
  left: 0;
  height: 82.7%;
  width: 14.6%;
  margin-top: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 12px 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.sidebar li:hover {
  background-color: #444;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #f0f0f0;
}

.icon {
  flex-shrink: 0;
  color: #ffffff;
}

.botao-voltar {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #444;
  color: white;
}

.botao-voltar:hover {
  background-color: #555;
}

.botao-adicionar {
  align-items: end;
  justify-content: flex-end;
  align-self: end;
  display: inline;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #444;
  color: white;
}

.botao-adicionar:hover {
  background-color: #555;
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  margin-bottom: 12px;
  margin-top: 5px;
}

.span {
  align-items: center;
  display: flex;
  justify-content:center;
  margin-top: -20px;
  margin-bottom: -20px;
}

@media (max-width: 1500px) {
  .sidebar {
    position: relative;
    height: 265px;
    width: 300px;
  }
  .file-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10 10px;
    margin-top: 5px;
  }
}
</style>
