import { OBJECTIVE_GUIDE } from "./studyGuide.js";

const doc = (label, href) => ({ label, href });

export const QUIZ_DOCS = {
  associate: doc(
    "Vault Associate (003) objectives",
    "https://developer.hashicorp.com/vault/tutorials/associate-cert-003/associate-review-003"
  ),
  authConcepts: doc(
    "Authentication concepts",
    "https://developer.hashicorp.com/vault/docs/concepts/auth"
  ),
  authMethods: doc(
    "Auth methods overview",
    "https://developer.hashicorp.com/vault/docs/auth"
  ),
  approle: doc(
    "AppRole auth",
    "https://developer.hashicorp.com/vault/docs/auth/approle"
  ),
  kubernetesAuth: doc(
    "Kubernetes auth",
    "https://developer.hashicorp.com/vault/docs/auth/kubernetes"
  ),
  jwtAuth: doc(
    "JWT/OIDC auth",
    "https://developer.hashicorp.com/vault/docs/auth/jwt"
  ),
  awsAuth: doc(
    "AWS auth",
    "https://developer.hashicorp.com/vault/docs/auth/aws"
  ),
  certAuth: doc(
    "TLS cert auth",
    "https://developer.hashicorp.com/vault/docs/auth/cert"
  ),
  ldapAuth: doc(
    "LDAP auth",
    "https://developer.hashicorp.com/vault/docs/auth/ldap"
  ),
  userpassAuth: doc(
    "Userpass auth",
    "https://developer.hashicorp.com/vault/docs/auth/userpass"
  ),
  githubAuth: doc(
    "GitHub auth",
    "https://developer.hashicorp.com/vault/docs/auth/github"
  ),
  identity: doc(
    "Identity concepts",
    "https://developer.hashicorp.com/vault/docs/concepts/identity"
  ),
  policies: doc(
    "Policies concepts",
    "https://developer.hashicorp.com/vault/docs/concepts/policies"
  ),
  tokens: doc(
    "Token concepts",
    "https://developer.hashicorp.com/vault/docs/concepts/tokens"
  ),
  lease: doc(
    "Lease, renew, and revoke",
    "https://developer.hashicorp.com/vault/docs/concepts/lease"
  ),
  database: doc(
    "Database secrets engine",
    "https://developer.hashicorp.com/vault/docs/secrets/databases"
  ),
  pki: doc(
    "PKI secrets engine",
    "https://developer.hashicorp.com/vault/docs/secrets/pki"
  ),
  cubbyhole: doc(
    "Cubbyhole secrets engine",
    "https://developer.hashicorp.com/vault/docs/secrets/cubbyhole"
  ),
  kv: doc(
    "KV secrets engine",
    "https://developer.hashicorp.com/vault/docs/secrets/kv"
  ),
  transit: doc(
    "Transit secrets engine",
    "https://developer.hashicorp.com/vault/docs/secrets/transit"
  ),
  secrets: doc(
    "Secrets engines overview",
    "https://developer.hashicorp.com/vault/docs/secrets"
  ),
  responseWrapping: doc(
    "Response wrapping",
    "https://developer.hashicorp.com/vault/docs/concepts/response-wrapping"
  ),
  commands: doc(
    "Vault CLI usage",
    "https://developer.hashicorp.com/vault/docs/commands"
  ),
  seal: doc(
    "Seal and unseal concepts",
    "https://developer.hashicorp.com/vault/docs/concepts/seal"
  ),
  storage: doc(
    "Storage configuration",
    "https://developer.hashicorp.com/vault/docs/configuration/storage"
  ),
  hcpVault: doc(
    "HCP Vault Dedicated overview",
    "https://developer.hashicorp.com/hcp/docs/vault/what-is-hcp-vault"
  ),
  replication: doc(
    "Replication support",
    "https://developer.hashicorp.com/vault/docs/enterprise/replication"
  ),
  agent: doc(
    "Vault Agent",
    "https://developer.hashicorp.com/vault/docs/agent-and-proxy/agent"
  ),
  autoauth: doc(
    "Auto-auth",
    "https://developer.hashicorp.com/vault/docs/agent/autoauth"
  ),
  vso: doc(
    "Vault Secrets Operator",
    "https://developer.hashicorp.com/vault/docs/deploy/kubernetes/vso/sources/vault"
  ),
  k8sCompare: doc(
    "Kubernetes integrations comparison",
    "https://developer.hashicorp.com/vault/docs/deploy/kubernetes/comparisons"
  ),
};

