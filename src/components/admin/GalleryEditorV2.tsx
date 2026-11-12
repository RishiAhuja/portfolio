import React, { useState, useEffect } from 'react';
import {
  getAllGalleryCollections,
  createGalleryCollection,
  deleteGalleryCollection,
  uploadGalleryImage,
  deleteGalleryImage,
  updateGalleryImage,
  generateCollectionSlug,
  generateCollectionDisplayName,
  formatCapturedDate,
  type GalleryCollection,
  type GalleryImage,
} from '../../lib/gallery';
import { validateImageFile } from '../../lib/r2Storage';
import { framePath, resized } from '../../lib/galleryFrames';

interface GalleryEditorProps {
  token: string;
}

const GalleryEditor: React.FC<GalleryEditorProps> = ({ token }) => {
  const [collections, setCollections] = useState<GalleryCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<GalleryCollection | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewCollectionForm, setShowNewCollectionForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<{ imageId: string; caption: string; date: string } | null>(null);
  
  // Pending files with individual metadata
  const [pendingFiles, setPendingFiles] = useState<Array<{
    file: File;
    preview: string;
    capturedDate: string;
    description: string;
  }>>([]);

  // Form state for new collection
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: 0, // 0 = year-only, 1-12 = specific month
  });

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    setIsLoading(true);
    try {
      const data = await getAllGalleryCollections();
      setCollections(data);
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCollection = async () => {
    try {
      const month = formData.month === 0 ? undefined : formData.month;
      const slug = generateCollectionSlug(formData.year, month);
      const displayName = generateCollectionDisplayName(formData.year, month);

      const newCollection = await createGalleryCollection(token, {
        slug,
        year: formData.year,
        month,
        display_name: displayName,
      });

      if (newCollection) {
        await loadCollections();
        setShowNewCollectionForm(false);
        setFormData({ year: new Date().getFullYear(), month: 0 });
        alert('Collection created successfully!');
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      alert('Failed to create collection');
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (!confirm('Delete this collection and all its images? This cannot be undone.')) return;

    try {
      await deleteGalleryCollection(token, id);
      await loadCollections();
      if (selectedCollection?.id === id) {
        setSelectedCollection(null);
        setImages([]);
      }
    } catch (error) {
      console.error('Error deleting collection:', error);
    }
  };

  const handleSelectCollection = async (collection: GalleryCollection) => {
    setSelectedCollection(collection);
    setPendingFiles([]); // Clear pending files when switching collections
    // Fetch images for this collection, sorted by captured_date ASC (oldest first)
    const { supabase } = await import('../../lib/supabase');
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('collection_id', collection.id)
      .order('captured_date', { ascending: true });

    setImages((data as GalleryImage[]) || []);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCollection) {
      alert('Please select a collection first');
      return;
    }

    const files = e.target.files;
    if (!files || files.length === 0) return;

    const defaultDate = new Date().toISOString().split('T')[0];
    const newPendingFiles: typeof pendingFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        alert(`File ${file.name}: ${validation.error}`);
        continue;
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);
      
      // Try to extract date from EXIF metadata
      let capturedDate = defaultDate;
      try {
        const exifDate = await extractExifDate(file);
        if (exifDate) {
          capturedDate = exifDate;
        }
      } catch (error) {
        console.log('Could not extract EXIF date, using default');
      }
      
      newPendingFiles.push({
        file,
        preview,
        capturedDate,
        description: '',
      });
    }

    setPendingFiles([...pendingFiles, ...newPendingFiles]);
    // Reset file input
    e.target.value = '';
  };

  // Extract date from EXIF metadata
  const extractExifDate = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const view = new DataView(e.target?.result as ArrayBuffer);
          
          // Check for JPEG marker
          if (view.getUint16(0, false) !== 0xFFD8) {
            resolve(null);
            return;
          }
          
          // Find EXIF data
          let offset = 2;
          while (offset < view.byteLength) {
            if (view.getUint16(offset, false) === 0xFFE1) {
              // APP1 marker (EXIF)
              const exifOffset = offset + 10; // Skip marker, length, and "Exif\0\0"
              
              // Check for EXIF header
              if (view.getUint32(offset + 4, false) === 0x45786966) {
                const littleEndian = view.getUint16(exifOffset, false) === 0x4949;
                
                // Look for DateTimeOriginal tag (0x9003)
                const ifdOffset = exifOffset + view.getUint32(exifOffset + 4, littleEndian);
                const numEntries = view.getUint16(ifdOffset, littleEndian);
                
                for (let i = 0; i < numEntries; i++) {
                  const entryOffset = ifdOffset + 2 + (i * 12);
                  const tag = view.getUint16(entryOffset, littleEndian);
                  
                  if (tag === 0x9003 || tag === 0x0132) { // DateTimeOriginal or DateTime
                    const valueOffset = view.getUint32(entryOffset + 8, littleEndian);
                    const actualOffset = exifOffset + valueOffset;
                    
                    let dateString = '';
                    for (let j = 0; j < 19; j++) {
                      const char = view.getUint8(actualOffset + j);
                      if (char === 0) break;
                      dateString += String.fromCharCode(char);
                    }
                    
                    // Parse EXIF date format: "YYYY:MM:DD HH:MM:SS"
                    if (dateString.length >= 10) {
                      const datePart = dateString.substring(0, 10).replace(/:/g, '-');
                      resolve(datePart);
                      return;
                    }
                  }
                }
              }
              break;
            }
            offset += 2 + view.getUint16(offset + 2, false);
          }
          
          resolve(null);
        } catch (error) {
          console.error('Error parsing EXIF:', error);
          resolve(null);
        }
      };
      
      reader.onerror = () => resolve(null);
      reader.readAsArrayBuffer(file.slice(0, 128 * 1024)); // Read first 128KB for EXIF
    });
  };

  const handleUploadPendingFiles = async () => {
    if (!selectedCollection || pendingFiles.length === 0) return;

    setUploading(true);
    let successCount = 0;

    try {
      for (let i = 0; i < pendingFiles.length; i++) {
        const { file, capturedDate, description } = pendingFiles[i];

        try {
          const result = await uploadGalleryImage(
            token,
            selectedCollection.id,
            selectedCollection.slug,
            file,
            {
              capturedDate,
              description: description || undefined,
              isCover: i === 0 && images.length === 0,
            }
          );

          if (result) {
            successCount++;
          }
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
        }
      }

      alert(`Successfully uploaded ${successCount} of ${pendingFiles.length} images`);

      // Clear pending files and their previews
      pendingFiles.forEach(pf => URL.revokeObjectURL(pf.preview));
      setPendingFiles([]);

      // Reload images
      if (selectedCollection) {
        await handleSelectCollection(selectedCollection);
      }
      await loadCollections();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePendingFile = (index: number) => {
    const newPending = [...pendingFiles];
    URL.revokeObjectURL(newPending[index].preview);
    newPending.splice(index, 1);
    setPendingFiles(newPending);
  };

  const handleUpdatePendingFile = (index: number, field: 'capturedDate' | 'description', value: string) => {
    const newPending = [...pendingFiles];
    newPending[index][field] = value;
    setPendingFiles(newPending);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Delete this image? This cannot be undone.')) return;

    try {
      await deleteGalleryImage(token, imageId);
      setImages(images.filter((img) => img.id !== imageId));
      await loadCollections();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleUpdateImage = async (imageId: string) => {
    if (!editingImage || editingImage.imageId !== imageId) return;

    try {
      const result = await updateGalleryImage(token, imageId, {
        description: editingImage.caption,
        captured_date: editingImage.date,
      });

      if (result) {
        setImages(
          images.map((img) =>
            img.id === imageId
              ? { ...img, description: editingImage.caption, captured_date: editingImage.date }
              : img
          )
        );
        setEditingImage(null);
      }
    } catch (error) {
      console.error('Error updating image:', error);
    }
  };

  const startEditingImage = (image: GalleryImage) => {
    setEditingImage({
      imageId: image.id,
      caption: image.description || '',
      date: image.captured_date,
    });
  };

  const cancelEditing = () => {
    setEditingImage(null);
  };

  const sortedCollections = [...collections].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    if (a.month === null && b.month !== null) return 1;
    if (a.month !== null && b.month === null) return -1;
    if (a.month === null && b.month === null) return 0;
    return (b.month || 0) - (a.month || 0);
  });

  if (isLoading) {
    return <div className="p-8">Loading gallery collections...</div>;
  }

  return (
    <div className="gallery-editor">

      <div className="header">
        <h2>Rolls</h2>
        <button className="btn btn-primary" onClick={() => setShowNewCollectionForm(true)}>
          New roll
        </button>
      </div>

      {/* Collections Grid */}
      <div className="collections-grid">
        {sortedCollections.map((collection) => (
          <div
            key={collection.id}
            className={`collection-card ${selectedCollection?.id === collection.id ? 'selected' : ''}`}
            onClick={() => handleSelectCollection(collection)}
          >
            <h3>{collection.display_name}</h3>
            <p>{collection.image_count || 0} photos</p>
            <p className="collection-slug">{collection.slug}</p>
            <button
              className="btn btn-danger btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCollection(collection.id);
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Selected Collection Details */}
      {selectedCollection && (
        <>
          <div className="upload-section">
            <h3>Add photos to {selectedCollection.display_name}</h3>
            <div className="form-group">
              <label>Photos and videos</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif,.mp4,.webm,.mov,image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                multiple
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </div>
            
            {/* Pending Files Preview */}
            {pendingFiles.length > 0 && (
              <div className="pending-files">
                <h4>{pendingFiles.length} file{pendingFiles.length !== 1 ? 's' : ''} ready to upload</h4>
                
                {pendingFiles.map((pf, index) => {
                  const isVideo = pf.file.type.startsWith('video/');
                  return (
                  <div key={index} className="pending-file-item">
                    {isVideo ? (
                      <video src={pf.preview} className="pending-preview" controls muted />
                    ) : (
                      <img src={pf.preview} alt={pf.file.name} className="pending-preview" />
                    )}
                    
                    <div className="pending-inputs">
                      <div className="pending-file-name">
                        {pf.file.name} {isVideo && <span className="video-tag">Video</span>}
                      </div>
                      
                      <div className="form-group">
                        <label>Date taken</label>
                        <input
                          type="date"
                          value={pf.capturedDate}
                          onChange={(e) => handleUpdatePendingFile(index, 'capturedDate', e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Note (optional)</label>
                        <textarea
                          value={pf.description}
                          onChange={(e) => handleUpdatePendingFile(index, 'description', e.target.value)}
                          placeholder="A line or two about this photo"
                          rows={2}
                        />
                      </div>
                      
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleRemovePendingFile(index)}
                        disabled={uploading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )})}
                
                <button 
                  className="btn btn-primary" 
                  onClick={handleUploadPendingFiles}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading…' : `Upload ${pendingFiles.length} file${pendingFiles.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            )}
          </div>

          {/* Images Grid */}
          <div className="images-grid">
            {images.map((image) => {
              const isVideo = image.mime_type?.startsWith('video/');
              return (
              <div key={image.id} className="image-card">
                {isVideo ? (
                  <video src={image.r2_url} controls muted preload="metadata" />
                ) : (
                  <img src={resized(image.r2_url, 640)} alt={image.description || 'Gallery photo'} loading="lazy" decoding="async" />
                )}
                <div className="image-info">
                  {editingImage?.imageId === image.id ? (
                    <>
                      <div className="form-group">
                        <input
                          type="date"
                          value={editingImage.date}
                          onChange={(e) =>
                            setEditingImage({ ...editingImage, date: e.target.value })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <textarea
                          value={editingImage.caption}
                          onChange={(e) =>
                            setEditingImage({ ...editingImage, caption: e.target.value })
                          }
                          rows={3}
                        />
                      </div>
                      <div className="image-actions">
                        <button className="btn btn-primary" onClick={() => handleUpdateImage(image.id)}>
                          Save
                        </button>
                        <button className="btn" onClick={cancelEditing}>
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="image-date">{formatCapturedDate(image.captured_date)}</div>
                      <div className="image-note">{image.description || 'No note'}</div>
                      <div className="image-actions">
                        <button className="btn" onClick={() => startEditingImage(image)}>
                          Edit
                        </button>
                        <a className="btn" href={framePath(selectedCollection.slug, image)} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                        <button className="btn btn-danger" onClick={() => handleDeleteImage(image.id)}>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )})}
          </div>
        </>
      )}

      {/* New Collection Form Modal */}
      {showNewCollectionForm && (
        <div className="form-modal" onClick={() => setShowNewCollectionForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New roll</h3>
              <button className="btn" onClick={() => setShowNewCollectionForm(false)} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="form-group">
              <label>Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                min="2020"
                max="2030"
              />
            </div>

            <div className="form-group">
              <label>Month</label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
              >
                <option value="0">Whole year</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            <p className="modal-preview">
              Will be called {generateCollectionDisplayName(formData.year, formData.month === 0 ? undefined : formData.month)}
              {' ('}
              {generateCollectionSlug(formData.year, formData.month === 0 ? undefined : formData.month)}
              {')'}
            </p>

            <div className="modal-actions">
              <button className="btn" onClick={() => setShowNewCollectionForm(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleCreateCollection}>
                Create roll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryEditor;
