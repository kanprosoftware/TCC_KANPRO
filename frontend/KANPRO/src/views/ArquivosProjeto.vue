<template>
    <Navbar :search="searchQuery" @update:search="searchQuery = $event" @go-home="goToHome" />
    <div class="sidebar">
      <Sidebar @navigate="handleSidebarClick" />
    </div>
    <div class="page-title">
        <h1 style="color: white">Arquivos do Projeto</h1>
    </div>
  <div class="center-wrapper">
    <div class="attachments"></div>
  </div>
</template>
<script>
import Navbar from "../components/Navbar.vue";
import Sidebar from '../components/Sidebar.vue';
export default {
  components: {
    Navbar,
    Sidebar,
  },
  methods: {
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
      console.log("chamou UploadFile");
      console.log("element: ", this.element.id)
      const formData = new FormData();

      formData.append("tarefa_id", this.element.id);     
      formData.append("projeto_id", this.$route.params.id);  

      for (const file of files) {
        formData.append("arquivos", file); 
      }
      console.log("response files : ");

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
        console.log("response: ", response.data);
        this.attachments = response.data;
      } catch (error) {
        console.error('Erro ao buscar anexos:', error);
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

.center-wrapper {
  display: flex;
  justify-content: center; 
  align-items: center;     
  min-height: calc(10vh - 10px); 
}
.attachments {
  width: 1200px;
  height: 550px;
  background-color: #1f1f1f;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 20px;
  overflow: auto;
  position: relative;
  margin-left: 200px;
  margin-top: 20px;
}


</style>