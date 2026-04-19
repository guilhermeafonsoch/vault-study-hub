import { QUIZ_DOCS, validateQuestionSupport, withQuestionSupport } from "./quizSupport.js";

const q = (obj, question, choices, answer, explain, extra = {}) => withQuestionSupport({
  obj,
  question,
  choices,
  answer,
  explain,
  ...extra,
});

const D1 = [
  q("1a", "What is the direct result of any successful Vault authentication?", ["A policy file is created", "A client token is issued", "A lease is revoked", "A secrets engine is mounted"], 1, "All successful auth flows end with Vault issuing a client token for later requests."),
  q("1a", "What is the main purpose of a Vault auth method?", ["To encrypt the storage backend", "To verify identity before access is granted", "To mount a secrets engine", "To rotate Transit keys"], 1, "Auth methods prove who the caller is before Vault issues a token."),
  q("1a", "Which auth method starts enabled on every Vault instance?", ["OIDC auth", "LDAP auth", "Token auth", "AppRole auth"], 2, "Token auth is built in and enabled by default on Vault instances."),
  q("1a", "After Vault validates a caller through an auth method, what happens next?", ["Vault deletes all prior tokens", "Vault generates a token tied to policies", "Vault creates a DR secondary", "Vault disables the auth mount"], 1, "The validated identity receives a token, and that token carries policies for future requests."),
  q("1b", "A CI/CD pipeline needs non-interactive authentication without a browser flow. Which auth method is the best fit?", ["Userpass", "OIDC", "AppRole", "GitHub"], 2, "AppRole is the classic machine-oriented method for automation and CI/CD."),
  q("1b", "A Kubernetes pod should authenticate using its service account identity. Which auth method fits best?", ["LDAP", "Kubernetes", "Userpass", "Token"], 1, "Kubernetes auth uses the pod's service account identity and is the standard answer for this scenario."),
  q("1b", "A human operator wants SSO with an external identity provider and a browser-based login. Which method best fits?", ["OIDC", "AppRole", "AWS", "TLS certificates"], 0, "OIDC is the common browser-based SSO answer for human users."),
  q("1b", "A workload running on AWS should authenticate with its cloud-native identity instead of a shared secret. Which method best matches?", ["Userpass", "AWS auth", "GitHub auth", "Token auth"], 1, "AWS auth reuses the workload's AWS identity instead of forcing a separate static credential."),
  q("1b", "Two services already communicate with mutual TLS and want Vault to trust the presented client certificate. Which auth method best fits?", ["TLS certificates auth", "OIDC auth", "LDAP auth", "Response wrapping"], 0, "TLS certificate auth is the match when the service already has a trusted client certificate."),
  q("1c", "Which auth method is always considered machine-oriented in the exam context?", ["OIDC", "GitHub", "AppRole", "LDAP"], 2, "AppRole is designed for automated systems and is not a human login method."),
  q("1c", "Which pair is most clearly human-centric?", ["LDAP and GitHub", "Kubernetes and AppRole", "AWS and TLS certificates", "AppRole and OIDC"], 0, "LDAP and GitHub are human-oriented methods in the associate exam framing."),
  q("1c", "How should Kubernetes auth usually be classified?", ["Human auth", "System or machine auth", "Recovery auth", "Root-only auth"], 1, "Kubernetes auth is used by workloads and is therefore machine-oriented."),
  q("1d", "In Vault Identity, what does an entity alias represent?", ["A root token accessor", "A mapping from one auth backend identity to an entity", "A lease path", "A storage backend role"], 1, "Aliases connect an identity coming from a specific auth method to the canonical entity."),
  q("1d", "Why does Vault Identity use entities?", ["To ensure one actor can be represented consistently across auth methods", "To replace policies entirely", "To remove the need for tokens", "To manage storage replication"], 0, "Entities let Vault understand that one person or service may arrive through multiple auth methods."),
  q("1d", "What is true about external groups in Vault Identity?", ["They are always created by the Transit engine", "They are mapped from an outside provider such as LDAP", "They are only available in dev mode", "They replace entities"], 1, "External groups are associated with identities coming from outside providers."),
  q("1e", "What is the common API path pattern to log in through an auth method?", ["`/v1/sys/mounts/<path>`", "`/v1/auth/<mount>/login/<identity>`", "`/v1/identity/entity/<name>`", "`/v1/sys/policy/<name>`"], 1, "Login endpoints commonly live under `/v1/auth/<mount>/login/...`."),
  q("1e", "Which CLI pattern best matches a human login with userpass auth?", ["`vault token revoke -method=userpass username=alice`", "`vault login -method=userpass username=alice`", "`vault auth enable userpass username=alice`", "`vault lease renew userpass/alice`"], 1, "The CLI login flow uses `vault login -method=userpass username=...`."),
  q("1e", "Which statement about UI, CLI, and API authentication is correct?", ["Only the UI can return a Vault token", "Only the API can authenticate against custom mount paths", "All three interfaces authenticate against the same backends and return a token on success", "The CLI bypasses auth methods and creates policies directly"], 2, "The interface changes, but the same auth backend flow occurs and returns a token."),
  q("1f", "Which API path enables an auth method at the custom path `corp-ldap`?", ["`/v1/auth/corp-ldap/login`", "`/v1/sys/auth/corp-ldap`", "`/v1/sys/mounts/corp-ldap`", "`/v1/identity/auth/corp-ldap`"], 1, "Auth methods are enabled under `sys/auth`, not `sys/mounts`."),
  q("1f", "If you enable LDAP auth at the custom mount path `corp-ldap`, what changes?", ["Vault stops issuing tokens", "The login and config endpoints use that mount path", "Policies must move to `sys/mounts`", "The method becomes machine-only"], 1, "The mount path changes the auth method's API and CLI target path."),
  q("1f", "Which CLI command enables Kubernetes auth at the path `my-k8s`?", ["`vault auth enable kubernetes -path=my-k8s`", "`vault auth enable -path=my-k8s kubernetes`", "`vault secrets enable -path=my-k8s kubernetes`", "`vault login -path=my-k8s kubernetes`"], 1, "Auth methods use `vault auth enable -path=<path> <type>`."),
  q("1f", "Which command tunes an auth mount instead of enabling it?", ["`vault auth list userpass/`", "`vault auth tune -max-lease-ttl=24h userpass/`", "`vault token tune userpass/`", "`vault secrets tune userpass/`"], 1, "Tuning auth settings uses `vault auth tune`, not `vault secrets tune`."),
];

