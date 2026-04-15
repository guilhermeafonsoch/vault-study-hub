// HashiCorp Vault Associate (003) — 9 domains, 40 objectives.
// Source: https://developer.hashicorp.com/vault/tutorials/associate-cert-003/associate-review-003
// Content covers Vault 1.16. diff: 0=Easy, 1=Medium, 2=Hard.

export const DOMAINS = [
  {
    id: 1,
    icon: "🔐",
    label: "Authentication methods",
    mapLabel: "Auth methods",
    color: "#7F77DD",
    summary:
      "How Vault identifies clients. Every auth method ultimately produces a token. Know human vs system methods.",
    objectives: [
      {
        id: "1a",
        title: "Define the purpose of auth methods",
        diff: 0,
        concepts: [
          "Auth methods verify client identity before granting access",
          "All auth methods ultimately produce a Vault token",
          "Token auth is always enabled and cannot be disabled",
          "Every external auth maps down to a dynamically created token",
        ],
        cli: ["vault auth enable userpass", "vault auth list", "vault auth disable userpass/"],
        tip: "The fundamental goal of ALL auth methods is to obtain a token. Most tested concept.",
      },
      {
        id: "1b",
        title: "Choose an auth method based on use case",
        diff: 1,
        concepts: [
          "UserPass/LDAP/OIDC — human operators",
          "AppRole — CI/CD pipelines (role_id + secret_id)",
          "Kubernetes — pods via service account tokens",
          "AWS/Azure/GCP — cloud workloads with platform identity",
          "TLS Certificates — mTLS between services",
          "GitHub — developer teams using PATs",
        ],
        cli: ["vault auth enable -path=my-k8s kubernetes"],
        tip: "AppRole = automation, K8s = pods, OIDC = SSO. Know the match.",
      },
      {
        id: "1c",
        title: "Human vs system auth methods",
        diff: 0,
        concepts: [
          "Human: UserPass, LDAP, OIDC, GitHub — interactive login",
          "System/Machine: AppRole, Kubernetes, AWS, Azure, GCP, TLS Certs",
          "Human methods often use browser-based flows",
          "Machine methods use platform credentials (IAM role, SA)",
        ],
        cli: [],
        tip: "AppRole is ALWAYS machine. Exam loves asking which category.",
      },
      {
        id: "1d",
        title: "Purpose of identities and groups",
        diff: 1,
        concepts: [
          "Entity: single person or machine across auth methods",
          "Entity Alias: maps auth method identity to entity",
          "Internal Groups: managed within Vault",
          "External Groups: mapped from providers (LDAP OUs)",
          "Groups aggregate policies for multiple entities",
        ],
        cli: ['vault write identity/entity name="bob"'],
        tip: "Entities unify identity across auth methods. One person = one entity.",
      },
      {
        id: "1e",
        title: "Authenticate via API, CLI, and UI",
        diff: 0,
        concepts: [
          "CLI: vault login -method=userpass username=admin",
          "API: POST /v1/auth/userpass/login/admin",
          "UI: Select method, enter creds, click Sign In",
          "All return a client token for subsequent requests",
        ],
        cli: [
          "vault login -method=userpass username=admin",
          `curl --request POST --data '{"password":"<password>"}' \\\n  $VAULT_ADDR/v1/auth/userpass/login/admin`,
        ],
        tip: "Know API pattern: /v1/auth/<method>/login/<identity>",
      },
      {
        id: "1f",
        title: "Configure auth methods via API, CLI, UI",
        diff: 0,
        concepts: [
          "Enable: vault auth enable <type>",
          "Custom path: -path=my-ldap ldap",
          "API: POST /v1/sys/auth/<path>",
          "Tune: vault auth tune -max-lease-ttl=24h userpass/",
        ],
        cli: ["vault auth enable -path=corp-ldap ldap"],
        tip: "Auth methods can be at custom paths. Default = method name.",
      },
    ],
  },
  {
    id: 2,
    icon: "📜",
    label: "Vault policies",
    color: "#1D9E75",
    summary:
      "Deny by default. Policies are HCL/JSON attached to tokens. Capabilities map to HTTP verbs.",
    objectives: [
      {
        id: "2a",
        title: "Value of Vault policies",
        diff: 0,
        concepts: [
          "DENY BY DEFAULT — no policy = no access",
          "Primary authorization mechanism in Vault",
          "Written in HCL or JSON, attached to tokens",
          "Multiple policies are additive (union of permissions)",
          "deny capability always takes precedence",
        ],
        cli: ["vault policy list", "vault policy read default"],
        tip: "DENY BY DEFAULT is the #1 tested policy concept.",
      },
      {
        id: "2b",
        title: "Policy path syntax",
        diff: 1,
        concepts: [
          "Paths match API endpoints: secret/data/myapp/*",
          "* is used as a suffix glob in policy paths",
          "+ (wildcard) matches exactly one path segment",
          "secret/data/+/config matches one-level deep",
          "Paths are case-sensitive",
        ],
        cli: [
          'path "secret/data/*" {\n  capabilities = ["read"]\n}',
          'path "secret/data/+/creds" {\n  capabilities = ["read"]\n}',
        ],
        tip: "Know the wildcard contrast: * is a suffix glob, + matches exactly one segment.",
      },
      {
        id: "2c",
        title: "Policy capabilities",
        diff: 1,
        concepts: [
          "create, read, update, delete, list, sudo, deny",
          "sudo = access root-protected endpoints (sys/)",
          "deny = explicit deny, overrides ALL other capabilities",
          "HTTP mapping: create=POST, read=GET, list=LIST",
        ],
        cli: [
          'path "secret/data/prod/*" {\n  capabilities = ["create","read",\n    "update","delete","list"]\n}',
        ],
        tip: "deny ALWAYS wins regardless of other policies.",
      },
      {
        id: "2d",
        title: "Choose a policy based on requirements",
        diff: 2,
        concepts: [
          "Least privilege: grant only what's needed",
          "Template vars: {{identity.entity.id}}, {{identity.entity.name}}",
          "Combine fine-grained paths for role-based access",
        ],
        cli: [
          'path "secret/data/users/\n  {{identity.entity.name}}/*" {\n  capabilities = ["create","read",\n    "update","delete","list"]\n}',
        ],
        tip: "Focus on least privilege for scenario questions.",
      },
      {
        id: "2e",
        title: "Configure policies via UI and CLI",
        diff: 0,
        concepts: [
          "vault policy write <name> <file.hcl>",
          "Built-in root: full access, CANNOT be modified",
          "Built-in default: on every token, CAN be modified",
          "UI: Policies tab → Create ACL Policy",
        ],
        cli: ["vault policy write dev-ro ./dev-readonly.hcl", "vault token create -policy=dev-ro"],
        tip: "root can't change. default CAN be customized.",
      },
    ],
  },
  {
    id: 3,
    icon: "🎫",
    label: "Vault tokens",
    color: "#D85A30",
    summary:
      "Tokens carry policies and TTLs. Service vs batch, root lifecycle, accessors, orphans.",
    objectives: [
      {
        id: "3a",
        title: "Service vs batch tokens",
        diff: 2,
        concepts: [
          "Service: persisted, renewable, accessor, child tokens (service token prefix)",
          "Batch: NOT persisted, NOT renewable, no accessor (hvb.)",
          "Batch = lightweight, encoded in token itself",
          "Use batch for high-volume short-lived workloads",
        ],
        cli: ["vault token create -type=service", "vault token create -type=batch"],
        tip: "Batch = lightweight, not persisted, hvb. prefix. Exam favorite.",
      },
      {
        id: "3b",
        title: "Root token lifecycle",
        diff: 1,
        concepts: [
          "Root policy = unlimited access",
          "ONLY for initial setup or emergencies",
          "MUST revoke immediately after use",
          "Regenerate: vault operator generate-root",
        ],
        cli: ["vault operator generate-root -init", "vault token revoke <root-token>"],
        tip: "Root tokens: emergencies only. Always revoke after use.",
      },
      {
        id: "3c",
        title: "Token accessors",
        diff: 1,
        concepts: [
          "Unique accessor per service token",
          "Lookup/revoke/renew WITHOUT knowing token ID",
          "Batch tokens do NOT have accessors",
        ],
        cli: ["vault token lookup -accessor <acc>", "vault token revoke -accessor <acc>"],
        tip: "Accessors manage tokens without exposing the value.",
      },
      {
        id: "3d",
        title: "Impact of TTL",
        diff: 2,
        concepts: [
          "Default system TTL: 32 days",
          "Renew resets TTL but can't exceed max_ttl",
          "max_ttl counted from CREATION time",
          "Once max_ttl reached, token revoked regardless",
        ],
        cli: ["vault token create -ttl=1h -max-ttl=24h", "vault token renew -increment=2h <token>"],
        tip: "max_ttl is absolute from creation. Can't extend past it!",
      },
      {
        id: "3e",
        title: "Orphaned tokens",
        diff: 1,
        concepts: [
          "Normal tokens: parent-child trees",
          "Revoking parent revokes ALL children recursively",
          "Orphan tokens: no parent, independent lifecycle",
          "Auth method tokens are typically orphan",
        ],
        cli: ["vault token create -orphan -ttl=1h"],
        tip: "Parent revocation cascades. Orphans are immune.",
      },
      {
        id: "3f",
        title: "Create tokens based on need",
        diff: 1,
        concepts: [
          "Periodic: renewable indefinitely (no max_ttl)",
          "Use-limit: expire after N uses",
          "Token roles: pre-define token properties",
          "Tokens inherit policies from creator (unless root)",
        ],
        cli: ["vault token create -period=24h", "vault token create -use-limit=5"],
        tip: "Periodic tokens for long-running services.",
      },
    ],
  },
  {
    id: 4,
    icon: "⏰",
    label: "Vault leases",
    color: "#D4537E",
    summary:
      "Every dynamic secret has a lease. Renew to extend, revoke to invalidate. -prefix is your friend.",
    objectives: [
      {
        id: "4a",
        title: "Purpose of a lease ID",
        diff: 1,
        concepts: [
          "Every dynamic secret has an associated lease",
          "Format: <mount>/creds/<role>/<uuid>",
          "Lease expires → Vault revokes credentials",
          "Lease metadata is the handle Vault uses for renew and revoke workflows",
        ],
        cli: ["vault read database/creds/readonly"],
        tip: "Lease ID = how you manage dynamic secret lifecycle.",
      },
      {
        id: "4b",
        title: "Renew leases",
        diff: 1,
        concepts: [
          "vault lease renew extends the TTL",
          "Cannot exceed max_ttl",
          "Renewal keeps SAME credentials valid",
          "If renewal fails, request new credentials",
        ],
        cli: ["vault lease renew <lease-id>", "vault lease renew -increment=2h <id>"],
        tip: "Renewing extends SAME credentials. NOT new ones.",
      },
      {
        id: "4c",
        title: "Revoke leases",
        diff: 0,
        concepts: [
          "vault lease revoke invalidates a specific lease",
          "-prefix revokes ALL leases under a path",
          "-force ignores backend errors",
          "Vault auto-revokes expired leases",
        ],
        cli: ["vault lease revoke <lease-id>", "vault lease revoke -prefix database/creds/"],
        tip: "-prefix revokes ALL under that path. Incident response!",
      },
    ],
  },
  {
    id: 5,
    icon: "🗄️",
    label: "Secrets engines",
    color: "#378ADD",
    summary:
      "Plugins mounted at paths. KV static vs Database/Cloud dynamic. Transit = encryption. Cubbyhole = per-token.",
    objectives: [
      {
        id: "5a",
        title: "Choose engine by use case",
        diff: 1,
        concepts: [
          "KV: static key-value | Database: dynamic DB creds",
          "AWS/Azure/GCP: dynamic cloud IAM | Transit: encryption",
          "PKI: certificates | SSH: signed keys | Cubbyhole: per-token",
        ],
        cli: ["vault secrets enable -path=myapp kv-v2"],
        tip: "static=KV, dynamic=Database/Cloud, encryption=Transit.",
      },
      {
        id: "5b",
        title: "Dynamic vs static secrets",
        diff: 1,
        concepts: [
          "Static: stored, manually rotated (KV)",
          "Dynamic: on-demand with TTL, auto-revoked, UNIQUE per request",
          "Dynamic = reduced blast radius, full audit trail",
        ],
        cli: ["vault kv put secret/myapp db_pass=<db-password>", "vault read database/creds/readonly"],
        tip: "Dynamic = unique per request, auto-expire. Core value prop.",
      },
      {
        id: "5c",
        title: "Transit secrets engine",
        diff: 1,
        concepts: [
          "Encryption as a Service — keys NEVER leave Vault",
          "encrypt, decrypt, sign, verify, hash, hmac, rewrap",
          "Key rotation without re-encrypting data",
          "Data never stored — only processed",
        ],
        cli: [
          "vault write transit/encrypt/my-key \\\n  plaintext=$(echo -n 'secret' | base64)",
        ],
        tip: "Transit NEVER stores data. Keys never leave Vault.",
      },
      {
        id: "5d",
        title: "Purpose of secrets engines",
        diff: 0,
        concepts: [
          "Plugins mounted at paths, isolated barrier view",
          "Can enable same engine multiple times at different paths",
          "Disabling DELETES all data and leases!",
        ],
        cli: ["vault secrets enable -path=team-a kv-v2", "vault secrets list -detailed"],
        tip: "Disabling = DESTRUCTIVE. All data deleted!",
      },
      {
        id: "5e",
        title: "Response wrapping",
        diff: 2,
        concepts: [
          "Wraps response in single-use wrapping token",
          "Stored in cubbyhole, unwrap ONCE only",
          "Secure zero-knowledge secret delivery",
          "TTL controls delivery window",
        ],
        cli: ["vault kv get -wrap-ttl=120 secret/myapp", "vault unwrap <wrapping-token>"],
        tip: "Response wrapping: one-time use for secure delivery.",
      },
      {
        id: "5f",
        title: "Value of dynamic secrets",
        diff: 0,
        concepts: [
          "Reduced blast radius, unique per consumer",
          "Auto cleanup, no stale credentials",
          "Better compliance and audit trail",
        ],
        cli: [],
        tip: "Focus on WHY dynamic > static.",
      },
      {
        id: "5g",
        title: "Enable engines via API, CLI, UI",
        diff: 0,
        concepts: [
          "CLI: vault secrets enable [-path=<p>] <type>",
          "API: POST /v1/sys/mounts/<path>",
          "Disable is DESTRUCTIVE",
        ],
        cli: [
          `curl -H "X-Vault-Token: ..." --request POST \\\n  --data '{"type":"kv"}' \\\n  $VAULT_ADDR/v1/sys/mounts/myapp`,
        ],
        tip: "API: POST /v1/sys/mounts/<path>.",
      },
      {
        id: "5h",
        title: "Access secrets via CLI, API, UI",
        diff: 1,
        concepts: [
          "CLI often uses mount + key syntax instead of raw API paths",
          "KV v2 API reads use <mount>/data/<key>",
          "KV v2 metadata operations use <mount>/metadata/<key>",
          "ACL policies still need the exact KV v2 API path structure",
        ],
        cli: [
          "vault kv get -mount=secret myapp/config",
          `curl -H "X-Vault-Token: $VAULT_TOKEN" \\\n  $VAULT_ADDR/v1/secret/data/myapp/config`,
        ],
        tip: "CLI convenience hides it, but KV v2 policies and API paths still need /data/ or /metadata/.",
      },
    ],
  },
  {
    id: 6,
    icon: "🔒",
    label: "Encryption as a Service",
    color: "#639922",
    summary: "Transit encrypts/decrypts without storing data. Versioned keys, rotate + rewrap.",
    objectives: [
      {
        id: "6a",
        title: "Encrypt/decrypt with Transit",
        diff: 1,
        concepts: [
          "Plaintext MUST be base64 encoded",
          "Ciphertext: vault:v<version>:<base64>",
          "Decrypt returns base64 — decode for plaintext",
          "Data never stored, only processed",
        ],
        cli: [
          "vault secrets enable transit",
          "vault write -f transit/keys/orders",
          "vault write transit/encrypt/orders \\\n  plaintext=$(echo -n 'card-4242' | base64)",
          "vault write transit/decrypt/orders \\\n  ciphertext=vault:v1:AbCdEf...",
        ],
        tip: "Plaintext = base64. Ciphertext includes version: vault:v1:...",
      },
      {
        id: "6b",
        title: "Rotate encryption key",
        diff: 1,
        concepts: [
          "Rotation creates new key version",
          "Old ciphertext still decryptable",
          "Re-wrap upgrades ciphertext to latest version",
          "min_decryption_version enforces minimum",
        ],
        cli: [
          "vault write -f transit/keys/orders/rotate",
          "vault write transit/rewrap/orders \\\n  ciphertext=vault:v1:AbCdEf...",
        ],
        tip: "Rotate = new version. Old readable. Re-wrap to upgrade.",
      },
    ],
  },
  {
    id: 7,
    icon: "🏗️",
    label: "Architecture fundamentals",
    color: "#BA7517",
    summary:
      "Cryptographic barrier, seal/unseal, Shamir's Secret Sharing. Storage backend is untrusted.",
    objectives: [
      {
        id: "7a",
        title: "How Vault encrypts data",
        diff: 1,
        concepts: [
          "Cryptographic barrier encrypts ALL data",
          "Unseal or auto-unseal lets Vault recover the root key that unlocks the barrier",
          "Storage backend is UNTRUSTED, always encrypted",
        ],
        cli: [],
        tip: "Know the hierarchy. Storage = always untrusted.",
      },
      {
        id: "7b",
        title: "Seal and unseal Vault",
        diff: 2,
        concepts: [
          "Sealed = can't decrypt (only status + unseal work)",
          "Shamir: N shares, threshold T (default 5/3)",
          "Auto-unseal: external KMS (AWS, GCP, Azure, HSM)",
          "Recovery keys CANNOT unseal — only for quorum ops",
        ],
        cli: [
          "vault operator init -key-shares=5 -key-threshold=3",
          "vault operator unseal <share>",
          "vault operator seal",
        ],
        tip: "Recovery keys (auto-unseal) CANNOT unseal Vault!",
      },
      {
        id: "7c",
        title: "Environment variables",
        diff: 0,
        concepts: [
          "VAULT_ADDR, VAULT_TOKEN, VAULT_NAMESPACE",
          "VAULT_SKIP_VERIFY (dev only!), VAULT_FORMAT",
          "VAULT_CACERT, VAULT_CLIENT_CERT",
        ],
        cli: [
          "export VAULT_ADDR='https://vault:8200'",
          "export VAULT_TOKEN='<vault-token>'",
          "export VAULT_FORMAT='json'",
        ],
        tip: "Key vars: ADDR, TOKEN, NAMESPACE, FORMAT.",
      },
    ],
  },
  {
    id: 8,
    icon: "🌐",
    label: "Deployment architecture",
    mapLabel: "Deploy arch",
    color: "#854F0B",
    summary: "Self-managed vs HCP. Integrated Storage (Raft) recommended. Rekey ≠ rotate.",
    objectives: [
      {
        id: "8a",
        title: "Self-managed vs HCP clusters",
        diff: 1,
        concepts: [
          "Self-managed: full control, full responsibility",
          "HCP Vault Dedicated: HashiCorp manages infra",
          "HCP: auto-upgrades, backups, HA",
        ],
        cli: [],
        tip: "HCP = managed service. Know trade-offs.",
      },
      {
        id: "8b",
        title: "Storage backends",
        diff: 1,
        concepts: [
          "Integrated Storage (Raft): RECOMMENDED",
          "External storage backends exist when you have a specific operational reason",
          "Only ONE storage backend is configured per cluster",
          "In-memory storage is for dev mode only",
        ],
        cli: ['storage "raft" {\n  path = "/opt/vault/data"\n  node_id = "vault-1"\n}'],
        tip: "Raft is recommended. Know this.",
      },
      {
        id: "8c",
        title: "Shamir and unsealing ops",
        diff: 1,
        concepts: [
          "init: generate unseal keys + root token",
          "unseal: provide shares until threshold",
          "rekey: change shares/threshold/holders",
          "rotate: change encryption key (DEK)",
          "Rekey ≠ Rotate!",
        ],
        cli: [
          "vault operator init",
          "vault operator rekey -init -key-shares=3 -key-threshold=2",
          "vault operator rotate",
        ],
        tip: "Rekey = unseal keys. Rotate = encryption key. Different!",
      },
      {
        id: "8d",
        title: "DR and performance replication",
        diff: 2,
        concepts: [
          "Perf: scales reads, secondaries handle clients, own tokens",
          "DR: full mirror incl. tokens/leases, warm standby",
          "DR can't serve clients until promoted",
        ],
        cli: [],
        tip: "DR mirrors tokens/leases, Perf does NOT.",
      },
      {
        id: "8e",
        title: "Differentiate self-managed vs HashiCorp-managed Vault",
        diff: 0,
        concepts: [
          "Self-managed: you own upgrades, backups, HA behavior, and surrounding infrastructure",
          "HashiCorp-managed: HashiCorp operates more of the platform lifecycle for you",
          "Both models still require sound auth, policy, and app-integration design",
        ],
        cli: [],
        tip: "Answer this objective in ownership terms: who operates the platform, not just where it runs.",
      },
    ],
  },
  {
    id: 9,
    icon: "🤖",
    label: "Access management architecture",
    mapLabel: "Access arch",
    color: "#993556",
    summary:
      "Vault Agent and Vault Secrets Operator reduce app-side Vault logic through helper and controller patterns.",
    objectives: [
      {
        id: "9a",
        title: "Vault Agent",
        diff: 1,
        concepts: [
          "Sidecar daemon: Auto-Auth, Caching, Templating",
          "Apps don't need Vault SDK",
          "Agent Injector: K8s mutating webhook",
          "Templates re-render when secrets change",
        ],
        cli: [
          "vault agent -config=agent.hcl",
          'auto_auth {\n  method "approle" {\n    config = {\n      role_id_file_path = "/etc/vault/role-id"\n    }\n  }\n}',
        ],
        tip: "Agent = apps don't need Vault API.",
      },
      {
        id: "9b",
        title: "Vault Secrets Operator (VSO)",
        diff: 1,
        concepts: [
          "K8s-native controller: syncs Vault-managed data into Kubernetes resources",
          "No sidecar is required in every pod",
          "Secret transformation and encrypted client cache are optional platform features, not the basic mental model",
          "Think controller-style sync, not sidecar-style secret delivery",
        ],
        cli: [
          "apiVersion: secrets.hashicorp.com/v1beta1\nkind: VaultStaticSecret\nspec:\n  mount: secret\n  path: myapp/config\n  destination:\n    name: my-k8s-secret",
        ],
        tip: "VSO = Kubernetes-native controller sync. Agent = helper close to the workload.",
      },
    ],
  },
];

export const CONNECTIONS = [
  [1, 3, "Login issues Tokens"],
  [3, 2, "Tokens carry Policies"],
  [2, 5, "Policies gate Paths"],
  [5, 4, "Dynamic secrets create Leases"],
  [5, 6, "Transit is an Engine"],
  [7, 8, "Architecture drives Operations"],
  [9, 1, "Agent/VSO rely on Auth"],
  [9, 5, "Apps consume secret outputs"],
];

export const DIFFICULTY = ["🟢 Easy", "🟡 Medium", "🔴 Hard"];

export const TOTAL_OBJECTIVES = DOMAINS.reduce((s, d) => s + d.objectives.length, 0);

export const allObjectives = () =>
  DOMAINS.flatMap((d) => d.objectives.map((o) => ({ ...o, domain: d })));
