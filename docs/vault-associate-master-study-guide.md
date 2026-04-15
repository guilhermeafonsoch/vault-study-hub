# Vault Associate (003) Master Study Guide

This document is the long-form written companion to the study hub app. It is meant to be the single document you can read from start to finish to prepare for the **HashiCorp Certified: Vault Associate (003)** exam.

## Scope

This guide is aligned to the current official HashiCorp Vault Associate material reviewed on **April 15, 2026**:

- Vault Associate **(003)**
- Product version tested: **Vault 1.16**
- Format: **online proctored**
- Duration: **1 hour**

Official references reviewed while preparing this document:

- Certification details: <https://developer.hashicorp.com/certifications/security-automation>
- Exam content list: <https://developer.hashicorp.com/vault/tutorials/associate-cert-003/associate-review-003>
- Learning path: <https://developer.hashicorp.com/vault/tutorials/associate-cert/associate-study>
- Sample questions: <https://developer.hashicorp.com/vault/tutorials/associate-cert-003/associate-questions-003>

## How to use this document

1. Read the **Core Mental Model** first.
2. Study the **nine domains** in order.
3. For each domain, make sure you can explain the summary out loud without reading.
4. Use the **Pass Checklist** at the end to find weak spots.
5. Use the app for recall practice after finishing the reading.

## What you actually need to pass

You do not need deep operator-level mastery of every enterprise feature.

You do need:

- strong understanding of how Vault pieces fit together
- the ability to choose the right feature for a scenario
- comfort with common CLI commands and API path patterns
- clarity on lifecycle concepts such as tokens, TTLs, leases, mounts, auth flows, and sealing
- confidence with common exam contrasts such as:
  - human vs machine auth
  - service vs batch tokens
  - static vs dynamic secrets
  - rekey vs rotate
  - performance replication vs disaster recovery replication
  - KV v1/v2 API path behavior

The exam is much easier if you keep one chain in your head:

`auth -> token -> policy -> secret engine -> lease`

If you can explain where a request is in that lifecycle, many questions answer themselves.

## Core Mental Model

### 1. Vault authenticates first

A user, application, pod, or cloud workload proves identity through an auth method.

Important idea:

- all auth methods ultimately result in a **Vault token**

### 2. The token is the working identity

After login, the client no longer keeps authenticating on every request through the original method. It presents the token.

Important idea:

- the token carries policies, TTL, renewability, and lifecycle behavior

### 3. Policies authorize paths

Policies decide what a token can do on which API paths.

Important ideas:

- Vault is deny-by-default
- capabilities map to operations on paths
- explicit `deny` wins

### 4. Secrets engines answer requests

Secrets engines are mounted plugins. They store secrets, generate secrets, encrypt data, issue certificates, and more.

Important ideas:

- the same engine type can be mounted multiple times
- mount paths matter for policy design and API requests
- disabling a mount is destructive

### 5. Dynamic output is tracked through leases

Generated credentials and other dynamic objects often come with leases so Vault can renew or revoke them.

Important ideas:

- renew keeps the same leased object alive longer
- revoke ends it early

### 6. Vault protects data through the barrier

Vault encrypts data before it reaches storage. The storage backend is treated as untrusted.

Important ideas:

- sealing controls access to the material needed to decrypt
- unseal and recovery operations are not the same thing

## Domain 1: Authentication Methods

### Domain summary

Authentication answers **who is calling Vault**. The exam mostly tests whether you can match the right auth method to the right use case and remember that every successful auth flow ends in a token.

### What to master

**1a. Define the purpose of auth methods**

- Auth methods verify identity.
- Their output is a token.
- Token auth is built in and always enabled.

**1b. Choose an auth method based on use case**

- UserPass, LDAP, OIDC, GitHub: usually human login flows
- AppRole: automation and CI/CD
- Kubernetes: pods using service account identity
- AWS, Azure, GCP auth: cloud workloads using cloud identity
- TLS cert auth: workloads using certificates