const OBJECTIVE_DOCS = {
  "1a": [QUIZ_DOCS.associate, QUIZ_DOCS.authConcepts, QUIZ_DOCS.authMethods],
  "1b": [QUIZ_DOCS.associate, QUIZ_DOCS.authConcepts, QUIZ_DOCS.authMethods],
  "1c": [QUIZ_DOCS.associate, QUIZ_DOCS.authConcepts, QUIZ_DOCS.authMethods],
  "1d": [QUIZ_DOCS.associate, QUIZ_DOCS.identity, QUIZ_DOCS.authConcepts],
  "1e": [QUIZ_DOCS.associate, QUIZ_DOCS.authConcepts, QUIZ_DOCS.commands],
  "1f": [QUIZ_DOCS.associate, QUIZ_DOCS.authConcepts, QUIZ_DOCS.authMethods],
  "2a": [QUIZ_DOCS.associate, QUIZ_DOCS.policies],
  "2b": [QUIZ_DOCS.associate, QUIZ_DOCS.policies, QUIZ_DOCS.kv],
  "2c": [QUIZ_DOCS.associate, QUIZ_DOCS.policies],
  "2d": [QUIZ_DOCS.associate, QUIZ_DOCS.policies, QUIZ_DOCS.identity],
  "2e": [QUIZ_DOCS.associate, QUIZ_DOCS.policies, QUIZ_DOCS.commands],
  "3a": [QUIZ_DOCS.associate, QUIZ_DOCS.tokens],
  "3b": [QUIZ_DOCS.associate, QUIZ_DOCS.tokens, QUIZ_DOCS.seal],
  "3c": [QUIZ_DOCS.associate, QUIZ_DOCS.tokens],
  "3d": [QUIZ_DOCS.associate, QUIZ_DOCS.tokens, QUIZ_DOCS.lease],
  "3e": [QUIZ_DOCS.associate, QUIZ_DOCS.tokens],
  "3f": [QUIZ_DOCS.associate, QUIZ_DOCS.tokens],
  "4a": [QUIZ_DOCS.associate, QUIZ_DOCS.lease, QUIZ_DOCS.database],
  "4b": [QUIZ_DOCS.associate, QUIZ_DOCS.lease, QUIZ_DOCS.database],
  "4c": [QUIZ_DOCS.associate, QUIZ_DOCS.lease, QUIZ_DOCS.database],
  "5a": [QUIZ_DOCS.associate, QUIZ_DOCS.secrets, QUIZ_DOCS.database],
  "5b": [QUIZ_DOCS.associate, QUIZ_DOCS.secrets, QUIZ_DOCS.lease],
  "5c": [QUIZ_DOCS.associate, QUIZ_DOCS.transit],
  "5d": [QUIZ_DOCS.associate, QUIZ_DOCS.secrets],
  "5e": [QUIZ_DOCS.associate, QUIZ_DOCS.responseWrapping, QUIZ_DOCS.cubbyhole],
  "5f": [QUIZ_DOCS.associate, QUIZ_DOCS.lease, QUIZ_DOCS.database],
  "5g": [QUIZ_DOCS.associate, QUIZ_DOCS.secrets, QUIZ_DOCS.commands],
  "5h": [QUIZ_DOCS.associate, QUIZ_DOCS.kv, QUIZ_DOCS.policies],
  "6a": [QUIZ_DOCS.associate, QUIZ_DOCS.transit],
  "6b": [QUIZ_DOCS.associate, QUIZ_DOCS.transit],
  "7a": [QUIZ_DOCS.associate, QUIZ_DOCS.seal, QUIZ_DOCS.storage],
  "7b": [QUIZ_DOCS.associate, QUIZ_DOCS.seal, QUIZ_DOCS.storage],
  "7c": [QUIZ_DOCS.associate, QUIZ_DOCS.commands],
  "8a": [QUIZ_DOCS.associate, QUIZ_DOCS.hcpVault],
  "8b": [QUIZ_DOCS.associate, QUIZ_DOCS.storage],
  "8c": [QUIZ_DOCS.associate, QUIZ_DOCS.seal, QUIZ_DOCS.commands],
  "8d": [QUIZ_DOCS.associate, QUIZ_DOCS.replication],
  "8e": [QUIZ_DOCS.associate, QUIZ_DOCS.hcpVault],
  "9a": [QUIZ_DOCS.associate, QUIZ_DOCS.agent, QUIZ_DOCS.autoauth],
  "9b": [QUIZ_DOCS.associate, QUIZ_DOCS.vso, QUIZ_DOCS.k8sCompare],
};

const KEYWORD_DOC_RULES = [
  { test: /\bAppRole\b/i, docs: [QUIZ_DOCS.approle] },
  { test: /\bKubernetes\b/i, docs: [QUIZ_DOCS.kubernetesAuth] },
  { test: /\bOIDC\b|\bJWT\b/i, docs: [QUIZ_DOCS.jwtAuth] },
  { test: /\bAWS\b/i, docs: [QUIZ_DOCS.awsAuth] },
  { test: /\bLDAP\b/i, docs: [QUIZ_DOCS.ldapAuth] },
  { test: /\bGitHub\b/i, docs: [QUIZ_DOCS.githubAuth] },
  { test: /\bTLS\b|\bcert(?:ificate)?\b/i, docs: [QUIZ_DOCS.certAuth] },
  { test: /\bidentity\b|\bentity\b|\balias\b|\bexternal groups?\b/i, docs: [QUIZ_DOCS.identity] },
  { test: /\bpolicy\b|\bcapabilit/i, docs: [QUIZ_DOCS.policies] },
  { test: /\btoken\b|\baccessor\b|\bperiodic\b|\borphan\b|\bmax_ttl\b/i, docs: [QUIZ_DOCS.tokens] },
  { test: /\blease\b|\brenew\b|\brevoke\b/i, docs: [QUIZ_DOCS.lease] },
  { test: /\bDatabase\b|\bdatabase credentials?\b|\bPostgreSQL\b/i, docs: [QUIZ_DOCS.database] },
  { test: /\bPKI\b|\bcertificate issuance\b/i, docs: [QUIZ_DOCS.pki] },
  { test: /\bCubbyhole\b/i, docs: [QUIZ_DOCS.cubbyhole] },
  { test: /\bKV v2\b|\bmetadata\b|\bsecret\/data\b/i, docs: [QUIZ_DOCS.kv] },
  { test: /\bTransit\b|\bciphertext\b|\bplaintext\b|\bHMAC\b|\bsign(?:ing)?\b|\bdecrypt\b/i, docs: [QUIZ_DOCS.transit] },
  { test: /\bresponse wrapping\b|\bwrapping token\b|\bwrap\b/i, docs: [QUIZ_DOCS.responseWrapping] },
  { test: /\bsecrets engine\b|\bsys\/mounts\b|\bmount path\b/i, docs: [QUIZ_DOCS.secrets] },
  { test: /\bseal\b|\bunseal\b|\bShamir\b|\bbarrier\b/i, docs: [QUIZ_DOCS.seal] },
  { test: /\bVAULT_[A-Z_]+\b/i, docs: [QUIZ_DOCS.commands] },
  { test: /\bHCP\b|\bself-managed\b|\bHashiCorp-managed\b/i, docs: [QUIZ_DOCS.hcpVault] },
  { test: /\bRaft\b|\bIntegrated Storage\b|\bstorage backend\b|\bin-memory storage\b/i, docs: [QUIZ_DOCS.storage] },
  { test: /\breplication\b|\bDR\b|\bperformance replication\b/i, docs: [QUIZ_DOCS.replication] },
  { test: /\bVault Agent\b|\bauto-auth\b|\btemplating\b|\bsidecar\b|\bcaching\b/i, docs: [QUIZ_DOCS.agent, QUIZ_DOCS.autoauth] },
  { test: /\bVSO\b|\bVault Secrets Operator\b|\bVaultStaticSecret\b|\bVaultConnection\b|\bVaultAuth\b/i, docs: [QUIZ_DOCS.vso, QUIZ_DOCS.k8sCompare] },
];

