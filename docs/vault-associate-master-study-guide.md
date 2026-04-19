# Vault Associate (003) Master Study Guide

This document is the long-form written companion to the study hub app. It is meant to be the single document you can read from start to finish to prepare for the **HashiCorp Certified: Vault Associate (003)** exam.

## Scope

This guide is aligned to the current official HashiCorp Vault Associate material reviewed on **April 19, 2026**:

- Vault Associate **(003)**
- Product version tested: **Vault 1.16**
- Format: **online proctored**
- Duration: **1 hour**

Official references reviewed while preparing this document:

- Certification details: <https://developer.hashicorp.com/certifications/security-automation>
- Exam content list: <https://developer.hashicorp.com/vault/tutorials/associate-cert-003/associate-review-003>
- Learning path: <https://developer.hashicorp.com/vault/tutorials/associate-cert-003/associate-study-003>
- Sample questions: <https://developer.hashicorp.com/vault/tutorials/associate-cert-003/associate-questions-003>

## How to use this document

1. Read the **Core Mental Model** first.
2. Study the **nine domains** in order.
3. Use each objective breakdown to answer three questions out loud: what it is, why it matters, and when you would use it.
4. After each domain, switch back to the app for flashcards and quiz practice.
5. Use the examples and exam-correlation notes to translate definitions into scenario thinking.

## What you actually need to pass

You do not need deep operator-level mastery of every enterprise feature.

You do need:

- strong understanding of how Vault pieces fit together
- the ability to choose the right feature for a scenario
- comfort with common CLI commands and API path patterns
- clarity on lifecycle concepts such as tokens, TTLs, leases, mounts, auth flows, and sealing
- confidence with common exam contrasts such as human vs machine auth, service vs batch tokens, static vs dynamic secrets, rekey vs rotate, and performance replication vs DR replication

The exam is much easier if you keep one chain in your head:

`auth -> token -> policy -> secret engine -> lease`

If you can explain where a request is in that lifecycle, many questions answer themselves.

## Core Mental Model

### Authentication feeds tokens

Vault does not authorize a login session directly. Every successful auth flow results in a token that the client uses afterward.

### Tokens carry policies

Policies are attached to tokens and define capabilities on paths. If you can explain that sentence clearly, many questions simplify immediately.

### Secrets engines issue data and leases

Dynamic secrets come from a mounted secrets engine and are tracked through lease IDs so Vault can renew or revoke them.

### Transit is still a secrets engine

Transit is different because it processes data instead of storing it, but it still follows Vault's mount-and-path model.

### Architecture explains trust

Seal state, key hierarchy, storage backend choice, and replication strategy explain how Vault stays secure and available in production.

### Agents reduce app complexity

Vault Agent and Vault Secrets Operator are both about delivering Vault-managed secrets to applications without pushing Vault API logic into every app.

## Recommended study flow

- **Pass 1 - Learn the map:** Start with the guide and mind map until you can explain how the nine domains connect without looking at the screen.
- **Pass 2 - Work the objectives:** Open one domain at a time and study every objective as a why, when, and how question instead of a definition-only fact.
- **Pass 3 - Practice contrasts:** Spend extra time on exam pairs: service vs batch, static vs dynamic, rekey vs rotate, DR vs performance replication, human vs machine auth.
- **Pass 4 - Simulate the exam:** Use cheat sheet, flashcards, and quiz mode together. Review every wrong answer by asking which Vault lifecycle or comparison you misunderstood.

## Domain 1: Authentication methods

**Domain summary:** How Vault identifies clients. Every auth method ultimately produces a token. Know human vs system methods.

**Domain focus:** Authentication questions are mostly about choosing the right identity source and remembering that every successful auth flow ends in a token.

### Mental model

- Auth answers who the caller is; policies answer what the caller can do.
- Humans usually authenticate with interactive methods such as OIDC, LDAP, GitHub, or Userpass; machines authenticate with workload identity such as AppRole, Kubernetes, or cloud IAM.
- Entities and aliases let Vault understand that the same person or service may arrive through multiple auth methods.

### Domain traps

- Confusing token auth with authorization. Token auth is simply another auth method.
- Choosing AppRole for humans or OIDC/LDAP for non-interactive workloads.
- Forgetting that token auth is always enabled.

### Objective breakdowns

#### 1a. Define the purpose of auth methods

**What it is**

Authentication methods are Vault's front door. Their job is to verify identity and then issue a token that the client uses for every later request.

**Why it matters**

Vault cannot make an authorization decision until it knows who the caller is. Auth methods are the start of every secure request flow because they turn identity into a Vault token.

**How it works**

A client presents identity material to an auth backend, the backend validates it against a trusted source, and Vault returns a token that carries policies and lifecycle settings for later requests.

**Use case**

Use auth methods whenever a person, application, CI pipeline, or platform workload needs to establish identity before reading or generating secrets.

**Real-world example**

An engineer signs in with OIDC through the company identity provider, receives a Vault token, and then uses that token to read only the development secrets allowed by policy.

**How the exam may ask it**

If a question asks what all auth methods ultimately produce, the answer is a token.

**Key concepts**

- Auth methods verify client identity before granting access
- All auth methods ultimately produce a Vault token
- Token auth is always enabled and cannot be disabled
- Every external auth maps down to a dynamically created token

**Commands and patterns worth recognizing**

```text
vault auth enable userpass
vault auth list
vault auth disable userpass/
```

**Common traps**

- Policies are not authentication methods; they only authorize paths after authentication succeeds.
- Token auth is built in and remains enabled even if you add other methods.

**Remember**

- Auth proves identity; the token carries access.

#### 1b. Choose an auth method based on use case

**What it is**

Choose the auth method that best reuses the identity source the workload already has, such as an IdP for humans or platform identity for machines.

**Why it matters**

The wrong auth method creates avoidable risk or operational friction. The best choice usually reuses the identity system the caller already has instead of inventing a new shared secret.

**How it works**

You map the caller type to its native identity source: interactive users to directory or SSO methods, and machine workloads to non-interactive platform identity such as AppRole, Kubernetes, or cloud IAM.

**Use case**

Choose OIDC or LDAP for employees, AppRole for automation, Kubernetes auth for pods, and cloud auth for workloads that already have AWS, Azure, or GCP identity.

**Real-world example**

A GitHub Actions deployment job authenticates with AppRole to fetch short-lived database credentials before running a migration, while engineers use OIDC to access the UI and CLI.

**How the exam may ask it**

Scenario matching is common: AppRole for automation, Kubernetes for pods, OIDC or LDAP for human SSO.

**Key concepts**

- UserPass/LDAP/OIDC — human operators
- AppRole — CI/CD pipelines (role_id + secret_id)
- Kubernetes — pods via service account tokens
- AWS/Azure/GCP — cloud workloads with platform identity
- TLS Certificates — mTLS between services
- GitHub — developer teams using PATs

**Commands and patterns worth recognizing**

```text
vault auth enable -path=my-k8s kubernetes
```

**Common traps**

- Do not force a human workflow onto a machine workload or vice versa.
- The best method is usually the one that avoids long-lived shared secrets.

**Remember**

- Pick the method that matches the caller's native identity.

#### 1c. Human vs system auth methods

**What it is**

Human auth methods support interactive or directory-backed users, while system auth methods let applications or workloads prove identity non-interactively.

**Why it matters**

Many exam scenarios are really classification questions. If you can quickly tell whether the caller is a human or a machine, the correct auth method becomes much easier to spot.

**How it works**

Human auth methods assume interactive or directory-backed login flows, while system auth methods let a workload prove identity with platform credentials, certificates, or machine-specific secrets.

**Use case**

Use human methods for operators, analysts, and developers; use system methods for services, batch jobs, containers, VMs, and serverless functions.

**Real-world example**

A Kubernetes pod should use the Kubernetes auth method with its service account token, not Userpass, because the pod is a workload and not a human user.

**How the exam may ask it**

Expect classification questions that ask whether a method is human-facing or machine-facing.

**Key concepts**

- Human: UserPass, LDAP, OIDC, GitHub — interactive login
- System/Machine: AppRole, Kubernetes, AWS, Azure, GCP, TLS Certs
- Human methods often use browser-based flows
- Machine methods use platform credentials (IAM role, SA)

**Common traps**

- GitHub, LDAP, and OIDC are human-oriented methods in this exam context.
- AppRole and Kubernetes are machine methods even if humans configure them.

**Remember**

- Humans log in; machines present workload identity.

#### 1d. Purpose of identities and groups

**What it is**

Vault Identity gives Vault a stable representation of a person or machine across multiple auth methods. Entities are the canonical identity; aliases connect that identity to each auth backend.