**1c. Human vs system auth methods**

- Human methods are interactive or user-directory based.
- Machine methods use workload identity or machine credentials.

**1d. Purpose of identities and groups**

- An entity is Vault's canonical identity object.
- An alias links an auth-method identity to the entity.
- Groups collect identities and policies.

**1e. Authenticate via API, CLI, and UI**

- CLI, UI, and API all perform the same logical action.
- API login path pattern is commonly:
  - `/v1/auth/<method>/login/<identity>`

**1f. Configure auth methods via API, CLI, and UI**

- Enabling an auth method mounts it at a path.
- Custom paths change how you log in and how policies refer to the method.

### Must remember

- Auth proves identity. Policy proves permission.
- Every successful auth flow becomes a token.
- AppRole is for automation.
- Kubernetes auth is for pods.
- OIDC and LDAP are human-oriented auth methods in exam scenarios.

### Common traps

- Confusing auth with authorization
- Forgetting token auth is always enabled
- Using human auth methods for non-interactive workloads

### Commands worth recognizing

```bash
vault auth enable userpass
vault auth list
vault login -method=userpass username=admin
vault auth tune -max-lease-ttl=24h userpass/
```

## Domain 2: Vault Policies

### Domain summary

Policies answer **what the caller can do**. This domain is heavily tested and should feel automatic.

### What to master

**2a. Value of Vault policies**

- Vault denies by default.
- Policies are the main authorization mechanism.
- Policies attach to tokens.

**2b. Policy path syntax**

- Policies match API paths.
- `*` is a broad glob.
- `+` matches exactly one path segment.
- KV v2 paths often require extra care because CLI convenience hides API details.

**2c. Policy capabilities**

- create, read, update, delete, list, sudo, deny
- `deny` overrides everything
- `sudo` is for protected endpoints such as some `sys/` paths

**2d. Choose a policy based on requirements**

- Least privilege matters.
- Narrow paths and minimal capabilities are usually the best answer.
- Identity templating can scope access per user or entity.

**2e. Configure policies via UI and CLI**

- `root` policy is built in and cannot be modified.
- `default` is built in and can be modified.
- Writing a policy does not apply it automatically; a token still needs that policy.

### Must remember

- No policy means no access.
- Policies are additive except explicit deny.
- Policies talk in API paths, not friendly CLI shortcuts.

### Common traps

- Mixing up `*` and `+`
- Forgetting `sudo` is not a general admin switch
- Missing `/data/` in KV v2 policy paths

### Commands worth recognizing

```hcl
path "secret/data/*" {
  capabilities = ["read"]
}
```

```bash
vault policy write dev-ro ./dev-readonly.hcl
vault policy read default
vault token create -policy=dev-ro
```

## Domain 3: Vault Tokens

### Domain summary

Tokens are the day-to-day operating identity in Vault. This domain tests lifecycle behavior more than memorization.

### What to master

**3a. Service vs batch tokens**

- Service tokens are persisted and support richer lifecycle operations.
- Batch tokens are lightweight, not persisted, and not renewable.
- Batch tokens do not have accessors.

**3b. Root token lifecycle**

- Root tokens have unrestricted access.
- They should only be used for setup or emergencies.
- Best practice is to revoke them after use.

**3c. Token accessors**

- Accessors let you inspect or revoke service tokens without exposing the token value.

**3d. Impact of TTL**

- TTL controls how long a token lasts.
- Renewal extends TTL but cannot exceed max TTL.
- Max TTL is the hard ceiling from creation time.

**3e. Orphaned tokens**

- Normal tokens can have parent-child relationships.
- Revoking a parent revokes its descendants.
- Orphan tokens have no parent and do not die because a parent was revoked.

**3f. Create tokens based on need**

- Periodic tokens are for long-running renewable workflows.
- Use-limit tokens expire after a number of uses.
- Token roles can define token creation rules.

