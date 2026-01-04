import React, { useState, useEffect } from 'react';
import { getAllBootcampLectures, updateBootcampLecture, togglePublishBootcampLecture, type BootcampLecture } from '../../lib/admin';

interface BootcampEditorProps {
  token: string;
}

const BootcampEditor: React.FC<BootcampEditorProps> = ({ token }) => {
  const [lectures, setLectures] = useState<BootcampLecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BootcampLecture>>({});
  const [newResource, setNewResource] = useState({ label: '', url: '' });

  useEffect(() => {
    loadLectures();
  }, []);

  const loadLectures = async () => {
    setIsLoading(true);
    try {
      const data = await getAllBootcampLectures(token);
      setLectures(data);
    } catch (error) {
      console.error('Error loading bootcamp lectures:', error);
      alert('Error loading bootcamp lectures');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (lecture: BootcampLecture) => {
    setEditingId(lecture.id);
    setFormData({
      title: lecture.title,
      description: lecture.description || '',
      slides_url: lecture.slides_url || '',
      video_url: lecture.video_url || '',
      additional_resources: lecture.additional_resources || []
    });
    setNewResource({ label: '', url: '' });
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      await updateBootcampLecture(token, editingId, formData);
      await loadLectures();
      setEditingId(null);
      setFormData({});
      alert('Lecture updated successfully!');
    } catch (error) {
      console.error('Error updating lecture:', error);
      alert('Error updating lecture');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await togglePublishBootcampLecture(token, id, !currentStatus);
      await loadLectures();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Error toggling publish status');
    }
  };

  const handleAddResource = () => {
    if (!newResource.label || !newResource.url) {
      alert('Please fill in both label and URL');
      return;
    }

    setFormData({
      ...formData,
      additional_resources: [
        ...(formData.additional_resources || []),
        { ...newResource }
      ]
    });
    setNewResource({ label: '', url: '' });
  };

  const handleRemoveResource = (index: number) => {
    setFormData({
      ...formData,
      additional_resources: formData.additional_resources?.filter((_, i) => i !== index) || []
    });
  };

  if (isLoading) {
    return <div className="text-gunSmoke">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-quillGray mb-4">Flutter Bootcamp Lectures</h3>

      <div className="grid gap-4">
        {lectures.map((lecture) => (
          <div key={lecture.id} className="bg-darkGrey/20 p-4 rounded-lg">
            {editingId === lecture.id ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-quillGray">Day {lecture.day_number}</h4>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setFormData({});
                    }}
                    className="text-sm text-gunSmoke hover:text-quillGray"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <label className="text-sm text-gunSmoke block mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-darkGrey/50 text-quillGray rounded border border-darkGrey/50 focus:border-accent-light focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-gunSmoke block mb-1">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-darkGrey/50 text-quillGray rounded border border-darkGrey/50 focus:border-accent-light focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-gunSmoke block mb-1">Slides URL</label>
                  <input
                    type="url"
                    value={formData.slides_url || ''}
                    onChange={(e) => setFormData({ ...formData, slides_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-darkGrey/50 text-quillGray rounded border border-darkGrey/50 focus:border-accent-light focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-gunSmoke block mb-1">Video URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.video_url || ''}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://youtube.com/..."
                    className="w-full px-3 py-2 bg-darkGrey/50 text-quillGray rounded border border-darkGrey/50 focus:border-accent-light focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm text-gunSmoke block mb-2">Additional Resources</label>
                  
                  {formData.additional_resources && formData.additional_resources.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {formData.additional_resources.map((resource, index) => (
                        <div key={index} className="flex items-center gap-2 bg-darkGrey/30 p-2 rounded">
                          <div className="flex-1">
                            <span className="text-sm text-quillGray font-medium">{resource.label}</span>
                            <span className="text-xs text-gunSmoke block truncate">{resource.url}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveResource(index)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newResource.label}
                      onChange={(e) => setNewResource({ ...newResource, label: e.target.value })}
                      placeholder="Resource Label"
                      className="flex-1 px-3 py-2 bg-darkGrey/50 text-quillGray rounded border border-darkGrey/50 focus:border-accent-light focus:outline-none text-sm"
                    />
                    <input
                      type="url"
                      value={newResource.url}
                      onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 bg-darkGrey/50 text-quillGray rounded border border-darkGrey/50 focus:border-accent-light focus:outline-none text-sm"
                    />
                    <button
                      onClick={handleAddResource}
                      className="px-3 py-2 bg-accent-light/20 text-accent-light rounded hover:bg-accent-light/30 text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-accent-light text-darkGrey rounded hover:bg-accent-light/90 font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-quillGray">Day {lecture.day_number}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded ${lecture.is_published ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {lecture.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-quillGray">{lecture.title}</p>
                    {lecture.description && (
                      <p className="text-sm text-gunSmoke mt-1">{lecture.description}</p>
                    )}
                    {lecture.slides_url && (
                      <p className="text-xs text-accent-light mt-2">📄 Slides: {lecture.slides_url}</p>
                    )}
                    {lecture.video_url && (
                      <p className="text-xs text-accent-light">🎥 Video: {lecture.video_url}</p>
                    )}
                    {lecture.additional_resources && lecture.additional_resources.length > 0 && (
                      <p className="text-xs text-gunSmoke mt-1">
                        📚 {lecture.additional_resources.length} additional resource(s)
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEdit(lecture)}
                      className="px-3 py-1 bg-accent-light/20 text-accent-light rounded hover:bg-accent-light/30 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleTogglePublish(lecture.id, lecture.is_published)}
                      className={`px-3 py-1 rounded text-sm ${lecture.is_published ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
                    >
                      {lecture.is_published ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BootcampEditor;
