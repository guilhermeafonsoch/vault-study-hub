export const OBJECTIVE_DEEP_DIVE = {
  "1a": {
    whyItMatters:
      "Vault cannot make an authorization decision until it knows who the caller is. Auth methods are the start of every secure request flow because they turn identity into a Vault token.",
    howItWorks:
      "A client presents identity material to an auth backend, the backend validates it against a trusted source, and Vault returns a token that carries policies and lifecycle settings for later requests.",
    useCase:
      "Use auth methods whenever a person, application, CI pipeline, or platform workload needs to establish identity before reading or generating secrets.",
    realWorldExample:
      "An engineer signs in with OIDC through the company identity provider, receives a Vault token, and then uses that token to read only the development secrets allowed by policy.",
  },
  "1b": {
    whyItMatters:
      "The wrong auth method creates avoidable risk or operational friction. The best choice usually reuses the identity system the caller already has instead of inventing a new shared secret.",
    howItWorks:
      "You map the caller type to its native identity source: interactive users to directory or SSO methods, and machine workloads to non-interactive platform identity such as AppRole, Kubernetes, or cloud IAM.",
    useCase:
      "Choose OIDC or LDAP for employees, AppRole for automation, Kubernetes auth for pods, and cloud auth for workloads that already have AWS, Azure, or GCP identity.",
    realWorldExample:
      "A GitHub Actions deployment job authenticates with AppRole to fetch short-lived database credentials before running a migration, while engineers use OIDC to access the UI and CLI.",
  },
  "1c": {
    whyItMatters:
      "Many exam scenarios are really classification questions. If you can quickly tell whether the caller is a human or a machine, the correct auth method becomes much easier to spot.",
    howItWorks:
      "Human auth methods assume interactive or directory-backed login flows, while system auth methods let a workload prove identity with platform credentials, certificates, or machine-specific secrets.",
    useCase:
      "Use human methods for operators, analysts, and developers; use system methods for services, batch jobs, containers, VMs, and serverless functions.",
    realWorldExample:
      "A Kubernetes pod should use the Kubernetes auth method with its service account token, not Userpass, because the pod is a workload and not a human user.",
  },
  "1d": {
    whyItMatters:
      "Vault Identity lets you keep a stable concept of who the caller really is even when that same person or service arrives through more than one auth method.",
    howItWorks:
      "Vault creates an entity as the canonical identity record, links auth-specific logins through aliases, and uses internal or external groups to attach shared policies to many identities at once.",
    useCase:
      "Use identities and groups when one user may log in through multiple systems or when many users or services need the same policy set without copying policy assignments one by one.",
    realWorldExample:
      "An engineer can log in through both LDAP and OIDC, but both aliases map to one Vault entity so audit records and group-based policies stay consistent.",
  },
  "1e": {
    whyItMatters:
      "The exam switches between CLI, API, and UI wording. You need to recognize that the interface changes, but the auth flow and token result stay the same.",
    howItWorks:
      "The CLI and UI are convenience layers on top of the same backend logic. Underneath, the auth mount receives credentials at its login endpoint and returns a client token when validation succeeds.",
    useCase:
      "Use the CLI for operator workflows, the API for automation and integrations, and the UI for interactive browsing or administrative tasks.",
    realWorldExample:
      "A script posts credentials to `/v1/auth/approle/login`, gets a `client_token`, and then uses that token for later API reads even though an operator might do the same job with `vault login`.",
  },
  "1f": {
    whyItMatters:
      "Mount paths and method settings affect how clients authenticate, how you document the platform, and which endpoints policies or integrations must reference.",
    howItWorks:
      "You enable an auth backend at a mount path, configure its method-specific settings, and optionally tune values such as TTL behavior so callers use the right login endpoint for that path.",
    useCase:
      "Configure auth methods when onboarding a new identity provider, splitting methods by audience, or giving one method a custom path for a specific business unit or environment.",
    realWorldExample:
      "A company enables LDAP at `corp-ldap/` and contractor LDAP at `partner-ldap/`, so the login paths are separate and each user group follows the correct auth flow.",
  },
  "2a": {
    whyItMatters:
      "Policies are the main reason Vault is useful after authentication. Without them, a token would either be powerless or dangerously overprivileged.",
    howItWorks:
      "Vault evaluates the ACL policies attached to the token on each request path and requested operation, denying by default unless a capability is explicitly granted.",
    useCase:
      "Use policies to separate environments, teams, and operational duties so callers can reach only the exact paths they need.",
    realWorldExample:
      "A payments service token can read `secret/data/payments/*` but cannot list or modify production infrastructure paths because its policy grants only the narrow read capability it needs.",
  },
  "2b": {
    whyItMatters:
      "Policy bugs often come from path mismatches, especially with KV v2. The exam uses this objective to see whether you understand how Vault actually evaluates paths.",
    howItWorks:
      "Vault compares the request against API-style path rules. A suffix glob with `*` broadens the tail of the path, while `+` matches exactly one path segment in the middle of a path.",
    useCase:
      "Use path syntax to scope access to folders, single app branches, or one layer of a hierarchy without giving away access to the entire mount.",
    realWorldExample:
      "A policy on `secret/data/+/db` can allow one application folder level for database settings, but it will not match deeper paths like `secret/data/prod/payments/db`.",
  },
  "2c": {
    whyItMatters:
      "Least privilege depends on translating business actions into the right capability set. This is one of the most common ways the exam checks whether you can think operationally.",
    howItWorks:
      "Each request maps to a capability such as read, list, create, update, delete, sudo, or deny. Vault grants the operation only if the token has the matching capability on the exact path.",
    useCase:
      "Use capabilities to let CI rotate secrets, let apps read only what they consume, and reserve destructive or privileged operations for a smaller set of operator tokens.",
    realWorldExample:
      "A deployment pipeline receives create and update on a KV path so it can rotate an API key, but it does not get delete because removing the secret is not part of its job.",
  },
  "2d": {
    whyItMatters:
      "Most real Vault design work is not writing any policy, but writing the right one. The exam tests whether you choose the narrowest policy that still solves the stated requirement.",
    howItWorks:
      "You identify the caller, the exact path, and the minimum operations required, then write the smallest ACL rule set that satisfies that workflow without broad wildcard access.",
    useCase:
      "Choose a policy when designing access for a new service, a support team, an auditor, or a per-user self-service workflow.",
    realWorldExample:
      "An onboarding policy uses identity templating so each employee can read only `secret/data/users/<their-name>/*` instead of getting read access to the whole users mount.",
  },
  "2e": {
    whyItMatters:
      "Writing a policy and actually using a policy are different steps. The exam wants you to understand both the tooling and the built-in policy behavior that comes with Vault.",
    howItWorks:
      "You create an ACL policy through the UI or CLI, store it in Vault, and then issue or configure tokens, token roles, or auth mappings that attach that policy to a caller.",
    useCase:
      "Configure policies when onboarding a team, creating a read-only audit role, or changing the default behavior that every issued token receives.",
    realWorldExample:
      "A security engineer writes an `audit-ro` policy, uploads it with `vault policy write`, and then gives that policy to audit users through their auth group mapping.",
  },
  "3a": {
    whyItMatters:
      "Token type changes how the platform behaves at scale. If you pick the wrong token type, you either lose useful lifecycle controls or carry more overhead than the workload needs.",
    howItWorks:
      "Service tokens are persisted server-side and support richer lifecycle operations such as renewal and accessors, while batch tokens are lightweight, self-contained, and optimized for short-lived high-volume use.",
    useCase:
      "Use service tokens for long-running applications or agents, and batch tokens for high-frequency short-lived requests such as serverless or edge-style workloads.",
    realWorldExample:
      "A web API that runs all day uses a service token because it needs renewal and operational control, while a short serverless job uses a batch token to read one secret and exit.",
  },
  "3b": {
    whyItMatters:
      "Root tokens are the sharpest credential in Vault. The exam expects you to treat them as emergency or bootstrap tools, not normal day-to-day administrator identity.",
    howItWorks:
      "Vault can create a root token during initialization or through a generate-root workflow, and that token bypasses normal policy restrictions until you revoke it.",
    useCase:
      "Use a root token only for first-time bootstrap, break-glass recovery, or exceptional administrative operations that cannot be delegated safely through normal policies.",
    realWorldExample:
      "An operator uses a root token once to enable the first auth methods and baseline policies in a new cluster, then revokes it and switches to scoped admin tokens for daily work.",
  },
  "3c": {
    whyItMatters:
      "Accessors let operators manage service tokens safely without copying or exposing the token value itself, which is much better for support and incident response.",
    howItWorks:
      "When a service token is created, Vault stores an accessor that can be used to look up, renew, or revoke that token while keeping the original token secret hidden.",
    useCase:
      "Use accessors in audit investigations, support cases, or security responses when you need to manage a token seen in logs or telemetry without disclosing the token itself.",
    realWorldExample:
      "A SOC analyst finds a token accessor in audit logs tied to suspicious behavior and revokes the service token immediately without ever seeing the token value.",
  },
  "3d": {
    whyItMatters:
      "TTL design directly affects both security and reliability. Tokens that are too long-lived increase standing risk, while tokens that are too short without renewal can break applications.",
    howItWorks:
      "Vault issues a token with a TTL, optionally allows renewal, and enforces an absolute max TTL from creation time so renewals cannot continue forever.",
    useCase:
      "Use short TTLs for CI or ephemeral jobs, and renewable or periodic tokens for long-running agents that can refresh before expiry.",
    realWorldExample:
      "A token starts with a one-hour TTL and is renewed every thirty minutes, but once it hits its 24-hour max TTL the workload must authenticate again to keep working.",
  },
  "3e": {
    whyItMatters:
      "Parent-child token relationships explain cascading revocation behavior. This matters in exam scenarios where one token creates another and the question asks what happens next.",
    howItWorks:
      "Child tokens inherit a parent lineage, so revoking the parent revokes its descendants too. Orphan tokens are created without a parent chain and therefore survive parent revocation events.",
    useCase:
      "Use orphan tokens when a downstream service should continue independently of the session or token that originally created it.",
    realWorldExample:
      "An operator creates an orphan token for a background process so revoking the operator's own token later does not accidentally shut down the service.",
  },
  "3f": {
    whyItMatters:
      "Token creation settings let you align token behavior with workload risk, lifetime, and blast radius instead of handing out generic tokens everywhere.",
    howItWorks:
      "Vault can create tokens with options such as periodic renewal, use limits, orphaning, and token roles so the issued token behaves in a predictable way for that workload.",
    useCase:
      "Use periodic tokens for long-running services, use-limited tokens for one-time jobs, and token roles when many workloads should inherit the same token rules.",
    realWorldExample:
      "A database migration job gets a token with a 30-minute TTL and a small use limit, while a Vault Agent sidecar gets a periodic token that can renew as long as the pod is healthy.",
  },
  "4a": {
    whyItMatters:
      "A lease ID is the handle that makes dynamic secret lifecycle management possible. Without that handle, renewal and revocation would be much harder to reason about.",
    howItWorks:
      "When a dynamic secret is issued, Vault returns the secret, its TTL, and a lease ID that points back to that leased object for later lifecycle actions.",
    useCase:
      "Use lease IDs whenever an application or operator needs to renew or revoke dynamic credentials instead of waiting for them to expire naturally.",
    realWorldExample:
      "A service reads database credentials from the Database engine, stores the lease ID, and later renews that lease to keep the same temporary username alive while the service is still running.",
  },
  "4b": {
    whyItMatters:
      "Renewal keeps a workload stable without forcing a brand-new credential every time a short TTL approaches expiration, which is important for long-running jobs or connections.",
    howItWorks:
      "The client asks Vault to renew the lease, and Vault extends the lifetime of the same leased object if the backend and TTL limits allow that extension.",
    useCase:
      "Use lease renewal for long-running applications or scheduled jobs that are already using a dynamic credential and just need it to stay valid longer.",
    realWorldExample:
      "A reporting service renews its PostgreSQL lease every thirty minutes during a multi-hour export window instead of asking for a new database user midway through the job.",
  },
  "4c": {
    whyItMatters:
      "Revocation is how Vault cleans up before the normal expiration point, which is critical during incidents, application shutdowns, or operational cleanup.",
    howItWorks:
      "Vault receives a revoke request for a specific lease or path prefix and then asks the backend to invalidate or delete the underlying leased credentials.",
    useCase:
      "Use revoke or revoke-prefix when a workload is compromised, a role is being retired, or you need to clean up many generated credentials quickly.",
    realWorldExample:
      "After suspicious activity in the payments environment, an operator runs prefix revocation against the payments database role to invalidate every outstanding temporary database credential issued from that path.",
  },
  "5a": {
    whyItMatters:
      "Each secrets engine solves a different class of problem. The exam repeatedly asks you to pick the feature that matches the secret lifecycle or delivery pattern in the scenario.",
    howItWorks:
      "Vault mounts a backend plugin at a path, and that plugin exposes behavior such as storing values, generating credentials, issuing certificates, or performing cryptographic operations.",
    useCase:
      "Use KV for static config, Database or cloud engines for dynamic credentials, Transit for encryption, PKI for certificates, SSH for signed access, and Cubbyhole for token-scoped delivery.",
    realWorldExample:
      "A team stores static feature flags in KV, generates one-hour PostgreSQL users from the Database engine, and uses Transit to encrypt customer identifiers before writing them to a database.",
  },
  "5b": {
    whyItMatters:
      "This contrast is one of Vault's core value propositions. If you understand why dynamic secrets are safer, you can answer many scenario questions quickly.",
    howItWorks:
      "Static secrets are stored and reused until someone rotates them, while dynamic secrets are generated on demand for a specific consumer and usually expire automatically through a lease.",
    useCase:
      "Use static secrets for values that truly cannot be generated dynamically, and use dynamic secrets when the target system can create short-lived credentials on request.",
    realWorldExample:
      "Instead of sharing one long-lived read-only database password among five apps, Vault issues each app instance its own temporary username and password that expire automatically.",
  },
  "5c": {
    whyItMatters:
      "Transit lets teams centralize cryptographic control without distributing raw encryption keys into every application, which is a major real-world design advantage.",
    howItWorks:
      "Applications send data to Transit endpoints for encryption, decryption, signing, verification, hashing, or HMAC operations, and Vault performs the cryptographic action while keeping keys inside Vault.",
    useCase:
      "Use Transit when an app must encrypt or sign sensitive data but should not hold key material locally.",
    realWorldExample:
      "A checkout service encrypts payment reference data with the `transit/orders` key before storing it in its own database, so the service never has direct access to the key material.",
  },
  "5d": {
    whyItMatters:
      "Understanding mount purpose helps you reason about isolation, API paths, policy design, and the operational impact of enabling or disabling engines.",
    howItWorks:
      "A secrets engine is mounted at a path, and that mount becomes the API namespace where requests, policies, and lifecycle behavior for that engine live.",
    useCase:
      "Use separate mounts when different teams or environments need their own isolation boundaries, retention rules, or policy scopes even if they use the same engine type.",
    realWorldExample:
      "A platform team mounts `secret-dev/` and `secret-prod/` separately so production access is governed by different policies and operational safeguards than development access.",
  },
  "5e": {
    whyItMatters:
      "Response wrapping solves secure delivery, which is a different problem from storage or encryption. The exam uses it to test whether you understand one-time handoff patterns.",
    howItWorks:
      "Vault takes a normal response, wraps it in a short-lived single-use wrapping token, and stores the wrapped value so the final recipient can unwrap it exactly once later.",
    useCase:
      "Use response wrapping when one system or operator must hand off a secret to another system without exposing the final secret value over email, chat, or logs.",
    realWorldExample:
      "An operator wraps an AppRole `secret_id` and gives only the wrapping token to a deployment platform, which unwraps it at runtime and never receives the raw secret over a human channel.",
  },
  "5f": {
    whyItMatters:
      "Dynamic secrets lower standing risk because credentials are short-lived, unique per consumer, and easier to revoke or audit than shared static credentials.",
    howItWorks:
      "Vault generates the credential just in time, tracks it with a lease, and lets it expire or be revoked automatically instead of relying on manual rotation of a shared password.",
    useCase:
      "Use dynamic secrets for database access, cloud IAM credentials, or any system where short-lived just-in-time access is safer than a shared long-lived password.",
    realWorldExample:
      "A contractor receives AWS credentials from Vault that expire after an hour, so the access disappears automatically when the task ends without any manual cleanup.",
  },
  "5g": {
    whyItMatters:
      "This objective tests the operational fact that secrets engines are mounts. If you understand mounting, you understand how paths, policies, and APIs line up.",
    howItWorks:
      "Vault enables a secrets engine by mounting its backend type at a chosen path, after which requests to that mount use the engine's features and lifecycle behavior.",
    useCase:
      "Enable engines when onboarding a new app, creating a separate environment mount, or introducing a new feature such as Transit or PKI into the platform.",
    realWorldExample:
      "A team enables `kv-v2` at `payments-config/` so their service can read static config values from a dedicated mount instead of sharing a generic global secrets path.",
  },
  "5h": {
    whyItMatters:
      "Vault interfaces hide different amounts of detail, and KV v2 is where many people get tripped up. The exam uses this objective to test path accuracy, not just feature recognition.",
    howItWorks:
      "The CLI can present friendly commands, but the underlying API still uses exact subpaths such as `/data/` and `/metadata/`, and policies must match those API paths rather than CLI shorthand.",
    useCase:
      "Understand this objective whenever you move between manual CLI usage, raw API integrations, and policy authoring for KV v2 mounts.",
    realWorldExample:
      "A developer can run `vault kv get -mount=secret myapp/config`, but the policy still needs access to `secret/data/myapp/config` because that is the actual API path Vault evaluates.",
  },
  "6a": {
    whyItMatters:
      "Transit questions are usually workflow questions. You need to know the exact encrypt/decrypt flow well enough to spot wrong assumptions about storage or plaintext handling.",
    howItWorks:
      "The client base64-encodes plaintext, sends it to Transit for encryption, receives versioned ciphertext, and later submits that ciphertext back to Transit for decryption before decoding the returned base64 output.",
    useCase:
      "Use Transit encrypt and decrypt flows when your application must protect sensitive values before storing or transmitting them but should not own the encryption keys.",
    realWorldExample:
      "A billing service encrypts a customer identifier before writing it to a database row and only decrypts it through Transit when an authorized support workflow needs to display the value.",
  },
  "6b": {
    whyItMatters:
      "Key rotation is a common compliance and security requirement, and Vault's ability to rotate keys without handing them to applications is a major design advantage.",
    howItWorks:
      "Rotation creates a new key version for future operations, while old ciphertext remains decryptable. Rewrap can then move existing ciphertext to the latest version without exposing plaintext to the client.",
    useCase:
      "Use key rotation for periodic crypto hygiene, regulatory requirements, or after concerns about key age, and use rewrap when you want stored ciphertext updated to the latest key version.",
    realWorldExample:
      "A security team rotates the `orders` Transit key annually and runs a background process that rewraps previously stored ciphertext so new and old records converge on the latest version.",
  },
  "7a": {
    whyItMatters:
      "Vault's trust model is one of the most important conceptual ideas on the exam. If you understand the barrier, storage-backend questions become much simpler.",
    howItWorks:
      "Vault encrypts data before writing it to storage, using its internal key hierarchy so the backend stores ciphertext only and does not need to be trusted with plaintext data.",
    useCase:
      "Rely on this model when choosing Raft, Consul, or another backend and when explaining why Vault still protects data even if the storage system is exposed.",
    realWorldExample:
      "An attacker who gets raw access to the underlying storage still sees encrypted blobs because Vault's barrier encrypted the data before it was written.",
  },
  "7b": {
    whyItMatters:
      "Seal and unseal behavior is a classic exam trap because people mix up Shamir shares, auto-unseal behavior, and recovery keys.",
    howItWorks:
      "A sealed Vault can access storage but cannot decrypt protected data until Shamir key shares or an auto-unseal mechanism restore access to the material needed to unlock the barrier.",
    useCase:
      "Use Shamir when you want multi-person control over unseal operations, and use auto-unseal when you want startup automation through a trusted KMS or HSM integration.",
    realWorldExample:
      "A cluster restarts after maintenance and three out of five security officers submit their shares so Vault can unseal, while recovery keys remain reserved for specific recovery workflows rather than unseal itself.",
  },
  "7c": {
    whyItMatters:
      "Environment variables are small but practical exam territory because they shape how operators and automation interact with Vault safely and consistently from the CLI.",
    howItWorks:
      "The Vault CLI reads variables such as address, token, namespace, format, and TLS settings so commands can run without repeating the same connection details every time.",
    useCase:
      "Use environment variables in local operator sessions, scripts, CI jobs, and troubleshooting workflows to point the CLI at the right cluster and namespace.",
    realWorldExample:
      "A CI pipeline exports `VAULT_ADDR` and `VAULT_NAMESPACE` before running `vault kv get`, while a support engineer sets `VAULT_FORMAT=json` so the output is easier to parse and inspect.",
  },
  "8a": {
    whyItMatters:
      "Deployment strategy questions are really about trade-offs between control and operational burden. The exam wants to know whether you can pick the right model for the organization's constraints.",
    howItWorks:
      "Self-managed Vault means your team owns the cluster, upgrades, backup, networking, and HA operations, while HCP Vault shifts more of the infrastructure and lifecycle management to HashiCorp.",
    useCase:
      "Use self-managed when you need deep infrastructure control, and consider HCP when you want faster adoption with less day-to-day platform maintenance.",
    realWorldExample:
      "A small platform team chooses HCP Vault Dedicated because it wants managed upgrades and backup workflows, while a regulated enterprise chooses self-managed Vault inside its own network boundary.",
  },
  "8b": {
    whyItMatters:
      "Storage backend choice is a basic architecture decision that shows up on the exam because it affects operational complexity, HA behavior, and recommended deployment patterns.",
    howItWorks:
      "Vault uses one storage backend per cluster to persist encrypted data and coordinate cluster state, and Integrated Storage with Raft is the recommended modern default for most new deployments.",
    useCase:
      "Use Raft for most new production clusters, and use other backends only when you have a specific operational reason that justifies the added complexity.",
    realWorldExample:
      "A new three-node production cluster uses Raft integrated storage so the team avoids managing a separate Consul tier just to persist Vault's encrypted state.",
  },
  "8c": {
    whyItMatters:
      "This objective bundles several similar-sounding operations, and the exam frequently checks whether you know exactly which one changes shares versus encryption keys.",
    howItWorks:
      "Initialization creates the first shares and root token, unseal reconstructs access to the barrier, rekey changes the share arrangement or threshold, and rotate changes Vault's encryption key material.",
    useCase:
      "Use rekey when personnel or threshold requirements change, and use rotate when you need new encryption key material without changing who holds the shares.",
    realWorldExample:
      "A security team moves from a five-share threshold model to a three-share model during an organizational change, so it performs rekey instead of rotate because the goal is new share ownership, not new data-encryption material.",
  },
  "8d": {
    whyItMatters:
      "Replication questions are common because they test whether you understand the difference between scale and recovery instead of treating every secondary cluster as a generic backup.",
    howItWorks:
      "Performance replication creates secondaries that can help serve clients and improve locality, while DR replication maintains a standby copy intended to be promoted only during failover or disaster events.",
    useCase:
      "Use performance replication when client traffic needs regional scale, and use DR replication when the main goal is continuity after a severe outage.",
    realWorldExample:
      "A global company keeps a performance secondary in Europe for regional latency benefits and a separate DR secondary in another region that stays passive until a disaster recovery promotion is required.",
  },
  "8e": {
    whyItMatters:
      "This objective overlaps with cluster strategy, but it specifically tests whether you can answer in responsibility terms and not just feature terms.",
    howItWorks:
      "You compare who owns patching, monitoring, storage, backup, upgrades, and routine platform maintenance in a self-managed cluster versus a HashiCorp-managed deployment.",
    useCase:
      "Use this comparison when deciding whether your team wants to own the full Vault platform lifecycle or focus mainly on auth, policy, and application integration.",
    realWorldExample:
      "An enterprise keeps policy and app-integration design in-house but chooses HCP so HashiCorp handles more of the day-to-day infrastructure lifecycle around the Vault service itself.",
  },
  "9a": {
    whyItMatters:
      "Vault Agent reduces the amount of Vault-specific code each application has to own, which makes integration simpler and safer for many workloads.",
    howItWorks:
      "The agent authenticates automatically, can cache tokens or secrets locally, and renders templates so an application can consume files or local data instead of calling the Vault API directly.",
    useCase:
      "Use Vault Agent for workloads that need sidecar-style auth, local caching, or templated secret files rather than direct SDK integration.",
    realWorldExample:
      "A legacy application that only knows how to read a config file runs with a Vault Agent sidecar that logs in, fetches database credentials, and renders them into a file the app already knows how to consume.",
  },
  "9b": {
    whyItMatters:
      "Vault Secrets Operator represents a different integration model from Vault Agent, and the exam uses that contrast to check whether you understand Kubernetes-native secret delivery patterns.",
    howItWorks:
      "The operator runs as a Kubernetes controller that reconciles Vault-managed data into Kubernetes-native resources, letting cluster workloads consume those resources without per-pod sidecars.",
    useCase:
      "Use VSO when platform teams want Kubernetes-native secret objects or controller-driven synchronization from Vault into the cluster.",
    realWorldExample:
      "A platform team defines a `VaultStaticSecret` that keeps a Kubernetes Secret in sync with data from Vault, so application deployments can keep using standard Kubernetes secret references.",
  },
};