### Must remember

- Batch tokens: not persisted, not renewable, no accessor
- Root tokens: break-glass only
- Max TTL is a hard stop
- Orphan tokens are independent of parent revocation

### Common traps

- Thinking all tokens have accessors
- Thinking renewal can continue forever
- Treating root tokens as normal admin credentials

### Commands worth recognizing

```bash
vault token create -type=service
vault token create -type=batch
vault token lookup -accessor <accessor>
vault token revoke -accessor <accessor>
vault token create -orphan -ttl=1h
vault token create -period=24h
```

## Domain 4: Vault Leases

### Domain summary

Leases are the lifecycle handles for dynamic outputs. If you understand renew and revoke, this domain is straightforward.

### What to master

**4a. Purpose of a lease ID**

- Lease IDs identify dynamic secrets and other leased objects.
- Lease metadata allows lifecycle management.

**4b. Renew leases**

- Renew extends the life of the same credentials.
- Renew does not create new credentials.
- Renewal is still bounded by limits such as max TTL.

**4c. Revoke leases**

- Revoke ends a lease early.
- Prefix revoke is the bulk cleanup tool.
- Force revoke is an operational fallback when the backend has issues.

### Must remember

- Lease ID is the lifecycle handle
- Renew means same secret, longer lifetime
- Revoke means end now

### Common traps

- Confusing renew with issuing new credentials
- Missing the value of `-prefix` in incident response scenarios

### Commands worth recognizing

```bash
vault lease renew <lease-id>
vault lease renew -increment=2h <lease-id>
vault lease revoke <lease-id>
vault lease revoke -prefix database/creds/
```

## Domain 5: Secrets Engines

### Domain summary

This is one of the most practical domains on the exam. You need to know which engine solves which problem.

### What to master

**5a. Choose engine by use case**

- KV: static secrets
- Database/cloud engines: dynamic credentials
- Transit: encryption as a service
- PKI: certificates
- SSH: signed SSH material
- Cubbyhole: per-token storage

**5b. Dynamic vs static secrets**

- Static secrets are stored values.
- Dynamic secrets are issued on demand and usually expire.
- Dynamic secrets reduce blast radius and improve auditability.

**5c. Transit secrets engine**

- Transit performs encryption, decryption, signing, verification, hashing, HMAC, and rewrap.
- Keys do not leave Vault.
- Transit does not store your plaintext application data.

**5d. Purpose of secrets engines**

- Engines are mounted plugins at paths.
- Same engine type can be enabled more than once.
- Disabling a mount deletes stored data and related leases.

**5e. Response wrapping**

- Wraps a response in a one-time-use wrapping token.
- Useful for secure secret delivery.

**5f. Value of dynamic secrets**

- Short-lived
- unique per consumer
- better cleanup and audit trail

**5g. Enable engines via API, CLI, UI**

- Engine enablement is a mount operation.
- API path is:
  - `/v1/sys/mounts/<path>`

**5h. Access secrets via CLI, API, UI**

- KV v2 API paths include `/data/`
- CLI often hides this detail
- Policies must still match the API path

### Must remember

- Match the engine to the problem
- KV is static storage
- Database and cloud engines are dynamic
- Transit is for cryptographic operations
- KV v2 policy and API path details matter

### Common traps

- Forgetting mount disable is destructive
- Treating Transit like a storage engine
- Forgetting `/data/` for KV v2
- Thinking wrapping is the same as encryption at rest

### Commands worth recognizing

```bash
vault secrets enable -path=myapp kv-v2
vault secrets list -detailed
vault kv get -mount=secret myapp/config
vault kv get -wrap-ttl=120 secret/myapp
vault unwrap <wrapping-token>
```

## Domain 6: Encryption as a Service

### Domain summary

This domain is small but important because it tests whether you understand what Transit actually does.

### What to master

**6a. Encrypt and decrypt with Transit**

