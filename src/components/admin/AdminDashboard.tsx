import React, { useState, useEffect } from 'react';
import { getAllEntries, createEntry, updateEntry, deleteEntry, togglePublishEntry, adminLogout, type UncompiledEntry } from '../../lib/admin';
import SideQuestsEditor from './SideQuestsEditor';
import GalleryEditor from './GalleryEditor';
import BootcampEditor from './BootcampEditor';

interface AdminDashboardProps {
  token: string;
  email: string;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, email, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'uncompiled' | 'sidequests' | 'gallery' | 'bootcamp'>('uncompiled');
  const [entries, setEntries] = useState<UncompiledEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState<UncompiledEntry | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    title: '',
    slug: '',
    content: '',
    published: false
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const data = await getAllEntries(token);
      setEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout(token);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    onLogout();
  };

  const handleNewEntry = () => {
    setEditingEntry(null);
    setFormData({
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      title: '',
      slug: '',
      content: '',
      published: false
    });
    setShowEditor(true);
  };

  const handleEditEntry = (entry: UncompiledEntry) => {
    setEditingEntry(entry);
    setFormData({
      date: entry.date,
      title: entry.title,
      slug: entry.slug,
      content: entry.content,
      published: entry.published
    });
    setShowEditor(true);
  };

  const handleSaveEntry = async () => {
    try {
      if (editingEntry) {
        await updateEntry(token, editingEntry.id, formData);
      } else {
        await createEntry(token, formData);
      }
      setShowEditor(false);
      loadEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Error saving entry');
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      await deleteEntry(token, id);
      loadEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await togglePublishEntry(token, id, !currentStatus);
      loadEntries();
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  if (showEditor) {
    return (
      <div className="min-h-screen bg-codGray p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-ptMono text-quillGray">
              {editingEntry ? 'Edit Entry' : 'New Entry'}
            </h2>
            <button
              onClick={() => setShowEditor(false)}
              className="px-4 py-2 bg-darkGrey border border-gunSmoke/30 rounded-sm text-gunSmoke
                hover:border-accent-light hover:text-accent-light transition-colors font-ptMono text-sm"
            >
              Cancel
            </button>
          </div>

          <div className="bg-darkGrey border border-gunSmoke/30 rounded-sm p-6 space-y-4">
            <div>
              <label className="block text-sm font-ptMono text-gunSmoke mb-2">Date</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 bg-codGray border border-gunSmoke/30 rounded-sm
                  text-quillGray font-ptMono text-sm focus:border-accent-light focus:outline-none"
                placeholder="23 Nov 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-ptMono text-gunSmoke mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ 
                    ...formData, 
                    title: e.target.value,
                    slug: generateSlug(e.target.value)
                  });
                }}
                className="w-full px-4 py-2 bg-codGray border border-gunSmoke/30 rounded-sm
                  text-quillGray font-ptMono text-sm focus:border-accent-light focus:outline-none"
                placeholder="The Horizon Effect"
              />
            </div>

            <div>
              <label className="block text-sm font-ptMono text-gunSmoke mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 bg-codGray border border-gunSmoke/30 rounded-sm
                  text-quillGray font-ptMono text-sm focus:border-accent-light focus:outline-none"
                placeholder="horizon-effect"
              />
            </div>

            <div>
              <label className="block text-sm font-ptMono text-gunSmoke mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={20}
                className="w-full px-4 py-2 bg-codGray border border-gunSmoke/30 rounded-sm
                  text-quillGray font-ptMono text-sm focus:border-accent-light focus:outline-none
                  resize-none"
                placeholder="Write your thoughts here..."
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm font-ptMono text-gunSmoke">
                Publish immediately
              </label>
            </div>

            <button
              onClick={handleSaveEntry}
              className="w-full py-3 bg-accent-light/10 border border-accent-light/40 rounded-sm
                text-accent-light font-ptMono text-sm hover:bg-accent-light hover:text-codGray
                transition-all duration-200"
            >
              {editingEntry ? 'Update Entry' : 'Create Entry'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-codGray p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold font-ptMono text-quillGray">Admin Panel</h1>
            <p className="text-sm text-gunSmoke font-ptMono mt-1">Logged in as {email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-darkGrey border border-gunSmoke/30 rounded-sm text-gunSmoke
              hover:border-red-400 hover:text-red-400 transition-colors font-ptMono text-sm"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-darkGrey/50">
          <button
            onClick={() => setActiveTab('uncompiled')}
            className={`px-4 py-2 font-ptMono text-sm transition-colors ${
              activeTab === 'uncompiled'
                ? 'text-accent-light border-b-2 border-accent-light'
                : 'text-gunSmoke hover:text-quillGray'
            }`}
          >
            Uncompiled
          </button>
          <button
            onClick={() => setActiveTab('sidequests')}
            className={`px-4 py-2 font-ptMono text-sm transition-colors ${
              activeTab === 'sidequests'
                ? 'text-accent-light border-b-2 border-accent-light'
                : 'text-gunSmoke hover:text-quillGray'
            }`}
          >
            Side Quests
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 font-ptMono text-sm transition-colors ${
              activeTab === 'gallery'
                ? 'text-accent-light border-b-2 border-accent-light'
                : 'text-gunSmoke hover:text-quillGray'
            }`}
          >
            Gallery
          </button>
          <button
            onClick={() => setActiveTab('bootcamp')}
            className={`px-4 py-2 font-ptMono text-sm transition-colors ${
              activeTab === 'bootcamp'
                ? 'text-accent-light border-b-2 border-accent-light'
                : 'text-gunSmoke hover:text-quillGray'
            }`}
          >
            Bootcamp
          </button>
        </div>

        {/* Content */}
        {activeTab === 'bootcamp' ? (
          <BootcampEditor token={token} />
        ) : activeTab === 'gallery' ? (
          <GalleryEditor token={token} />
        ) : activeTab === 'sidequests' ? (
          <SideQuestsEditor token={token} />
        ) : (
          <>
            {/* New Entry Button */}
            <div className="mb-6">
              <button
                onClick={handleNewEntry}
                className="px-4 py-2 bg-accent-light/10 border border-accent-light/40 rounded-sm
                  text-accent-light font-ptMono text-sm hover:bg-accent-light hover:text-codGray
                  transition-all duration-200"
              >
                + New Entry
              </button>
            </div>

            {/* Entries List */}
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gunSmoke font-ptMono">Loading entries...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12">
            <p className="text-gunSmoke font-ptMono mb-4">No entries yet</p>
            <button
              onClick={handleNewEntry}
              className="px-4 py-2 bg-accent-light/10 border border-accent-light/40 rounded-sm
                text-accent-light font-ptMono text-sm hover:bg-accent-light hover:text-codGray
                transition-all duration-200"
            >
              Create your first entry
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-darkGrey border border-gunSmoke/30 rounded-sm p-4"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-ptMono text-gunSmoke">{entry.date}</span>
                      <span className={`px-2 py-0.5 text-xs font-ptMono rounded border ${
                        entry.published 
                          ? 'bg-green-500/10 text-green-400 border-green-400/30'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-400/30'
                      }`}>
                        {entry.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <h3 className="text-lg font-ptMono text-quillGray mb-1">{entry.title}</h3>
                    <p className="text-sm text-gunSmoke font-ptMono">{entry.slug}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTogglePublish(entry.id, entry.published)}
                      className="px-3 py-1.5 bg-codGray border border-gunSmoke/30 rounded-sm
                        text-gunSmoke hover:border-accent-light hover:text-accent-light
                        transition-colors font-ptMono text-xs"
                    >
                      {entry.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleEditEntry(entry)}
                      className="px-3 py-1.5 bg-codGray border border-gunSmoke/30 rounded-sm
                        text-gunSmoke hover:border-accent-light hover:text-accent-light
                        transition-colors font-ptMono text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="px-3 py-1.5 bg-codGray border border-gunSmoke/30 rounded-sm
                        text-gunSmoke hover:border-red-400 hover:text-red-400
                        transition-colors font-ptMono text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