**Why it matters**

Vault Identity lets you keep a stable concept of who the caller really is even when that same person or service arrives through more than one auth method.

**How it works**

Vault creates an entity as the canonical identity record, links auth-specific logins through aliases, and uses internal or external groups to attach shared policies to many identities at once.

**Use case**

Use identities and groups when one user may log in through multiple systems or when many users or services need the same policy set without copying policy assignments one by one.

**Real-world example**

An engineer can log in through both LDAP and OIDC, but both aliases map to one Vault entity so audit records and group-based policies stay consistent.

**How the exam may ask it**

If the same person can log in with more than one auth method, entities and aliases explain how Vault sees one actor instead of many.

**Key concepts**

- Entity: single person or machine across auth methods
- Entity Alias: maps auth method identity to entity
- Internal Groups: managed within Vault
- External Groups: mapped from providers (LDAP OUs)
- Groups aggregate policies for multiple entities

**Commands and patterns worth recognizing**

```text
vault write identity/entity name="bob"
```

**Common traps**

- An alias is not the same thing as an entity.
- Groups are how you collect entities under shared policies.

**Remember**

- Entity = who it really is; alias = how it arrived.

#### 1e. Authenticate via API, CLI, and UI

**What it is**

Vault can authenticate through the CLI, API, and UI, but all three routes talk to the same auth backends and return a token on success.

**Why it matters**

The exam switches between CLI, API, and UI wording. You need to recognize that the interface changes, but the auth flow and token result stay the same.

**How it works**

The CLI and UI are convenience layers on top of the same backend logic. Underneath, the auth mount receives credentials at its login endpoint and returns a client token when validation succeeds.

**Use case**

Use the CLI for operator workflows, the API for automation and integrations, and the UI for interactive browsing or administrative tasks.

**Real-world example**

A script posts credentials to `/v1/auth/approle/login`, gets a `client_token`, and then uses that token for later API reads even though an operator might do the same job with `vault login`.

**How the exam may ask it**

API login paths usually follow /v1/auth/<mount>/login/<identity>.

**Key concepts**

- CLI: vault login -method=userpass username=admin
- API: POST /v1/auth/userpass/login/admin
- UI: Select method, enter creds, click Sign In
- All return a client token for subsequent requests

**Commands and patterns worth recognizing**

```text
vault login -method=userpass username=admin
curl --request POST --data '{"password":"<password>"}' \
  $VAULT_ADDR/v1/auth/userpass/login/admin
```

**Common traps**

- The interface changes; the auth backend behavior does not.
- UI and CLI often hide request details that the API exposes directly.

**Remember**

- Different interface, same auth flow, same token outcome.

#### 1f. Configure auth methods via API, CLI, UI

**What it is**

Configuring an auth method means enabling it at a mount path and then tuning or writing method-specific settings under that path.

**Why it matters**

Mount paths and method settings affect how clients authenticate, how you document the platform, and which endpoints policies or integrations must reference.

**How it works**

You enable an auth backend at a mount path, configure its method-specific settings, and optionally tune values such as TTL behavior so callers use the right login endpoint for that path.

**Use case**

Configure auth methods when onboarding a new identity provider, splitting methods by audience, or giving one method a custom path for a specific business unit or environment.

**Real-world example**

A company enables LDAP at `corp-ldap/` and contractor LDAP at `partner-ldap/`, so the login paths are separate and each user group follows the correct auth flow.

**How the exam may ask it**

Expect enable-at-path questions and remember auth methods live under sys/auth from the API perspective.

**Key concepts**

- Enable: vault auth enable <type>
- Custom path: -path=my-ldap ldap
- API: POST /v1/sys/auth/<path>
- Tune: vault auth tune -max-lease-ttl=24h userpass/

**Commands and patterns worth recognizing**

```text
vault auth enable -path=corp-ldap ldap
```

**Common traps**

- The method type and the mount path are related but not the same thing.
- Custom paths are common and can change the login endpoint shape.

**Remember**

- An auth method is a mounted backend with settings.

### Official references for this domain

