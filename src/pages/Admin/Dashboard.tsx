import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, X, ImagePlus, Edit } from 'lucide-react';
import { specialsApi } from '../../api/api';
import logo from '../../images/logo.png';

interface Special {
  id: string;
  title: string;
  description: string;
  imageLink: string;
  validUpTo: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const adminToken = sessionStorage.getItem('admin-token') || '';

  const [specials, setSpecials] = useState<Special[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [validUpTo, setValidUpTo] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await specialsApi.getAll();
      setSpecials(data);
    } catch (err) {
      console.error('Failed to load specials:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId && !imageFile) return alert('Please select an image.');

    setSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('validUpTo', validUpTo);
    if (imageFile) formData.append('image', imageFile);

    try {
      if (editId) {
        await specialsApi.update(editId, formData, adminToken);
      } else {
        await specialsApi.create(formData, adminToken);
      }
      setIsModalOpen(false);
      resetForm();
      loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this special?')) return;
    try {
      await specialsApi.delete(id, adminToken);
      setSpecials(prev => prev.filter(s => s.id !== id));
    } catch {
      alert('Failed to delete special.');
    }
  };

  const handleEdit = (s: Special) => {
    setEditId(s.id);
    setTitle(s.title);
    setDescription(s.description || '');
    setValidUpTo(s.validUpTo ? new Date(s.validUpTo).toISOString().split('T')[0] : '');
    setImagePreview(s.imageLink);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setDescription('');
    setValidUpTo('');
    setImageFile(null);
    setImagePreview('');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <header className="fixed top-0 w-full bg-white border-b h-20 flex items-center justify-between px-8 z-40">
        <div className="flex items-center gap-3">
          <img src={logo} className="h-10 w-10 rounded-full" alt="logo" />
          <h1 className="font-bold text-[#0f2f7a]">Admin Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded"
        >
          <LogOut size={16} /> Logout
        </button>
      </header>

      <main className="max-w-6xl mx-auto pt-28 px-4 pb-10">
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-700 text-white px-6 py-2.5 rounded-md font-semibold mb-6 flex items-center gap-2"
        >
          <Plus size={20} /> Add New Special
        </button>

        <div className="grid gap-4">
          {specials.map(s => (
            <div
              key={s.id}
              className="bg-white p-4 rounded-xl border flex items-center gap-4 shadow-sm"
            >
              <img
                src={s.imageLink}
                className="w-24 h-24 object-cover rounded-lg"
                alt={s.title}
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{s.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-1">{s.description}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Valid Until: {new Date(s.validUpTo).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editId ? 'Edit Special' : 'New Special'}
              </h2>
              <X
                className="cursor-pointer"
                onClick={() => { setIsModalOpen(false); resetForm(); }}
              />
            </div>

            <input
              type="file"
              hidden
              accept="image/jpeg,image/png,image/webp,image/gif"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed h-40 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-gray-50"
            >
              {imagePreview ? (
                <img src={imagePreview} className="h-full w-full object-cover rounded-lg" alt="preview" />
              ) : (
                <>
                  <ImagePlus className="text-blue-600" />
                  <span className="text-sm">Click to upload image</span>
                </>
              )}
            </div>

            <input
              placeholder="Title"
              className="w-full border p-2 rounded text-black"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={200}
              required
            />

            <textarea
              placeholder="Description"
              className="w-full border p-2 rounded text-black"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <input
              type="date"
              className="w-full border p-2 rounded text-black"
              value={validUpTo}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setValidUpTo(e.target.value)}
              required
            />

            <button
              disabled={submitting}
              className="w-full bg-blue-700 text-white py-3 rounded font-bold disabled:bg-gray-400"
            >
              {submitting ? 'Saving…' : editId ? 'Update Special' : 'Save Special'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
