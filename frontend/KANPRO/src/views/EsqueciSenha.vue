<template>
    <div  class="modal-overlay">
      <div class="modal-content">
        <h1>Redefinir Senha</h1>
        <span class="textModal">Insira sua nova senha</span>
        <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Nova Senha" class="input password-input" @keydown.enter="redefinir" required/>
          <div class="password-toggle" @click="togglePasswordVisibility">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </div>
        <span class="dicaSenha">A senha deve conter pelo menos 6 caracteres</span>
        <div class="centerButtons">
          <button @click="redefinir" class="send-button" :disabled="aguarde">{{ aguarde ? 'Aguarde...' : 'Redefinir' }}</button>
        </div>
      </div>
    </div>
</template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
        return {
            password: '',
            showPassword: false,
        }
    },
    async mounted() {
      const token = this.$route.query.token;
      console.log("token: ", token);
  
      if (!token) {
        alert("Token inválido ou ausente!");
        this.$router.push("/login");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:3000/validate-reset-token", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        console.log(data);
        this.password = '';
        if (!response.ok) throw new Error(data.error || "Erro ao verificar");
      } catch (err) {
        alert("Erro: " + err.message);
        this.$router.push("/login");
      }

    },
    methods: {
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        async redefinir() {
            console.log("redefinir: ", this.password);

             const token = this.$route.query.token;

            if (!this.password) {
                alert("Digite uma senha!")
                return;
            }
            if (this.password.length < 6) {
                alert("Senha muito curta!");
                return;
            }

            try {
                const response = await axios.put("http://localhost:3000/auth/resetPasswordUser", {
                    token: token,
                    password: this.password,
                    }, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                alert("Senha redefinida com sucesso!");
                this.$router.push("/login");
            } catch (error) {
                alert(error);
            }
        }
    }
  };
  </script>
  
<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #2f2f2f;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  color: white;
  text-align: center;
}

.modal-content input {
  width: 91%;
}

.input {
  width: 100%;
  padding: 10px 15px;
  margin: 10px 0;
  border: none;
  border-radius: 6px;
  font-size: 16px;
}

.send-button,
.close-button {
  margin-top: 15px;
  padding: 10px;
  width: 100%;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.send-button {
  background-color: #444;
  color: white;
}

.send-button:hover {
  background-color: #555;
}

.close-button {
  background-color: #999;
  color: white;
}

.close-button:hover {
  background-color: #aaa;
}

.centerButtons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.textModal {
  width: 120%;
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-top: -23px;
  margin-bottom: 23px;
  margin-left: 117px;
}

.dicaSenha {
  width: 120%;
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-top: -18px;
  margin-bottom: 23px;
  margin-left: 7px;
}
.send-button:disabled,
.send-button.desativado {
  background-color: #666;
  cursor: not-allowed;
}

.password-toggle {
    width: 10px;
    height: 10px;
  position: relative;
  left: 370px;
  bottom: 37px;
  transform: translateY(-50%);
  cursor: pointer;
  color: #000000;
}

.password-toggle:hover i {
  color: #808080; 
}

</style>