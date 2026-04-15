export const EXAM_GUIDE = {
  title: "Vault Associate (003) Study Guide",
  summary:
    "This guide adds the narrative layer above the existing mind map, flashcards, and quiz. It follows the current HashiCorp Vault Associate (003) exam track for Vault 1.16 and focuses on the relationships the exam comes back to repeatedly.",
  highlights: [
    {
      title: "Current scope",
      body: "HashiCorp currently lists Vault Associate (003) as the active associate exam for Vault, and the product version tested is Vault 1.16.",
    },
    {
      title: "Question style",
      body: "The official sample questions use true/false, single-answer, and multiple-answer patterns. Most prompts test concept clarity and feature selection, not obscure memorization.",
    },
    {
      title: "What matters most",
      body: "Follow the lifecycle chains: auth -> token -> policy -> secret engine -> lease. Many scenario questions become much easier once you can trace that path.",
    },
    {
      title: "How to use this hub",
      body: "Read the guide for context, open each domain for deeper notes, then switch to flashcards and quiz mode to turn recognition into recall.",
    },
  ],
  studyFlow: [
    {
      title: "Pass 1 - Learn the map",
      body: "Start with the guide and mind map until you can explain how the nine domains connect without looking at the screen.",
    },
    {
      title: "Pass 2 - Work the objectives",
      body: "Open one domain at a time and study every objective as a why, when, and how question instead of a definition-only fact.",
    },
    {
      title: "Pass 3 - Practice contrasts",
      body: "Spend extra time on exam pairs: service vs batch, static vs dynamic, rekey vs rotate, DR vs performance replication, human vs machine auth.",
    },
    {
      title: "Pass 4 - Simulate the exam",
      body: "Use cheat sheet, flashcards, and quiz mode together. Review every wrong answer by asking which Vault lifecycle or comparison you misunderstood.",
    },
  ],
  connectionMap: [
    {
      title: "Authentication feeds tokens",
      body: "Vault does not authorize a login session directly. Every successful auth flow results in a token that the client uses afterward.",
    },
    {
      title: "Tokens carry policies",
      body: "Policies are attached to tokens and define capabilities on paths. If you can explain that sentence clearly, many questions simplify immediately.",
    },
    {
      title: "Secrets engines issue data and leases",
      body: "Dynamic secrets come from a mounted secrets engine and are tracked through lease IDs so Vault can renew or revoke them.",
    },
    {
      title: "Transit is still a secrets engine",
      body: "Transit is different because it processes data instead of storing it, but it still follows Vault's mount-and-path model.",
    },
    {
      title: "Architecture explains trust",
      body: "Seal state, key hierarchy, storage backend choice, and replication strategy explain how Vault stays secure and available in production.",
    },
    {
      title: "Agents reduce app complexity",
      body: "Vault Agent and Vault Secrets Operator are both about delivering Vault-managed secrets to applications without pushing Vault API logic into every app.",
    },
  ],
  officialLinks: [
    {
      label: "Certification details",
      href: "https://developer.hashicorp.com/certifications/security-automation",
    },
    {
      label: "Exam content list",
      href: "https://developer.hashicorp.com/vault/tutorials/associate-cert-003/associate-review-003",
    },
    {
      label: "Learning path",
      href: "https://developer.hashicorp.com/vault/tutorials/associate-cert-003/associate-study-003",
    },
    {
      label: "Sample questions",
      href: "https://developer.hashicorp.com/vault/tutorials/associate-cert-003/associate-questions-003",
    },
  ],
};