- Plaintext must be base64 encoded before encrypting.
- Ciphertext includes the key version.
- Decrypt output must usually be base64 decoded by the client.

**6b. Rotate encryption key**

- Rotation creates a new key version.
- Old ciphertext can still be decrypted.
- Rewrap updates ciphertext to the latest key version without exposing plaintext.

### Must remember

- Transit keeps keys in Vault
- your app stores the ciphertext, not Vault
- rotate and rewrap are related but different

### Common traps

- Forgetting base64 input and output handling
- Thinking rotation automatically rewrites old ciphertext

### Commands worth recognizing

```bash
vault secrets enable transit
vault write -f transit/keys/orders
vault write transit/encrypt/orders plaintext=$(echo -n 'card-4242' | base64)
vault write -f transit/keys/orders/rotate
vault write transit/rewrap/orders ciphertext=vault:v1:...
```

## Domain 7: Architecture Fundamentals

### Domain summary

This domain tests the security model underneath the product: barrier, seal state, unseal flow, and basic operator environment variables.

### What to master

**7a. How Vault encrypts data**

- Vault encrypts data before writing it to storage.
- The storage backend is untrusted.
- Understand the key hierarchy at a conceptual level.

**7b. Seal and unseal Vault**

- Sealed Vault can access storage but cannot decrypt data.
- Shamir uses shares and a threshold.
- Auto-unseal uses an external KMS or HSM.
- Recovery keys are not unseal keys.

**7c. Environment variables**

- `VAULT_ADDR`
- `VAULT_TOKEN`
- `VAULT_NAMESPACE`
- `VAULT_FORMAT`
- `VAULT_SKIP_VERIFY` only as a non-production shortcut

### Must remember

- Vault secures data through the barrier, not by trusting storage
- recovery keys cannot unseal Vault
- `VAULT_SKIP_VERIFY` is not okay for normal secure production use

### Common traps

- Mixing up recovery keys, unseal keys, and root tokens
- Giving storage backend security too much conceptual credit

### Commands worth recognizing

```bash
vault operator init -key-shares=5 -key-threshold=3
vault operator unseal <share>
vault operator seal
export VAULT_ADDR='https://vault:8200'
export VAULT_TOKEN='<vault-token>'
```

## Domain 8: Deployment Architecture

### Domain summary

This domain tests operational judgment: how Vault is deployed, how it stores data, and how it handles replication and key operations.

### What to master

**8a. Self-managed vs HCP clusters**

- Self-managed gives more control and more operational responsibility.
- HCP Vault shifts more platform operations to HashiCorp.

**8b. Storage backends**

- Integrated Storage with Raft is the recommended default.
- Consul is older and more operationally complex.
- In-memory is for dev only.

**8c. Shamir and unsealing operations**

- `init` creates initial shares and root token
- `unseal` opens Vault using shares
- `rekey` changes shares or threshold
- `rotate` changes encryption key material
- Rekey is not rotate

**8d. DR and performance replication**

- Performance replication helps scale and locality
- DR replication is for recovery
- DR secondaries do not serve clients until promoted

**8e. Cluster recommendations**

- Recommended default thinking:
  - Integrated Storage
  - 3 to 5 nodes
  - multi-AZ design

### Must remember

- Raft is the recommended storage answer
- rekey changes unseal share handling
- rotate changes encryption key material
- performance and DR replication solve different problems

### Common traps

- Saying performance replication is a backup solution
- Confusing HCP feature/ownership tradeoffs
- Mixing up rekey and rotate

### Commands worth recognizing

```bash
vault operator init
vault operator rekey -init -key-shares=3 -key-threshold=2
vault operator rotate
```

## Domain 9: Access Management

### Domain summary

This domain is about how applications consume Vault-managed secrets without every app becoming Vault-specific.

### What to master

**9a. Vault Agent**