const D2 = [
  q("2a", "What is Vault's default behavior when no policy grants access to a path?", ["Allow read-only access", "Deny access", "Prompt the UI user", "Allow with an audit warning"], 1, "Vault is deny by default: no matching policy means no access."),
  q("2a", "What is the primary role of Vault ACL policies?", ["To authenticate users", "To authorize operations on paths", "To rotate unseal keys", "To enable replication"], 1, "Policies define what authenticated callers can do on specific API paths."),
  q("2a", "If a token has multiple policies, how are permissions generally combined?", ["Intersection only", "Union of allowed capabilities, unless an explicit deny exists", "The first policy wins", "The default policy overrides all others"], 1, "Vault combines policy permissions additively except when explicit deny is present."),
  q("2a", "What object do ACL policies attach to during normal use?", ["Storage backends", "Tokens", "Secrets engines", "Auth mount paths only"], 1, "Policies are attached to tokens, and the token is what authorizes requests."),
  q("2b", "In a Vault policy path, what does `+` match?", ["Zero or more path segments", "Exactly one path segment", "Any suffix anywhere in the path", "Only a literal plus sign"], 1, "`+` matches exactly one path segment."),
  q("2b", "What is the role of `*` in a Vault policy path?", ["It is used as a suffix glob", "It matches exactly one segment", "It disables path checking", "It means the path is root protected"], 0, "In policy syntax, `*` is used as a suffix glob rather than a free-form wildcard everywhere."),
  q("2b", "Vault policy paths should usually be written against which form?", ["CLI shorthand paths", "UI menu labels", "Exact API paths", "Mount descriptions"], 2, "Policies speak API path language, which is especially important for KV v2."),
  q("2b", "A policy should allow reads from a KV v2 secret stored at `secret/myapp/config`. Which path pattern is correct?", ["`secret/myapp/config`", "`secret/data/myapp/config`", "`secret/kv/myapp/config`", "`kv/data/secret/myapp/config`"], 1, "KV v2 policies need the API path, which includes `/data/`."),
  q("2b", "How does case affect Vault policy path matching?", ["Paths are case-insensitive", "Only mount names are case-sensitive", "Paths are case-sensitive", "Only Enterprise namespaces are case-sensitive"], 2, "Vault policy path matching is case-sensitive."),
  q("2c", "What happens when one policy grants read and another policy explicitly denies the same path?", ["Read is allowed", "The request is denied", "Vault prompts for MFA", "The default policy decides"], 1, "Explicit deny overrides every other capability."),
  q("2c", "What is the purpose of the `sudo` capability?", ["To make any token a root token", "To access root-protected endpoints", "To renew leases indefinitely", "To bypass audit devices"], 1, "`sudo` is for root-protected endpoints such as certain `sys/` operations."),
  q("2c", "Which capability most directly maps to reading secret data?", ["`create`", "`list`", "`read`", "`sudo`"], 2, "`read` is the capability tied to retrieving data from a path."),
  q("2c", "Which capability do you need to list keys on a supported path?", ["`list`", "`read`", "`update`", "`deny`"], 0, "Listing paths uses the `list` capability."),
  q("2d", "A team only needs to read secrets under `secret/data/payments/*`. Which policy choice best follows least privilege?", ['`path "secret/*" { capabilities = ["read","update"] }`', '`path "secret/data/payments/*" { capabilities = ["read"] }`', '`path "secret/data/*" { capabilities = ["read","update","delete"] }`', '`path "sys/*" { capabilities = ["sudo"] }`'], 1, "The narrowest path with only the required capability is the least-privilege answer."),
  q("2d", "What is the best guiding principle when choosing between two valid Vault policies?", ["Pick the policy with the most wildcards", "Pick the smallest policy that still satisfies the need", "Always grant `sudo` for future-proofing", "Always include the `root` policy"], 1, "Least privilege means granting only the minimum path scope and capabilities that the workload needs."),
  q("2d", "Why would you use identity templating in a Vault policy path?", ["To change the storage backend dynamically", "To scope access per entity or username", "To make tokens renewable", "To create unseal keys"], 1, "Identity templating is useful for per-user or per-entity path scoping."),
  q("2d", "Which policy is most likely over-broad for a developer who only needs app config reads?", ['`path "secret/data/app/*" { capabilities = ["read"] }`', '`path "secret/data/app/config/*" { capabilities = ["read"] }`', '`path "secret/data/*" { capabilities = ["create","read","update","delete","list"] }`', '`path "secret/metadata/app/config/*" { capabilities = ["list"] }`'], 2, "Granting CRUD and broad path scope is much wider than the stated requirement."),
  q("2e", "Which built-in Vault policy cannot be modified?", ["`default`", "`root`", "`sudo`", "`token`"], 1, "`root` is built in and immutable."),
  q("2e", "Which built-in Vault policy can be customized?", ["`root` only", "`default` only", "Both `root` and `default`", "Neither"], 1, "`default` exists on every token and can be changed."),
  q("2e", "What does creating a policy NOT do by itself?", ["Write the ACL definition to Vault", "Attach that policy to an existing token automatically", "Make it visible in the UI", "Allow future tokens to use it"], 1, "Policies must still be attached to tokens before they have any effect."),
  q("2e", "Which CLI command writes a policy into Vault?", ["`vault policy enable dev-ro ./dev.hcl`", "`vault policy write dev-ro ./dev.hcl`", "`vault write policy/dev-ro ./dev.hcl`", "`vault auth write dev-ro ./dev.hcl`"], 1, "The CLI command is `vault policy write <name> <file>`."),
  q("2e", "Which answer correctly identifies Vault's built-in ACL policies?", ["`root` and `default`", "`admin` and `default`", "`root` and `sudo`", "`token` and `operator`"], 0, "Vault ships with the built-in `root` and `default` policies."),
];