export const DOMAIN_GUIDES = {
  1: {
    focus:
      "Authentication questions are mostly about choosing the right identity source and remembering that every successful auth flow ends in a token.",
    mentalModel: [
      "Auth answers who the caller is; policies answer what the caller can do.",
      "Humans usually authenticate with interactive methods such as OIDC, LDAP, GitHub, or Userpass; machines authenticate with workload identity such as AppRole, Kubernetes, or cloud IAM.",
      "Entities and aliases let Vault understand that the same person or service may arrive through multiple auth methods.",
    ],
    commonTraps: [
      "Confusing token auth with authorization. Token auth is simply another auth method.",
      "Choosing AppRole for humans or OIDC/LDAP for non-interactive workloads.",
      "Forgetting that token auth is always enabled.",
    ],
    resources: [
      { label: "Auth methods docs", href: "https://developer.hashicorp.com/vault/docs/auth" },
      { label: "Identity docs", href: "https://developer.hashicorp.com/vault/docs/concepts/identity" },
    ],
  },
  2: {
    focus:
      "Policies are the core authorization layer in Vault. The exam tests path matching, capabilities, least privilege, and the deny-by-default model.",
    mentalModel: [
      "Policies attach to tokens, not directly to users.",
      "Path rules map to API paths, which matters a lot for KV v2 because API and CLI paths are not identical.",
      "Multiple policies combine as a union, except explicit deny always wins.",
    ],
    commonTraps: [
      "Mixing up * and + in path syntax.",
      "Forgetting that sudo is for protected system endpoints, not a general admin flag.",
      "Assuming a token with no policy still has some default read access.",
    ],
    resources: [
      { label: "Policies docs", href: "https://developer.hashicorp.com/vault/docs/concepts/policies" },
      { label: "Vault policy tutorial", href: "https://developer.hashicorp.com/vault/tutorials/getting-started/getting-started-policies" },
    ],
  },
  3: {
    focus:
      "Token questions revolve around lifecycle, persistence, renewability, inheritance, and knowing when a token type is appropriate for the workload.",
    mentalModel: [
      "Tokens are the working identity presented on requests after authentication completes.",
      "Service tokens are full-featured lifecycle objects; batch tokens trade lifecycle features for lightweight scale.",
      "TTL, max TTL, orphaning, and parent-child relationships explain most token behavior.",
    ],
    commonTraps: [
      "Assuming every token has an accessor. Batch tokens do not.",
      "Thinking renewals can extend past max TTL forever.",
      "Treating root tokens as normal long-lived admin credentials.",
    ],
    resources: [
      { label: "Token concepts", href: "https://developer.hashicorp.com/vault/docs/concepts/tokens" },
      { label: "Tokens tutorial", href: "https://developer.hashicorp.com/vault/tutorials/getting-started/getting-started-tokens" },
    ],
  },
  4: {
    focus:
      "Leases are how Vault manages the lifetime of dynamic outputs. If the exam mentions renewing or revoking generated credentials, think lease ID.",
    mentalModel: [
      "Dynamic secrets come with lease metadata because Vault expects them to expire or be revoked.",
      "Renew extends the lifetime of the same lease; revoke invalidates it.",
      "Prefix revocation is the bulk-operation tool for incident response and cleanup.",
    ],
    commonTraps: [
      "Confusing a lease renewal with generating a fresh secret.",
      "Forgetting that lease operations are constrained by max TTL and backend behavior.",
      "Not recognizing a lease path format in scenario questions.",
    ],
    resources: [
      { label: "Lease concepts", href: "https://developer.hashicorp.com/vault/docs/concepts/lease" },
      { label: "Dynamic secrets tutorial", href: "https://developer.hashicorp.com/vault/tutorials/getting-started/getting-started-dynamic-secrets" },
    ],
  },
  5: {
    focus:
      "Secrets engines are one of the most scenario-heavy areas of the exam. You need to recognize which engine solves which problem and how pathing changes behavior.",
    mentalModel: [
      "A secrets engine is a plugin mounted at a path.",
      "Static secrets are stored and retrieved; dynamic secrets are generated on demand and usually come with leases.",
      "Transit is a secrets engine even though it processes data rather than storing secret values.",
    ],
    commonTraps: [
      "Forgetting that disabling a mount deletes its stored data and associated leases.",
      "Missing the KV v2 API path difference: CLI hides /data, policies and direct API paths do not.",
      "Treating response wrapping as encryption at rest instead of one-time secret delivery.",
    ],
    resources: [
      { label: "Secrets engines overview", href: "https://developer.hashicorp.com/vault/docs/secrets" },
      { label: "KV v2 docs", href: "https://developer.hashicorp.com/vault/docs/secrets/kv" },
    ],
  },
  6: {
    focus:
      "Encryption as a service is smaller in scope but high value on the exam because it tests whether you understand what Transit does and does not do.",
    mentalModel: [
      "Transit keeps cryptographic key material in Vault and performs crypto operations for clients.",
      "Applications send base64 plaintext to encrypt and receive ciphertext that includes the key version.",
      "Rotation creates a new key version; rewrap upgrades ciphertext to the latest version.",
    ],
    commonTraps: [
      "Assuming Transit stores the original plaintext.",
      "Mixing up key rotation with data re-encryption or rewrap.",
      "Forgetting that decrypted output is base64 encoded and must be decoded by the client.",
    ],
    resources: [
      { label: "Transit docs", href: "https://developer.hashicorp.com/vault/docs/secrets/transit" },
      { label: "Transit tutorial", href: "https://developer.hashicorp.com/vault/tutorials/encryption-as-a-service/eaas-transit" },
    ],
  },
  7: {
    focus:
      "Architecture fundamentals explain why Vault can trust untrusted storage. Expect conceptual questions about the barrier, seal state, and operational environment variables.",
    mentalModel: [
      "Vault encrypts data before it ever reaches the storage backend.",
      "Seal and unseal exist because Vault must protect the root material that unlocks the barrier.",
      "Environment variables make CLI work easier, but some of them are operational shortcuts that should be used carefully.",
    ],
    commonTraps: [
      "Assuming the storage backend itself provides the core data protection instead of the cryptographic barrier.",
      "Mixing up unseal keys, recovery keys, and root tokens.",
      "Using VAULT_SKIP_VERIFY as if it were acceptable for production.",
    ],
    resources: [
      { label: "Seal and unseal docs", href: "https://developer.hashicorp.com/vault/docs/concepts/seal" },
      { label: "CLI environment variables", href: "https://developer.hashicorp.com/vault/docs/commands#environment-variables" },
    ],
  },
  8: {
    focus:
      "Deployment architecture questions test operational judgment: where Vault runs, which storage mode to choose, and how availability or disaster recovery features differ.",
    mentalModel: [
      "Self-managed Vault gives you full control and full operational responsibility; HCP Vault shifts infrastructure operations to HashiCorp.",
      "Integrated Storage using Raft is the recommended default for most new deployments.",
      "Replication answers two different needs: performance scale versus disaster recovery readiness.",
    ],
    commonTraps: [
      "Mixing up rekey and rotate.",
      "Treating performance replication as a backup strategy.",
      "Forgetting that DR secondaries cannot serve clients until promoted.",
    ],
    resources: [
      { label: "Storage docs", href: "https://developer.hashicorp.com/vault/docs/configuration/storage" },
      { label: "Replication docs", href: "https://developer.hashicorp.com/vault/docs/enterprise/replication" },
    ],
  },
  9: {
    focus:
      "Access management architecture is about reducing the amount of Vault-specific logic your applications need to own, especially in Kubernetes environments.",
    mentalModel: [
      "Vault Agent handles auto-auth, local caching, and template rendering close to the workload.",
      "Vault Secrets Operator syncs Vault-managed data into Kubernetes-native resources.",
      "Both tools exist to simplify secret consumption, but they fit different runtime and platform models.",
    ],
    commonTraps: [
      "Assuming VSO is just Vault Agent in a different form factor.",
      "Ignoring the sidecar versus Kubernetes-controller distinction.",
      "Forgetting that Agent can help apps avoid direct Vault API code.",
    ],
    resources: [
      { label: "Vault Agent docs", href: "https://developer.hashicorp.com/vault/docs/agent" },
      { label: "Vault Secrets Operator docs", href: "https://developer.hashicorp.com/vault/docs/deploy/kubernetes/vso" },
    ],
  },
};

