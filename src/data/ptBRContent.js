import { DOMAINS as EN_DOMAINS, CONNECTIONS as EN_CONNECTIONS, DIFFICULTY as EN_DIFFICULTY } from "./domains.js";
import { EXAM_GUIDE as EN_EXAM_GUIDE, DOMAIN_GUIDES as EN_DOMAIN_GUIDES, OBJECTIVE_GUIDE as EN_OBJECTIVE_GUIDE } from "./studyGuide.js";
import { QUIZ as EN_QUIZ } from "./quiz.js";

const DOMAIN_COPY = {
  1: {
    label: "Métodos de autenticação",
    mapLabel: "Auth",
    summary: "Como o Vault identifica clientes. Todo método de auth produz um token. Saiba diferenciar humano e sistema.",
    objectives: {
      "1a": { title: "Definir o propósito dos métodos de autenticação", tip: "Todo método de auth existe para produzir um token. É um dos pontos mais cobrados." },
      "1b": { title: "Escolher um método de autenticação pelo caso de uso", tip: "AppRole = automação, Kubernetes = pods, OIDC = SSO. Saiba casar o método com o cenário." },
      "1c": { title: "Métodos humanos vs. de sistema", tip: "AppRole é sempre método de máquina. A prova gosta muito dessa distinção." },
      "1d": { title: "Propósito de identidades e grupos", tip: "Entities unificam identidade em vários métodos de auth. Uma pessoa = uma entity." },
      "1e": { title: "Autenticar via API, CLI e UI", tip: "Lembre o padrão de API: /v1/auth/<method>/login/<identity>." },
      "1f": { title: "Configurar métodos de autenticação via API, CLI e UI", tip: "Auth methods podem usar paths customizados. O padrão é o nome do método." },
    },
  },
  2: {
    label: "Políticas do Vault",
    mapLabel: "Policies",
    summary: "Negação por padrão. Policies são anexadas a tokens. Capabilities controlam o que pode ser feito em cada path.",
    objectives: {
      "2a": { title: "Explicar o valor das políticas do Vault", tip: "DENY BY DEFAULT é o conceito número 1 de policies." },
      "2b": { title: "Sintaxe de paths em policies", tip: "Saiba o contraste: * é glob de sufixo; + corresponde a exatamente um segmento." },
      "2c": { title: "Capabilities de policy", tip: "deny sempre vence, não importa o que as outras policies permitam." },
      "2d": { title: "Escolher uma policy com base nos requisitos", tip: "Em cenários, pense sempre em menor privilégio." },
      "2e": { title: "Configurar policies via UI e CLI", tip: "root não pode ser alterada. default pode ser customizada." },
    },
  },
  3: {
    label: "Tokens do Vault",
    mapLabel: "Tokens",
    summary: "Tokens carregam policies e TTLs. Service vs. batch, root lifecycle, accessors e tokens órfãos.",
    objectives: {
      "3a": { title: "Escolher entre service e batch tokens", tip: "Batch = leve, não persistido, sem accessor. É um favorito da prova." },
      "3b": { title: "Ciclo de vida do root token", tip: "Root token é para emergência ou setup. Revogue depois de usar." },
      "3c": { title: "Token accessors", tip: "Accessors permitem administrar tokens sem expor o valor do token." },
      "3d": { title: "Impacto do TTL", tip: "max_ttl é um teto absoluto contado desde a criação." },
      "3e": { title: "Tokens órfãos", tip: "Se o pai for revogado, os filhos caem junto. Órfãos escapam dessa cascata." },
      "3f": { title: "Criar tokens de acordo com a necessidade", tip: "Periodic tokens combinam com serviços de longa duração." },
    },
  },
  4: {
    label: "Leases do Vault",
    mapLabel: "Leases",
    summary: "Todo segredo dinâmico tem lease. Renew estende; revoke invalida. -prefix é muito importante.",
    objectives: {
      "4a": { title: "Propósito de um lease ID", tip: "Lease ID = handle do ciclo de vida do segredo dinâmico." },
      "4b": { title: "Renovar leases", tip: "Renovar estende o mesmo segredo. Não cria um segredo novo." },
      "4c": { title: "Revogar leases", tip: "-prefix revoga tudo sob aquele path. Muito útil em incidentes." },
    },
  },
  5: {
    label: "Secrets engines",
    mapLabel: "Secrets",
    summary: "Plugins montados em paths. KV é estático; Database/Cloud é dinâmico. Transit = criptografia.",
    objectives: {
      "5a": { title: "Escolher um engine pelo caso de uso", tip: "estático=KV, dinâmico=Database/Cloud, criptografia=Transit." },
      "5b": { title: "Segredos dinâmicos vs. estáticos", tip: "Dinâmico = único por requisição, com expiração automática." },
      "5c": { title: "Transit secrets engine", tip: "Transit não armazena seus dados; ele processa criptografia." },
      "5d": { title: "Propósito dos secrets engines", tip: "Desabilitar uma mount é destrutivo." },
      "5e": { title: "Response wrapping", tip: "Response wrapping serve para entrega segura de uso único." },
      "5f": { title: "Valor dos segredos dinâmicos", tip: "Pense no porquê: menos risco permanente e menos credenciais compartilhadas." },
      "5g": { title: "Habilitar engines via API, CLI e UI", tip: "Mount de secrets engines fica em /v1/sys/mounts/<path>." },
      "5h": { title: "Acessar segredos via CLI, API e UI", tip: "A CLI esconde parte da complexidade, mas KV v2 ainda exige /data/ ou /metadata/ em policies e API." },
    },
  },
  6: {
    label: "Criptografia como serviço",
    mapLabel: "Transit",
    summary: "Transit criptografa e descriptografa sem armazenar dados. Rotate e rewrap são conceitos-chave.",
    objectives: {
      "6a": { title: "Criptografar e descriptografar com Transit", tip: "Plaintext entra em base64. Ciphertext inclui a versão da chave." },
      "6b": { title: "Rotacionar a chave de criptografia", tip: "Rotate cria nova versão; rewrap atualiza o ciphertext." },
    },
  },
  7: {
    label: "Fundamentos de arquitetura",
    mapLabel: "Arquitetura",
    summary: "Barrier criptográfica, seal/unseal e Shamir. O storage backend é tratado como não confiável.",
    objectives: {
      "7a": { title: "Como o Vault criptografa dados", tip: "O storage é não confiável porque o Vault criptografa antes de gravar." },
      "7b": { title: "Fazer seal e unseal no Vault", tip: "Recovery keys não conseguem fazer unseal do Vault." },
      "7c": { title: "Variáveis de ambiente", tip: "As principais são ADDR, TOKEN, NAMESPACE e FORMAT." },
    },
  },
  8: {
    label: "Arquitetura de implantação",
    mapLabel: "Deploy",
    summary: "Self-managed vs. HCP. Raft é o padrão recomendado. Rekey não é rotate.",
    objectives: {
      "8a": { title: "Clusters self-managed vs. HCP", tip: "HCP = mais operação gerenciada. Saiba os trade-offs." },
      "8b": { title: "Storage backends", tip: "Integrated Storage (Raft) é a resposta recomendada." },
      "8c": { title: "Shamir e operações de unseal", tip: "Rekey muda shares; rotate muda o material de criptografia." },
      "8d": { title: "Replicação DR e performance", tip: "DR replica tokens e leases; performance não." },
      "8e": { title: "Diferenciar Vault self-managed e gerenciado pela HashiCorp", tip: "Responda em termos de responsabilidade operacional." },
    },
  },
  9: {
    label: "Arquitetura de gerenciamento de acesso",
    mapLabel: "Acesso",
    summary: "Vault Agent e VSO reduzem a lógica de Vault dentro das aplicações usando padrões diferentes.",
    objectives: {
      "9a": { title: "Vault Agent", tip: "Agent = a app fica menos dependente da API do Vault." },
      "9b": { title: "Vault Secrets Operator (VSO)", tip: "VSO = sincronização nativa do Kubernetes. Agent = helper próximo da workload." },
    },
  },
};