const D3 = [
  q("3a", "Which statement about service tokens is true?", ["They are not persisted", "They have no accessor", "They support richer lifecycle features such as accessors and child tokens", "They cannot be renewed"], 2, "Service tokens are the full-featured lifecycle token type."),
  q("3a", "Which statement about batch tokens is true?", ["They are persisted in storage", "They are renewable", "They have accessors", "They are lightweight and not persisted"], 3, "Batch tokens trade lifecycle features for scale and are not persisted."),
  q("3a", "Which token type best fits a very high-volume, short-lived workload?", ["Root token", "Batch token", "Periodic service token", "Default token"], 1, "Batch tokens are designed for lightweight, high-volume use cases."),
  q("3a", "What feature is missing from batch tokens?", ["Policies", "TTL", "Token accessor", "Association with auth methods"], 2, "Batch tokens do not have token accessors."),
  q("3b", "How should root tokens normally be treated in production?", ["As day-to-day admin tokens", "As break-glass credentials for setup or emergencies", "As batch tokens for performance", "As the default token for every operator"], 1, "Root tokens are for exceptional use, not routine administration."),
  q("3b", "What is the recommended action after using a root token for an emergency or setup task?", ["Convert it to a periodic token", "Revoke it", "Attach the `default` policy", "Store it in the app config"], 1, "The guidance is to revoke root tokens once they are no longer needed."),
  q("3b", "Which command can be used later to generate a new root token with quorum approval?", ["`vault token create -root`", "`vault operator generate-root`", "`vault auth enable root`", "`vault operator rotate`"], 1, "A fresh root token can be generated through the `generate-root` workflow."),
  q("3b", "What makes a root token different from ordinary tokens?", ["It bypasses leases only", "It is the only token that can mount Transit", "It carries unrestricted access through the `root` policy", "It never appears in audit logs"], 2, "Root tokens have the `root` policy and therefore unrestricted access."),
  q("3c", "What is the main benefit of a token accessor?", ["It can replace the token in API calls", "It lets operators inspect or revoke a service token without revealing the token value", "It creates child tokens automatically", "It turns a batch token into a service token"], 1, "Accessors are administrative handles that avoid exposing the token ID."),
  q("3c", "Which token type does NOT have an accessor?", ["Periodic service token", "Root token", "Batch token", "Orphan service token"], 2, "Batch tokens do not support accessors."),
  q("3c", "A security team wants to revoke a service token but does not want to handle the token value directly. What should they use?", ["A lease ID", "The token accessor", "The token's max TTL", "The entity alias"], 1, "Accessors are specifically for this safer administrative workflow."),
  q("3d", "What does a token's `max_ttl` represent?", ["The number of child tokens it can create", "A hard ceiling on lifetime from creation time", "The minimum time before it can be renewed", "The number of policies attached"], 1, "`max_ttl` is the absolute upper limit on token lifetime."),
  q("3d", "What happens when a renewable token reaches its `max_ttl`?", ["It can keep renewing forever", "It stops being renewable and eventually expires", "It becomes a batch token", "Its accessor is deleted but the token remains"], 1, "Renewals cannot push the token beyond the absolute ceiling."),
  q("3d", "A token is created at 10:00 with `ttl=1h` and `max_ttl=4h`. What is the latest possible expiration time?", ["11:00", "13:00", "14:00", "Renewals make the end time unlimited"], 2, "The absolute latest time is 10:00 plus 4 hours, which is 14:00."),
  q("3d", "What is true about token renewal?", ["It can ignore `max_ttl` if the token is periodic", "It always issues a brand-new token", "It extends the current token's TTL, but not past its ceiling", "It removes the token's policies"], 2, "Renewal extends the lifetime of the existing token within configured limits."),
  q("3e", "What happens to child tokens when their parent token is revoked?", ["They stay valid until manual cleanup", "They are renewed automatically", "They are revoked recursively", "They become root tokens"], 2, "Parent revocation cascades to child tokens and their leases."),
  q("3e", "Why would you create an orphan token?", ["To prevent policies from applying", "To avoid parent-child revocation cascading from the creator", "To disable renewal", "To mount an auth method"], 1, "Orphan tokens have no parent, so parent revocation does not revoke them."),
  q("3e", "Which statement about orphan tokens is correct?", ["They cannot have policies", "They are independent of parent token revocation", "They are always batch tokens", "They never expire"], 1, "The defining property of an orphan token is that it has no parent in the revocation tree."),
  q("3f", "Which token type best fits a long-running service that must renew on a regular cadence?", ["Batch token", "Use-limit token", "Periodic token", "Root token"], 2, "Periodic tokens are designed for renewable, service-style workflows."),
  q("3f", "What is the purpose of a use-limit token?", ["To guarantee unlimited renewal", "To expire after a fixed number of uses", "To become orphaned automatically", "To create more child tokens"], 1, "Use-limit tokens constrain how many times the token can be used."),
  q("3f", "What is the main value of a token role?", ["It stores the token in Cubbyhole", "It predefines token creation properties", "It disables policy inheritance", "It forces DR replication"], 1, "Token roles let operators standardize token properties for future token creation."),
  q("3f", "Which choice best matches a token created to fit workload lifespan and risk?", ["Always create root tokens for services", "Always prefer batch tokens", "Choose token settings such as periodic or use-limit based on the need", "Disable TTL for all machine tokens"], 2, "The right token shape depends on workload duration, renewal needs, and risk tolerance."),
];

const D4 = [
  q("4a", "What is a lease ID primarily used for in Vault?", ["To identify the storage backend", "To renew or revoke a leased secret later", "To sign Transit ciphertext", "To mount an auth method"], 1, "Lease IDs are lifecycle handles for dynamic outputs."),
  q("4a", "Which type of Vault output most commonly comes with a lease ID?", ["A dynamically generated credential", "A static README file", "A policy definition", "A root token accessor"], 0, "Dynamic secrets are the classic leased outputs in Vault."),
  q("4a", "Which statement best describes a lease ID?", ["It is the secret value itself", "It is a lifecycle handle attached to a leased object", "It is the same as a token accessor", "It is the name of a policy"], 1, "A lease ID is used to manage the lifetime of a leased secret."),
  q("4a", "When Vault issues dynamic database credentials, what does the client receive besides the credential data?", ["A recovery key", "A lease ID and lease metadata", "A policy file", "A storage backend snapshot"], 1, "Dynamic credentials include lease information so their lifetime can be managed."),
  q("4a", "What question should make you think immediately of a lease ID on the exam?", ["How to change the UI theme", "How to manage the lifetime of a generated secret", "How to create a root token", "How to enable OIDC"], 1, "Lease IDs are about renewal and revocation of dynamic outputs."),
  q("4a", "What does the expiration manager register when a secrets engine returns a leased secret?", ["An entity alias", "A lease ID", "A namespace", "A root policy"], 1, "Vault's core attaches and tracks a lease ID for leased outputs."),
  q("4a", "Which of the following is NOT the main purpose of a lease ID?", ["Tracking secret lifetime", "Supporting renew and revoke workflows", "Acting as the credential itself", "Helping Vault manage expiration"], 2, "A lease ID is separate from the actual secret value."),
  q("4b", "What happens when you successfully renew a lease?", ["Vault automatically rotates the secret to a new value", "Vault extends the lifetime of the same leased secret", "Vault disables the secrets engine", "Vault promotes a DR secondary"], 1, "Lease renewal keeps the current leased value alive longer instead of minting a new one."),
  q("4b", "Which command renews a lease for longer if the backend allows it?", ["`vault token renew <lease-id>`", "`vault lease renew <lease-id>`", "`vault auth renew <lease-id>`", "`vault secrets renew <lease-id>`"], 1, "Lease renewal uses the `vault lease renew` command."),
  q("4b", "What still limits a lease even if renewal is allowed?", ["The UI session timeout only", "Its configured max TTL and backend behavior", "The number of policies on the token", "The number of auth methods enabled"], 1, "Lease renewal is still bounded by the backend's rules and max TTL."),
  q("4b", "What should you do if a renewable dynamic credential can no longer be renewed because it hit its ceiling?", ["Expect renewal to work again later", "Request a new credential", "Convert the lease to a token accessor", "Promote performance replication"], 1, "Once the lease can no longer be renewed, the usual answer is to request a fresh secret."),
  q("4b", "Which statement about lease renewal is correct?", ["It always creates a fresh username and password", "It extends the lifetime of the same lease", "It bypasses max TTL", "It only works for root tokens"], 1, "Renewal extends the existing lease instead of creating a new secret."),
  q("4b", "Which exam prompt is most likely asking for renewal?", ["Keep the same dynamic credential valid for longer", "Delete the entire mount", "Change the unseal threshold", "Attach a new policy to a token"], 0, "Renewal is the answer when the goal is to keep the current leased secret alive."),
  q("4b", "What is true about renewable leases in Vault?", ["Every lease is renewable", "Renewable leases do not need a lease ID", "Some leases are renewable, but not all", "Renewing a lease removes the need for a token"], 2, "Not every leased object is renewable."),
  q("4c", "What does lease revocation do?", ["It extends a lease", "It invalidates the leased secret before TTL expiry", "It converts the secret into a static KV entry", "It enables a secrets engine"], 1, "Revoking a lease ends the leased secret immediately."),
  q("4c", "Which command revokes every lease under a given prefix?", ["`vault lease revoke -prefix <path>`", "`vault lease renew -prefix <path>`", "`vault auth revoke -prefix <path>`", "`vault token revoke -prefix <path>`"], 0, "Prefix revocation is the bulk cleanup tool for leased secrets."),
  q("4c", "When is prefix lease revocation most useful?", ["When enabling a new auth method", "During incident response or cleanup of many generated credentials", "When tuning UI session length", "When rotating Transit keys"], 1, "Prefix revoke is valuable when many dynamic secrets must be invalidated quickly."),
  q("4c", "What does the `-force` option do during lease revocation?", ["It turns revocation into renewal", "It ignores backend cleanup errors", "It changes a lease into an orphan token", "It makes revocation permanent across clusters"], 1, "`-force` is the fallback when Vault should revoke even if backend cleanup fails."),
  q("4c", "What normally happens when a lease reaches its TTL and is not renewed?", ["Vault auto-revokes it", "Vault turns it into a root token", "Vault mounts a new backend", "Vault creates an entity alias"], 0, "Expired leases are automatically revoked by Vault."),
  q("4c", "What is the difference between renewing and revoking a lease?", ["Renew revokes the mount, revoke changes the TTL", "Renew extends lifetime, revoke ends it", "There is no difference", "Renew is for auth methods only"], 1, "Renew and revoke are opposite lifecycle actions."),
  q("4c", "Which command targets one specific lease instead of every lease under a prefix?", ["`vault lease revoke <lease-id>`", "`vault lease revoke -prefix <lease-id>`", "`vault token revoke <lease-id>`", "`vault auth revoke <lease-id>`"], 0, "Direct revocation of a single lease uses its exact lease ID."),
  q("4c", "Why is revocation more than just deleting a record from storage?", ["It also triggers backend-side cleanup or invalidation", "It automatically creates a new secret", "It disables all policies on the token", "It rewrites the audit log"], 0, "Revocation is a lifecycle action that asks the backend to invalidate what it issued."),
];

