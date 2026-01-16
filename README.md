# 🚀 Lead – Internal Management System

Este projeto foi desenvolvido como um **Trabalho de Extensão Universitária**. O objetivo é aplicar conhecimentos técnicos em desenvolvimento web para resolver problemas reais de gestão interna, focando em segurança, escalabilidade e experiência do usuário (UX).

---

### 📝 Sobre o Projeto

O **Lead** é um sistema de gerenciamento interno robusto, construído para facilitar o acompanhamento de serviços e o controle rigoroso de acessos. Através de uma interface moderna, ele permite que organizações gerenciem permissões de forma granular e segura.

---

### ✨ Funcionalidades Principais

* 🔐 **Autenticação Completa:** Gerenciada via Supabase Auth.
* 🛡️ **Controle de Acesso (RBAC):** Diferenciação clara entre níveis de acesso (*Admin* vs. *User*).
* 🛠️ **Gestão de Serviços:** Interface intuitiva para criação e monitoramento de ordens de serviço.
* 🚦 **Navegação Inteligente:** Menus e ações que se adaptam dinamicamente conforme as permissões do usuário.
* 🔒 **Segurança de Dados:** Proteção direto na camada de banco de dados com **Row Level Security (RLS)**.

---

### 🧰 Tech Stack

O projeto utiliza as tecnologias mais modernas do ecossistema Fullstack:

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Backend & DB:** [Supabase](https://supabase.com/) (PostgreSQL + Auth)
* **Interface:** [ShadCN UI](https://ui.shadcn.com/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)

---

### 🔑 Controle de Acesso

A lógica de permissões é baseada na tabela `profiles`. Abaixo, a estrutura de privilégios:

| Papel (Role) | Nível de Acesso | Descrição |
| --- | --- | --- |
| **Admin** 👑 | Total | Acesso completo a configurações, usuários e serviços. |
| **User** 👤 | Restrito | Consulta e interação limitada aos serviços designados. |

> [!IMPORTANT]
> **Segurança:** Todas as operações críticas são protegidas por políticas de RLS, garantindo que um usuário nunca acesse dados de terceiros sem autorização.

---

### ⚙️ Configuração do Ambiente

**Pré-requisitos:**

* Node.js 18 ou superior
* Conta ativa no Supabase

**1. Variáveis de Ambiente:**
Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=seu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui

```

**2. Instalação e Execução:**

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev

```

---
