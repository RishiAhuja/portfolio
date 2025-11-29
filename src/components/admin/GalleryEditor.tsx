import React, { useState, useEffect } from 'react';
import {
  getAllGalleryEvents,
  createGalleryEvent,
  updateGalleryEvent,
  deleteGalleryEvent,
  uploadGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
  generateSlug,
  formatEventDate,
  type GalleryEventWithCount,
  type GalleryImage,
} from '../../lib/gallery';
import { validateImageFile } from '../../lib/r2Storage';

interface GalleryEditorProps {
  token: string;
}

const GalleryEditor: React.FC<GalleryEditorProps> = ({ token }) => {
  const [events, setEvents] = useState<GalleryEventWithCount[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<GalleryEventWithCount | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state for new/edit event
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    event_date: new Date().toISOString().split('T')[0],
    location: '',
    category: 'hackathon',
    is_featured: false,
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await getAllGalleryEvents(token);
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const newEvent = await createGalleryEvent(token, formData);
      if (newEvent) {
        await loadEvents();
        setShowNewEventForm(false);
        resetForm();
        alert('Event created successfully!');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Delete this event and all its images? This cannot be undone.')) return;
    
    try {
      await deleteGalleryEvent(token, id);
      await loadEvents();
      if (selectedEvent?.id === id) {
        setSelectedEvent(null);
        setImages([]);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleSelectEvent = async (event: GalleryEventWithCount) => {
    setSelectedEvent(event);
    // Fetch images for this event
    const { supabase } = await import('../../lib/supabase');
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('event_id', event.id)
      .order('sort_order', { ascending: true });
    
    setImages(data as GalleryImage[] || []);
  };

  const handleImageUpload = async (files: FileList) => {
    if (!selectedEvent) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          alert(`${file.name}: ${validation.error}`);
          return null;
        }

        return await uploadGalleryImage(
          token,
          selectedEvent.id,
          selectedEvent.slug,
          file,
          {
            sortOrder: images.length + index,
            isCover: images.length === 0 && index === 0, // First image is cover
          }
        );
      });

      await Promise.all(uploadPromises);
      await handleSelectEvent(selectedEvent); // Reload images
      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload some images');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Delete this image?')) return;

    try {
      await deleteGalleryImage(token, imageId);
      await handleSelectEvent(selectedEvent!);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleSetCover = async (image: GalleryImage) => {
    try {
      // Unset all covers first
      await Promise.all(
        images.map((img) =>
          updateGalleryImage(token, img.id, { is_cover: false })
        )
      );
      // Set new cover
      await updateGalleryImage(token, image.id, { is_cover: true });
      await handleSelectEvent(selectedEvent!);
      alert('Cover image updated!');
    } catch (error) {
      console.error('Error setting cover:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      event_date: new Date().toISOString().split('T')[0],
      location: '',
      category: 'hackathon',
      is_featured: false,
    });
  };

  if (isLoading) {
    return <div className="text-gunSmoke">Loading gallery...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-quillGray">Gallery Management</h3>
        <button
          onClick={() => setShowNewEventForm(!showNewEventForm)}
          className="px-4 py-2 bg-accent-light/10 border border-accent-light/40 rounded text-accent-light hover:bg-accent-light hover:text-codGray transition-colors"
        >
          {showNewEventForm ? 'Cancel' : '+ New Event'}
        </button>
      </div>

      {/* New Event Form */}
      {showNewEventForm && (
        <div className="bg-darkGrey/20 p-6 rounded-lg space-y-4">
          <h4 className="text-lg font-medium text-quillGray">Create New Event</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gunSmoke mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({
                  ...formData,
                  title: e.target.value,
                  slug: generateSlug(e.target.value)
                })}
                className="w-full px-3 py-2 bg-codGray/50 text-quillGray rounded border border-gunSmoke/30 focus:border-accent-light focus:outline-none"
                placeholder="Tech Hackathon 2025"
              />
            </div>

            <div>
              <label className="block text-sm text-gunSmoke mb-1">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 bg-codGray/50 text-quillGray rounded border border-gunSmoke/30 focus:border-accent-light focus:outline-none"
                placeholder="tech-hackathon-2025"
              />
            </div>

            <div>
              <label className="block text-sm text-gunSmoke mb-1">Date</label>
              <input
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full px-3 py-2 bg-codGray/50 text-quillGray rounded border border-gunSmoke/30 focus:border-accent-light focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gunSmoke mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-codGray/50 text-quillGray rounded border border-gunSmoke/30 focus:border-accent-light focus:outline-none"
                placeholder="San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm text-gunSmoke mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-codGray/50 text-quillGray rounded border border-gunSmoke/30 focus:border-accent-light focus:outline-none"
              >
                <option value="hackathon">Hackathon</option>
                <option value="trip">Trip</option>
                <option value="delegation">Delegation</option>
                <option value="conference">Conference</option>
                <option value="casual">Casual</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="mr-2"
              />
              <label className="text-sm text-gunSmoke">Featured</label>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gunSmoke mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-codGray/50 text-quillGray rounded border border-gunSmoke/30 focus:border-accent-light focus:outline-none"
              rows={3}
              placeholder="A brief description of the event..."
            />
          </div>

          <button
            onClick={handleCreateEvent}
            className="px-4 py-2 bg-accent-light text-codGray rounded hover:bg-accent-light/90 transition-colors"
          >
            Create Event
          </button>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className={`bg-darkGrey/20 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
              selectedEvent?.id === event.id
                ? 'border-accent-light'
                : 'border-transparent hover:border-gunSmoke/30'
            }`}
            onClick={() => handleSelectEvent(event)}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-quillGray font-medium">{event.title}</h4>
              {event.is_featured && (
                <span className="text-xs bg-accent-light/20 text-accent-light px-2 py-0.5 rounded">
                  ★ Featured
                </span>
              )}
            </div>
            <p className="text-sm text-gunSmoke mb-2">
              {formatEventDate(event.event_date)} • {event.location || 'No location'}
            </p>
            <div className="flex justify-between items-center text-xs text-gunSmoke">
              <span className="bg-codGray/50 px-2 py-1 rounded">{event.category}</span>
              <span>{event.image_count} photos</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteEvent(event.id);
              }}
              className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Delete Event
            </button>
          </div>
        ))}
      </div>

      {/* Image Upload Section */}
      {selectedEvent && (
        <div className="bg-darkGrey/20 p-6 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium text-quillGray">
              Images for "{selectedEvent.title}"
            </h4>
            <label className="px-4 py-2 bg-accent-light/10 border border-accent-light/40 rounded text-accent-light hover:bg-accent-light hover:text-codGray transition-colors cursor-pointer">
              {uploading ? 'Uploading...' : '+ Upload Images'}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.r2_url}
                  alt={image.title || 'Gallery image'}
                  className="w-full h-48 object-cover rounded"
                />
                {image.is_cover && (
                  <div className="absolute top-2 left-2 bg-accent-light text-codGray px-2 py-1 text-xs rounded">
                    Cover
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded flex flex-col items-center justify-center gap-2">
                  <button
                    onClick={() => handleSetCover(image)}
                    className="px-3 py-1 bg-accent-light text-codGray rounded text-sm"
                  >
                    Set as Cover
                  </button>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <p className="text-center text-gunSmoke py-12">
              No images yet. Upload your first image!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryEditor;