const D5 = [
  q("5a", "Which secrets engine is the best fit when an application needs on-demand database credentials?", ["KV", "Database", "Transit", "Cubbyhole"], 1, "The Database secrets engine is the classic dynamic database credential answer."),
  q("5a", "Which secrets engine best fits certificate issuance and PKI-style workloads?", ["Transit", "PKI", "Cubbyhole", "Identity"], 1, "The PKI engine is designed for certificate issuance workflows."),
  q("5a", "Which secrets engine is scoped per token and commonly used with response wrapping workflows?", ["Cubbyhole", "Database", "AWS", "LDAP"], 0, "Cubbyhole stores data that is private to the current token."),
  q("5b", "What is the main difference between static and dynamic secrets?", ["Dynamic secrets are always stored in KV", "Static secrets are generated on demand while dynamic secrets are copied from files", "Dynamic secrets are issued on demand and designed to expire", "Static secrets always require OIDC"], 2, "Dynamic secrets are generated for a consumer and are usually leased and time-bound."),
  q("5b", "What is a key security benefit of dynamic secrets?", ["They eliminate the need for authentication", "They reduce blast radius through unique, short-lived credentials", "They make root tokens safer", "They disable audit logging"], 1, "Each consumer gets distinct, time-bound credentials instead of sharing one long-lived secret."),
  q("5b", "Which statement best matches a static secret?", ["It is normally manually rotated and stored until changed", "It always has a lease ID", "It only works with the Transit engine", "It cannot be read through the CLI"], 0, "Static secrets are stored values that remain until explicitly updated or rotated."),
  q("5c", "What is true about the Transit secrets engine?", ["It stores encrypted plaintext inside Vault for later retrieval", "It processes cryptographic operations without storing your original data", "It can only sign, not encrypt", "It requires an HSM for all use cases"], 1, "Transit is encryption as a service, not a general secret store for your plaintext."),
  q("5c", "Why do teams use Transit?", ["To distribute raw encryption keys to every app", "To let applications perform crypto without the keys leaving Vault", "To replace policies with certificates", "To disable leases"], 1, "Transit keeps key material in Vault while applications send data to be processed."),
  q("5c", "Which capability is commonly associated with Transit besides encrypt and decrypt?", ["Performance replication only", "Sign and verify", "Entity aliasing", "Storage backend snapshots"], 1, "Transit also supports signing, verification, hashing, HMAC, and rewrap."),
  q("5d", "What is a Vault secrets engine in architectural terms?", ["A policy attached to a token", "A mounted backend plugin with its own paths and behavior", "An auth method for workloads", "A recovery key store"], 1, "Secrets engines are plugins mounted at paths."),
  q("5d", "What happens when you disable a secrets engine mount?", ["Only new writes are blocked; old data stays", "Vault keeps the data and waits for re-enable", "Data and leases under that mount are deleted", "Nothing until the cluster restarts"], 2, "Disabling a mount is destructive for its stored data and associated leases."),
  q("5d", "Why might an operator mount the same secrets engine type at two different paths?", ["Because one cluster requires two storage backends", "To separate use cases, configuration, or policy boundaries", "To bypass Vault Identity", "To turn dynamic secrets into static ones"], 1, "The same engine can be mounted multiple times for separation and isolation."),
  q("5e", "What is the main purpose of response wrapping?", ["Encrypting the physical storage backend", "Secure one-time delivery of a secret response with a short-lived wrapping token", "Creating a root token", "Enabling DR replication"], 1, "Response wrapping is about secure delivery, not at-rest encryption."),
  q("5e", "What is true about a wrapping token?", ["It is the final secret value itself", "It can normally be unwrapped many times", "It is a short-lived token used for one-time retrieval", "It automatically becomes a service token"], 2, "The wrapping token is single-use and short-lived."),
  q("5f", "Why are short-lived dynamic secrets so valuable operationally?", ["They remove the need for policies", "They reduce standing credential risk and stale shared secrets", "They make the UI faster", "They prevent audit logs from growing"], 1, "The big win is less long-lived credential exposure and easier cleanup."),
  q("5f", "Which statement best describes the value of dynamic secrets?", ["Their biggest benefit is lower CPU usage in Vault", "They improve risk posture by expiring automatically and being unique per consumer", "They are only useful for Transit", "They stop tokens from expiring"], 1, "Dynamic secrets improve security through uniqueness, TTLs, and easier revocation."),
  q("5g", "Which API path enables a secrets engine at the mount path `payments`?", ["`/v1/sys/auth/payments`", "`/v1/sys/mounts/payments`", "`/v1/secret/payments/enable`", "`/v1/payments/mounts`"], 1, "Secrets engines are enabled under `sys/mounts`."),
  q("5g", "Which CLI command enables a KV v2 engine at the mount path `myapp`?", ["`vault secrets enable -path=myapp kv-v2`", "`vault auth enable -path=myapp kv-v2`", "`vault kv enable myapp`", "`vault write sys/auth/myapp type=kv-v2`"], 0, "The CLI uses `vault secrets enable -path=<path> <type>`."),
  q("5g", "What is the key API difference between enabling an auth method and a secrets engine?", ["There is no difference", "Auth methods use `sys/auth`, secrets engines use `sys/mounts`", "Secrets engines use `sys/auth`, auth methods use `identity/`", "Secrets engines can only be enabled from the UI"], 1, "Auth methods and secrets engines have different system API mount paths."),
  q("5h", "For KV v2, what API path reads secret data stored under `secret/myapp/config`?", ["`/v1/secret/myapp/config`", "`/v1/secret/data/myapp/config`", "`/v1/secret/metadata/myapp/config`", "`/v1/sys/mounts/secret/myapp/config`"], 1, "KV v2 data reads use the `/data/` API path."),
  q("5h", "Which path should a policy reference to allow reading a KV v2 secret value?", ["`secret/myapp/config`", "`secret/data/myapp/config`", "`secret/kv/myapp/config`", "`secret/list/myapp/config`"], 1, "Policies must reference the exact KV v2 API path, which includes `/data/`."),
  q("5h", "Which KV v2 API area is used for metadata-style operations such as listing versioned metadata?", ["`<mount>/data/<key>`", "`<mount>/transit/<key>`", "`<mount>/metadata/<key>`", "`<mount>/sys/<key>`"], 2, "KV v2 metadata operations use the `/metadata/` portion of the API."),
];