const CHOICE_FACT_RULES = [
  { test: /A client token is issued/i, note: "Successful authentication ends with Vault issuing a client token that carries policies for later requests." },
  { test: /policy file is created/i, note: "Authentication does not create policy files. Policies already exist and are attached to a token when Vault issues it." },
  { test: /lease is revoked/i, note: "Authentication does not revoke leases. Lease revocation is a secret- or token-lifecycle action." },
  { test: /secrets engine is mounted/i, note: "Mounting a secrets engine is an operator action and is unrelated to the direct result of authenticating a caller." },
  { test: /\bAppRole\b/i, note: "AppRole is the machine-oriented auth method for automation, CI/CD, and non-interactive services." },
  { test: /\bOIDC\b|\bJWT\b/i, note: "OIDC or JWT auth is the SSO-oriented choice for browser-based human logins through an external identity provider." },
  { test: /\bKubernetes\b/i, note: "Kubernetes auth uses pod or service-account identity and is the standard workload auth pattern inside a cluster." },
  { test: /\bAWS auth\b/i, note: "AWS auth reuses AWS-native identity instead of a shared Vault-only credential." },
  { test: /\bLDAP\b/i, note: "LDAP auth is a human-oriented method that maps Vault access to an external directory." },
  { test: /\bGitHub\b/i, note: "GitHub auth is a human-oriented method based on GitHub identity and team membership, not workload identity." },
  { test: /\bUserpass\b/i, note: "Userpass is a human-style username and password auth method, not the usual answer for cloud-native workloads." },
  { test: /\bTLS certificates auth\b|\bcert auth\b/i, note: "TLS certificate auth trusts a presented client certificate and fits mutual-TLS service environments." },
  { test: /\bentity alias\b/i, note: "An entity alias maps one auth-backend identity onto a canonical Vault entity." },
  { test: /\bentity\b/i, note: "An entity represents the same person or service even when it authenticates through multiple auth methods." },
  { test: /\bexternal groups?\b/i, note: "External groups map identities from an outside provider such as LDAP or OIDC into Vault group membership." },
  { test: /\bdeny\b/i, note: "Explicit deny overrides other allowed capabilities on the same path." },
  { test: /\bsudo\b/i, note: "The sudo capability is for root-protected endpoints, especially under sys paths." },
  { test: /\bread\b/i, note: "Read retrieves data from a path and is different from list, create, update, or delete." },
  { test: /\blist\b/i, note: "List lets a caller enumerate supported keys or paths. It does not read the secret value itself." },
  { test: /\bservice token\b/i, note: "Service tokens are the full-featured token type with lifecycle features such as accessors and child tokens." },
  { test: /\bbatch token\b/i, note: "Batch tokens are lightweight and non-persistent, which is why they fit high-volume short-lived workloads." },
  { test: /\bperiodic token\b/i, note: "Periodic tokens are designed for long-running services that renew on a regular cadence." },
  { test: /\broot token\b/i, note: "Root tokens carry unrestricted access and should be reserved for setup or emergency break-glass situations." },
  { test: /\baccessor\b/i, note: "A token accessor is the safer administrative handle used to inspect or revoke a service token without revealing the token value." },
  { test: /\borphan\b/i, note: "Orphan tokens have no parent in the revocation tree, so parent-token revocation does not cascade to them." },
  { test: /\buse-limit token\b/i, note: "Use-limit tokens expire after a fixed number of uses rather than remaining valid indefinitely." },
  { test: /\btoken role\b/i, note: "A token role standardizes how created tokens should look by applying default policies, TTL limits, or type settings." },
  { test: /\bmax_ttl\b/i, note: "max_ttl is the absolute lifetime ceiling. Renewals cannot push a token or lease past that cap." },
  { test: /\blease ID\b/i, note: "A lease ID is the handle Vault uses to renew or revoke a specific leased secret later." },
  { test: /\blease renew\b|\brenew a lease\b/i, note: "Renewal extends the lifetime of the same leased object when the backend and limits allow it." },
  { test: /\blease revoke -prefix\b|\bprefix lease revocation\b/i, note: "Prefix revocation invalidates many leases under one path prefix and is especially useful during incidents or mass cleanup." },
  { test: /\blease is revoked recursively\b/i, note: "When a parent token is revoked, Vault recursively revokes child tokens and the leases created through them." },
  { test: /\bDatabase secrets engine\b/i, note: "The Database engine is the on-demand answer for dynamic database credentials." },
  { test: /\bPKI\b/i, note: "PKI is the certificate issuance engine, not the general answer for passwords or key-value data." },
  { test: /\bCubbyhole\b/i, note: "Cubbyhole is token-scoped storage and commonly appears in response-wrapping or one-time handoff workflows." },
  { test: /\bTransit\b/i, note: "Transit performs cryptographic operations without storing the plaintext data as a normal secret." },
  { test: /\bKV v2\b/i, note: "KV v2 uses versioned secret storage, with API paths that distinguish between data and metadata operations." },
  { test: /\bresponse wrapping\b|\bwrapping token\b/i, note: "Response wrapping delivers a secret through a short-lived single-use token so the original secret value is not handed directly through intermediaries." },
  { test: /\bstatic secret\b/i, note: "Static secrets are stored and reused until someone rotates them manually." },
  { test: /\bdynamic secret\b/i, note: "Dynamic secrets are generated on demand for a specific consumer and usually expire automatically through a lease." },
  { test: /\bsecrets engine\b/i, note: "A secrets engine is a mounted backend plugin that exposes secret operations under its path." },
  { test: /\bsys\/auth\b/i, note: "Auth methods are enabled and tuned under sys/auth, not under the secrets-engine sys/mounts path." },
  { test: /\bsys\/mounts\b/i, note: "Secrets engines are enabled under sys/mounts, while auth methods use sys/auth." },
  { test: /vault auth enable/i, note: "vault auth enable is the CLI used to enable an auth method, optionally at a custom path." },
  { test: /vault auth tune/i, note: "vault auth tune changes auth-mount settings after the auth method is already enabled." },
  { test: /vault login -method=/i, note: "vault login -method authenticates through an enabled auth backend and returns a client token on success." },
  { test: /vault policy write/i, note: "vault policy write stores an ACL policy in Vault. It does not attach the policy to existing tokens automatically." },
  { test: /vault secrets enable/i, note: "vault secrets enable mounts a secrets engine, not an auth method." },
  { test: /vault operator generate-root/i, note: "generate-root is the quorum workflow for minting a fresh root token later without keeping the original one forever." },
  { test: /vault operator rekey -init/i, note: "Rekey changes the share set or threshold used for Shamir unseal. It does not rotate the barrier encryption key." },
  { test: /vault operator rotate/i, note: "rotate changes Vault's encryption key material, not the number of shares or the threshold." },
  { test: /\bplaintext\b/i, note: "Transit encrypt endpoints expect plaintext to be base64 encoded on input because the API payload is JSON." },
  { test: /\bciphertext\b/i, note: "Transit returns ciphertext values prefixed with a version marker such as vault:v1 so Vault can track which key version produced them." },
  { test: /\brewrap\b/i, note: "Rewrap upgrades existing ciphertext to the latest key version without exposing plaintext to the client." },
  { test: /\bRaft\b|\bIntegrated Storage\b/i, note: "Integrated Storage with Raft is the recommended default backend for most new Vault deployments." },
  { test: /\bin-memory storage\b/i, note: "In-memory storage is only appropriate for development mode because it is not durable production persistence." },
  { test: /\bstorage backend\b/i, note: "A Vault cluster uses one configured storage backend at a time to persist encrypted state." },
  { test: /\bbarrier\b/i, note: "The barrier encrypts data before it reaches the storage backend, which is why Vault treats storage as untrusted." },
  { test: /\bsealed\b/i, note: "A sealed Vault can reach storage but cannot decrypt protected data until it is unsealed." },
  { test: /\bunseal\b|\bShamir\b/i, note: "Shamir unseal reconstructs access to the barrier key material when the required threshold of shares is supplied." },
  { test: /\bVAULT_ADDR\b/i, note: "VAULT_ADDR tells the CLI which Vault server address to connect to." },
  { test: /\bVAULT_TOKEN\b/i, note: "VAULT_TOKEN provides the token the CLI should use for authenticated requests." },
  { test: /\bVAULT_NAMESPACE\b/i, note: "VAULT_NAMESPACE is used with Vault Enterprise namespaces so CLI commands target the right namespace." },
  { test: /\bHCP\b|\bHashiCorp-managed\b/i, note: "HCP Vault Dedicated shifts more upgrades, backups, and platform operations to HashiCorp." },
  { test: /\bself-managed\b/i, note: "Self-managed Vault keeps more infrastructure, backup, upgrade, and HA ownership with your own team." },
  { test: /\bperformance replication\b/i, note: "Performance replication is the scale and locality answer for serving clients closer to where they run." },
  { test: /\bDR replication\b|\bDisaster Recovery\b/i, note: "DR replication is the warm-standby failover model that mirrors tokens and leases for recovery scenarios." },
  { test: /\bVault Agent\b/i, note: "Vault Agent is the client-side helper that can auto-authenticate, cache supported responses, and render templates for applications." },
  { test: /\bAuto-auth\b/i, note: "Auto-auth is the Vault Agent feature that performs login and handles token renewal." },
  { test: /\btemplating\b/i, note: "Vault Agent templates render secrets into files so applications can consume them without custom Vault code." },
  { test: /\bsidecar\b/i, note: "A sidecar pattern points toward Vault Agent close to the workload, not toward a cluster-level controller." },
  { test: /\bVSO\b|\bVault Secrets Operator\b/i, note: "Vault Secrets Operator is the Kubernetes-native controller pattern for syncing Vault data into Kubernetes resources." },
  { test: /\bVaultStaticSecret\b/i, note: "VaultStaticSecret is the VSO custom resource commonly used to sync a Vault value into a Kubernetes Secret." },
  { test: /\bVaultConnection\b|\bVaultAuth\b/i, note: "VaultConnection and VaultAuth are the VSO resources that define how the operator reaches Vault and authenticates." },
  { test: /\bcontroller\b/i, note: "A controller pattern points toward VSO reconciliation rather than a per-pod sidecar." },
  { test: /^Token(?: auth)?$/i, note: "Token auth is built in and uses an existing token value. It is not the same thing as choosing a richer external auth method." },
  { test: /^TLS certificates$/i, note: "TLS certificates can authenticate services that already use mutual TLS, but they are not the standard human SSO answer for a browser-based identity-provider flow." },
  { test: /^AWS and TLS certificates$/i, note: "Both are machine-oriented options tied to workload identity or client certificates, so they are not the most human-centric pair." },
  { test: /^Intersection only$/i, note: "Vault does not reduce multiple policies to an intersection-only model. Allowed capabilities are combined unless an explicit deny overrides them." },
  { test: /^Storage backends$/i, note: "Policies do not attach to storage backends. They are evaluated through the token presented on the request." },
  { test: /^Secrets engines$/i, note: "Policies govern access to secrets-engine paths, but the policy itself is attached to tokens rather than to the engine mount object." },
  { test: /^Auth mount paths only$/i, note: "Policies can cover auth-related endpoints, but they are still attached to tokens, not to auth mount objects themselves." },
  { test: /^Zero or more path segments$/i, note: "That description is too broad for `+`. In Vault policy paths, `+` matches exactly one path segment." },
  { test: /^Any suffix anywhere in the path$/i, note: "Vault does not treat `+` as a free-form wildcard. The exam expects you to remember the one-segment behavior specifically." },
  { test: /^CLI shorthand paths$/i, note: "Policies are written against the underlying API path, not the friendlier CLI shorthand that omits KV v2 segments like `/data/`." },
  { test: /^UI menu labels$/i, note: "UI labels are not policy syntax. The exam expects exact API path thinking when you read or write policies." },
  { test: /^Mount descriptions$/i, note: "Mount descriptions are presentation text, not the path language used in Vault ACL policies." },
  { test: /^Paths are case-insensitive$/i, note: "Vault policy path matching is case-sensitive, so changing capitalization can change the result." },
  { test: /^create$/i, note: "The `create` capability is for creating or writing at a path, not for reading back secret data." },
  { test: /^update$/i, note: "The `update` capability changes data at a path. Listing keys is a separate `list` capability." },
  { test: /^default$/i, note: "The built-in `default` policy exists on tokens and can be customized. It is not the immutable built-in policy." },
  { test: /^root only$/i, note: "This is incomplete because Vault's built-in `default` policy can be customized, while `root` cannot." },
  { test: /^Both root and default$/i, note: "Vault does not let you modify both built-in policies. `root` is immutable, while `default` can be changed." },
  { test: /^Neither$/i, note: "This is too broad because `default` can be customized even though `root` cannot." },
  { test: /^admin and default$/i, note: "`admin` is not one of Vault's built-in ACL policies. The built-ins are `root` and `default`." },
  { test: /^token and operator$/i, note: "`token` and `operator` are not the names of Vault's built-in ACL policies." },
  { test: /^Default token$/i, note: "Vault does not use a special 'default token' type for high-volume workloads. Batch tokens are the lightweight type designed for that use case." },
  { test: /^Policies$/i, note: "Batch tokens still carry policies. The missing lifecycle feature the exam expects you to remember is the accessor." },
  { test: /^TTL$/i, note: "Batch tokens still have a TTL even though they are lightweight and non-persistent." },
  { test: /^Association with auth methods$/i, note: "Batch tokens can still come from auth workflows. The missing feature being tested here is the accessor." },
  { test: /^Renewals make the end time unlimited$/i, note: "Renewals can extend a token or lease only within its configured ceiling. They do not remove the max TTL limit." },
  { test: /^Disable TTL for all machine tokens$/i, note: "The safer design is to fit TTL and renewal behavior to workload risk, not to remove TTL protections entirely." },
  { test: /^Tracking secret lifetime$/i, note: "This is actually one of the reasons lease IDs matter, which is why it cannot be the 'NOT the main purpose' answer." },
  { test: /^Supporting renew and revoke workflows$/i, note: "This is a real lease-ID purpose because renew and revoke operations use the lease handle directly." },
  { test: /^Helping Vault manage expiration$/i, note: "Lease metadata is part of how Vault tracks lifetime and expiration, so this is not the wrong-purpose option." },
  { test: /^Expect renewal to work again later$/i, note: "Once a renewable credential has hit its ceiling, waiting does not restore renewability. The safer response is usually to request a fresh credential." },
  { test: /^Delete the entire mount$/i, note: "Renewal is about extending a credential's lifetime, not about disabling or deleting the entire mount." },
  { test: /^Every lease is renewable$/i, note: "Vault leases always exist for dynamic secrets, but not every lease is renewable. Renewability depends on backend behavior and limits." },
  { test: /^Renewing a lease removes the need for a token$/i, note: "Lease renewal does not replace authentication. Clients still use a valid token to talk to Vault." },
  { test: /^Renew revokes the mount, revoke changes the TTL$/i, note: "These actions are backwards. Renew extends a valid lease, while revoke invalidates it immediately." },
  { test: /^Renew is for auth methods only$/i, note: "Renewal applies to renewable tokens and leased secrets. It is not limited to auth-method administration." },
  { test: /^Dynamic secrets are always stored in KV$/i, note: "Dynamic secrets are usually generated by a dedicated engine like Database or cloud backends, not automatically stored in KV." },
  { test: /^Static secrets are generated on demand while dynamic secrets are copied from files$/i, note: "That reverses the model. Static secrets are stored values, while dynamic secrets are generated on demand for a client." },
  { test: /^Nothing until the cluster restarts$/i, note: "Disabling a secrets engine mount takes effect immediately and can revoke or remove access to data under that mount." },
  { test: /^Their biggest benefit is lower CPU usage in Vault$/i, note: "The value of dynamic secrets is reduced credential sharing and automatic expiration, not CPU optimization." },
  { test: /^Secrets engines can only be enabled from the UI$/i, note: "Vault supports enabling secrets engines through the CLI and API, not only through the UI." },
  { test: /^Shared static API keys for developers$/i, note: "Transit is for cryptographic operations. Shared static API keys are the opposite of the short-lived or cryptographic workflows Transit is meant to support." },
  { test: /^Database credential rotation$/i, note: "Database credential rotation belongs to the Database secrets engine, not to Transit's encrypt/decrypt/sign/HMAC feature set." },
  { test: /^In the auth method mount$/i, note: "Transit returns ciphertext to the client. That ciphertext is normally stored by the application in its own datastore, not in an auth mount." },
  { test: /^Rotation creates a new key version$/i, note: "This statement is true about Transit rotation, so it cannot be the false answer in a 'Which statement is false?' prompt." },
  { test: /^New encrypt calls use the current key version$/i, note: "This is also true after Transit key rotation, which is why it is not the false option." },
  { test: /^Mounting auth methods only$/i, note: "The barrier is about encryption and protecting stored data, not about mounting auth methods." },
  { test: /^Handling browser login redirects$/i, note: "Browser redirect handling is part of an auth flow such as OIDC, not part of the barrier's encryption role." },
  { test: /^Policies are stored outside Vault$/i, note: "Policies are stored inside Vault's encrypted storage. They are not what explains why raw backend compromise still shows ciphertext." },
  { test: /^Tokens are never written anywhere$/i, note: "Service tokens and other Vault state can be persisted. The protection comes from barrier encryption, not from data never being written." },
  { test: /^Policies no longer apply$/i, note: "Being sealed does not erase or disable policies. It means Vault cannot decrypt protected data until it is unsealed." },
  { test: /^Through a policy path wildcard$/i, note: "Unseal keys are split through Shamir's Secret Sharing, not through ACL policy syntax." },
  { test: /^Recovery keys are just token accessors$/i, note: "Recovery keys are special recovery workflow material, not token accessors." },
  { test: /^HashiCorp owns upgrades and backups$/i, note: "That describes the managed HCP model, not a self-managed Vault deployment." },
  { test: /^Whether policies exist$/i, note: "Both self-managed and HashiCorp-managed Vault still use policies. The difference is operational ownership, not whether ACLs exist." },
  { test: /^Whether auth methods are supported$/i, note: "Both deployment models still use auth methods. The tradeoff is who operates the platform lifecycle around Vault." },
  { test: /^Whether tokens have TTL$/i, note: "Token TTL behavior exists in either deployment model. The comparison is about responsibility for operations and maintenance." },
  { test: /^Filesystem$/i, note: "Filesystem storage exists, but it is not the recommended modern default for most new production Vault clusters." },
  { test: /^PostgreSQL$/i, note: "PostgreSQL can be used as external storage, but HashiCorp recommends Integrated Storage with Raft for most new deployments." },
  { test: /^Two for HA$/i, note: "A cluster does not use two storage backends just because it is highly available. It uses one configured backend for the cluster." },
  { test: /^One per auth method$/i, note: "Storage backend choice is cluster-wide, not something you configure separately for each auth method." },
  { test: /^One per namespace$/i, note: "Namespaces partition Vault usage, but they do not each get their own independent storage backend." },
  { test: /^HMAC vs hash$/i, note: "That is a Transit feature comparison, but the repeated operations contrast in this architecture area is rekey versus rotate." },
  { test: /^Both modes do$/i, note: "The exam expects you to remember that DR replication mirrors tokens and leases, while performance replication does not." },
  { test: /^Neither mode does$/i, note: "This ignores the DR behavior. DR replication is the mode that mirrors tokens and leases for recovery." },
  { test: /^Identity replication$/i, note: "That is not the Enterprise replication mode being tested here. The real contrast is DR versus performance replication." },
  { test: /^Lease replication$/i, note: "Lease replication is not the named Enterprise mode used for read scaling or regional client access." },
  { test: /^Policies are no longer required$/i, note: "Managed Vault still requires normal auth, policy, and secret-delivery design. The service being managed does not remove Vault fundamentals." },
  { test: /^Secrets engines disappear$/i, note: "Managed Vault still runs Vault Enterprise features and secrets engines. The platform model does not remove the product's core concepts." },
  { test: /^HashiCorp handles patching and cluster operations for you$/i, note: "That statement describes the managed model, so it cannot be the best match for self-managed Vault." },
  { test: /^Managed service reduces some operational burden$/i, note: "This statement is actually true, which is why it cannot be the false option in the comparison prompt." },
  { test: /^Defining enterprise namespaces$/i, note: "Vault Agent helps apps authenticate, cache, and render secrets. Namespace design is a separate Enterprise administration concern." },
  { test: /^Rekey$/i, note: "Rekey changes unseal share configuration. It is unrelated to rendering secrets into files through Vault Agent templates." },
  { test: /^Agent caching disables lease renewal$/i, note: "Agent caching can help manage renewals for supported cached responses. It does not disable lease renewal." },
  { test: /^Agent only works with static KV secrets$/i, note: "Vault Agent can help with dynamic secrets and token management too. It is not limited to static KV reads." },
  { test: /^Agent converts leases into accessors$/i, note: "Leases and token accessors are different concepts. Vault Agent does not convert one into the other." },
  { test: /^Use only root tokens$/i, note: "Using root tokens everywhere is the opposite of the safer application-integration model the prompt is pointing toward." },
  { test: /^Use policy wildcards everywhere$/i, note: "Broad policy wildcards do not solve application integration. The prompt is asking how to reduce direct Vault logic in the app." },
  { test: /^VaultLeaseSecret$/i, note: "That is not the standard VSO CRD used for syncing a static Vault secret into a Kubernetes Secret." },
  { test: /^VaultTransitKey$/i, note: "This is not the VSO resource used for syncing static secret data into a Kubernetes Secret object." },
  { test: /^VaultPolicyMount$/i, note: "That is not a VSO CRD for syncing static Vault data to Kubernetes Secrets." },
  { test: /^VaultRoot and VaultSeal$/i, note: "These are not the VSO resources that define the Vault connection and auth configuration." },
  { test: /^AgentConfig and TransitConfig$/i, note: "Those names do not match the foundational VSO resources used to configure Vault reachability and authentication." },
  { test: /^LeaseToken and PathPolicy$/i, note: "These are not the VSO CRDs used for the operator's connection and authentication model." },
  { test: /^Authenticating to Vault$/i, note: "VSO absolutely must authenticate to Vault, so this is part of the real design. The optional nuance is extra features like encrypted client cache, not authentication itself." },
];

