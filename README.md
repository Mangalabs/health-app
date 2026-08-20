# Health App - Frontend

Aplicativo mobile desenvolvido com **React Native** e **Expo** para rastreamento de métricas de saúde, rotinas de medicamentos, hábitos diários e funcionalidades gamificadas.

---

## Tech Stack

- **Framework:** Expo (React Native)
- **Roteamento:** Expo Router
- **Gerenciamento de Estado:** Zustand
- **Busca e Cache:** TanStack React Query
- **Estilização:** NativeWind / Tailwind CSS
- **Formulários e Validação:** React Hook Form + Zod
- **Animações:** Moti + React Native Reanimated

---

## Pré‑requisitos

- Node.js (v20+ recomendado)
- npm (ou yarn)
- Expo Go (para testes em dispositivo físico) ou emulador Android Studio / Xcode

---

## Como executar

1. **Clone o repositório e instale as dependências:**

   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto e defina a URL da API do backend:

   ```env
   EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
   ```

   > *Ajuste o endereço conforme a configuração do seu backend.*

3. **Inicie o servidor de desenvolvimento:**

   ```bash
   npm start
   ```

---

## Scripts disponíveis

| Comando            | Descrição                                        |
| ------------------ | ------------------------------------------------ |
| `npm start`        | Inicia o servidor de desenvolvimento Expo.       |
| `npm run android`  | Abre o app em um emulador Android.               |
| `npm run ios`      | Abre o app em um simulador iOS.                  |
| `npm run web`      | Abre o app em um navegador web.                  |
| `npm run lint`     | Executa o ESLint para verificar a qualidade do código. |
| `npm run reset-project` | Reseta a estrutura do projeto para os templates padrão (apenas se necessário). |

---

## Arquitetura da aplicação

### Estrutura de pastas (principais)

```
src/
├── app/                 # Telas e navegação (Expo Router)
├── core/
│   ├── services/api/    # Módulos de API (health, medications, etc.)
│   ├── store/           # Stores globais (Zustand)
│   └── utils/           # Funções auxiliares
├── design-system/       # Componentes UI reutilizáveis (buttons, cards, inputs)
├── features/            # Funcionalidades agrupadas por domínio
│   ├── dashboard/       # Tela inicial
│   ├── health-tracking/ # Cards de peso, água, exercícios
│   ├── medications/     # Gerenciamento de medicamentos
│   ├── gamification/    # Pet virtual, XP, streaks
│   └── statistics/      # Gráficos e histórico
└── modules/             # Módulos de negócio (quando aplicável)
```

### Comunicação com o Backend

- **Cliente HTTP:** `axios` com interceptores para autenticação JWT.
- **Endpoints consumidos** (exemplos):
  - `/dashboard/summary` – resumo do dia
  - `/weight/history` – histórico de peso
  - `/hydration/history` – histórico de hidratação
  - `/exercise/history` – histórico de exercícios
  - `/medications/logs` – logs de medicamentos
- Todos os endpoints retornam dados com **timestamp** (`loggedAt`), permitindo agregação por dia, semana ou mês.

### Gerenciamento de estado

- **Zustand:** usado para estado global do usuário, gamificação e configurações.
- **React Query:** responsável pelo cache, invalidação e sincronização com a API. As queries são invalidadas automaticamente após mutações bem‑sucedidas, garantindo que a UI esteja sempre atualizada.

---

## Funcionalidades principais

### Dashboard (Home)

- **Medicamentos:** exibe apenas os medicamentos ativos que ainda **não** foram completamente tomados no dia atual. Cada medicamento aparece uma única vez, com seu horário.
- **Hidratação:** progresso diário com meta configurável.
- **Exercícios:** registro binário (fez/não fez).
- **Peso:** registro com atualização do último valor.
- **Pet virtual:** reage com XP, streaks e animações.

### Estatísticas

- **Gráficos:**
  - **Peso:** linha (evolução).
  - **Água:** barras verticais (consumo diário).
  - **Exercícios:** grade de dias com cores (verde = treino, vermelho = descanso).
  - **Medicamentos:** matriz de adesão por medicamento/dia.
- **Calendário mensal:** indicadores visuais (bolinhas) por categoria (peso, água, exercício, medicação).

### Medicamentos

- **Cadastro:** nome, dosagem, estoque, horário, cor e ícone.
- **Log diário:** cada dose pode ser marcada como `TAKEN`, `SKIPPED` ou `MISSED`.
- **Histórico:** consulta de logs com filtros por data.

---

## Considerações sobre dados e reatividade

### Medicamentos e doses

- Cada medicamento possui um único **horário padrão** (`timeOfDay`), mas o usuário pode registrar múltiplos logs no mesmo dia em horários diferentes.
- O card de medicamentos (home) mostra **apenas as doses pendentes** do dia atual, com base nos logs existentes:
  - Se não houver nenhum log para hoje, exibe uma dose pendente com o horário padrão.
  - Se houver logs, exibe apenas aqueles com status diferente de `TAKEN` (ou seja, `SKIPPED` ou `MISSED`).
  - Após uma ação (`TAKEN` ou `SKIPPED`), a dose desaparece imediatamente do card, graças à invalidação da query e ao `staleTime: 0`.
- **Limitação:** atualmente não há suporte para múltiplas doses programadas para o mesmo medicamento no mesmo dia, a menos que o usuário já tenha registrado logs para cada uma delas. Para essa funcionalidade completa, seria necessário expandir o modelo de dados com uma tabela de `MedicationSchedule`.

### Reatividade

- Todas as mutações (ex.: `logMedication`) invalidam as queries `medicationLogs` e `medications`, garantindo que a UI reflita imediatamente o novo estado.
- O uso de `staleTime: 0` em algumas queries evita que dados obsoletos sejam servidos pelo cache.

---

## Contribuição

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`).
4. Push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

---