const D6 = [
  q("6a", "What must happen to plaintext before calling `transit/encrypt/<key>`?", ["It must be hex encoded", "It must be gzip compressed", "It must be base64 encoded", "It must be wrapped in JSON Web Token format"], 2, "Transit expects plaintext to be base64 encoded on input."),
  q("6a", "What does Vault return after a successful Transit encrypt operation?", ["The original plaintext stored in KV", "Ciphertext that includes the key version", "A lease ID only", "A root token accessor"], 1, "Transit returns ciphertext, and its format includes the key version."),
  q("6a", "When you decrypt with Transit, what format is the returned plaintext in?", ["Raw bytes automatically written to disk", "Hex", "Base64", "YAML"], 2, "Transit decrypt returns base64 plaintext, which the client then decodes."),
  q("6a", "What is the best description of Transit?", ["A static secret store", "Encryption as a service with key material kept inside Vault", "A DR replication backend", "A policy authoring tool"], 1, "Transit lets clients perform crypto without exporting the keys."),
  q("6a", "Which statement about data storage and Transit is correct?", ["Transit stores the caller's plaintext for later reads", "Transit stores only the keys and processes the data", "Transit stores all ciphertext in the barrier automatically", "Transit disables audit logs"], 1, "Transit does not store your original data; your application keeps its own ciphertext."),
  q("6a", "Which command path creates a Transit key named `orders`?", ["`vault write -f transit/keys/orders`", "`vault secrets enable orders`", "`vault write transit/encrypt/orders`", "`vault policy write orders`"], 0, "Creating a Transit key uses the `transit/keys/<name>` path."),
  q("6a", "Which use case best fits Transit?", ["Shared static API keys for developers", "Encrypting application data without distributing raw encryption keys", "Creating external groups", "Choosing a storage backend"], 1, "Transit is for crypto operations with centrally managed keys."),
  q("6a", "What is a correct mental model for Transit keys?", ["They are copied into every client container", "They remain inside Vault while clients send data to be processed", "They are stored in Cubbyhole", "They only exist during unseal"], 1, "The whole point of Transit is to keep key material inside Vault."),
  q("6a", "Which operation is supported by Transit in addition to encrypt and decrypt?", ["Database credential rotation", "Sign and verify", "OIDC login", "Raft snapshot creation"], 1, "Transit also supports signing, verification, hashing, HMAC, and related operations."),
  q("6a", "If an application uses Transit to encrypt data, where is the resulting ciphertext usually stored?", ["Only inside Vault's system backend", "In the application's chosen storage location", "In the auth method mount", "In the unseal key shares"], 1, "Transit processes the data, but the client is responsible for storing the ciphertext."),
  q("6a", "Which statement best explains why Transit is different from KV?", ["Transit manages browser SSO", "Transit performs cryptographic operations rather than storing secret values for later retrieval", "Transit is only for Enterprise", "Transit cannot be mounted more than once"], 1, "Transit is a crypto service, whereas KV is a storage-oriented secrets engine."),
  q("6b", "What does rotating a Transit key do?", ["Deletes all prior ciphertext", "Creates a new key version for future operations", "Changes the storage backend", "Generates unseal key shares"], 1, "Rotation creates a new key version while preserving old versions for decryption."),
  q("6b", "What happens to ciphertext created with an older Transit key version after you rotate the key?", ["It becomes unreadable immediately", "It remains decryptable", "It becomes a lease", "It is automatically re-encrypted in place"], 1, "Older ciphertext remains decryptable after rotation."),
  q("6b", "Which operation upgrades existing ciphertext to the latest key version without exposing plaintext to the client?", ["Renew", "Rewrap", "Seal", "Unseal"], 1, "Rewrap re-encrypts the ciphertext under the newer key version without returning plaintext."),
  q("6b", "What is the difference between rotate and rewrap?", ["Rotate changes the client token; rewrap changes the auth method", "Rotate creates a new key version; rewrap updates existing ciphertext to that newer version", "Rotate enables Transit; rewrap disables it", "There is no difference"], 1, "They are related but distinct: one changes key version, the other updates ciphertext."),
  q("6b", "Which action affects future encrypt operations by causing new ciphertext to use a later key version?", ["`vault write -f transit/keys/<key>/rotate`", "`vault lease renew`", "`vault auth tune`", "`vault operator rekey`"], 0, "Rotation affects subsequent encrypt operations by changing the current key version."),
  q("6b", "What is true about rewrap?", ["It requires the client to send plaintext again", "It upgrades ciphertext without returning plaintext", "It deletes previous key versions", "It is only for batch tokens"], 1, "Rewrap avoids exposing plaintext during ciphertext upgrades."),
  q("6b", "If a prompt says 'move stored ciphertext to the newest key version,' what is the likely answer?", ["Rotate", "Rewrap", "Seal", "Generate-root"], 1, "That prompt is describing rewrap rather than key rotation itself."),
  q("6b", "Which statement about old Transit key versions is correct?", ["They are removed immediately on rotation", "They can still decrypt older ciphertext unless restricted by policy or key settings", "They become root tokens", "They are moved to the storage backend outside Vault"], 1, "Older versions remain relevant for decryption of old ciphertext."),
  q("6b", "Why is the key version embedded in Transit ciphertext useful?", ["It tells Vault which auth method created the token", "It identifies which key version was used for encryption", "It stores the lease ID", "It replaces the need for policies"], 1, "The version marker helps Vault know which key version is associated with the ciphertext."),
  q("6b", "What does `min_decryption_version` help enforce?", ["A minimum number of auth methods", "A lower bound on key versions that are allowed to decrypt", "The number of leases to keep", "That ciphertext must always be v1"], 1, "It can be used to prevent decryption with very old key versions."),
  q("6b", "Which statement is false?", ["Rotation creates a new key version", "Rewrap can move ciphertext to a newer version", "Old ciphertext always becomes unreadable after rotation", "New encrypt calls use the current key version"], 2, "Old ciphertext remains decryptable after rotation, so that statement is false."),
];