- [Auth methods docs](https://developer.hashicorp.com/vault/docs/auth)
- [Identity docs](https://developer.hashicorp.com/vault/docs/concepts/identity)

## Domain 2: Vault policies

**Domain summary:** Deny by default. Policies are HCL/JSON attached to tokens. Capabilities map to HTTP verbs.

**Domain focus:** Policies are the core authorization layer in Vault. The exam tests path matching, capabilities, least privilege, and the deny-by-default model.

### Mental model

- Policies attach to tokens, not directly to users.
- Path rules map to API paths, which matters a lot for KV v2 because API and CLI paths are not identical.
- Multiple policies combine as a union, except explicit deny always wins.

### Domain traps

- Mixing up * and + in path syntax.
- Forgetting that sudo is for protected system endpoints, not a general admin flag.
- Assuming a token with no policy still has some default read access.

### Objective breakdowns

#### 2a. Value of Vault policies

**What it is**

Policies are the main authorization mechanism in Vault. Vault denies access by default, so a caller only gets the capabilities explicitly granted through attached policies.

**Why it matters**

Policies are the main reason Vault is useful after authentication. Without them, a token would either be powerless or dangerously overprivileged.

**How it works**

Vault evaluates the ACL policies attached to the token on each request path and requested operation, denying by default unless a capability is explicitly granted.

**Use case**

Use policies to separate environments, teams, and operational duties so callers can reach only the exact paths they need.

**Real-world example**

A payments service token can read `secret/data/payments/*` but cannot list or modify production infrastructure paths because its policy grants only the narrow read capability it needs.

**How the exam may ask it**

If the question asks what happens with no matching policy, the answer is no access.

**Key concepts**

- DENY BY DEFAULT — no policy = no access
- Primary authorization mechanism in Vault
- Written in HCL or JSON, attached to tokens
- Multiple policies are additive (union of permissions)
- deny capability always takes precedence

**Commands and patterns worth recognizing**

```text
vault policy list
vault policy read default
```

**Common traps**

- Policies are additive, but explicit deny still overrides all grants.
- Policies are attached to tokens, not to paths themselves.

**Remember**

- No policy means no access.

#### 2b. Policy path syntax

**What it is**

Vault policy paths match API paths, not friendly CLI shortcuts. Wildcards determine how broad the match is, which is why path syntax questions show up often.

**Why it matters**

Policy bugs often come from path mismatches, especially with KV v2. The exam uses this objective to see whether you understand how Vault actually evaluates paths.

**How it works**

Vault compares the request against API-style path rules. A suffix glob with `*` broadens the tail of the path, while `+` matches exactly one path segment in the middle of a path.

**Use case**

Use path syntax to scope access to folders, single app branches, or one layer of a hierarchy without giving away access to the entire mount.

**Real-world example**

A policy on `secret/data/+/db` can allow one application folder level for database settings, but it will not match deeper paths like `secret/data/prod/payments/db`.

**How the exam may ask it**

Know that * is used as a suffix glob and + matches exactly one path segment.

**Key concepts**

- Paths match API endpoints: secret/data/myapp/*
- * is used as a suffix glob in policy paths
- + (wildcard) matches exactly one path segment
- secret/data/+/config matches one-level deep
- Paths are case-sensitive

**Commands and patterns worth recognizing**

```text
path "secret/data/*" {
  capabilities = ["read"]
}
path "secret/data/+/creds" {
  capabilities = ["read"]
}
```

**Common traps**

- KV v2 policies must account for API paths such as /data/ and sometimes /metadata/.
- Treating * like a free-form wildcard anywhere in the path leads to bad policy answers.
- Path matching is case-sensitive.

**Remember**

- Policies speak API path language.

#### 2c. Policy capabilities

**What it is**

Capabilities define which operations are allowed on a path, such as read, create, update, delete, list, sudo, or deny.

**Why it matters**

Least privilege depends on translating business actions into the right capability set. This is one of the most common ways the exam checks whether you can think operationally.

**How it works**

Each request maps to a capability such as read, list, create, update, delete, sudo, or deny. Vault grants the operation only if the token has the matching capability on the exact path.

**Use case**

Use capabilities to let CI rotate secrets, let apps read only what they consume, and reserve destructive or privileged operations for a smaller set of operator tokens.

**Real-world example**

A deployment pipeline receives create and update on a KV path so it can rotate an API key, but it does not get delete because removing the secret is not part of its job.

**How the exam may ask it**

Expect capability-to-operation mapping questions, especially around sudo and deny.

**Key concepts**

- create, read, update, delete, list, sudo, deny
- sudo = access root-protected endpoints (sys/)
- deny = explicit deny, overrides ALL other capabilities
- HTTP mapping: create=POST, read=GET, list=LIST

**Commands and patterns worth recognizing**

```text
path "secret/data/prod/*" {
  capabilities = ["create","read",
    "update","delete","list"]
}
```

**Common traps**

- sudo is for protected endpoints, not a generic superuser flag on all paths.
- deny beats every other capability no matter where it came from.

**Remember**

- Capabilities are the verbs on a path.

#### 2d. Choose a policy based on requirements

**What it is**

Choosing a policy means translating a business need into the smallest set of path capabilities required to do the job and nothing more.

**Why it matters**

Most real Vault design work is not writing any policy, but writing the right one. The exam tests whether you choose the narrowest policy that still solves the stated requirement.

**How it works**

You identify the caller, the exact path, and the minimum operations required, then write the smallest ACL rule set that satisfies that workflow without broad wildcard access.

**Use case**

Choose a policy when designing access for a new service, a support team, an auditor, or a per-user self-service workflow.

**Real-world example**

An onboarding policy uses identity templating so each employee can read only `secret/data/users/<their-name>/*` instead of getting read access to the whole users mount.

**How the exam may ask it**

The best answer is usually the narrowest path and smallest capability set that still satisfies the requirement.

**Key concepts**

- Least privilege: grant only what's needed
- Template vars: {{identity.entity.id}}, {{identity.entity.name}}
- Combine fine-grained paths for role-based access

**Commands and patterns worth recognizing**

```text
path "secret/data/users/
  {{identity.entity.name}}/*" {
  capabilities = ["create","read",
    "update","delete","list"]
}
```

**Common traps**

- Over-broad globs are easy to write but violate least privilege.
- Identity templating is useful when each user needs access only to their own path.

**Remember**

- Write the smallest policy that still works.

#### 2e. Configure policies via UI and CLI

**What it is**

Vault policies can be created in the UI or written from the CLI, but the main exam idea is understanding the built-in root and default policies and how custom ACL policies are applied.

**Why it matters**

Writing a policy and actually using a policy are different steps. The exam wants you to understand both the tooling and the built-in policy behavior that comes with Vault.

**How it works**

You create an ACL policy through the UI or CLI, store it in Vault, and then issue or configure tokens, token roles, or auth mappings that attach that policy to a caller.

**Use case**

Configure policies when onboarding a team, creating a read-only audit role, or changing the default behavior that every issued token receives.

**Real-world example**

A security engineer writes an `audit-ro` policy, uploads it with `vault policy write`, and then gives that policy to audit users through their auth group mapping.

**How the exam may ask it**

Remember that root is built in and cannot be modified, while default exists on every token and can be changed.

**Key concepts**

- vault policy write <name> <file.hcl>
- Built-in root: full access, CANNOT be modified
- Built-in default: on every token, CAN be modified
- UI: Policies tab → Create ACL Policy

**Commands and patterns worth recognizing**

```text
vault policy write dev-ro ./dev-readonly.hcl
vault token create -policy=dev-ro
```

**Common traps**

- Creating a policy does not grant it automatically; a token still has to receive that policy.
- Do not confuse ACL policies with Sentinel or other Enterprise policy layers.

**Remember**

- Write policy, then attach policy.

### Official references for this domain

- [Policies docs](https://developer.hashicorp.com/vault/docs/concepts/policies)
- [Vault policy tutorial](https://developer.hashicorp.com/vault/tutorials/getting-started/getting-started-policies)

## Domain 3: Vault tokens

**Domain summary:** Tokens carry policies and TTLs. Service vs batch, root lifecycle, accessors, orphans.

**Domain focus:** Token questions revolve around lifecycle, persistence, renewability, inheritance, and knowing when a token type is appropriate for the workload.

### Mental model

- Tokens are the working identity presented on requests after authentication completes.
- Service tokens are full-featured lifecycle objects; batch tokens trade lifecycle features for lightweight scale.
- TTL, max TTL, orphaning, and parent-child relationships explain most token behavior.

### Domain traps

- Assuming every token has an accessor. Batch tokens do not.
- Thinking renewals can extend past max TTL forever.
- Treating root tokens as normal long-lived admin credentials.

### Objective breakdowns

#### 3a. Service vs batch tokens

**What it is**

Service tokens are persisted lifecycle objects with features such as accessors and renewal, while batch tokens are lightweight, non-persisted tokens optimized for scale.

**Why it matters**

Token type changes how the platform behaves at scale. If you pick the wrong token type, you either lose useful lifecycle controls or carry more overhead than the workload needs.

**How it works**

Service tokens are persisted server-side and support richer lifecycle operations such as renewal and accessors, while batch tokens are lightweight, self-contained, and optimized for short-lived high-volume use.

**Use case**

Use service tokens for long-running applications or agents, and batch tokens for high-frequency short-lived requests such as serverless or edge-style workloads.

**Real-world example**

A web API that runs all day uses a service token because it needs renewal and operational control, while a short serverless job uses a batch token to read one secret and exit.

**How the exam may ask it**

When the question is about high-volume short-lived workloads, batch tokens are usually the better fit.

**Key concepts**

- Service: persisted, renewable, accessor, child tokens (service token prefix)
- Batch: NOT persisted, NOT renewable, no accessor (hvb.)
- Batch = lightweight, encoded in token itself
- Use batch for high-volume short-lived workloads

**Commands and patterns worth recognizing**

```text
vault token create -type=service
vault token create -type=batch
```

**Common traps**

- Batch tokens are not renewable and do not have accessors.
- Service tokens support richer lifecycle behavior such as child tokens.

**Remember**

- Service = full lifecycle; batch = lightweight scale.

#### 3b. Root token lifecycle

**What it is**

Root tokens carry unrestricted access and should be treated as break-glass credentials for setup or emergencies, not day-to-day administration.

**Why it matters**

Root tokens are the sharpest credential in Vault. The exam expects you to treat them as emergency or bootstrap tools, not normal day-to-day administrator identity.

**How it works**

Vault can create a root token during initialization or through a generate-root workflow, and that token bypasses normal policy restrictions until you revoke it.

**Use case**

Use a root token only for first-time bootstrap, break-glass recovery, or exceptional administrative operations that cannot be delegated safely through normal policies.

**Real-world example**

An operator uses a root token once to enable the first auth methods and baseline policies in a new cluster, then revokes it and switches to scoped admin tokens for daily work.

**How the exam may ask it**

Questions often test whether you know root tokens should be revoked after the task is complete.

**Key concepts**

- Root policy = unlimited access
- ONLY for initial setup or emergencies
- MUST revoke immediately after use
- Regenerate: vault operator generate-root

**Commands and patterns worth recognizing**

```text
vault operator generate-root -init
vault token revoke <root-token>
```

**Common traps**

- Generate-root is an operational recovery workflow, not a normal login pattern.
- Keeping a root token around for convenience is the wrong operational habit.

**Remember**

- Root is temporary and exceptional.

#### 3c. Token accessors

**What it is**

A token accessor lets you inspect, revoke, or renew a service token without exposing the actual token value, which is safer for operations.

**Why it matters**

Accessors let operators manage service tokens safely without copying or exposing the token value itself, which is much better for support and incident response.

**How it works**

When a service token is created, Vault stores an accessor that can be used to look up, renew, or revoke that token while keeping the original token secret hidden.

**Use case**

Use accessors in audit investigations, support cases, or security responses when you need to manage a token seen in logs or telemetry without disclosing the token itself.

**Real-world example**

A SOC analyst finds a token accessor in audit logs tied to suspicious behavior and revokes the service token immediately without ever seeing the token value.

**How the exam may ask it**

If the prompt says 'manage a token without revealing the token itself,' think accessor.

**Key concepts**

- Unique accessor per service token
- Lookup/revoke/renew WITHOUT knowing token ID
- Batch tokens do NOT have accessors

**Commands and patterns worth recognizing**

```text
vault token lookup -accessor <acc>
vault token revoke -accessor <acc>
```

**Common traps**

- Accessors do not exist for batch tokens.
- An accessor is not a substitute token; it is an admin handle.

**Remember**

- Accessor = token handle without token secret.

#### 3d. Impact of TTL

**What it is**

TTL determines how long a token lives before expiring, while max TTL puts a hard ceiling on how far renewals can extend that lifetime.

**Why it matters**

TTL design directly affects both security and reliability. Tokens that are too long-lived increase standing risk, while tokens that are too short without renewal can break applications.

**How it works**

Vault issues a token with a TTL, optionally allows renewal, and enforces an absolute max TTL from creation time so renewals cannot continue forever.

**Use case**

Use short TTLs for CI or ephemeral jobs, and renewable or periodic tokens for long-running agents that can refresh before expiry.

**Real-world example**

A token starts with a one-hour TTL and is renewed every thirty minutes, but once it hits its 24-hour max TTL the workload must authenticate again to keep working.

**How the exam may ask it**

Expect questions that contrast renewable TTL with absolute max TTL from creation time.

**Key concepts**

- Default system TTL: 32 days
- Renew resets TTL but can't exceed max_ttl
- max_ttl counted from CREATION time
- Once max_ttl reached, token revoked regardless

**Commands and patterns worth recognizing**

```text
vault token create -ttl=1h -max-ttl=24h
vault token renew -increment=2h <token>
```

**Common traps**

- Renewal does not ignore max TTL.
- A renewable token can still become non-renewable once it reaches its ceiling.

**Remember**

- max_ttl is the hard stop.

#### 3e. Orphaned tokens

**What it is**

Normal tokens form parent-child trees, so revoking a parent also revokes its descendants. Orphan tokens have no parent and live independently.

**Why it matters**

Parent-child token relationships explain cascading revocation behavior. This matters in exam scenarios where one token creates another and the question asks what happens next.

**How it works**

Child tokens inherit a parent lineage, so revoking the parent revokes its descendants too. Orphan tokens are created without a parent chain and therefore survive parent revocation events.

**Use case**

Use orphan tokens when a downstream service should continue independently of the session or token that originally created it.

**Real-world example**

An operator creates an orphan token for a background process so revoking the operator's own token later does not accidentally shut down the service.

**How the exam may ask it**

If revocation should not cascade from a parent, the exam is pointing you toward orphan tokens.

**Key concepts**

- Normal tokens: parent-child trees
- Revoking parent revokes ALL children recursively
- Orphan tokens: no parent, independent lifecycle
- Auth method tokens are typically orphan

**Commands and patterns worth recognizing**

```text
vault token create -orphan -ttl=1h
```

**Common traps**

- Parent-child behavior matters for delegated token creation flows.
- Many auth-derived tokens are orphans because they start a fresh identity branch.

**Remember**

- Parent gone means children gone unless the token is orphaned.

#### 3f. Create tokens based on need

**What it is**

Vault can create tokens with different behaviors such as periodic renewal, limited uses, or properties defined through token roles to fit the workload's lifecycle.

**Why it matters**

Token creation settings let you align token behavior with workload risk, lifetime, and blast radius instead of handing out generic tokens everywhere.

**How it works**

Vault can create tokens with options such as periodic renewal, use limits, orphaning, and token roles so the issued token behaves in a predictable way for that workload.

**Use case**

Use periodic tokens for long-running services, use-limited tokens for one-time jobs, and token roles when many workloads should inherit the same token rules.

**Real-world example**

A database migration job gets a token with a 30-minute TTL and a small use limit, while a Vault Agent sidecar gets a periodic token that can renew as long as the pod is healthy.

**How the exam may ask it**

Look for the operational need: long-running service, temporary automation, or pre-defined token policy via a role.

**Key concepts**

- Periodic: renewable indefinitely (no max_ttl)
- Use-limit: expire after N uses
- Token roles: pre-define token properties
- Tokens inherit policies from creator (unless root)

**Commands and patterns worth recognizing**

```text
vault token create -period=24h
vault token create -use-limit=5
```

**Common traps**

- Periodic tokens are about repeatable renewal behavior, not unlimited privilege.
- Use-limit constrains how many requests a token can make, not how long it lasts.

**Remember**

- Create the token that matches the workload's lifespan and risk.

### Official references for this domain

- [Token concepts](https://developer.hashicorp.com/vault/docs/concepts/tokens)
- [Tokens tutorial](https://developer.hashicorp.com/vault/tutorials/getting-started/getting-started-tokens)

## Domain 4: Vault leases

**Domain summary:** Every dynamic secret has a lease. Renew to extend, revoke to invalidate. -prefix is your friend.

**Domain focus:** Leases are how Vault manages the lifetime of dynamic outputs. If the exam mentions renewing or revoking generated credentials, think lease ID.

### Mental model

- Dynamic secrets come with lease metadata because Vault expects them to expire or be revoked.
- Renew extends the lifetime of the same lease; revoke invalidates it.
- Prefix revocation is the bulk-operation tool for incident response and cleanup.

### Domain traps

- Confusing a lease renewal with generating a fresh secret.
- Forgetting that lease operations are constrained by max TTL and backend behavior.
- Not recognizing a lease path format in scenario questions.

### Objective breakdowns

#### 4a. Purpose of a lease ID

**What it is**

A lease ID is the handle Vault uses to track the lifetime of a dynamic secret or another leased object so that it can be renewed or revoked later.

**Why it matters**

A lease ID is the handle that makes dynamic secret lifecycle management possible. Without that handle, renewal and revocation would be much harder to reason about.

**How it works**

When a dynamic secret is issued, Vault returns the secret, its TTL, and a lease ID that points back to that leased object for later lifecycle actions.

**Use case**

Use lease IDs whenever an application or operator needs to renew or revoke dynamic credentials instead of waiting for them to expire naturally.

**Real-world example**

A service reads database credentials from the Database engine, stores the lease ID, and later renews that lease to keep the same temporary username alive while the service is still running.

**How the exam may ask it**

If a credential was generated dynamically, expect a lease ID to be involved.

**Key concepts**

- Every dynamic secret has an associated lease
- Format: <mount>/creds/<role>/<uuid>
- Lease expires → Vault revokes credentials
- Lease metadata is the handle Vault uses for renew and revoke workflows

**Commands and patterns worth recognizing**

```text
vault read database/creds/readonly
```

**Common traps**

- Lease IDs are not the same thing as secret values.
- Leases are about lifecycle management, not just lookup convenience.

**Remember**

- Lease ID is the lifecycle handle.

#### 4b. Renew leases

**What it is**

Renewing a lease extends the life of the same issued credential instead of creating a new one, as long as the backend and max TTL rules allow it.

**Why it matters**

Renewal keeps a workload stable without forcing a brand-new credential every time a short TTL approaches expiration, which is important for long-running jobs or connections.

**How it works**

The client asks Vault to renew the lease, and Vault extends the lifetime of the same leased object if the backend and TTL limits allow that extension.

**Use case**

Use lease renewal for long-running applications or scheduled jobs that are already using a dynamic credential and just need it to stay valid longer.

**Real-world example**

A reporting service renews its PostgreSQL lease every thirty minutes during a multi-hour export window instead of asking for a new database user midway through the job.

**How the exam may ask it**

If the goal is to keep the current credential valid longer, renew; if you need a new credential, issue a new secret.

**Key concepts**

- vault lease renew extends the TTL
- Cannot exceed max_ttl
- Renewal keeps SAME credentials valid
- If renewal fails, request new credentials

**Commands and patterns worth recognizing**

```text
vault lease renew <lease-id>
vault lease renew -increment=2h <id>
```

**Common traps**

- Renewal is still bounded by max TTL and backend policy.
- Not every lease is renewable.

**Remember**

- Renew keeps the same secret alive.

#### 4c. Revoke leases

**What it is**

Revoking a lease invalidates the leased secret before its TTL expires. Prefix revocation extends that to every lease under a path.

**Why it matters**

Revocation is how Vault cleans up before the normal expiration point, which is critical during incidents, application shutdowns, or operational cleanup.

**How it works**

Vault receives a revoke request for a specific lease or path prefix and then asks the backend to invalidate or delete the underlying leased credentials.

**Use case**

Use revoke or revoke-prefix when a workload is compromised, a role is being retired, or you need to clean up many generated credentials quickly.

**Real-world example**

After suspicious activity in the payments environment, an operator runs prefix revocation against the payments database role to invalidate every outstanding temporary database credential issued from that path.

**How the exam may ask it**

For emergency cleanup of many generated credentials, the exam often expects prefix revoke.

**Key concepts**

- vault lease revoke invalidates a specific lease
- -prefix revokes ALL leases under a path
- -force ignores backend errors
- Vault auto-revokes expired leases

**Commands and patterns worth recognizing**

```text
vault lease revoke <lease-id>
vault lease revoke -prefix database/creds/
```

**Common traps**

- Revocation is broader than deletion from storage; it triggers backend cleanup too.
- Force revoke ignores backend cleanup errors and should be understood as an operational fallback.

**Remember**

- Revoke ends the lease now, not later.

### Official references for this domain

- [Lease concepts](https://developer.hashicorp.com/vault/docs/concepts/lease)
- [Dynamic secrets tutorial](https://developer.hashicorp.com/vault/tutorials/getting-started/getting-started-dynamic-secrets)

## Domain 5: Secrets engines

**Domain summary:** Plugins mounted at paths. KV static vs Database/Cloud dynamic. Transit = encryption. Cubbyhole = per-token.

**Domain focus:** Secrets engines are one of the most scenario-heavy areas of the exam. You need to recognize which engine solves which problem and how pathing changes behavior.

### Mental model

- A secrets engine is a plugin mounted at a path.
- Static secrets are stored and retrieved; dynamic secrets are generated on demand and usually come with leases.
- Transit is a secrets engine even though it processes data rather than storing secret values.

### Domain traps

- Forgetting that disabling a mount deletes its stored data and associated leases.
- Missing the KV v2 API path difference: CLI hides /data, policies and direct API paths do not.
- Treating response wrapping as encryption at rest instead of one-time secret delivery.

### Objective breakdowns

#### 5a. Choose engine by use case

**What it is**

Choosing a secrets engine is about matching the problem to the engine's behavior: storage, dynamic credentials, encryption, certificates, SSH, or per-token delivery.

**Why it matters**

Each secrets engine solves a different class of problem. The exam repeatedly asks you to pick the feature that matches the secret lifecycle or delivery pattern in the scenario.

**How it works**

Vault mounts a backend plugin at a path, and that plugin exposes behavior such as storing values, generating credentials, issuing certificates, or performing cryptographic operations.

**Use case**

Use KV for static config, Database or cloud engines for dynamic credentials, Transit for encryption, PKI for certificates, SSH for signed access, and Cubbyhole for token-scoped delivery.

**Real-world example**

A team stores static feature flags in KV, generates one-hour PostgreSQL users from the Database engine, and uses Transit to encrypt customer identifiers before writing them to a database.

**How the exam may ask it**

Expect use-case matching: KV for static values, Database or cloud engines for dynamic credentials, Transit for cryptography, PKI for certificates.

**Key concepts**

- KV: static key-value | Database: dynamic DB creds
- AWS/Azure/GCP: dynamic cloud IAM | Transit: encryption
- PKI: certificates | SSH: signed keys | Cubbyhole: per-token

**Commands and patterns worth recognizing**

```text
vault secrets enable -path=myapp kv-v2
```

**Common traps**

- Transit is not a general storage engine.
- Cubbyhole is per-token and not a team-wide secret store.

**Remember**

- Pick the engine for the secret lifecycle you need.

#### 5b. Dynamic vs static secrets

**What it is**

Static secrets are stored values that remain until changed, while dynamic secrets are generated on demand, scoped per consumer, and designed to expire.

**Why it matters**

This contrast is one of Vault's core value propositions. If you understand why dynamic secrets are safer, you can answer many scenario questions quickly.

**How it works**

Static secrets are stored and reused until someone rotates them, while dynamic secrets are generated on demand for a specific consumer and usually expire automatically through a lease.

**Use case**

Use static secrets for values that truly cannot be generated dynamically, and use dynamic secrets when the target system can create short-lived credentials on request.

**Real-world example**

Instead of sharing one long-lived read-only database password among five apps, Vault issues each app instance its own temporary username and password that expire automatically.

**How the exam may ask it**

If the prompt emphasizes reduced blast radius or unique credentials per request, dynamic secrets are the answer.

**Key concepts**

- Static: stored, manually rotated (KV)
- Dynamic: on-demand with TTL, auto-revoked, UNIQUE per request
- Dynamic = reduced blast radius, full audit trail

**Commands and patterns worth recognizing**

```text
vault kv put secret/myapp db_pass=<db-password>
vault read database/creds/readonly
```

**Common traps**

- Dynamic does not just mean temporary; it usually also means generated specifically for a client or session.
- Static secrets often require manual rotation and broader sharing risk.

**Remember**

- Dynamic secrets are issued, not just stored.

#### 5c. Transit secrets engine

**What it is**

The Transit secrets engine provides encryption, decryption, signing, verification, hashing, HMAC, and rewrap operations while keeping key material inside Vault.

**Why it matters**

Transit lets teams centralize cryptographic control without distributing raw encryption keys into every application, which is a major real-world design advantage.

**How it works**

Applications send data to Transit endpoints for encryption, decryption, signing, verification, hashing, or HMAC operations, and Vault performs the cryptographic action while keeping keys inside Vault.

**Use case**

Use Transit when an app must encrypt or sign sensitive data but should not hold key material locally.

**Real-world example**

A checkout service encrypts payment reference data with the `transit/orders` key before storing it in its own database, so the service never has direct access to the key material.

**How the exam may ask it**

If the question is about encrypting data without handing keys to the application, think Transit.

**Key concepts**

- Encryption as a Service — keys NEVER leave Vault
- encrypt, decrypt, sign, verify, hash, hmac, rewrap
- Key rotation without re-encrypting data
- Data never stored — only processed

**Commands and patterns worth recognizing**

```text
vault write transit/encrypt/my-key \
  plaintext=$(echo -n 'secret' | base64)
```

**Common traps**

- Transit does not store the original plaintext for later retrieval.
- Applications must handle the ciphertext and any storage themselves.

**Remember**

- Transit keeps keys in Vault and crypto outside your app code.

#### 5d. Purpose of secrets engines

**What it is**

A secrets engine is a mounted backend plugin with its own paths and behavior. You can mount the same engine type multiple times at different paths for separation.

**Why it matters**

Understanding mount purpose helps you reason about isolation, API paths, policy design, and the operational impact of enabling or disabling engines.

**How it works**

A secrets engine is mounted at a path, and that mount becomes the API namespace where requests, policies, and lifecycle behavior for that engine live.

**Use case**

Use separate mounts when different teams or environments need their own isolation boundaries, retention rules, or policy scopes even if they use the same engine type.

**Real-world example**

A platform team mounts `secret-dev/` and `secret-prod/` separately so production access is governed by different policies and operational safeguards than development access.

**How the exam may ask it**

Mount path matters because policies and API routes reference the mount, not just the engine type.

**Key concepts**

- Plugins mounted at paths, isolated barrier view
- Can enable same engine multiple times at different paths
- Disabling DELETES all data and leases!

**Commands and patterns worth recognizing**

```text
vault secrets enable -path=team-a kv-v2
vault secrets list -detailed
```

**Common traps**

- Disabling a mount is destructive.
- Isolation comes from mount paths, configuration, and policy boundaries.

**Remember**

- Engine type tells you what it does; mount path tells you where it lives.

#### 5e. Response wrapping

**What it is**

Response wrapping packages a secret response into a short-lived, single-use wrapping token so the recipient can unwrap it later without the sender seeing the final secret in transit.

**Why it matters**

Response wrapping solves secure delivery, which is a different problem from storage or encryption. The exam uses it to test whether you understand one-time handoff patterns.

**How it works**

Vault takes a normal response, wraps it in a short-lived single-use wrapping token, and stores the wrapped value so the final recipient can unwrap it exactly once later.

**Use case**

Use response wrapping when one system or operator must hand off a secret to another system without exposing the final secret value over email, chat, or logs.

**Real-world example**

An operator wraps an AppRole `secret_id` and gives only the wrapping token to a deployment platform, which unwraps it at runtime and never receives the raw secret over a human channel.

**How the exam may ask it**

When secure delivery is the goal, response wrapping is usually the intended feature.

**Key concepts**

- Wraps response in single-use wrapping token
- Stored in cubbyhole, unwrap ONCE only
- Secure zero-knowledge secret delivery
- TTL controls delivery window

**Commands and patterns worth recognizing**

```text
vault kv get -wrap-ttl=120 secret/myapp
vault unwrap <wrapping-token>
```

**Common traps**

- The wrapping token is not the secret itself.
- Wrapping is about delivery and one-time retrieval, not long-term storage.

**Remember**

- Wrap once, unwrap once.

#### 5f. Value of dynamic secrets

**What it is**

Short-lived dynamic secrets reduce blast radius, simplify cleanup, and create better auditability because each consumer gets credentials with a bounded lifetime.

**Why it matters**

Dynamic secrets lower standing risk because credentials are short-lived, unique per consumer, and easier to revoke or audit than shared static credentials.

**How it works**

Vault generates the credential just in time, tracks it with a lease, and lets it expire or be revoked automatically instead of relying on manual rotation of a shared password.

**Use case**

Use dynamic secrets for database access, cloud IAM credentials, or any system where short-lived just-in-time access is safer than a shared long-lived password.

**Real-world example**

A contractor receives AWS credentials from Vault that expire after an hour, so the access disappears automatically when the task ends without any manual cleanup.

**How the exam may ask it**

If the question asks for the main value proposition of Vault, dynamic secrets are often part of the answer.

**Key concepts**

- Reduced blast radius, unique per consumer
- Auto cleanup, no stale credentials
- Better compliance and audit trail

**Common traps**

- The biggest gain is operational risk reduction, not just convenience.
- Dynamic secrets only help if applications are designed to handle renewal or re-issuance.

**Remember**

- Dynamic plus short-lived means less standing risk.

#### 5g. Enable engines via API, CLI, UI

**What it is**

Enabling a secrets engine mounts it at a path so clients can use it. The CLI, API, and UI all perform the same core action through different interfaces.

**Why it matters**

This objective tests the operational fact that secrets engines are mounts. If you understand mounting, you understand how paths, policies, and APIs line up.

**How it works**

Vault enables a secrets engine by mounting its backend type at a chosen path, after which requests to that mount use the engine's features and lifecycle behavior.

**Use case**

Enable engines when onboarding a new app, creating a separate environment mount, or introducing a new feature such as Transit or PKI into the platform.

**Real-world example**

A team enables `kv-v2` at `payments-config/` so their service can read static config values from a dedicated mount instead of sharing a generic global secrets path.

**How the exam may ask it**

The API route for mounting engines is under /v1/sys/mounts/<path>.

**Key concepts**

- CLI: vault secrets enable [-path=<p>] <type>
- API: POST /v1/sys/mounts/<path>
- Disable is DESTRUCTIVE

**Commands and patterns worth recognizing**

```text
curl -H "X-Vault-Token: ..." --request POST \
  --data '{"type":"kv"}' \
  $VAULT_ADDR/v1/sys/mounts/myapp
```

**Common traps**

- A mount path can differ from the engine type name.
- HashiCorp added the API to this objective in March 2025, so direct mount API knowledge now matters.

**Remember**

- Enable means mount the engine at a path.

#### 5h. Access secrets via CLI, API, UI

**What it is**

Accessing a secret depends on both the engine type and the interface you use. KV v2 is the classic exam example because CLI and UI hide some API path details.

**Why it matters**

Vault interfaces hide different amounts of detail, and KV v2 is where many people get tripped up. The exam uses this objective to test path accuracy, not just feature recognition.

**How it works**

The CLI can present friendly commands, but the underlying API still uses exact subpaths such as `/data/` and `/metadata/`, and policies must match those API paths rather than CLI shorthand.

**Use case**

Understand this objective whenever you move between manual CLI usage, raw API integrations, and policy authoring for KV v2 mounts.

**Real-world example**

A developer can run `vault kv get -mount=secret myapp/config`, but the policy still needs access to `secret/data/myapp/config` because that is the actual API path Vault evaluates.

**How the exam may ask it**

Expect questions about /data/ in KV v2 API paths and policies.

**Key concepts**

- CLI often uses mount + key syntax instead of raw API paths
- KV v2 API reads use <mount>/data/<key>
- KV v2 metadata operations use <mount>/metadata/<key>
- ACL policies still need the exact KV v2 API path structure

**Commands and patterns worth recognizing**

```text
vault kv get -mount=secret myapp/config
curl -H "X-Vault-Token: $VAULT_TOKEN" \
  $VAULT_ADDR/v1/secret/data/myapp/config
```

**Common traps**

- CLI convenience commands do not change how policies and raw API paths work.
- Versioned KV reads and writes use different API subpaths than KV v1.

**Remember**

- Friendly CLI commands still map to exact API paths.

### Official references for this domain

- [Secrets engines overview](https://developer.hashicorp.com/vault/docs/secrets)
- [KV v2 docs](https://developer.hashicorp.com/vault/docs/secrets/kv)

## Domain 6: Encryption as a Service

**Domain summary:** Transit encrypts/decrypts without storing data. Versioned keys, rotate + rewrap.

**Domain focus:** Encryption as a service is smaller in scope but high value on the exam because it tests whether you understand what Transit does and does not do.

### Mental model

- Transit keeps cryptographic key material in Vault and performs crypto operations for clients.
- Applications send base64 plaintext to encrypt and receive ciphertext that includes the key version.
- Rotation creates a new key version; rewrap upgrades ciphertext to the latest version.

### Domain traps

- Assuming Transit stores the original plaintext.
- Mixing up key rotation with data re-encryption or rewrap.
- Forgetting that decrypted output is base64 encoded and must be decoded by the client.

### Objective breakdowns

#### 6a. Encrypt/decrypt with Transit

**What it is**

Transit encrypt and decrypt operations require the client to base64 encode plaintext on the way in and decode plaintext on the way out after decryption.

**Why it matters**

Transit questions are usually workflow questions. You need to know the exact encrypt/decrypt flow well enough to spot wrong assumptions about storage or plaintext handling.

**How it works**

The client base64-encodes plaintext, sends it to Transit for encryption, receives versioned ciphertext, and later submits that ciphertext back to Transit for decryption before decoding the returned base64 output.

**Use case**

Use Transit encrypt and decrypt flows when your application must protect sensitive values before storing or transmitting them but should not own the encryption keys.

**Real-world example**

A billing service encrypts a customer identifier before writing it to a database row and only decrypts it through Transit when an authorized support workflow needs to display the value.

**How the exam may ask it**

Ciphertext values show the key version, which is important when rotation enters the picture.

**Key concepts**

- Plaintext MUST be base64 encoded
- Ciphertext: vault:v<version>:<base64>
- Decrypt returns base64 — decode for plaintext
- Data never stored, only processed

**Commands and patterns worth recognizing**

```text
vault secrets enable transit
vault write -f transit/keys/orders
vault write transit/encrypt/orders \
  plaintext=$(echo -n 'card-4242' | base64)
vault write transit/decrypt/orders \
  ciphertext=vault:v1:AbCdEf...
```

**Common traps**

- Sending raw plaintext instead of base64 is a common mental miss.
- Decrypt returns base64 content, not the final decoded text.

**Remember**

- Base64 in, ciphertext out, base64 back on decrypt.

#### 6b. Rotate encryption key

**What it is**

Rotating a Transit key creates a new key version for future operations while preserving the ability to decrypt older ciphertext. Rewrap updates ciphertext to the latest version.

**Why it matters**

Key rotation is a common compliance and security requirement, and Vault's ability to rotate keys without handing them to applications is a major design advantage.

**How it works**

Rotation creates a new key version for future operations, while old ciphertext remains decryptable. Rewrap can then move existing ciphertext to the latest version without exposing plaintext to the client.

**Use case**

Use key rotation for periodic crypto hygiene, regulatory requirements, or after concerns about key age, and use rewrap when you want stored ciphertext updated to the latest key version.

**Real-world example**

A security team rotates the `orders` Transit key annually and runs a background process that rewraps previously stored ciphertext so new and old records converge on the latest version.

**How the exam may ask it**

If the prompt asks how to move ciphertext to the latest key version without exposing plaintext, the answer is rewrap.

**Key concepts**

- Rotation creates new key version
- Old ciphertext still decryptable
- Re-wrap upgrades ciphertext to latest version
- min_decryption_version enforces minimum

**Commands and patterns worth recognizing**

```text
vault write -f transit/keys/orders/rotate
vault write transit/rewrap/orders \
  ciphertext=vault:v1:AbCdEf...
```

**Common traps**

- Rotate changes key versions; rewrap updates ciphertext; they are related but different actions.
- Old ciphertext does not become unreadable immediately after rotation.

**Remember**

- Rotate the key, rewrap the ciphertext.

### Official references for this domain

- [Transit docs](https://developer.hashicorp.com/vault/docs/secrets/transit)
- [Transit tutorial](https://developer.hashicorp.com/vault/tutorials/encryption-as-a-service/eaas-transit)

## Domain 7: Architecture fundamentals

**Domain summary:** Cryptographic barrier, seal/unseal, Shamir's Secret Sharing. Storage backend is untrusted.

**Domain focus:** Architecture fundamentals explain why Vault can trust untrusted storage. Expect conceptual questions about the barrier, seal state, and operational environment variables.

### Mental model

- Vault encrypts data before it ever reaches the storage backend.
- Seal and unseal exist because Vault must protect the root material that unlocks the barrier.
- Environment variables make CLI work easier, but some of them are operational shortcuts that should be used carefully.

### Domain traps

- Assuming the storage backend itself provides the core data protection instead of the cryptographic barrier.
- Mixing up unseal keys, recovery keys, and root tokens.
- Using VAULT_SKIP_VERIFY as if it were acceptable for production.

### Objective breakdowns

#### 7a. How Vault encrypts data

**What it is**

Vault encrypts data through its cryptographic barrier before writing anything to the storage backend, which is why the backend can be treated as untrusted.

**Why it matters**

Vault's trust model is one of the most important conceptual ideas on the exam. If you understand the barrier, storage-backend questions become much simpler.

**How it works**

Vault encrypts data before writing it to storage, using its internal key hierarchy so the backend stores ciphertext only and does not need to be trusted with plaintext data.

**Use case**

Rely on this model when choosing Raft, Consul, or another backend and when explaining why Vault still protects data even if the storage system is exposed.

**Real-world example**

An attacker who gets raw access to the underlying storage still sees encrypted blobs because Vault's barrier encrypted the data before it was written.

**How the exam may ask it**

If the question asks why storage can be untrusted, the barrier and key hierarchy are the reason.

**Key concepts**

- Cryptographic barrier encrypts ALL data
- Unseal or auto-unseal lets Vault recover the root key that unlocks the barrier
- Storage backend is UNTRUSTED, always encrypted

**Common traps**

- Do not assume backend encryption replaces Vault's own data protection model.
- The exam cares more about the barrier concept than implementation trivia.

**Remember**

- Vault encrypts before storage sees anything.

#### 7b. Seal and unseal Vault

**What it is**

Seal and unseal control access to the material required to decrypt Vault's protected data. Shamir splitting distributes unseal responsibility across multiple key shares.

**Why it matters**

Seal and unseal behavior is a classic exam trap because people mix up Shamir shares, auto-unseal behavior, and recovery keys.

**How it works**

A sealed Vault can access storage but cannot decrypt protected data until Shamir key shares or an auto-unseal mechanism restore access to the material needed to unlock the barrier.

**Use case**

Use Shamir when you want multi-person control over unseal operations, and use auto-unseal when you want startup automation through a trusted KMS or HSM integration.

**Real-world example**

A cluster restarts after maintenance and three out of five security officers submit their shares so Vault can unseal, while recovery keys remain reserved for specific recovery workflows rather than unseal itself.

**How the exam may ask it**

Auto-unseal changes operational flow, but recovery keys are still not unseal keys.

**Key concepts**

- Sealed = can't decrypt (only status + unseal work)
- Shamir: N shares, threshold T (default 5/3)
- Auto-unseal: external KMS (AWS, GCP, Azure, HSM)
- Recovery keys CANNOT unseal — only for quorum ops

**Commands and patterns worth recognizing**

```text
vault operator init -key-shares=5 -key-threshold=3
vault operator unseal <share>
vault operator seal
```

**Common traps**

- Recovery keys cannot unseal Vault.
- Rekey changes unseal shares; it does not rotate the data encryption key.

**Remember**

- Unseal keys open Vault; recovery keys do not.

#### 7c. Environment variables

**What it is**

Environment variables simplify Vault CLI usage by carrying connection, auth, namespace, and formatting settings for commands.

**Why it matters**

Environment variables are small but practical exam territory because they shape how operators and automation interact with Vault safely and consistently from the CLI.

**How it works**

The Vault CLI reads variables such as address, token, namespace, format, and TLS settings so commands can run without repeating the same connection details every time.

**Use case**

Use environment variables in local operator sessions, scripts, CI jobs, and troubleshooting workflows to point the CLI at the right cluster and namespace.

**Real-world example**

A CI pipeline exports `VAULT_ADDR` and `VAULT_NAMESPACE` before running `vault kv get`, while a support engineer sets `VAULT_FORMAT=json` so the output is easier to parse and inspect.

**How the exam may ask it**

Know the common variables such as VAULT_ADDR, VAULT_TOKEN, and VAULT_NAMESPACE.

**Key concepts**

- VAULT_ADDR, VAULT_TOKEN, VAULT_NAMESPACE
- VAULT_SKIP_VERIFY (dev only!), VAULT_FORMAT
- VAULT_CACERT, VAULT_CLIENT_CERT

**Commands and patterns worth recognizing**

```text
export VAULT_ADDR='https://vault:8200'
export VAULT_TOKEN='<vault-token>'
export VAULT_FORMAT='json'
```

**Common traps**

- VAULT_SKIP_VERIFY is a troubleshooting shortcut, not a production best practice.
- Environment variables improve ergonomics but do not replace sound credential handling.

**Remember**

- ADDR, TOKEN, NAMESPACE, FORMAT are the core ones.

### Official references for this domain

- [Seal and unseal docs](https://developer.hashicorp.com/vault/docs/concepts/seal)
- [CLI environment variables](https://developer.hashicorp.com/vault/docs/commands#environment-variables)

## Domain 8: Deployment architecture

**Domain summary:** Self-managed vs HCP. Integrated Storage (Raft) recommended. Rekey ≠ rotate.

**Domain focus:** Deployment architecture questions test operational judgment: where Vault runs, which storage mode to choose, and how availability or disaster recovery features differ.

### Mental model

- Self-managed Vault gives you full control and full operational responsibility; HCP Vault shifts infrastructure operations to HashiCorp.
- Integrated Storage using Raft is the recommended default for most new deployments.
- Replication answers two different needs: performance scale versus disaster recovery readiness.

### Domain traps

- Mixing up rekey and rotate.
- Treating performance replication as a backup strategy.
- Forgetting that DR secondaries cannot serve clients until promoted.

### Objective breakdowns

#### 8a. Self-managed vs HCP clusters

**What it is**

Cluster strategy questions ask you to balance operational control against operational burden. Self-managed clusters offer flexibility; HCP Vault reduces infrastructure overhead.

**Why it matters**

Deployment strategy questions are really about trade-offs between control and operational burden. The exam wants to know whether you can pick the right model for the organization's constraints.

**How it works**

Self-managed Vault means your team owns the cluster, upgrades, backup, networking, and HA operations, while HCP Vault shifts more of the infrastructure and lifecycle management to HashiCorp.

**Use case**

Use self-managed when you need deep infrastructure control, and consider HCP when you want faster adoption with less day-to-day platform maintenance.

**Real-world example**

A small platform team chooses HCP Vault Dedicated because it wants managed upgrades and backup workflows, while a regulated enterprise chooses self-managed Vault inside its own network boundary.

**How the exam may ask it**

If the scenario emphasizes managed operations, upgrades, and backups, HCP is usually the fit.

**Key concepts**

- Self-managed: full control, full responsibility
- HCP Vault Dedicated: HashiCorp manages infra
- HCP: auto-upgrades, backups, HA

**Common traps**

- Managed service does not mean no architecture decisions; it means fewer infrastructure tasks.
- Self-managed gives control, but also gives you patching, backup, and HA responsibility.

**Remember**

- More control usually means more operational work.

#### 8b. Storage backends

**What it is**

Storage backend choice determines how Vault persists data and participates in HA. For the associate exam, Integrated Storage with Raft is the recommended default to remember.

**Why it matters**

Storage backend choice is a basic architecture decision that shows up on the exam because it affects operational complexity, HA behavior, and recommended deployment patterns.

**How it works**

Vault uses one storage backend per cluster to persist encrypted data and coordinate cluster state, and Integrated Storage with Raft is the recommended modern default for most new deployments.

**Use case**

Use Raft for most new production clusters, and use other backends only when you have a specific operational reason that justifies the added complexity.

**Real-world example**

A new three-node production cluster uses Raft integrated storage so the team avoids managing a separate Consul tier just to persist Vault's encrypted state.

**How the exam may ask it**

When asked for the recommended modern default, answer Integrated Storage (Raft).

**Key concepts**

- Integrated Storage (Raft): RECOMMENDED
- External storage backends exist when you have a specific operational reason
- Only ONE storage backend is configured per cluster
- In-memory storage is for dev mode only

**Commands and patterns worth recognizing**

```text
storage "raft" {
  path = "/opt/vault/data"
  node_id = "vault-1"
}
```

**Common traps**

- There is only one storage backend per cluster.
- In-memory storage is for development only, not production HA.

**Remember**

- Raft is the recommended default.

#### 8c. Shamir and unsealing ops

**What it is**

Shamir secret sharing splits unseal capability across multiple holders, and related operations such as init, unseal, rekey, and rotate each solve different operational problems.

**Why it matters**

This objective bundles several similar-sounding operations, and the exam frequently checks whether you know exactly which one changes shares versus encryption keys.

**How it works**

Initialization creates the first shares and root token, unseal reconstructs access to the barrier, rekey changes the share arrangement or threshold, and rotate changes Vault's encryption key material.

**Use case**

Use rekey when personnel or threshold requirements change, and use rotate when you need new encryption key material without changing who holds the shares.

**Real-world example**

A security team moves from a five-share threshold model to a three-share model during an organizational change, so it performs rekey instead of rotate because the goal is new share ownership, not new data-encryption material.

**How the exam may ask it**

The exam loves the contrast between rekey and rotate.

**Key concepts**

- init: generate unseal keys + root token
- unseal: provide shares until threshold
- rekey: change shares/threshold/holders
- rotate: change encryption key (DEK)
- Rekey ≠ Rotate!

**Commands and patterns worth recognizing**

```text
vault operator init
vault operator rekey -init -key-shares=3 -key-threshold=2
vault operator rotate
```

**Common traps**

- Rekey changes unseal shares, threshold, or holders.
- Rotate changes Vault's encryption key material, not the human-held unseal shares.

**Remember**

- Rekey changes shares; rotate changes encryption keys.

#### 8d. DR and performance replication

**What it is**

Performance replication extends client-serving capacity and geographic reach, while disaster recovery replication maintains a standby copy intended for failover after a serious outage.

**Why it matters**

Replication questions are common because they test whether you understand the difference between scale and recovery instead of treating every secondary cluster as a generic backup.

**How it works**

Performance replication creates secondaries that can help serve clients and improve locality, while DR replication maintains a standby copy intended to be promoted only during failover or disaster events.

**Use case**

Use performance replication when client traffic needs regional scale, and use DR replication when the main goal is continuity after a severe outage.

**Real-world example**

A global company keeps a performance secondary in Europe for regional latency benefits and a separate DR secondary in another region that stays passive until a disaster recovery promotion is required.

**How the exam may ask it**

If the question is about backup-style failover, think DR; if it is about scale and locality for reads, think performance replication.

**Key concepts**

- Perf: scales reads, secondaries handle clients, own tokens
- DR: full mirror incl. tokens/leases, warm standby
- DR can't serve clients until promoted

**Common traps**

- DR secondaries do not serve client traffic until promoted.
- Performance replication is not a substitute for disaster recovery planning.

**Remember**

- Performance scales; DR recovers.

#### 8e. Differentiate self-managed vs HashiCorp-managed Vault

**What it is**

Differentiating self-managed and HashiCorp-managed Vault means understanding who owns upgrades, backups, HA operations, and surrounding infrastructure care.

**Why it matters**

This objective overlaps with cluster strategy, but it specifically tests whether you can answer in responsibility terms and not just feature terms.

**How it works**

You compare who owns patching, monitoring, storage, backup, upgrades, and routine platform maintenance in a self-managed cluster versus a HashiCorp-managed deployment.

**Use case**

Use this comparison when deciding whether your team wants to own the full Vault platform lifecycle or focus mainly on auth, policy, and application integration.

**Real-world example**

An enterprise keeps policy and app-integration design in-house but chooses HCP so HashiCorp handles more of the day-to-day infrastructure lifecycle around the Vault service itself.

**How the exam may ask it**

This objective overlaps with 8a, but here the question is usually about operational responsibility rather than cluster design strategy.

**Key concepts**

- Self-managed: you own upgrades, backups, HA behavior, and surrounding infrastructure
- HashiCorp-managed: HashiCorp operates more of the platform lifecycle for you
- Both models still require sound auth, policy, and app-integration design

**Common traps**

- Do not answer only in feature terms; answer in responsibility terms too.
- Managed clusters still require sound auth, policy, and app-integration design.

**Remember**

- The difference is as much about who operates it as where it runs.

### Official references for this domain

- [Storage docs](https://developer.hashicorp.com/vault/docs/configuration/storage)
- [Replication docs](https://developer.hashicorp.com/vault/docs/enterprise/replication)

## Domain 9: Access management architecture

**Domain summary:** Vault Agent and Vault Secrets Operator reduce app-side Vault logic through helper and controller patterns.

**Domain focus:** Access management architecture is about reducing the amount of Vault-specific logic your applications need to own, especially in Kubernetes environments.

### Mental model

- Vault Agent handles auto-auth, local caching, and template rendering close to the workload.
- Vault Secrets Operator syncs Vault-managed data into Kubernetes-native resources.
- Both tools exist to simplify secret consumption, but they fit different runtime and platform models.

### Domain traps

- Assuming VSO is just Vault Agent in a different form factor.
- Ignoring the sidecar versus Kubernetes-controller distinction.
- Forgetting that Agent can help apps avoid direct Vault API code.

### Objective breakdowns

#### 9a. Vault Agent

**What it is**

Vault Agent is a helper process that can authenticate automatically, cache secrets or tokens locally, and render templates so applications do not need to talk to Vault directly.

**Why it matters**

Vault Agent reduces the amount of Vault-specific code each application has to own, which makes integration simpler and safer for many workloads.

**How it works**

The agent authenticates automatically, can cache tokens or secrets locally, and renders templates so an application can consume files or local data instead of calling the Vault API directly.

**Use case**

Use Vault Agent for workloads that need sidecar-style auth, local caching, or templated secret files rather than direct SDK integration.

**Real-world example**

A legacy application that only knows how to read a config file runs with a Vault Agent sidecar that logs in, fetches database credentials, and renders them into a file the app already knows how to consume.

**How the exam may ask it**

In Kubernetes, the injector turns Vault Agent into a sidecar-driven secret delivery pattern.

**Key concepts**

- Sidecar daemon: Auto-Auth, Caching, Templating
- Apps don't need Vault SDK
- Agent Injector: K8s mutating webhook
- Templates re-render when secrets change

**Commands and patterns worth recognizing**

```text
vault agent -config=agent.hcl
auto_auth {
  method "approle" {
    config = {
      role_id_file_path = "/etc/vault/role-id"
    }
  }
}
```

**Common traps**

- Agent does not remove Vault; it reduces direct Vault logic inside the application.
- Auto-auth, caching, and templating are separate capabilities and may appear independently in questions.

**Remember**

- Agent makes apps less Vault-aware.

#### 9b. Vault Secrets Operator (VSO)

**What it is**

Vault Secrets Operator is a Kubernetes-native controller that syncs or transforms Vault-managed data into Kubernetes resources, giving clusters a platform-native integration model.

**Why it matters**

Vault Secrets Operator represents a different integration model from Vault Agent, and the exam uses that contrast to check whether you understand Kubernetes-native secret delivery patterns.

**How it works**

The operator runs as a Kubernetes controller that reconciles Vault-managed data into Kubernetes-native resources, letting cluster workloads consume those resources without per-pod sidecars.

**Use case**

Use VSO when platform teams want Kubernetes-native secret objects or controller-driven synchronization from Vault into the cluster.

**Real-world example**

A platform team defines a `VaultStaticSecret` that keeps a Kubernetes Secret in sync with data from Vault, so application deployments can keep using standard Kubernetes secret references.

**How the exam may ask it**

If the scenario wants Kubernetes-native secret objects without a sidecar in each pod, VSO is the likely answer.

**Key concepts**

- K8s-native controller: syncs Vault-managed data into Kubernetes resources
- No sidecar is required in every pod
- Secret transformation and encrypted client cache are optional platform features, not the basic mental model
- Think controller-style sync, not sidecar-style secret delivery

**Commands and patterns worth recognizing**

```text
apiVersion: secrets.hashicorp.com/v1beta1
kind: VaultStaticSecret
spec:
  mount: secret
  path: myapp/config
  destination:
    name: my-k8s-secret
```

**Common traps**

- VSO is not the same pattern as Vault Agent sidecars.
- The operator is about cluster-level reconciliation, not just a thin API proxy.

**Remember**

- VSO is the Kubernetes-native sync pattern.

### Official references for this domain

- [Vault Agent docs](https://developer.hashicorp.com/vault/docs/agent)
- [Vault Secrets Operator docs](https://developer.hashicorp.com/vault/docs/deploy/kubernetes/vso)

## Final revision strategy

### Three days before the exam

- Read this full document once from top to bottom.
- Review the mental model and domain traps for all nine domains.
- Rehearse the major comparison pairs until you can explain them without notes.

### One day before the exam

- Review one domain at a time in the app.
- Use flashcards for recall and quiz mode for scenario recognition.
- Revisit the objective examples for any area where you still confuse use cases.

### One hour before the exam

- Review auth method matching.
- Review policy path behavior and KV v2 `/data/` handling.
- Review service vs batch, rekey vs rotate, and performance vs DR replication.
- Review Transit basics and the meaning of leases.

## Suggested next step

After reading this document, open the study hub app and move through the sections in this order:

1. Guide
2. Mind Map
3. One domain at a time
4. Flashcards
5. Quiz

That sequence turns reading into recall, which is what will actually help you pass.
