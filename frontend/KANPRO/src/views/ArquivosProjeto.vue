<template>
    <Navbar :search="searchQuery" @update:search="searchQuery = $event" @go-home="goToHome" />
    <div class="sidebar">
      <Sidebar @navigate="handleSidebarClick" />
    </div>
    <div class="page-title">
        <!-- <h1 class="name-project" v-if="nameProject()">{{this.namedProject}}</h1> -->
        <h1 style="color: white">Arquivos do Projeto</h1>
    </div>
    <!-- NOVO: container que centraliza -->
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
      this.$refs.fileInput.click(); // Abre o seletor de arquivo
    },
    onFileChange(event) {
      //console.log("chamou OnFileChange");
      const selectedFiles = Array.from(event.target.files);
      //console.log("selectedFiles: ", selectedFiles);
      if (selectedFiles) {
        //console.log("entrou no if");
        //this.file = selectedFiles;
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
          responseType: 'blob', // importante para arquivos binários
          withCredentials: true
        });
        //const data = await response.json();
        //console.log("response file: ", response.headers['content-disposition']);
        const contentType = response.headers['content-type'];
        const contentDispositions = response.headers['content-disposition'];
        // Cria um link temporário com o blob
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = URL.createObjectURL(blob);
        const isInlineType = contentType.startsWith('image/') || contentType === 'application/pdf';
        if (isInlineType) {
          // Abre o arquivo diretamente em uma nova aba
          const response = await axios.get(`http://localhost:3000/todos/downloadAttachment/${attachmentId}&inline=true`, {
            params: {
              projeto_id: this.$route.params.id,
              tarefa_id: taskId
            },
            responseType: 'blob', // importante para arquivos binários
            withCredentials: true
          });
          // console.log("response file: ", response);
          window.open(response.request.responseURL, '_blank');
        } else {
          // Cria o elemento <a> para forçar download
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
        // alert(`Erro: ${error.response.data.error}`);
        console.error('Erro ao baixar arquivo:', error);
      }
    },
    async uploadFile(files) {
      console.log("chamou UploadFile");
      console.log("element: ", this.element.id)
      const formData = new FormData();

      formData.append("tarefa_id", this.element.id);     // por exemplo, tarefaId = 1
      formData.append("projeto_id", this.$route.params.id);   // por exemplo, projetoId = 2

      // Adiciona os arquivos (vários, com mesmo nome "arquivos")
      for (const file of files) {
        formData.append("arquivos", file); // "arquivos" é o mesmo nome usado no multer
      }
      console.log("response files : ");

      try {
        const response = await axios.post(
          'http://localhost:3000/todos/addAttachment',
          formData,
          { withCredentials: true }
        );
        await this.listAttachments(this.element.id);
        //await this.fetchComments(taskId);
        //console.log("response files : ", response);
        //const data = await response.json();
        //console.log("data: ", data);
        if (response.status == 201) {
          alert('Arquivo enviado com sucesso!');
          // Aqui você pode atualizar o estado com o novo arquivo
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
        //const response = await fetch(`http://localhost:3000/todos/getComments/${todoId}`);
        const response = await axios.get(`http://localhost:3000/todos/listAttachment/${todoId}`, {
          withCredentials: true
        });
        console.log("response: ", response.data);
        //const data = await response.json();
        this.attachments = response.data;
        //console.log("comments: ", data);
      } catch (error) {
        console.error('Erro ao buscar anexos:', error);
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

.center-wrapper {
  display: flex;
  justify-content: center; /* Centraliza horizontalmente */
  align-items: center;     /* Centraliza verticalmente */
  min-height: calc(10vh - 10px); /* Ajuste conforme a altura do navbar e título */
}
.attachments {
  width: 1200px;
  height: 550px;
  background-color: #1f1f1f;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 20px;
  overflow: auto;
  /* Remova essas linhas que atrapalham o centramento */
  position: relative;
  margin-left: 200px;
  margin-top: 20px;
}


</style>