const D7 = [
  q("7a", "Why is Vault's storage backend considered untrusted?", ["Because it cannot store data durably", "Because Vault encrypts data before it is written there", "Because it only works in dev mode", "Because it is always public"], 1, "Vault's barrier encrypts data before the storage backend ever sees it."),
  q("7a", "What is the Vault barrier responsible for?", ["Creating external groups", "Encrypting and decrypting Vault data", "Mounting auth methods only", "Handling browser login redirects"], 1, "The barrier is Vault's encryption layer."),
  q("7a", "When Vault is sealed, which statement is true?", ["Vault can read all plaintext from storage", "Vault can access the physical storage but cannot decrypt the data", "Vault disables all auth methods permanently", "Vault promotes a DR secondary automatically"], 1, "The classic exam sample question is that sealed Vault can reach storage but cannot decrypt its contents."),
  q("7a", "What protects the data before it reaches the storage backend?", ["The storage backend's own ACLs only", "Vault's cryptographic barrier", "The default policy", "The auth mount path"], 1, "Vault's own encryption model is the main protection, not the backend alone."),
  q("7a", "Which statement best describes Vault's data-at-rest model?", ["Vault writes plaintext to storage and encrypts it later", "Vault encrypts data before sending it to storage", "Vault relies only on TLS for at-rest protection", "Vault stores data only in memory"], 1, "The barrier encrypts before write, which is why the backend can be treated as untrusted."),
  q("7a", "After Vault becomes unsealed, what kinds of protected configuration does it load?", ["Only DNS settings", "Audit devices, auth methods, and secrets engines", "Only Transit keys", "Only UI themes"], 1, "Once unsealed, Vault loads sensitive configuration such as audit devices, auth methods, and secrets engines."),
  q("7a", "Which answer correctly contrasts Vault and the storage backend?", ["The storage backend authorizes policies; Vault stores nothing", "Vault performs encryption, while the backend provides durable persistence", "The backend creates client tokens; Vault stores UI sessions", "There is no difference"], 1, "Vault handles cryptography and the backend provides persistence."),
  q("7a", "What should you remember if an exam question asks why backend compromise does not automatically reveal Vault data?", ["The backend stores no bytes at all", "The barrier keeps stored data encrypted", "Policies are stored outside Vault", "Tokens are never written anywhere"], 1, "The barrier is the reason stored data remains protected even if the backend is exposed."),
  q("7b", "What does it mean when Vault is in a sealed state?", ["Clients can read secrets but cannot write them", "Vault cannot decrypt and serve normal data operations", "Policies no longer apply", "Only Transit keeps working"], 1, "A sealed Vault cannot perform normal secret operations because it cannot decrypt the protected data."),
  q("7b", "By default, how does Vault split the unseal key during initialization?", ["Through OIDC claims", "Through Shamir's Secret Sharing", "Through a policy path wildcard", "Through DR replication"], 1, "Vault uses Shamir's Secret Sharing by default unless configured for auto-unseal."),
  q("7b", "If Vault was initialized with 5 shares and a threshold of 3, how many valid shares are needed to unseal it?", ["1", "2", "3", "5"], 2, "The threshold tells you how many shares are required to reconstruct the unseal key."),
  q("7b", "What commonly provides auto-unseal for Vault?", ["An external KMS or HSM", "A default ACL policy", "A wrapping token", "A token accessor"], 0, "Auto-unseal relies on a trusted external KMS or HSM rather than manual Shamir entry."),
  q("7b", "With auto-unseal enabled, what is true about recovery keys?", ["They unseal Vault directly", "They are used for quorum-style privileged operations but cannot unseal Vault", "They replace tokens", "They mount secrets engines"], 1, "Recovery keys are not unseal keys."),
  q("7b", "Which command manually seals a running Vault node?", ["`vault operator seal`", "`vault operator unseal`", "`vault auth disable`", "`vault token revoke-root`"], 0, "The `vault operator seal` command returns Vault to the sealed state."),
  q("7b", "Which statement is correct about unseal keys and recovery keys?", ["They are always the same thing", "Recovery keys are used for privileged operations in auto-unseal setups, not for unsealing", "Unseal keys only matter in HCP", "Recovery keys are just token accessors"], 1, "The exam likes this distinction: recovery keys do not unseal Vault."),
  q("7b", "What operational question is the exam usually testing with seal and unseal?", ["How Vault regains access to the material that unlocks the barrier", "How Vault writes CSS files", "How Vault chooses an auth mount name", "How Vault creates entity aliases"], 0, "Seal and unseal are about protecting and recovering the material needed to unlock Vault's cryptographic barrier."),
  q("7c", "Which environment variable tells the Vault CLI which server address to use?", ["`VAULT_TOKEN`", "`VAULT_ADDR`", "`VAULT_FORMAT`", "`VAULT_NAMESPACE`"], 1, "`VAULT_ADDR` points the CLI to the Vault server."),
  q("7c", "Which environment variable stores the token the CLI should use for requests?", ["`VAULT_TOKEN`", "`VAULT_ADDR`", "`VAULT_SKIP_VERIFY`", "`VAULT_CACERT`"], 0, "`VAULT_TOKEN` provides the client token for CLI requests."),
  q("7c", "Which environment variable is used with Enterprise namespaces?", ["`VAULT_SCOPE`", "`VAULT_NAMESPACE`", "`VAULT_CLUSTER`", "`VAULT_POLICY`"], 1, "`VAULT_NAMESPACE` selects the namespace context in Enterprise environments."),
  q("7c", "Which environment variable changes CLI output format to JSON or another supported format?", ["`VAULT_STYLE`", "`VAULT_PRINT`", "`VAULT_FORMAT`", "`VAULT_JSON`"], 2, "`VAULT_FORMAT` controls how CLI output is rendered."),
  q("7c", "Which environment variable should be treated as a troubleshooting shortcut rather than a production best practice?", ["`VAULT_NAMESPACE`", "`VAULT_SKIP_VERIFY`", "`VAULT_ADDR`", "`VAULT_FORMAT`"], 1, "`VAULT_SKIP_VERIFY` disables TLS verification and is not a production best practice."),
  q("7c", "If a private CA signs your Vault server certificate, which environment variable is commonly used to point the CLI at that CA bundle?", ["`VAULT_CACERT`", "`VAULT_SKIP_VERIFY`", "`VAULT_AUDIT`", "`VAULT_MOUNT`"], 0, "`VAULT_CACERT` points the CLI to the CA certificate file."),
];