const CONNECTIONS_PT = [
  [1, 3, "Login gera Tokens"],
  [3, 2, "Tokens carregam Policies"],
  [2, 5, "Policies protegem Paths"],
  [5, 4, "Segredos dinâmicos geram Leases"],
  [5, 6, "Transit é um Engine"],
  [7, 8, "Arquitetura orienta Operações"],
  [9, 1, "Agent/VSO dependem de Auth"],
  [9, 5, "Apps consomem segredos"],
];

const DIFFICULTY_PT = ["🟢 Fácil", "🟡 Médio", "🔴 Difícil"];

const EXAM_GUIDE_PT = {
  title: "Guia de Estudos Vault Associate (003)",
  summary:
    "Este guia adiciona a camada narrativa acima do mapa mental, dos flashcards e do quiz. Ele segue a trilha atual da prova HashiCorp Vault Associate (003) para Vault 1.16 e foca nas relações que a prova repete com mais frequência.",
  highlights: [
    { title: "Escopo atual", body: "A prova associate ativa do Vault é a Vault Associate (003), e a versão do produto cobrada é o Vault 1.16." },
    { title: "Estilo das questões", body: "As questões oficiais de exemplo usam verdadeiro/falso, resposta única e múltiplas respostas. A prova cobra mais clareza conceitual do que memorização obscura." },
    { title: "O que mais importa", body: "Siga a cadeia auth -> token -> policy -> secret engine -> lease. Muitas questões de cenário ficam simples quando você rastreia esse caminho." },
    { title: "Como usar o hub", body: "Leia o guia para ganhar contexto, abra cada domínio para aprofundar e depois use flashcards e quiz para transformar reconhecimento em lembrança ativa." },
  ],
  studyFlow: [
    { title: "Passo 1 - Aprender o mapa", body: "Comece pelo guia e pelo mapa mental até conseguir explicar como os nove domínios se conectam sem olhar para a tela." },
    { title: "Passo 2 - Trabalhar os objetivos", body: "Abra um domínio por vez e estude cada objetivo como uma pergunta de por que, quando e como, e não só como definição." },
    { title: "Passo 3 - Praticar contrastes", body: "Dê atenção extra aos pares clássicos: service vs batch, static vs dynamic, rekey vs rotate, DR vs performance replication, humano vs máquina." },
    { title: "Passo 4 - Simular a prova", body: "Use resumo, flashcards e quiz juntos. Revise cada erro perguntando qual ciclo de vida do Vault ou comparação você entendeu errado." },
  ],
  connectionMap: [
    { title: "Autenticação gera tokens", body: "O Vault não autoriza uma sessão de login diretamente. Todo auth flow bem-sucedido termina em um token que o cliente usa depois." },
    { title: "Tokens carregam policies", body: "Policies ficam anexadas aos tokens e definem capabilities sobre paths. Se você explica bem essa frase, muita coisa da prova fica simples." },
    { title: "Secrets engines geram dados e leases", body: "Segredos dinâmicos vêm de um engine montado e são acompanhados por lease IDs para que o Vault possa renovar ou revogar depois." },
    { title: "Transit continua sendo um secrets engine", body: "Transit processa dados em vez de armazená-los, mas ainda segue o modelo de mount e path do Vault." },
    { title: "Arquitetura explica a confiança", body: "Seal state, hierarquia de chaves, storage backend e replication explicam como o Vault continua seguro e disponível." },
    { title: "Agents reduzem complexidade nas apps", body: "Vault Agent e VSO ajudam a entregar segredos gerenciados pelo Vault sem empurrar lógica de API para cada aplicação." },
  ],
  officialLinks: EN_EXAM_GUIDE.officialLinks,
};

