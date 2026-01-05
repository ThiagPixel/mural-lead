Lead – Internal Management System

Internal management system built with Next.js, Supabase, and ShadCN UI, focused on service tracking, permissions control, and role-based access.

Features

User authentication with Supabase Auth

Role-based access control (admin / user)

Services management

Permissions management

Admin-only navigation and actions

Secure backend with Row Level Security (RLS)

Tech Stack

Next.js (App Router)

Supabase (Auth + PostgreSQL)

ShadCN UI

Tailwind CSS

Access Control

User roles are defined in the profiles table.

Role	Access
admin	Full access
user	Restricted access
Security

All critical operations are protected by Supabase Row Level Security.

Setup
Requirements

Node.js 18+

Supabase project

Environment Variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

Run
npm install
npm run dev


