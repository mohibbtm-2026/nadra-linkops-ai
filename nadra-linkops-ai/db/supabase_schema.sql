create table if not exists profiles (
  id uuid primary key,
  full_name text not null,
  email text unique not null,
  role text not null check (role in ('Admin','Engineer')),
  status text not null default 'Active' check (status in ('Active','Inactive')),
  created_at timestamptz default now()
);

create table if not exists complaints (
  id uuid primary key,
  complaint_id text unique not null,
  site_name text not null,
  district text,
  incharge_name text not null,
  incharge_contact text,
  telecom_ticket text,
  link_role text,
  provider text not null,
  issue_nature text not null,
  validated_cause text,
  disruption_start timestamptz not null,
  resolution_time timestamptz,
  status text not null,
  user_impact text,
  remarks text,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ad_requests (
  id uuid primary key,
  employee_name text not null,
  employee_ref text,
  old_site text,
  new_site text,
  request_type text not null,
  hr_order text,
  requested_by text,
  status text not null,
  request_date date not null,
  completed_date date,
  notes text,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

create table if not exists site_directory (
  id uuid primary key,
  site_name text not null,
  district text,
  address text,
  timing text,
  source text,
  created_at timestamptz default now()
);