const DOMAIN_GUIDES_PT = {
  1: { focus: "As questões de autenticação cobram escolher a fonte de identidade certa e lembrar que todo auth bem-sucedido termina em token.", mentalModel: ["Auth responde quem é o chamador; policies respondem o que ele pode fazer.", "Humanos costumam usar OIDC, LDAP, GitHub ou Userpass; máquinas usam AppRole, Kubernetes ou cloud IAM.", "Entities e aliases permitem que o Vault reconheça o mesmo ator em mais de um método de auth."], commonTraps: ["Confundir token auth com autorização.", "Escolher AppRole para humanos ou OIDC/LDAP para workloads não interativas.", "Esquecer que token auth sempre fica habilitado."], resources: [{ label: "Docs de auth methods", href: "https://developer.hashicorp.com/vault/docs/auth" }, { label: "Docs de identity", href: "https://developer.hashicorp.com/vault/docs/concepts/identity" }] },
  2: { focus: "Policies são a camada central de autorização do Vault. A prova cobra path matching, capabilities, menor privilégio e deny-by-default.", mentalModel: ["Policies se prendem a tokens, não diretamente a usuários.", "Rules de path seguem paths de API, o que importa muito em KV v2.", "Múltiplas policies se combinam como união, exceto quando há deny explícito."], commonTraps: ["Misturar * e + em path syntax.", "Esquecer que sudo é para endpoints protegidos, não um modo admin geral.", "Assumir acesso residual sem policy."], resources: [{ label: "Docs de policies", href: "https://developer.hashicorp.com/vault/docs/concepts/policies" }, { label: "Tutorial de policies", href: "https://developer.hashicorp.com/vault/tutorials/getting-started/getting-started-policies" }] },
  3: { focus: "As questões de tokens giram em torno de ciclo de vida, persistência, renovabilidade, herança e quando cada tipo se encaixa melhor.", mentalModel: ["Tokens são a identidade operacional usada depois da autenticação.", "Service tokens têm ciclo de vida completo; batch tokens trocam isso por leveza e escala.", "TTL, max TTL, orphans e relações pai-filho explicam a maior parte do comportamento."], commonTraps: ["Assumir que todo token tem accessor.", "Pensar que renew passa de max TTL para sempre.", "Tratar root token como credencial admin normal."], resources: [{ label: "Conceitos de tokens", href: "https://developer.hashicorp.com/vault/docs/concepts/tokens" }, { label: "Tutorial de tokens", href: "https://developer.hashicorp.com/vault/tutorials/getting-started/getting-started-tokens" }] },
  4: { focus: "Leases são como o Vault gerencia a vida útil de saídas dinâmicas. Se a prova falar em renovar ou revogar credenciais geradas, pense em lease ID.", mentalModel: ["Segredos dinâmicos vêm com metadados de lease porque o Vault espera que expirem ou sejam revogados.", "Renew estende a vida do mesmo lease; revoke o invalida.", "Revogação por prefixo é a ferramenta de operação em massa para incidentes."], commonTraps: ["Confundir renew de lease com geração de credencial nova.", "Esquecer limites como max TTL e comportamento do backend.", "Não reconhecer o formato de um lease path."], resources: [{ label: "Conceitos de lease", href: "https://developer.hashicorp.com/vault/docs/concepts/lease" }, { label: "Tutorial de segredos dinâmicos", href: "https://developer.hashicorp.com/vault/tutorials/getting-started/getting-started-dynamic-secrets" }] },
  5: { focus: "Secrets engines são uma das áreas mais práticas da prova. Você precisa reconhecer qual engine resolve qual problema e como o path altera o comportamento.", mentalModel: ["Um secrets engine é um plugin montado em um path.", "Segredos estáticos são armazenados; dinâmicos são gerados sob demanda e normalmente vêm com lease.", "Transit é um secrets engine mesmo processando dados em vez de armazenar valores."], commonTraps: ["Esquecer que desabilitar uma mount apaga dados e leases.", "Ignorar a diferença de path do KV v2.", "Tratar response wrapping como criptografia em repouso."], resources: [{ label: "Visão geral de secrets engines", href: "https://developer.hashicorp.com/vault/docs/secrets" }, { label: "Docs do KV v2", href: "https://developer.hashicorp.com/vault/docs/secrets/kv" }] },
  6: { focus: "Criptografia como serviço é menor em escopo, mas vale muito na prova porque testa se você entende o que o Transit faz e o que ele não faz.", mentalModel: ["Transit mantém o material criptográfico dentro do Vault e executa operações para os clientes.", "Aplicações enviam plaintext em base64 para encrypt e recebem ciphertext com a versão da chave.", "Rotation cria nova versão da chave; rewrap atualiza ciphertext."], commonTraps: ["Assumir que Transit armazena o plaintext original.", "Misturar rotate com rewrap.", "Esquecer que decrypt devolve base64."], resources: [{ label: "Docs do Transit", href: "https://developer.hashicorp.com/vault/docs/secrets/transit" }, { label: "Tutorial do Transit", href: "https://developer.hashicorp.com/vault/tutorials/encryption-as-a-service/eaas-transit" }] },
  7: { focus: "Os fundamentos de arquitetura explicam por que o Vault consegue confiar em storage não confiável. Espere questões sobre barrier, seal state e variáveis de ambiente.", mentalModel: ["O Vault criptografa os dados antes que eles cheguem ao storage backend.", "Seal e unseal existem porque o Vault precisa proteger o material que destrava a barrier.", "Variáveis de ambiente ajudam a CLI, mas algumas são atalhos arriscados."], commonTraps: ["Dar crédito demais ao backend de storage em vez da barrier.", "Misturar unseal keys, recovery keys e root tokens.", "Usar VAULT_SKIP_VERIFY como se fosse normal em produção."], resources: [{ label: "Docs de seal e unseal", href: "https://developer.hashicorp.com/vault/docs/concepts/seal" }, { label: "Variáveis de ambiente da CLI", href: "https://developer.hashicorp.com/vault/docs/commands#environment-variables" }] },
  8: { focus: "Questões de arquitetura de deploy testam julgamento operacional: onde o Vault roda, qual storage usar e como recursos de disponibilidade ou recuperação se diferenciam.", mentalModel: ["Vault self-managed dá controle total e responsabilidade total; HCP Vault reduz parte da operação de infraestrutura.", "Integrated Storage com Raft é o padrão recomendado para novos deployments.", "Replication responde a necessidades diferentes: escala de performance e disaster recovery."], commonTraps: ["Misturar rekey e rotate.", "Tratar performance replication como backup.", "Esquecer que DR secondaries não atendem clientes até serem promovidos."], resources: [{ label: "Docs de storage", href: "https://developer.hashicorp.com/vault/docs/configuration/storage" }, { label: "Docs de replication", href: "https://developer.hashicorp.com/vault/docs/enterprise/replication" }] },
  9: { focus: "Arquitetura de gerenciamento de acesso é sobre reduzir a quantidade de lógica de Vault que suas aplicações precisam carregar, especialmente no Kubernetes.", mentalModel: ["Vault Agent cuida de auto-auth, cache local e templates perto da workload.", "Vault Secrets Operator sincroniza dados gerenciados pelo Vault para recursos nativos do Kubernetes.", "Os dois simplificam consumo de segredos, mas em modelos bem diferentes."], commonTraps: ["Assumir que VSO é só Vault Agent com outro nome.", "Ignorar a diferença entre sidecar e controller.", "Esquecer que o Agent ajuda a evitar código direto de Vault na app."], resources: [{ label: "Docs do Vault Agent", href: "https://developer.hashicorp.com/vault/docs/agent" }, { label: "Docs do Vault Secrets Operator", href: "https://developer.hashicorp.com/vault/docs/deploy/kubernetes/vso" }] },
};

