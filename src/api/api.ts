const BASE_URL = `${import.meta.env.VITE_API_URL}/api/specials`;
const AUTH_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  async login(password: string): Promise<{ token: string }> {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed.');
    return data;
  },
};

// ─── Specials ─────────────────────────────────────────────────────────────────

export const specialsApi = {
  async getAll() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch specials.');
    return res.json();
  },

  async create(formData: FormData, token: string) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create special.');
    return data;
  },

  async update(id: string, formData: FormData, token: string) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update special.');
    return data;
  },

  async delete(id: string, token: string) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete special.');
    return data;
  },
};