function lowerFirst(text) {
  if (!text) return "";
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function normalizeChoice(choice) {
  return String(choice).replace(/`/g, "").replace(/\s+/g, " ").trim();
}

function dedupeStrings(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item?.trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dedupeDocs(docs) {
  const seen = new Set();
  return docs.filter((item) => {
    if (!item?.href || seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });
}

function resolveObjectiveId(question) {
  if (question.guideObjective === false) return null;
  return question.guideObjective ?? question.obj ?? null;
}

function resolveChoiceFact(choice) {
  const raw = String(choice);
  const text = normalizeChoice(choice);
  for (const rule of CHOICE_FACT_RULES) {
    if (rule.test.test(text)) return rule.note;
  }

  if (/^There is no difference$/i.test(text)) {
    return "The documentation does draw a real distinction here, so saying there is no difference misses the contrast the exam wants you to recognize.";
  }

  if (/^Generate-root$/i.test(text)) {
    return "generate-root is specifically the quorum workflow for minting a new root token later. It is not a general-purpose auth, secrets, or integration feature.";
  }

  if (/^AWS$/i.test(text)) {
    return "AWS by itself is only the cloud platform name. The precise Vault answer on the exam is usually AWS auth or an AWS-focused secrets engine.";
  }

  if (/^Seal$/i.test(text)) {
    return "Seal is Vault's locked state. It is not the command or lifecycle action the prompt is asking you to identify.";
  }

  if (/^Consul$/i.test(text)) {
    return "Consul is a valid external storage backend, but it is not the recommended modern default answer for most new Vault deployments.";
  }

  if (/^DR promotion$/i.test(text)) {
    return "DR promotion is a disaster-recovery action, not a normal Kubernetes integration pattern or day-to-day client-serving design.";
  }

  if (/^Human auth$/i.test(text)) {
    return "This objective contrasts human-oriented methods with workload-oriented methods, and the scenario is pointing at a machine or system auth pattern instead.";
  }

  if (/^Recovery auth$/i.test(text) || /^Root-only auth$/i.test(text)) {
    return "Vault does not classify auth methods this way for the associate exam. The real distinction here is between human and machine-oriented auth.";
  }

  if (/^Only /.test(text)) {
    return "This statement is too absolute. The documented behavior is not limited only this narrowly.";
  }

  if (/^Always /.test(text) || /^Never /.test(text)) {
    return "This option is using absolute language, which is a common exam trap. Vault behavior here is more conditional than this wording suggests.";
  }

  if (/^Because /.test(text)) {
    return "This gives the wrong reason for the feature choice or behavior the question is asking about.";
  }

  if (/^When /.test(text)) {
    return "This describes the wrong situation or trigger for the behavior being tested.";
  }

  if (/^How /.test(text)) {
    return "This describes a different concern than the CLI, auth, or architecture setting the prompt is actually asking you to identify.";
  }

  if (/^(They|It|Vault) /.test(text)) {
    return "This statement describes the feature incorrectly for the lifecycle or comparison the prompt is testing.";
  }

  if (/^The /.test(text)) {
    return "This identifies a real Vault detail, but it is not the specific limit, artifact, or control the prompt is asking about.";
  }

  if (/^(To|As|Allow|Prompt|Write|Make|Pick|Store|Attach) /i.test(text)) {
    return "This describes a different purpose or operator action than the workflow the question is asking about.";
  }

  if (/^(A|An) /.test(text)) {
    return "This is a real object or artifact in Vault, but it is not the item the prompt is asking for in this scenario.";
  }

  if (/^VAULT_[A-Z_]+$/.test(text)) {
    return "This is a real Vault CLI environment variable, but it is not the one that controls the behavior named in the prompt.";
  }

  if (/^<(?:mount)>\/.+/.test(text)) {
    return "This path pattern is close to a real endpoint shape, but it does not use the correct KV v2 or mount-specific API area for the operation being asked about.";
  }

  if (/^(KV|Identity|Database|Renew|Rotate)$/i.test(text)) {
    return "This is a real Vault engine or lifecycle term, but it is not the best match for the specific task or comparison in the prompt.";
  }

  if (/^(Hex|YAML)$/.test(text) || /raw bytes automatically written to disk/i.test(text)) {
    return "This format does not match the documented Transit request or response handling the question is testing.";
  }

  if (/^\d+$/.test(text)) {
    return "This number does not match the threshold or share count implied by the prompt's Shamir-unseal scenario.";
  }

  if (raw.includes("`vault ")) {
    return "This CLI command belongs to a different command family than the one the prompt is asking you to use.";
  }

  if (raw.includes("`/v1/")) {
    return "This API path targets a real Vault endpoint family, but it is not the correct endpoint for the workflow described in the prompt.";
  }

  if (/^secret\/.+/.test(text) && !text.includes("/data/") && !text.includes("/metadata/")) {
    return "For KV v2, read and policy paths use the API form that includes /data/ or /metadata/, not just the CLI-style shorthand path.";
  }

  if (/^secret\/.+\/metadata/.test(text) || /^kv\/data\//.test(text)) {
    return "This path shape is close to a real KV v2 API path, but the prompt is asking for a different KV v2 area than this one.";
  }

  if (/\/v1\/auth\/.+\/login/.test(text) || /auth\/.+\/login/.test(text)) {
    return "Login endpoints live under the auth mount path, commonly under auth/<mount>/login.";
  }

  if (/^\/v1\//.test(text)) {
    return "This API path names a real Vault endpoint family, but it is not the best endpoint for the workflow described in the prompt.";
  }

  if (/^\d{1,2}:\d{2}$/.test(text)) {
    return "This time value can be reasoned about from TTL and max TTL math, but the prompt is looking for the hard ceiling rather than the initial TTL.";
  }

  return "This option names a real Vault concept or action, but it does not best match the workflow the question is testing.";
}

function buildCorrectReview(question, objectiveId) {
  const note = objectiveId ? OBJECTIVE_GUIDE[objectiveId] : null;
  return dedupeStrings([
    question.explain,
    note?.explanation,
    note?.examCue,
  ]).join(" ");
}

function buildChoiceNotes(question, correctReview) {
  const objectiveId = resolveObjectiveId(question);
  const note = objectiveId ? OBJECTIVE_GUIDE[objectiveId] : null;
  const correctChoice = question.choices[question.answer];
  const correctFact = resolveChoiceFact(correctChoice);

  return question.choices.map((choice, index) => {
    const fact = resolveChoiceFact(choice);

    if (index === question.answer) {
      return dedupeStrings([
        question.explain,
        fact,
        note?.remember ? `Memory hook: ${note.remember}` : "",
      ]).join(" ");
    }

    return [
      fact,
      `${correctChoice} is the better fit here because ${lowerFirst(correctFact || correctReview || question.explain)}`,
    ].join(" ");
  });
}

function buildDocs(question) {
  const objectiveId = resolveObjectiveId(question);
  const baseDocs = objectiveId
    ? (OBJECTIVE_DOCS[objectiveId] ?? [QUIZ_DOCS.associate])
    : [QUIZ_DOCS.associate];
  const haystack = `${question.question} ${question.choices.join(" ")}`;
  const keywordDocs = KEYWORD_DOC_RULES
    .filter((rule) => rule.test.test(haystack))
    .flatMap((rule) => rule.docs);

  return dedupeDocs([...baseDocs, ...keywordDocs]).slice(0, 4);
}

export function withQuestionSupport(question) {
  const objectiveId = resolveObjectiveId(question);
  const correctReview = question.correctReview ?? buildCorrectReview(question, objectiveId);
  const docs = question.docs?.length ? dedupeDocs(question.docs) : buildDocs(question);
  const choiceNotes = question.choiceNotes?.length
    ? question.choiceNotes
    : buildChoiceNotes(question, correctReview);

  return {
    ...question,
    correctReview,
    docs,
    choiceNotes,
  };
}

export function validateQuestionSupport(groups) {
  const issues = [];

  groups.forEach((group) => {
    group.questions.forEach((question) => {
      if (!Array.isArray(question.docs) || question.docs.length === 0) {
        issues.push(`${question.question}: missing docs`);
      }

      if (!Array.isArray(question.choiceNotes) || question.choiceNotes.length !== question.choices.length) {
        issues.push(`${question.question}: choice notes do not match choice count`);
      }
    });
  });

  if (issues.length) {
    throw new Error(`Quiz support validation failed:\n${issues.join("\n")}`);
  }
}