const D8 = [
  q("8a", "A team wants HashiCorp to manage more of the Vault platform lifecycle, such as upgrades and backups. Which option best fits?", ["Self-managed Vault", "HCP Vault / HashiCorp-managed Vault", "Dev mode with in-memory storage", "Performance replication"], 1, "HCP or HashiCorp-managed Vault reduces infrastructure operational burden."),
  q("8a", "Which statement best describes self-managed Vault?", ["HashiCorp owns upgrades and backups", "The customer owns operational responsibility for the cluster", "It cannot use Raft", "It cannot run in production"], 1, "Self-managed Vault provides control, but also operational responsibility."),
  q("8a", "What is the main tradeoff between self-managed and HashiCorp-managed Vault?", ["Who operates and maintains the platform lifecycle", "Whether policies exist", "Whether auth methods are supported", "Whether tokens have TTL"], 0, "The biggest distinction is operational ownership rather than core Vault concepts."),
  q("8a", "Which scenario points most strongly toward a managed Vault offering?", ["The team wants to run every upgrade and backup process themselves", "The team wants reduced infrastructure operations and managed service behavior", "The team needs policies on paths", "The team needs to use Transit"], 1, "A managed offering is the fit when the goal is to offload more platform operations."),
  q("8b", "Which storage backend does HashiCorp recommend as the modern default for most new Vault deployments?", ["Consul", "Integrated Storage (Raft)", "Filesystem", "PostgreSQL"], 1, "Integrated Storage with Raft is the recommended default answer."),
  q("8b", "How many storage backends are configured for a Vault cluster at a time?", ["One", "Two for HA", "One per auth method", "One per namespace"], 0, "A Vault cluster uses one configured storage backend."),
  q("8b", "Which storage backend choice is appropriate only for development mode and not production persistence?", ["Integrated Storage", "In-memory storage", "Raft", "Consul"], 1, "In-memory storage is a dev-mode answer, not a production architecture choice."),
  q("8b", "If an exam question asks for the recommended default backend and mentions avoiding extra dependencies, what is the answer?", ["Integrated Storage (Raft)", "LDAP", "Response wrapping", "Transit"], 0, "Raft is the recommended storage answer and does not require a separate external system."),
  q("8c", "What does `vault operator init` generate?", ["A DR secondary token only", "Unseal keys and the initial root token", "An external group mapping", "A Transit key version"], 1, "Initialization generates the initial unseal shares and the first root token."),
  q("8c", "What does rekey change?", ["The data encryption key used by the barrier", "The unseal key shares, threshold, or holders", "The storage backend type", "The auth mount path"], 1, "Rekey changes the Shamir share set, not the barrier encryption key."),
  q("8c", "What does `vault operator rotate` change?", ["The unseal key threshold", "The barrier encryption key material", "The number of policies on a token", "The auth method mount path"], 1, "Rotate changes Vault's encryption key material, not the Shamir shares."),
  q("8c", "Which contrast does the exam repeatedly test?", ["OIDC vs LDAP", "KV v1 vs Cubbyhole", "Rekey vs rotate", "HMAC vs hash"], 2, "The exam loves the difference between rekeying shares and rotating encryption keys."),
  q("8c", "Which command initiates a rekey workflow instead of rotating encryption keys?", ["`vault operator rekey -init`", "`vault operator rotate`", "`vault lease revoke -prefix`", "`vault auth tune`"], 0, "Rekey workflows start with the rekey command, whereas rotate changes the barrier key material."),
  q("8d", "Which Enterprise replication mode mirrors tokens and leases from the primary?", ["Performance replication", "Disaster Recovery (DR) replication", "Both modes do", "Neither mode does"], 1, "DR replication mirrors tokens and leases, while performance replication does not."),
  q("8d", "Which replication mode is meant primarily for warm-standby failover after a serious outage?", ["Performance replication", "Disaster Recovery replication", "Transit replication", "Identity replication"], 1, "DR replication is the failover-oriented model."),
  q("8d", "What is true about a DR secondary before promotion?", ["It serves client traffic normally", "It cannot serve clients until promoted", "It writes root tokens to the primary", "It replaces the storage backend"], 1, "DR secondaries are not client-serving until they are promoted."),
  q("8d", "Which replication mode best fits a goal of scaling reads or serving clients closer to their region?", ["DR replication", "Performance replication", "Shamir replication", "Lease replication"], 1, "Performance replication is the scale and locality answer."),
  q("8d", "Why is performance replication not a backup strategy?", ["Because it does not use Raft", "Because it is designed for scale, not DR-style failover semantics", "Because it disables policies", "Because it requires root tokens"], 1, "Performance replication addresses scale and locality, not disaster recovery."),
  q("8e", "What is the most important difference between self-managed and HashiCorp-managed Vault in operational terms?", ["Only one supports policies", "Only one supports auth methods", "Who owns upgrades, backups, and platform operations", "Which one can use Transit"], 2, "This objective is mostly about operational responsibility."),
  q("8e", "Which statement is true even with a HashiCorp-managed Vault cluster?", ["Auth, policy, and app-integration design still matter", "Policies are no longer required", "Secrets engines disappear", "Only root tokens can authenticate"], 0, "Managed service reduces platform work, but Vault design and integration still matter."),
  q("8e", "Which statement best matches self-managed Vault?", ["HashiCorp handles patching and cluster operations for you", "You still need to own backups, upgrades, and HA behavior", "It cannot run Enterprise features", "It automatically enables DR replication"], 1, "Self-managed means the operator owns more of the platform lifecycle."),
  q("8e", "Which statement is false about managed versus self-managed Vault?", ["Managed service reduces some operational burden", "Self-managed offers more direct infrastructure control", "Managed service removes the need to think about auth and policy design", "The difference includes who operates the platform"], 2, "Managed service does not remove the need for good Vault design decisions."),
];

const D9 = [
  q("9a", "What is the primary goal of Vault Agent?", ["To replace Vault server nodes", "To make applications less Vault-aware by handling auth, caching, and templating nearby", "To create DR secondaries", "To disable leases"], 1, "Vault Agent reduces the amount of direct Vault logic the application needs."),
  q("9a", "Which feature of Vault Agent automatically authenticates and manages token renewal?", ["Auto-auth", "DR replication", "Response wrapping", "Policy templating"], 0, "Auto-auth is the feature that handles initial login and token management for the agent."),
  q("9a", "What does Vault Agent caching do?", ["It stores unseal keys in the browser", "It locally caches token and leased secret responses and manages renewals", "It disables audit devices", "It replicates secrets to DR"], 1, "Caching lets the agent reduce repeated direct calls while tracking renewals."),
  q("9a", "Why are Vault Agent templates useful?", ["They render secret values into files that applications can consume", "They convert tokens into policies", "They create storage backends", "They replace namespaces"], 0, "Templating is used to render secrets into configuration files or similar outputs."),
  q("9a", "In Kubernetes, what common pattern uses Vault Agent close to the workload?", ["Controller reconciliation", "Sidecar injection", "DR promotion", "Raft snapshotting"], 1, "Vault Agent is commonly delivered as a sidecar pattern with injector support."),
  q("9a", "Which statement best describes Vault Agent?", ["A server cluster role", "A client-side helper daemon", "A storage backend", "An auth method"], 1, "Vault Agent is a client helper process, not a Vault server role."),
  q("9a", "What problem does Vault Agent most directly solve for applications?", ["Choosing a storage backend", "Avoiding direct Vault SDK and auth logic in every app", "Creating unseal shares", "Defining enterprise namespaces"], 1, "It keeps Vault-specific mechanics out of the application when appropriate."),
  q("9a", "If a prompt says secrets should be rendered to files and refreshed automatically, which Vault Agent feature should you think of?", ["Templating", "Generate-root", "Rekey", "Response wrapping"], 0, "Templating is the feature built for rendered secret files."),
  q("9a", "Which statement about Vault Agent and leases is correct?", ["Agent caching can help manage renewals of cached leased secrets", "Agent caching disables lease renewal", "Agent only works with static KV secrets", "Agent converts leases into accessors"], 0, "Agent caching can track and renew locally cached tokens and leased secrets."),
  q("9a", "What should you remember if an exam scenario says 'the app should not talk to Vault directly if we can avoid it'?", ["Use DR replication", "Use Vault Agent", "Use only root tokens", "Use policy wildcards everywhere"], 1, "That scenario is pointing toward Vault Agent as an integration helper."),
  q("9a", "Which statement is false about Vault Agent?", ["It can auto-authenticate", "It can cache supported responses", "It is meant to simplify secret consumption for apps", "It replaces the Vault server cluster itself"], 3, "Vault Agent complements Vault; it does not replace the Vault server."),
  q("9b", "What is the primary purpose of Vault Secrets Operator (VSO)?", ["To replace Kubernetes Secrets with Transit ciphertext everywhere", "To sync Vault-managed data into Kubernetes-native resources", "To create unseal key shares", "To mount Vault auth methods in the CLI"], 1, "VSO is a Kubernetes-native controller that syncs secrets from Vault."),
  q("9b", "Which Kubernetes integration pattern best matches VSO?", ["Sidecar per pod", "Controller reconciliation through CRDs", "Browser-based OIDC", "DR promotion"], 1, "VSO is a controller pattern, not a sidecar pattern."),
  q("9b", "What is a key difference between VSO and Vault Agent sidecars?", ["VSO is an auth method", "VSO syncs into Kubernetes resources and does not require a sidecar in every pod", "VSO can only work with Transit", "VSO disables policies"], 1, "Agent is the close-to-workload helper pattern; VSO is the controller sync pattern."),
  q("9b", "Which VSO custom resource is commonly used to sync a static secret from Vault into a Kubernetes Secret?", ["`VaultStaticSecret`", "`VaultLeaseSecret`", "`VaultTransitKey`", "`VaultPolicyMount`"], 0, "`VaultStaticSecret` is the common CRD for syncing Vault data into Kubernetes Secrets."),
  q("9b", "Which resources provide connection and authentication configuration for VSO?", ["`VaultConnection` and `VaultAuth`", "`VaultRoot` and `VaultSeal`", "`AgentConfig` and `TransitConfig`", "`LeaseToken` and `PathPolicy`"], 0, "`VaultConnection` and `VaultAuth` are foundational CRDs for the operator."),
  q("9b", "Which statement about VSO authentication support is correct?", ["It only supports Kubernetes auth", "It supports multiple auth methods such as Kubernetes, JWT, AppRole, AWS, and GCP", "It does not authenticate to Vault", "It requires a root token"], 1, "The operator supports several Vault auth methods, not just Kubernetes auth."),
  q("9b", "What is true about VSO client cache behavior?", ["It can optionally persist cached Vault client data and encrypt it with Transit", "It is always enabled and unencrypted", "It stores only root tokens", "It disables dynamic secret renewals"], 0, "VSO can optionally persist and encrypt its Vault client cache for continuity."),
  q("9b", "If the requirement is 'keep standard Kubernetes Secret objects in sync with Vault,' which tool is the better answer?", ["Vault Agent", "VSO", "Generate-root", "Raft"], 1, "That requirement points squarely at VSO."),
  q("9b", "Which statement best matches the mental model the exam wants for VSO?", ["A sidecar-driven file renderer", "A Kubernetes-native secret sync controller", "A replacement for policies", "A storage backend selector"], 1, "The exam is testing that VSO is a controller-style sync mechanism."),
  q("9b", "What is optional rather than the main exam mental model for VSO?", ["Syncing Vault data to Kubernetes-native resources", "Using features such as encrypted client cache or instant updates", "Working as a controller", "Authenticating to Vault"], 1, "Those features exist, but the main concept is still controller-based secret sync into Kubernetes resources."),
  q("9b", "Which statement is false about VSO?", ["It can work with Vault as a secret source", "It always requires a sidecar in each pod", "It uses Kubernetes CRDs", "It is part of HashiCorp's supported Vault integrations"], 1, "VSO is a controller-based integration and does not require a sidecar in each pod."),
];

