# 📌 KANPRO – Uma ferramenta para gestão de projetos

KANPRO é uma ferramenta gratuita e de código aberto para gestão de projetos, inspirada em plataformas que utilizan kanban e gantt. Desenvolvida como parte de um Trabalho de Conclusão de Curso, seu objetivo é auxiliar equipes na organização de tarefas, com funcionalidades como Kanban, gráfico de Gantt, controle de recursos, entre outras.

🔗 Repositório oficial: [https://github.com/kanprosoftware/TCC_KANPRO](https://github.com/kanprosoftware/TCC_KANPRO)

---

## ⚙️ Requisitos

- **Node.js** versão 18 ou superior  
- **npm** (gerenciador de pacotes do Node)  
- **PostgreSQL** instalado e configurado  

> ⚠️ A configuração padrão assume:  
> - Banco de dados: `kanpro`  
> - Usuário: `postgres`  
> - Senha: `postgres`  

---

## 📥 Instalação e Execução Local

### 1. Clone o repositório

```bash
git clone https://github.com/kanprosoftware/TCC_KANPRO
```

---

### 2. Configure as variáveis de ambiente

As variáveis estão definidas no arquivo `.env.development` dentro do diretório `backend`.

Esse arquivo armazena:  
- Credenciais do banco de dados  
- Chaves JWT de autenticação  
- Configurações de serviços externos  

> 🔐 **Certifique-se de preencher corretamente esse arquivo antes de rodar a aplicação.**

---

### 3. Instale as dependências

Acesse os diretórios `backend` e `/frontend/KANPRO` separadamente e execute:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend/KANPRO
npm install
```

---

### 4. Migre o banco de dados

Dentro do diretório `backend`, execute:

```bash
npm run migrate:dev
```

Esse comando cria e aplica as tabelas no banco de dados usando o Prisma ORM.

---

### 5. Execute a aplicação

Com o banco configurado e dependências instaladas, inicie:

```bash
# No diretório backend
npm run start:dev

# Em outro terminal, no diretório frontend/KANPRO
npm run dev
```

---

### 6. Acesse no navegador

Com os servidores em execução, acesse:

```
http://localhost:5173
```

> 🛑 Certifique-se de que as portas necessárias estejam disponíveis e que nenhum outro serviço esteja conflitando.

## 📝 Licença

Este projeto é distribuído sob os termos da licença definida no próprio repositório. Consulte o arquivo [LICENSE](LICENSE) para mais informações.

---

## 👨‍💻 Autor

Desenvolvido por **Canrobert Acosta Brasil Junior**  
📧 Email: _canrobertbrasiljunior@hotmail.com_  
🌐 [LinkedIn](https://www.linkedin.com/in/canrobert-junior-6219481b1/)

---
