<template>
  <div class="login-container">
    <div class="login-card">
      <img src="../assets/icon.png" class="logo" alt="Logo" />
      <h1 class="title">KANPRO</h1>
      <form class="form" @submit.prevent="login">
        <div class="form">
          <input type="email" v-model="email" placeholder="Email" class="input" />
          <!-- <input type="password" v-model="password" placeholder="Senha" class="input" /> -->
          <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Senha" class="input password-input" />
          <div class="password-toggle" @click="togglePasswordVisibility">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </div>
          <div class="button-group">
            <button class="login-button" @click="login">Login</button>
            <button class="register-button" @click="register">Cadastre-se</button>
          </div>
        </div>
      </form>
      <div class="oauth-section">
        <span class="entreCom"><p>ou entre com</p></span>
        
        <div class="oauth-buttons">
          <button class="oauth-button" @click="loginWith('google')">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" />
            <span class="namebtt">Google</span>
          </button>

          <button class="oauth-button" @click="loginWith('github')">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" />
            <span class="namebtt">Github</span>
          </button>

          <button class="oauth-button" @click="loginWith('microsoft')">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" />
            <span class="namebtt">Microsoft</span>
          </button>

          <button class="oauth-button" @click="loginWith('linkedin')">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" />
            <span class="namebtt">LinkedIn</span>
          </button>
        </div>
        <a href="/esqueci-senha" class="forgot-password">Esqueceu a senha?</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      alertEmailNotVerified: false,
      alertEmailNotVerifiedMessage: '',
    };
  },
  
  methods: {
    login() {
      if (!this.email) {
        alert('Por favor, preencha o e-mail.');
        return;
      }

      if (!this.password) {
        alert('Por favor, preencha a senha.');
        return;
      }

      if (this.password.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres.');
        return;
      }
      fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: this.email,
          password: this.password
        })
      })
      .then(async (response) => {
        const contentType = response.headers.get('content-type');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Erro no login');
        }

        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          // Se o servidor não retorna JSON, ainda assim redireciona
          return {};
        }
      })
      .then(() => {
        // ✅ Redirecionar após sucesso
        window.location.href = 'http://localhost:5173/projetos';
      })
      .catch(error => {
        console.error('Erro no login:', error.message);
        alert('Falha no login: ' + error.message);
      });
    },

    register() {
      // console.log("Indo para tela de cadastro...");
      // // this.$router.push('/register');
      window.location.href = "http://localhost:5173/registro";
    },
    loginWith(provider) {
      window.location.href = `http://localhost:3000/auth/${provider}`;
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    handleEnter(event) {
      if (event.key === 'Escape') {
        this.fecharModal(); // ou qualquer outra função
      }
    },
  },
  mounted() {
    //console.log('componente carregado');

    const params = new URLSearchParams(window.location.search);
    const erro = params.get('erro');
    const email = params.get('email');

    if (erro === 'email-nao-verificado') {
      alert('Por favor, verifique seu e-mail antes de fazer login.');
    }
    if (email === 'email-enviado') {
      alert('Um e-mail de verificação foi enviado para o seu endereço de e-mail.');
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1f1f1f;
}

.password-toggle {
  position: relative;
  left: 190px;
  bottom: 30px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #000000;
}

.password-toggle:hover i {
  color: #808080; /* Cor do ícone quando o mouse passa sobre */
}

.login-card {
  background-color: #2f2f2f;
  padding: 25px 90px 20px 90px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  text-align: center;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 200px;
  height: 200px;
  margin-bottom: -60px;
}

.title {
  font-size: 80px;
  color: white;
  margin-bottom: 32px;
}

.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input {
  width: 100%;
  padding: 10px 15px;
  margin: 10px 0;
  border: none;
  border-radius: 6px;
  font-size: 16px;
}

.button-group {
  display: flex;
  width: 100%;
  gap: 10px;
  margin-top: 10px;
}

.login-button,
.register-button {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.login-button {
  background-color: #444;
  color: white;
}

.login-button:hover {
  background-color: #555;
}

.register-button {
  background-color: #fff;
  color: #444;
}

.register-button:hover {
  background-color: #eee;
}

.entreCom {
  margin-top: -20px;
  color: #aaa;
}

.oauth-section {
  margin-top: 20px;
  color: #aaa;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.oauth-buttons {
  margin-top: 10px;
  display: flex;
  gap: 12px;
}

.oauth-button {
  background-color: white;
  border: none;
  border-radius: 24px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.oauth-button:hover {
  background-color: #eee;
}

.oauth-button img {
  width: 24px;
  height: 24px;
}

.namebtt {
  color: black;
  font-size: 16px;
  margin-left: 5px;
  font-weight: 500;
}

.forgot-password {
  margin-top: 15px;
  color: #aaa;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}
.forgot-password:hover {
  color: white;
  text-decoration: underline;
}

.toggle-password i {
  font-size: 18px;
  color: #aaa;
}
.toggle-password:hover i {
  color: #fff;
}
.alert-box {
  background-color: #ff4d4d;
  color: white;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-weight: bold;
  text-align: center;
  width: 100%;
}


</style>