const REVIEW = [
  q(
    "1a",
    "Which lifecycle chain best matches how Vault access usually works on the exam?",
    ["Policy -> auth method -> token -> lease -> secrets engine", "Auth method -> token -> policy -> secrets engine -> lease", "Lease -> token -> auth method -> policy -> storage backend", "Secrets engine -> auth method -> entity alias -> lease -> token"],
    1,
    "The repeated exam chain is auth method to token to policy to secrets engine to lease.",
    {
      guideObjective: false,
      reviewObjectives: ["1a", "2a", "5d", "4a"],
      docs: [
        QUIZ_DOCS.associate,
        QUIZ_DOCS.authConcepts,
        QUIZ_DOCS.policies,
        QUIZ_DOCS.lease,
      ],
      correctReview:
        "This mixed-review question is testing the end-to-end Vault flow the exam comes back to repeatedly: authenticate first, receive a token, authorize that token with policies, reach the mounted secrets engine, and then manage the leased output when the engine returns dynamic data.",
      choiceNotes: [
        "Policies are attached to tokens after authentication. They do not come before the auth step itself, so this chain starts in the wrong place.",
        "This is the best lifecycle chain for exam scenarios because Vault first authenticates the caller, then issues a token with policies, then authorizes access to the secrets engine, and finally manages leases for dynamic outputs.",
        "Leases are created after Vault issues a secret or a renewable service token. They do not come before authentication and token creation.",
        "Secrets engines are mounted by operators before clients ever authenticate, and entity aliases are identity-mapping objects rather than the normal next step after a secrets-engine request.",
      ],
    }
  ),
  q(
    "9b",
    "A Kubernetes application needs database credentials, should not embed Vault SDK logic, and wants synced Kubernetes Secret objects instead of a sidecar. Which combination best fits?",
    ["Vault Agent plus static KV only", "VSO plus a suitable dynamic secrets engine", "Userpass auth plus root token", "Response wrapping plus in-memory storage"],
    1,
    "This is a mixed scenario: VSO is the Kubernetes-native delivery pattern, and a dynamic secrets engine provides the credential.",
    {
      guideObjective: false,
      reviewObjectives: ["5a", "5b", "9b"],
      docs: [
        QUIZ_DOCS.associate,
        QUIZ_DOCS.database,
        QUIZ_DOCS.vso,
        QUIZ_DOCS.k8sCompare,
      ],
      correctReview:
        "This question mixes secret generation with Kubernetes delivery. The requirement for synced Kubernetes Secret objects points to Vault Secrets Operator, while the requirement for database credentials points to a dynamic secrets engine such as the Database engine rather than a static KV value.",
      choiceNotes: [
        "Vault Agent is the sidecar pattern, which the prompt explicitly rules out, and static KV does not satisfy the requirement for dynamic database credentials.",
        "This is the best fit because VSO handles controller-style sync into Kubernetes-native Secret objects while a dynamic secrets engine supplies short-lived database credentials.",
        "Userpass auth and root tokens are both wrong mental models here. The scenario is about workload delivery and dynamic credentials, not a human operator logging in with privileged emergency access.",
        "Response wrapping is about secure one-time handoff, and in-memory storage is only a development-mode storage choice. Neither solves the controller-based Kubernetes sync requirement in the prompt.",
      ],
    }
  ),
];

export const QUESTION_GROUPS = [
  { domain: "1", questions: D1 },
  { domain: "2", questions: D2 },
  { domain: "3", questions: D3 },
  { domain: "4", questions: D4 },
  { domain: "5", questions: D5 },
  { domain: "6", questions: D6 },
  { domain: "7", questions: D7 },
  { domain: "8", questions: D8 },
  { domain: "9", questions: D9 },
  { domain: "review", questions: REVIEW },
];

export const EXPECTED_DOMAIN_QUESTION_COUNT = 22;
export const EXPECTED_REVIEW_QUESTION_COUNT = 2;
export const EXPECTED_TOTAL_QUESTION_COUNT = 200;

QUESTION_GROUPS.filter((group) => group.domain !== "review").forEach((group) => {
  if (group.questions.length !== EXPECTED_DOMAIN_QUESTION_COUNT) {
    throw new Error(`Expected ${EXPECTED_DOMAIN_QUESTION_COUNT} questions for domain ${group.domain}, received ${group.questions.length}.`);
  }
});

if (REVIEW.length !== EXPECTED_REVIEW_QUESTION_COUNT) {
  throw new Error(`Expected ${EXPECTED_REVIEW_QUESTION_COUNT} mixed review questions, received ${REVIEW.length}.`);
}

const totalQuestions = QUESTION_GROUPS.reduce((count, group) => count + group.questions.length, 0);
if (totalQuestions !== EXPECTED_TOTAL_QUESTION_COUNT) {
  throw new Error(`Expected ${EXPECTED_TOTAL_QUESTION_COUNT} total quiz questions, received ${totalQuestions}.`);
}

validateQuestionSupport(QUESTION_GROUPS);