- Supports auto-auth
- can cache secrets or tokens
- can render templates
- helps apps avoid direct Vault API logic
- often used as a sidecar in Kubernetes

**9b. Vault Secrets Operator**

- Kubernetes-native controller model
- syncs Vault-managed data into Kubernetes secrets or resources
- useful when you want cluster-native secret consumption

### Must remember

- Agent is close to the workload
- VSO is a Kubernetes-controller pattern
- both solve secret delivery, but not in the same way

### Common traps

- Treating VSO as just another name for Vault Agent
- Forgetting the sidecar vs controller distinction

### Commands and config worth recognizing

```bash
vault agent -config=agent.hcl
```

```hcl
auto_auth {
  method "approle" {
    config = {
      role_id_file_path = "/etc/vault/role-id"
    }
  }
}
```

## High-Value Exam Contrasts

If you remember nothing else, remember these contrasts:

### Auth

- OIDC / LDAP / GitHub / UserPass = human
- AppRole / Kubernetes / cloud auth / cert auth = machine

### Tokens

- service = persisted, renewable, accessor
- batch = not persisted, not renewable, no accessor

### Secrets

- static = stored
- dynamic = issued on demand with limited lifetime

### Key operations

- rekey = change unseal share arrangement
- rotate = change encryption key material

### Replication

- performance replication = scale
- DR replication = failover recovery

### KV v2 behavior

- CLI can hide complexity
- policy and API paths still need `/data/`

## Pass Checklist

You are in good shape if you can answer all of these without looking:

- What does every auth method ultimately produce?
- What is the difference between authentication and authorization in Vault?
- Why is Vault described as deny-by-default?
- What does `deny` do in a policy?
- What is the difference between `*` and `+` in policy paths?
- What is the difference between a service token and a batch token?
- What is a token accessor used for?
- What is max TTL and why does it matter?
- What is an orphan token?
- What is a lease ID?
- What is the difference between lease renew and new credential issuance?
- Which secrets engine would you choose for static config values?
- Which secrets engine would you choose for encrypting application data?
- Why are dynamic secrets valuable?
- What does response wrapping solve?
- Why is the storage backend treated as untrusted?
- What is the difference between unseal keys and recovery keys?
- Which storage backend is the recommended default?
- What is the difference between rekey and rotate?
- What is the difference between performance replication and DR replication?
- What problem does Vault Agent solve?
- What problem does Vault Secrets Operator solve?

## Final Revision Strategy

### Three days before the exam

- Read this full document once.
- Review all nine domain summaries.
- Drill the comparison pairs.

### One day before the exam

- Use the app cheat sheet and flashcards.
- Retake quizzes and review every wrong answer.
- Practice recognizing CLI commands and API path patterns.

### One hour before the exam

- Review auth method matching.
- Review policies and path syntax.
- Review service vs batch tokens.
- Review KV v2 `/data/` behavior.
- Review rekey vs rotate.
- Review performance replication vs DR replication.
- Review Transit basics.

## Last-Minute Cram Sheet

- Every auth method ends in a token.
- Policies are attached to tokens.
- Vault denies by default.
- `deny` always wins.
- Batch tokens are not renewable and have no accessor.
- Max TTL is the hard stop.
- Dynamic secrets are unique, short-lived, and leased.
- Transit encrypts data but does not store your plaintext.
- KV v2 API and policy paths need `/data/`.
- Sealed Vault can access storage but cannot decrypt data.
- Recovery keys do not unseal Vault.
- Raft is the recommended storage backend.
- Rekey changes shares. Rotate changes encryption keys.
- Performance replication scales. DR replication recovers.
- Agent is sidecar-style helper. VSO is Kubernetes-native controller sync.

## Suggested next step

After reading this document, open the study hub app and move through the sections in this order:

1. Guide
2. Mind Map
3. One domain at a time
4. Flashcards
5. Quiz

That sequence turns reading into recall, which is what will actually help you pass.
