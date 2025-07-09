<template>
    <div class="cadastro-container">
      <div class="cadastro-card">
        <h1 class="title">Cadastro</h1>
  
        <form v-if="etapa === 1" class="form" @submit.prevent="avancarEtapa">
          <input v-model="nome" placeholder="Nome" class="input" />
          <input v-model="email" type="text" placeholder="Email" class="input" />
  
          <div class="password-wrapper">
            <input
                :type="showPassword ? 'text' : 'password'"
                v-model="senha"
                placeholder="Senha"
                class="input"
            />
            <div class="password-toggle" @click="togglePasswordVisibility">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </div>
          </div>
          <input
            v-if="isPrimeiroUsuario"
            v-model="serial"
            placeholder="Serial de ativação"
            class="input"
          />
  
          <button type="submit" class="botao">Próximo</button>
        </form>
  
        <div v-else-if="etapa === 2" class="form">
          <label>Selecione suas habilidades:</label>
          <div class="tecnologias-grid">
            <div class="tecnologia-item">
              <label>
                <input
                  type="checkbox"
                  value="Sem habilidades"
                  v-model="habilidades"
                />
                Sem habilidades
              </label>
            </div>
            <div
              v-for="(tecnologia, index) in tecnologias"
              :key="index"
              class="tecnologia-item"
            >
              <label>
                <input
                  type="checkbox"
                  :value="tecnologia.descricao"
                  v-model="habilidades"
                />
                {{ tecnologia.descricao }}
              </label>
              
            </div>
          </div>
          <button
            @click="finalizarCadastro"
            class="botao"
            :disabled="cadastrando"
          >
            {{ cadastrando ? 'Aguarde...' : 'Cadastrar' }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
  return {
    etapa: 1,
    isOAuth: false, 
    nome: '',
    email: '',
    senha: '',
    showPassword: false,
    habilidades: [],
    tecnologias: [],
    cadastrando: false,
    jwtToken: null,
    isPrimeiroUsuario: false,
  };
},
mounted() {
  const token = this.$route.query.token || localStorage.getItem('jwtToken'); 
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.cadastroIncompleto) {
      this.isOAuth = true;
      this.jwtToken = token;
      this.etapa = 2;
      this.nome = payload.name;
      this.email = payload.email;
    }
  }

  fetch('http://localhost:3000/tecnologys/listTecnologys')
    .then(res => res.json())
    .then(data => {
      this.tecnologias = data;
    });
},
created() {
  fetch("http://localhost:3000/auth/primeiroUser", {
    method: "GET",
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => {
      this.isPrimeiroUsuario = data;
    })
    .catch(err => {
      console.error("Erro ao verificar primeiro usuário:", err);
    });
},
methods: {
  avancarEtapa() {
    if (!this.serial && (this.isPrimeiroUsuario === true)) {
      alert("Informe o serial de ativacao!");
      return;
    }
    if (!this.nome || !this.email || !this.senha) {
      alert("Preencha todos os campos!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      alert("Email inválido!");
      return;
    }

    if (this.senha.length < 6) {
      alert("Senha muito curta!");
      return;
    }

    this.etapa = 2;
  },
  togglePasswordVisibility() {
        this.showPassword = !this.showPassword;
      },
  async finalizarCadastro() {
    this.cadastrando = true;

    let dados;
    let endpoint;

    if (this.isOAuth) {
      dados = { habilidades: this.habilidades };
      endpoint = 'http://localhost:3000/auth/complete-profile';

    } else {
      if (this.habilidades.includes('Sem habilidades')) {
        this.habilidades = [];
      }
      dados = {
        name: this.nome,
        email: this.email,
        password: this.senha,
        habilidades: this.habilidades,
        serial: this.serial
      };
      endpoint = 'http://localhost:3000/auth/register';
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(this.jwtToken && { 'Authorization': `Bearer ${this.jwtToken}` })
        },
        body: JSON.stringify(dados)
      });
      if (!res.ok) throw new Error(await res.text());

      alert('Cadastro concluído! \nUm email de verificação foi enviado.');
      localStorage.removeItem('jwtToken');
      this.etapa = 3;
      this.$router.push('/login');
    } catch (e) {
      alert(e.message);
    } finally {
      this.cadastrando = false;
    }
  }
}
  };
  </script>
  
  <style scoped>
  .cadastro-container {
    display: flex;
    justify-content: center;
    align-items: flex-start; 
    min-height: 100vh; 
    background-color: #1f1f1f;
    padding-top: 40px; 
    padding-bottom: 40px; 
  }

  .cadastro-card {
    background-color: #2f2f2f;
    padding: 30px 40px;
    border-radius: 12px;
    color: white;
    width: 100%;
    max-width: 500px;
    text-align: center;
  }
  
  .title {
    font-size: 40px;
    margin-bottom: 30px;
  }
  
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  
  .input {
    width: 100%;
    padding: 10px 15px;
    margin: 10px 0;
    border-radius: 6px;
    border: none;
    font-size: 16px;
  }
  
  .password-wrapper {
    position: relative;
    width: 100%;
    margin-left: -30px;
  }
  
  .password-toggle {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #000000;
  }
  
  .password-toggle:hover i {
    color: #aaa;
  }
  
  .botao {
    width: 100%;
    padding: 10px;
    background-color: #444;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .botao:hover {
    background-color: #555;
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

  .botao:disabled,
  .botao.desativado {
    background-color: #666;
    cursor: not-allowed;
  }
  </style>
  