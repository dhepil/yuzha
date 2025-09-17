-- Stores module passkeys server-side
create table if not exists public.module_passwords (
  module_id text primary key,
  passkey_hash text not null,
  hash_algorithm text not null default 'HS256',
  passkey_hint text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.module_passwords is 'Stores hashed module-level passkeys used by the passkey validation edge function.';
comment on column public.module_passwords.module_id is 'Identifier of the module requiring a passkey.';
comment on column public.module_passwords.passkey_hash is 'HMAC digest of the passkey, hex encoded.';
comment on column public.module_passwords.hash_algorithm is 'Hashing scheme used to derive passkey_hash.';
comment on column public.module_passwords.passkey_hint is 'Optional administrator-only hint; never exposed to clients.';
comment on column public.module_passwords.created_at is 'Timestamp when the record was created.';
comment on column public.module_passwords.updated_at is 'Timestamp when the record was last modified.';

alter table public.module_passwords enable row level security;
