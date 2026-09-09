import { type FormEvent, useMemo, useState } from "react";
import type { PortalUser } from "../api/API";
import { useOrganizations, useRoles, useSaveUser, useUserStatus, useUsers } from "../hooks/usePortal";
import { useTenants } from "../hooks/useTenants";
import { Badge, Field, Modal, PageTitle } from "./Organizations";

const freshUser = { name: "", email: "", type: "Platform" as const, status: "Active" as const, roleIds: ["role-viewer"], organizationIds: [], tenantIds: [] };

const Users = () => {
  const { data: users = [] } = useUsers();
  const { data: roles = [] } = useRoles();
  const { data: organizations = [] } = useOrganizations();
  const { data: tenants = [] } = useTenants();
  const save = useSaveUser();
  const setStatus = useUserStatus();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<PortalUser> | null>(null);
  const visible = useMemo(() => users.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())), [users, search]);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (editing) save.mutate(editing, { onSuccess: () => setEditing(null) }); };
  const toggle = (values: string[], value: string) => values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

  return <main className="mx-auto max-w-[1400px] px-6 py-10"><PageTitle title="User Management" description="Manage platform and tenant users, roles, and effective data access" action="+ Add User" onAction={() => setEditing(freshUser)} />
    <section className="mt-8 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users" className="w-full rounded-xl border p-3 outline-none focus:border-blue-400" />
      <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[860px] text-left text-sm"><thead><tr className="border-b text-slate-500"><th className="p-3">User</th><th className="p-3">Type</th><th className="p-3">Roles</th><th className="p-3">Data scope</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead><tbody>{visible.map((user) => <tr key={user.id} className="border-b border-slate-100"><td className="p-3 font-medium">{user.name}<br /><span className="font-normal text-slate-500">{user.email}</span></td><td className="p-3">{user.type}</td><td className="p-3">{user.roleIds.map((roleId) => roles.find((role) => role.id === roleId)?.name ?? roleId).join(", ")}</td><td className="p-3 text-slate-600">{user.organizationIds.length} organizations · {user.tenantIds.length} tenants</td><td className="p-3"><Badge value={user.status} /></td><td className="p-3"><div className="flex gap-2"><button type="button" onClick={() => setEditing(user)} className="rounded-lg border px-3 py-2 text-blue-600">Edit</button><button type="button" onClick={() => setStatus.mutate({ id: user.id, status: user.status === "Active" ? "Inactive" : "Active" })} className="rounded-lg border px-3 py-2">{user.status === "Active" ? "Deactivate" : "Activate"}</button></div></td></tr>)}{!visible.length && <tr><td colSpan={6} className="p-10 text-center text-slate-500">No users found.</td></tr>}</tbody></table></div>
    </section>
    {editing && <Modal title={editing.id ? "Edit User" : "Create User"} onClose={() => setEditing(null)}><form onSubmit={submit} className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><Field label="Full name" value={editing.name ?? ""} onChange={(value) => setEditing({ ...editing, name: value })} /><Field label="Email" type="email" value={editing.email ?? ""} onChange={(value) => setEditing({ ...editing, email: value })} /><label className="text-sm font-medium">User type<select value={editing.type ?? "Platform"} onChange={(event) => setEditing({ ...editing, type: event.target.value as PortalUser["type"] })} className="mt-1 w-full rounded-lg border p-3"><option>Platform</option><option>Tenant</option></select></label><label className="text-sm font-medium">Status<select value={editing.status ?? "Active"} onChange={(event) => setEditing({ ...editing, status: event.target.value as PortalUser["status"] })} className="mt-1 w-full rounded-lg border p-3"><option>Active</option><option>Inactive</option></select></label></div>
      <CheckGroup title="Roles" items={roles.map((role) => ({ id: role.id, label: role.name }))} selected={editing.roleIds ?? []} onChange={(value) => setEditing({ ...editing, roleIds: toggle(editing.roleIds ?? [], value) })} />
      <CheckGroup title="Organization data scope" items={organizations.map((organization) => ({ id: organization.id, label: organization.name }))} selected={editing.organizationIds ?? []} onChange={(value) => setEditing({ ...editing, organizationIds: toggle(editing.organizationIds ?? [], value) })} />
      <CheckGroup title="Tenant data scope" items={tenants.map((tenant) => ({ id: tenant.id, label: tenant.name }))} selected={editing.tenantIds ?? []} onChange={(value) => setEditing({ ...editing, tenantIds: toggle(editing.tenantIds ?? [], value) })} />
      <div className="flex justify-end gap-3"><button type="button" onClick={() => setEditing(null)} className="rounded-lg border px-4 py-2">Cancel</button><button disabled={save.isPending} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Save User</button></div></form></Modal>}
  </main>;
};

const CheckGroup = ({ title, items, selected, onChange }: { title: string; items: { id: string; label: string }[]; selected: string[]; onChange: (id: string) => void }) => <fieldset><legend className="text-sm font-semibold text-slate-700">{title}</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{items.length ? items.map((item) => <label key={item.id} className="flex items-center gap-2 rounded-lg border border-slate-100 p-2 text-sm"><input type="checkbox" checked={selected.includes(item.id)} onChange={() => onChange(item.id)} />{item.label}</label>) : <p className="text-sm text-slate-500">No records available.</p>}</div></fieldset>;
export default Users;
