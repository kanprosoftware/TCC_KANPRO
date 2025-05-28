<template>
    <div></div>
</template>
  
  <script>
  export default {
    async mounted() {
      const token = this.$route.query.token;
      console.log("token: ", token);
  
      if (!token) {
        alert("Token inválido ou ausente!");
        this.$router.push("/login");
        return;
      }
  
      try {
        const response = await fetch("http://localhost:3000/auth/verify-email", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        console.log(data);
  
        if (!response.ok) throw new Error(data.error || "Erro ao verificar");
  
        alert("Email verificado com sucesso!");
      } catch (err) {
        alert("Erro: " + err.message);
      }
  
      this.$router.push("/login");
    },
  };
  </script>
  