# Gestor de Notas Escolares

Um aplicativo web para gestão de notas escolares, com autenticação, gerenciamento de turmas, alunos, lançamento de notas e geração de relatórios em PDF.

## Funcionalidades

- Autenticação de professores
- Cadastro, edição e exclusão de turmas
- Cadastro, edição e exclusão de alunos
- Lançamento e edição de notas por aluno e turma
- Relatório geral com exportação em PDF
- Interface responsiva e tema escuro

## Tecnologias Utilizadas

- [React](https://react.dev/)
- [Firebase (Auth & Firestore)](https://firebase.google.com/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [jsPDF](https://github.com/parallax/jsPDF) e [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)

## Estrutura do Projeto

```
components/      # Componentes reutilizáveis (Sidebar, Modal, Spinner, Layout)
hooks/           # Hooks customizados (useAuth, useToast)
pages/           # Páginas principais (Login, Turmas, Alunos, Notas, Relatório)
services/        # Integração com Firebase (api.ts, firebase.ts)
types.ts         # Tipos TypeScript compartilhados
```

## Como rodar localmente

**Pré-requisitos:** Node.js

1. Instale as dependências:
   ```sh
   npm install
   ```
2. Configure sua chave da API Gemini (opcional, se usar IA):
   - Crie um arquivo `.env.local` na raiz e adicione:
     ```
     GEMINI_API_KEY=sua-chave-aqui
     ```
3. Execute o app:
   ```sh
   npm run dev
   ```

Acesse em [http://localhost:5173](http://localhost:5173) (ou porta indicada no terminal).

## Deploy

O projeto está pronto para deploy no Firebase Hosting. Para publicar:

```sh
npm run build
firebase deploy
```

## Licença

MIT. Veja o arquivo [LICENSE](LICENSE).

---

Projeto desenvolvido por Leonardo Pinho.

O front-end foi gerado com auxílio da IA do Firebase Studio.
