// const BASE_URL = `${import.meta.env.VITE_API_URL}/api/specials`;
// const AUTH_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

// // ─── Auth ─────────────────────────────────────────────────────────────────────

// export const authApi = {
//   async login(password: string): Promise<{ token: string }> {
//     const res = await fetch(`${AUTH_URL}/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ password }),
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.error || 'Login failed.');
//     return data;
//   },
// };

// // ─── Specials ─────────────────────────────────────────────────────────────────

// export const specialsApi = {
//   async getAll() {
//     const res = await fetch(BASE_URL);
//     if (!res.ok) throw new Error('Failed to fetch specials.');
//     return res.json();
//   },

//   async create(formData: FormData, token: string) {
//     const res = await fetch(BASE_URL, {
//       method: 'POST',
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData,
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.error || 'Failed to create special.');
//     return data;
//   },

//   async update(id: string, formData: FormData, token: string) {
//     const res = await fetch(`${BASE_URL}/${id}`, {
//       method: 'PUT',
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData,
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.error || 'Failed to update special.');
//     return data;
//   },

//   async delete(id: string, token: string) {
//     const res = await fetch(`${BASE_URL}/${id}`, {
//       method: 'DELETE',
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.error || 'Failed to delete special.');
//     return data;
//   },
// };



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

    if (!res.ok) {
      const text = await res.text();
      console.error('Login error:', text);
      throw new Error('Login failed. Check credentials.');
    }

    return res.json();
  },
};

// ─── Specials ─────────────────────────────────────────────────────────────────
async function parseJSONOrText(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text; // return raw text if not JSON (like HTML error pages)
  }
}

export const specialsApi = {
  async getAll() {
    const res = await fetch(BASE_URL);
    if (!res.ok) {
      const err = await parseJSONOrText(res);
      console.error('Fetch specials failed:', err);
      throw new Error('Failed to fetch specials.');
    }
    return res.json();
  },

  async create(formData: FormData, token: string) {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }, // no Content-Type for FormData
      body: formData,
    });

    if (!res.ok) {
      const err = await parseJSONOrText(res);
      console.error('Create special failed:', err);
      throw new Error('Failed to create special.');
    }

    return parseJSONOrText(res);
  },

  async update(id: string, formData: FormData, token: string) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const err = await parseJSONOrText(res);
      console.error('Update special failed:', err);
      throw new Error('Failed to update special.');
    }

    return parseJSONOrText(res);
  },

  async delete(id: string, token: string) {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const err = await parseJSONOrText(res);
      console.error('Delete special failed:', err);
      throw new Error('Failed to delete special.');
    }

    return parseJSONOrText(res);
  },
};