export const OBJECTIVE_GUIDE = {};

Object.assign(OBJECTIVE_GUIDE, {
  "1a": {
    explanation:
      "Authentication methods are Vault's front door. Their job is to verify identity and then issue a token that the client uses for every later request.",
    examCue: "If a question asks what all auth methods ultimately produce, the answer is a token.",
    pitfalls: [
      "Policies are not authentication methods; they only authorize paths after authentication succeeds.",
      "Token auth is built in and remains enabled even if you add other methods.",
    ],
    remember: "Auth proves identity; the token carries access.",
  },
  "1b": {
    explanation:
      "Choose the auth method that best reuses the identity source the workload already has, such as an IdP for humans or platform identity for machines.",
    examCue: "Scenario matching is common: AppRole for automation, Kubernetes for pods, OIDC or LDAP for human SSO.",
    pitfalls: [
      "Do not force a human workflow onto a machine workload or vice versa.",
      "The best method is usually the one that avoids long-lived shared secrets.",
    ],
    remember: "Pick the method that matches the caller's native identity.",
  },
  "1c": {
    explanation:
      "Human auth methods support interactive or directory-backed users, while system auth methods let applications or workloads prove identity non-interactively.",
    examCue: "Expect classification questions that ask whether a method is human-facing or machine-facing.",
    pitfalls: [
      "GitHub, LDAP, and OIDC are human-oriented methods in this exam context.",
      "AppRole and Kubernetes are machine methods even if humans configure them.",
    ],
    remember: "Humans log in; machines present workload identity.",
  },
  "1d": {
    explanation:
      "Vault Identity gives Vault a stable representation of a person or machine across multiple auth methods. Entities are the canonical identity; aliases connect that identity to each auth backend.",
    examCue: "If the same person can log in with more than one auth method, entities and aliases explain how Vault sees one actor instead of many.",
    pitfalls: [
      "An alias is not the same thing as an entity.",
      "Groups are how you collect entities under shared policies.",
    ],
    remember: "Entity = who it really is; alias = how it arrived.",
  },
  "1e": {
    explanation:
      "Vault can authenticate through the CLI, API, and UI, but all three routes talk to the same auth backends and return a token on success.",
    examCue: "API login paths usually follow /v1/auth/<mount>/login/<identity>.",
    pitfalls: [
      "The interface changes; the auth backend behavior does not.",
      "UI and CLI often hide request details that the API exposes directly.",
    ],
    remember: "Different interface, same auth flow, same token outcome.",
  },
  "1f": {
    explanation:
      "Configuring an auth method means enabling it at a mount path and then tuning or writing method-specific settings under that path.",
    examCue: "Expect enable-at-path questions and remember auth methods live under sys/auth from the API perspective.",
    pitfalls: [
      "The method type and the mount path are related but not the same thing.",
      "Custom paths are common and can change the login endpoint shape.",
    ],
    remember: "An auth method is a mounted backend with settings.",
  },
  "2a": {
    explanation:
      "Policies are the main authorization mechanism in Vault. Vault denies access by default, so a caller only gets the capabilities explicitly granted through attached policies.",
    examCue: "If the question asks what happens with no matching policy, the answer is no access.",
    pitfalls: [
      "Policies are additive, but explicit deny still overrides all grants.",
      "Policies are attached to tokens, not to paths themselves.",
    ],
    remember: "No policy means no access.",
  },
  "2b": {
    explanation:
      "Vault policy paths match API paths, not friendly CLI shortcuts. Wildcards determine how broad the match is, which is why path syntax questions show up often.",
    examCue: "Know that * is used as a suffix glob and + matches exactly one path segment.",
    pitfalls: [
      "KV v2 policies must account for API paths such as /data/ and sometimes /metadata/.",
      "Treating * like a free-form wildcard anywhere in the path leads to bad policy answers.",
      "Path matching is case-sensitive.",
    ],
    remember: "Policies speak API path language.",
  },
  "2c": {
    explanation:
      "Capabilities define which operations are allowed on a path, such as read, create, update, delete, list, sudo, or deny.",
    examCue: "Expect capability-to-operation mapping questions, especially around sudo and deny.",
    pitfalls: [
      "sudo is for protected endpoints, not a generic superuser flag on all paths.",
      "deny beats every other capability no matter where it came from.",
    ],
    remember: "Capabilities are the verbs on a path.",
  },
  "2d": {
    explanation:
      "Choosing a policy means translating a business need into the smallest set of path capabilities required to do the job and nothing more.",
    examCue: "The best answer is usually the narrowest path and smallest capability set that still satisfies the requirement.",
    pitfalls: [
      "Over-broad globs are easy to write but violate least privilege.",
      "Identity templating is useful when each user needs access only to their own path.",
    ],
    remember: "Write the smallest policy that still works.",
  },
  "2e": {
    explanation:
      "Vault policies can be created in the UI or written from the CLI, but the main exam idea is understanding the built-in root and default policies and how custom ACL policies are applied.",
    examCue: "Remember that root is built in and cannot be modified, while default exists on every token and can be changed.",
    pitfalls: [
      "Creating a policy does not grant it automatically; a token still has to receive that policy.",
      "Do not confuse ACL policies with Sentinel or other Enterprise policy layers.",
    ],
    remember: "Write policy, then attach policy.",
  },
  "3a": {
    explanation:
      "Service tokens are persisted lifecycle objects with features such as accessors and renewal, while batch tokens are lightweight, non-persisted tokens optimized for scale.",
    examCue: "When the question is about high-volume short-lived workloads, batch tokens are usually the better fit.",
    pitfalls: [
      "Batch tokens are not renewable and do not have accessors.",
      "Service tokens support richer lifecycle behavior such as child tokens.",
    ],
    remember: "Service = full lifecycle; batch = lightweight scale.",
  },
  "3b": {
    explanation:
      "Root tokens carry unrestricted access and should be treated as break-glass credentials for setup or emergencies, not day-to-day administration.",
    examCue: "Questions often test whether you know root tokens should be revoked after the task is complete.",
    pitfalls: [
      "Generate-root is an operational recovery workflow, not a normal login pattern.",
      "Keeping a root token around for convenience is the wrong operational habit.",
    ],
    remember: "Root is temporary and exceptional.",
  },
  "3c": {
    explanation:
      "A token accessor lets you inspect, revoke, or renew a service token without exposing the actual token value, which is safer for operations.",
    examCue: "If the prompt says 'manage a token without revealing the token itself,' think accessor.",
    pitfalls: [
      "Accessors do not exist for batch tokens.",
      "An accessor is not a substitute token; it is an admin handle.",
    ],
    remember: "Accessor = token handle without token secret.",
  },
  "3d": {
    explanation:
      "TTL determines how long a token lives before expiring, while max TTL puts a hard ceiling on how far renewals can extend that lifetime.",
    examCue: "Expect questions that contrast renewable TTL with absolute max TTL from creation time.",
    pitfalls: [
      "Renewal does not ignore max TTL.",
      "A renewable token can still become non-renewable once it reaches its ceiling.",
    ],
    remember: "max_ttl is the hard stop.",
  },
  "3e": {
    explanation:
      "Normal tokens form parent-child trees, so revoking a parent also revokes its descendants. Orphan tokens have no parent and live independently.",
    examCue: "If revocation should not cascade from a parent, the exam is pointing you toward orphan tokens.",
    pitfalls: [
      "Parent-child behavior matters for delegated token creation flows.",
      "Many auth-derived tokens are orphans because they start a fresh identity branch.",
    ],
    remember: "Parent gone means children gone unless the token is orphaned.",
  },
  "3f": {
    explanation:
      "Vault can create tokens with different behaviors such as periodic renewal, limited uses, or properties defined through token roles to fit the workload's lifecycle.",
    examCue: "Look for the operational need: long-running service, temporary automation, or pre-defined token policy via a role.",
    pitfalls: [
      "Periodic tokens are about repeatable renewal behavior, not unlimited privilege.",
      "Use-limit constrains how many requests a token can make, not how long it lasts.",
    ],
    remember: "Create the token that matches the workload's lifespan and risk.",
  },
  "4a": {
    explanation:
      "A lease ID is the handle Vault uses to track the lifetime of a dynamic secret or another leased object so that it can be renewed or revoked later.",
    examCue: "If a credential was generated dynamically, expect a lease ID to be involved.",
    pitfalls: [
      "Lease IDs are not the same thing as secret values.",
      "Leases are about lifecycle management, not just lookup convenience.",
    ],
    remember: "Lease ID is the lifecycle handle.",
  },
  "4b": {
    explanation:
      "Renewing a lease extends the life of the same issued credential instead of creating a new one, as long as the backend and max TTL rules allow it.",
    examCue: "If the goal is to keep the current credential valid longer, renew; if you need a new credential, issue a new secret.",
    pitfalls: [
      "Renewal is still bounded by max TTL and backend policy.",
      "Not every lease is renewable.",
    ],
    remember: "Renew keeps the same secret alive.",
  },
  "4c": {
    explanation:
      "Revoking a lease invalidates the leased secret before its TTL expires. Prefix revocation extends that to every lease under a path.",
    examCue: "For emergency cleanup of many generated credentials, the exam often expects prefix revoke.",
    pitfalls: [
      "Revocation is broader than deletion from storage; it triggers backend cleanup too.",
      "Force revoke ignores backend cleanup errors and should be understood as an operational fallback.",
    ],
    remember: "Revoke ends the lease now, not later.",
  },
  "5a": {
    explanation:
      "Choosing a secrets engine is about matching the problem to the engine's behavior: storage, dynamic credentials, encryption, certificates, SSH, or per-token delivery.",
    examCue: "Expect use-case matching: KV for static values, Database or cloud engines for dynamic credentials, Transit for cryptography, PKI for certificates.",
    pitfalls: [
      "Transit is not a general storage engine.",
      "Cubbyhole is per-token and not a team-wide secret store.",
    ],
    remember: "Pick the engine for the secret lifecycle you need.",
  },
  "5b": {
    explanation:
      "Static secrets are stored values that remain until changed, while dynamic secrets are generated on demand, scoped per consumer, and designed to expire.",
    examCue: "If the prompt emphasizes reduced blast radius or unique credentials per request, dynamic secrets are the answer.",
    pitfalls: [
      "Dynamic does not just mean temporary; it usually also means generated specifically for a client or session.",
      "Static secrets often require manual rotation and broader sharing risk.",
    ],
    remember: "Dynamic secrets are issued, not just stored.",
  },
  "5c": {
    explanation:
      "The Transit secrets engine provides encryption, decryption, signing, verification, hashing, HMAC, and rewrap operations while keeping key material inside Vault.",
    examCue: "If the question is about encrypting data without handing keys to the application, think Transit.",
    pitfalls: [
      "Transit does not store the original plaintext for later retrieval.",
      "Applications must handle the ciphertext and any storage themselves.",
    ],
    remember: "Transit keeps keys in Vault and crypto outside your app code.",
  },
  "5d": {
    explanation:
      "A secrets engine is a mounted backend plugin with its own paths and behavior. You can mount the same engine type multiple times at different paths for separation.",
    examCue: "Mount path matters because policies and API routes reference the mount, not just the engine type.",
    pitfalls: [
      "Disabling a mount is destructive.",
      "Isolation comes from mount paths, configuration, and policy boundaries.",
    ],
    remember: "Engine type tells you what it does; mount path tells you where it lives.",
  },
  "5e": {
    explanation:
      "Response wrapping packages a secret response into a short-lived, single-use wrapping token so the recipient can unwrap it later without the sender seeing the final secret in transit.",
    examCue: "When secure delivery is the goal, response wrapping is usually the intended feature.",
    pitfalls: [
      "The wrapping token is not the secret itself.",
      "Wrapping is about delivery and one-time retrieval, not long-term storage.",
    ],
    remember: "Wrap once, unwrap once.",
  },
  "5f": {
    explanation:
      "Short-lived dynamic secrets reduce blast radius, simplify cleanup, and create better auditability because each consumer gets credentials with a bounded lifetime.",
    examCue: "If the question asks for the main value proposition of Vault, dynamic secrets are often part of the answer.",
    pitfalls: [
      "The biggest gain is operational risk reduction, not just convenience.",
      "Dynamic secrets only help if applications are designed to handle renewal or re-issuance.",
    ],
    remember: "Dynamic plus short-lived means less standing risk.",
  },
  "5g": {
    explanation:
      "Enabling a secrets engine mounts it at a path so clients can use it. The CLI, API, and UI all perform the same core action through different interfaces.",
    examCue: "The API route for mounting engines is under /v1/sys/mounts/<path>.",
    pitfalls: [
      "A mount path can differ from the engine type name.",
      "HashiCorp added the API to this objective in March 2025, so direct mount API knowledge now matters.",
    ],
    remember: "Enable means mount the engine at a path.",
  },
  "5h": {
    explanation:
      "Accessing a secret depends on both the engine type and the interface you use. KV v2 is the classic exam example because CLI and UI hide some API path details.",
    examCue: "Expect questions about /data/ in KV v2 API paths and policies.",
    pitfalls: [
      "CLI convenience commands do not change how policies and raw API paths work.",
      "Versioned KV reads and writes use different API subpaths than KV v1.",
    ],
    remember: "Friendly CLI commands still map to exact API paths.",
  },
  "6a": {
    explanation:
      "Transit encrypt and decrypt operations require the client to base64 encode plaintext on the way in and decode plaintext on the way out after decryption.",
    examCue: "Ciphertext values show the key version, which is important when rotation enters the picture.",
    pitfalls: [
      "Sending raw plaintext instead of base64 is a common mental miss.",
      "Decrypt returns base64 content, not the final decoded text.",
    ],
    remember: "Base64 in, ciphertext out, base64 back on decrypt.",
  },
  "6b": {
    explanation:
      "Rotating a Transit key creates a new key version for future operations while preserving the ability to decrypt older ciphertext. Rewrap updates ciphertext to the latest version.",
    examCue: "If the prompt asks how to move ciphertext to the latest key version without exposing plaintext, the answer is rewrap.",
    pitfalls: [
      "Rotate changes key versions; rewrap updates ciphertext; they are related but different actions.",
      "Old ciphertext does not become unreadable immediately after rotation.",
    ],
    remember: "Rotate the key, rewrap the ciphertext.",
  },
  "7a": {
    explanation:
      "Vault encrypts data through its cryptographic barrier before writing anything to the storage backend, which is why the backend can be treated as untrusted.",
    examCue: "If the question asks why storage can be untrusted, the barrier and key hierarchy are the reason.",
    pitfalls: [
      "Do not assume backend encryption replaces Vault's own data protection model.",
      "The exam cares more about the barrier concept than implementation trivia.",
    ],
    remember: "Vault encrypts before storage sees anything.",
  },
  "7b": {
    explanation:
      "Seal and unseal control access to the material required to decrypt Vault's protected data. Shamir splitting distributes unseal responsibility across multiple key shares.",
    examCue: "Auto-unseal changes operational flow, but recovery keys are still not unseal keys.",
    pitfalls: [
      "Recovery keys cannot unseal Vault.",
      "Rekey changes unseal shares; it does not rotate the data encryption key.",
    ],
    remember: "Unseal keys open Vault; recovery keys do not.",
  },
  "7c": {
    explanation:
      "Environment variables simplify Vault CLI usage by carrying connection, auth, namespace, and formatting settings for commands.",
    examCue: "Know the common variables such as VAULT_ADDR, VAULT_TOKEN, and VAULT_NAMESPACE.",
    pitfalls: [
      "VAULT_SKIP_VERIFY is a troubleshooting shortcut, not a production best practice.",
      "Environment variables improve ergonomics but do not replace sound credential handling.",
    ],
    remember: "ADDR, TOKEN, NAMESPACE, FORMAT are the core ones.",
  },
  "8a": {
    explanation:
      "Cluster strategy questions ask you to balance operational control against operational burden. Self-managed clusters offer flexibility; HCP Vault reduces infrastructure overhead.",
    examCue: "If the scenario emphasizes managed operations, upgrades, and backups, HCP is usually the fit.",
    pitfalls: [
      "Managed service does not mean no architecture decisions; it means fewer infrastructure tasks.",
      "Self-managed gives control, but also gives you patching, backup, and HA responsibility.",
    ],
    remember: "More control usually means more operational work.",
  },
  "8b": {
    explanation:
      "Storage backend choice determines how Vault persists data and participates in HA. For the associate exam, Integrated Storage with Raft is the recommended default to remember.",
    examCue: "When asked for the recommended modern default, answer Integrated Storage (Raft).",
    pitfalls: [
      "There is only one storage backend per cluster.",
      "In-memory storage is for development only, not production HA.",
    ],
    remember: "Raft is the recommended default.",
  },
  "8c": {
    explanation:
      "Shamir secret sharing splits unseal capability across multiple holders, and related operations such as init, unseal, rekey, and rotate each solve different operational problems.",
    examCue: "The exam loves the contrast between rekey and rotate.",
    pitfalls: [
      "Rekey changes unseal shares, threshold, or holders.",
      "Rotate changes Vault's encryption key material, not the human-held unseal shares.",
    ],
    remember: "Rekey changes shares; rotate changes encryption keys.",
  },
  "8d": {
    explanation:
      "Performance replication extends client-serving capacity and geographic reach, while disaster recovery replication maintains a standby copy intended for failover after a serious outage.",
    examCue: "If the question is about backup-style failover, think DR; if it is about scale and locality for reads, think performance replication.",
    pitfalls: [
      "DR secondaries do not serve client traffic until promoted.",
      "Performance replication is not a substitute for disaster recovery planning.",
    ],
    remember: "Performance scales; DR recovers.",
  },
  "8e": {
    explanation:
      "Differentiating self-managed and HashiCorp-managed Vault means understanding who owns upgrades, backups, HA operations, and surrounding infrastructure care.",
    examCue: "This objective overlaps with 8a, but here the question is usually about operational responsibility rather than cluster design strategy.",
    pitfalls: [
      "Do not answer only in feature terms; answer in responsibility terms too.",
      "Managed clusters still require sound auth, policy, and app-integration design.",
    ],
    remember: "The difference is as much about who operates it as where it runs.",
  },
  "9a": {
    explanation:
      "Vault Agent is a helper process that can authenticate automatically, cache secrets or tokens locally, and render templates so applications do not need to talk to Vault directly.",
    examCue: "In Kubernetes, the injector turns Vault Agent into a sidecar-driven secret delivery pattern.",
    pitfalls: [
      "Agent does not remove Vault; it reduces direct Vault logic inside the application.",
      "Auto-auth, caching, and templating are separate capabilities and may appear independently in questions.",
    ],
    remember: "Agent makes apps less Vault-aware.",
  },
  "9b": {
    explanation:
      "Vault Secrets Operator is a Kubernetes-native controller that syncs or transforms Vault-managed data into Kubernetes resources, giving clusters a platform-native integration model.",
    examCue: "If the scenario wants Kubernetes-native secret objects without a sidecar in each pod, VSO is the likely answer.",
    pitfalls: [
      "VSO is not the same pattern as Vault Agent sidecars.",
      "The operator is about cluster-level reconciliation, not just a thin API proxy.",
    ],
    remember: "VSO is the Kubernetes-native sync pattern.",
  },
});