const OBJECTIVE_REMEMBER_PT = {
  "1a": "Auth prova identidade; o token leva o acesso.",
  "1b": "Escolha o método que combina com a identidade nativa do chamador.",
  "1c": "Humanos fazem login; máquinas apresentam identidade de workload.",
  "1d": "Entity = quem realmente é; alias = como chegou.",
  "1e": "Interface diferente, mesmo fluxo, mesmo token.",
  "1f": "Um auth method é um backend montado com configurações.",
  "2a": "Sem policy, sem acesso.",
  "2b": "Policies falam a língua dos paths de API.",
  "2c": "Capabilities são os verbos permitidos em um path.",
  "2d": "Escreva a menor policy que ainda funcione.",
  "2e": "Escreva a policy e depois anexe a policy.",
  "3a": "Service = ciclo de vida completo; batch = escala leve.",
  "3b": "Root é temporário e excepcional.",
  "3c": "Accessor = handle do token sem expor o segredo.",
  "3d": "max_ttl é o limite rígido.",
  "3e": "Se o pai cai, os filhos caem, a menos que sejam órfãos.",
  "3f": "Crie o token que combina com duração e risco da workload.",
  "4a": "Lease ID é o handle do ciclo de vida.",
  "4b": "Renew mantém o mesmo segredo vivo por mais tempo.",
  "4c": "Revoke encerra o lease agora.",
  "5a": "Escolha o engine pelo ciclo de vida do segredo.",
  "5b": "Segredos dinâmicos são emitidos, não apenas guardados.",
  "5c": "Transit guarda as chaves no Vault e tira a lógica de crypto da app.",
  "5d": "O tipo do engine diz o que ele faz; o path diz onde ele vive.",
  "5e": "Empacota uma vez, desembrulha uma vez.",
  "5f": "Dinâmico e curto = menos risco permanente.",
  "5g": "Enable significa montar o engine em um path.",
  "5h": "Comandos amigáveis ainda apontam para paths exatos de API.",
  "6a": "Base64 entra, ciphertext sai, base64 volta no decrypt.",
  "6b": "Rotate a chave, rewrap o ciphertext.",
  "7a": "O Vault criptografa antes que o storage veja qualquer coisa.",
  "7b": "Unseal keys abrem o Vault; recovery keys não.",
  "7c": "ADDR, TOKEN, NAMESPACE e FORMAT são as principais.",
  "8a": "Mais controle normalmente significa mais trabalho operacional.",
  "8b": "Raft é o padrão recomendado.",
  "8c": "Rekey muda shares; rotate muda chaves de criptografia.",
  "8d": "Performance escala; DR recupera.",
  "8e": "A diferença é tanto quem opera quanto onde roda.",
  "9a": "Agent deixa a app menos consciente do Vault.",
  "9b": "VSO é o padrão nativo de sincronização do Kubernetes.",
};

export const PT_BR_CONTENT = {
  domains: EN_DOMAINS.map((domain) => {
    const copy = DOMAIN_COPY[domain.id];
    return {
      ...domain,
      ...(copy ? { label: copy.label, mapLabel: copy.mapLabel, summary: copy.summary } : {}),
      objectives: domain.objectives.map((objective) => ({
        ...objective,
        ...(copy?.objectives?.[objective.id] ?? {}),
      })),
    };
  }),
  connections: EN_CONNECTIONS.map((connection, index) => CONNECTIONS_PT[index] ?? connection),
  difficulty: DIFFICULTY_PT.length === EN_DIFFICULTY.length ? DIFFICULTY_PT : EN_DIFFICULTY,
  examGuide: EXAM_GUIDE_PT,
  domainGuides: DOMAIN_GUIDES_PT,
  objectiveGuide: Object.fromEntries(
    Object.entries(EN_OBJECTIVE_GUIDE).map(([id, note]) => [
      id,
      { ...note, ...(OBJECTIVE_REMEMBER_PT[id] ? { remember: OBJECTIVE_REMEMBER_PT[id] } : {}) },
    ])
  ),
  quiz: EN_QUIZ,
};
