import React, { useState, useEffect } from 'react';

const AttendeeRequestForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    yearOfStudy: '',
    linkedinProfile: '',
    linkedinPost: '',
    githubProfile: '',
    initials: '',
    learningTakeaway: '',
    consent: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleShowForm = () => {
      console.log('Show form event received');
      setIsOpen(true);
    };

    window.addEventListener('showAttendeeForm', handleShowForm);
    console.log('AttendeeRequestForm mounted');
    return () => {
      window.removeEventListener('showAttendeeForm', handleShowForm);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      name: '',
      email: '',
      college: '',
      yearOfStudy: '',
      linkedinProfile: '',
      linkedinPost: '',
      githubProfile: '',
      initials: '',
      learningTakeaway: '',
      consent: true
    });
    setError('');
    setSuccess(false);
    
    // Reload page after successful submission
    if (success) {
      window.location.reload();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Prepare the data with proper types
      const submitData = {
        name: formData.name,
        email: formData.email,
        college: formData.college,
        yearOfStudy: formData.yearOfStudy ? parseInt(formData.yearOfStudy, 10) : null,
        linkedinProfile: formData.linkedinProfile,
        linkedinPost: formData.linkedinPost || null,
        githubProfile: formData.githubProfile || null,
        initials: formData.initials,
        learningTakeaway: formData.learningTakeaway || null,
        consent: formData.consent
      };

      console.log('Submitting data:', submitData);

      const response = await fetch('/api/bootcamp-students/submit-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      console.log('Response status:', response.status);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = e.target;
    const checked = target.checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate initials from name
    if (name === 'name' && value) {
      const initials = value
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 3);
      setFormData(prev => ({ ...prev, initials }));
    }
  };

  if (!isOpen) {
    return null;
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-darkGrey rounded-lg p-8 max-w-md w-full border border-accent-light/30 text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 text-accent-light mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-quillGray mb-2 font-ptMono">Request Submitted!</h3>
          <p className="text-gunSmoke font-ptMono text-sm">
            Your request has been submitted successfully. You will be listed once approved by the admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-darkGrey rounded-lg p-6 max-w-md w-full border border-gunSmoke/50 my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-quillGray font-ptMono">Request to be Listed</h3>
          <button
            onClick={handleClose}
            className="text-gunSmoke hover:text-quillGray transition-colors"
            aria-label="Close form"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-ptMono text-gunSmoke mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-codGray border border-gunSmoke/30 rounded text-quillGray font-ptMono text-sm focus:outline-none focus:border-accent-light/50 transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-ptMono text-gunSmoke mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-codGray border border-gunSmoke/30 rounded text-quillGray font-ptMono text-sm focus:outline-none focus:border-accent-light/50 transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="college" className="block text-sm font-ptMono text-gunSmoke mb-2">
                College/University <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="college"
                name="college"
                value={formData.college}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-codGray border border-gunSmoke/30 rounded text-quillGray font-ptMono text-sm focus:outline-none focus:border-accent-light/50 transition-colors"
                placeholder="University Name"
              />
            </div>

            <div>
              <label htmlFor="yearOfStudy" className="block text-sm font-ptMono text-gunSmoke mb-2">
                Year of Study
              </label>
              <select
                id="yearOfStudy"
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-codGray border border-gunSmoke/30 rounded text-quillGray font-ptMono text-sm focus:outline-none focus:border-accent-light/50 transition-colors"
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
                <option value="6">6th Year</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="initials" className="block text-sm font-ptMono text-gunSmoke mb-2">
              Initials <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="initials"
              name="initials"
              value={formData.initials}
              onChange={handleChange}
              required
              maxLength={3}
              className="w-full px-4 py-2 bg-codGray border border-gunSmoke/30 rounded text-quillGray font-ptMono text-sm focus:outline-none focus:border-accent-light/50 transition-colors"
              placeholder="JD"
            />
            <p className="text-xs text-gunSmoke/60 font-ptMono mt-1">Auto-generated from your name (max 3 characters)</p>
          </div>

          <div>
            <label htmlFor="linkedinProfile" className="block text-sm font-ptMono text-gunSmoke mb-2">
              LinkedIn Profile URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              id="linkedinProfile"
              name="linkedinProfile"
              value={formData.linkedinProfile}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-codGray border border-gunSmoke/30 rounded text-quillGray font-ptMono text-sm focus:outline-none focus:border-accent-light/50 transition-colors"
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div>
            <label htmlFor="linkedinPost" className="block text-sm font-ptMono text-gunSmoke mb-2">
              LinkedIn Post URL (Optional)
            </label>
            <input
              type="url"
              id="linkedinPost"
              name="linkedinPost"
              value={formData.linkedinPost}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-codGray border border-gunSmoke/30 rounded text-quillGray font-ptMono text-sm focus:outline-none focus:border-accent-light/50 transition-colors"
              placeholder="https://linkedin.com/posts/..."
            />
            <p className="text-xs text-gunSmoke/60 font-ptMono mt-1">Share your bootcamp journey post</p>
          </div>

          <div>
            <label htmlFor="githubProfile" className="block text-sm font-ptMono text-gunSmoke mb-2">
              GitHub Profile URL (Optional)
            </label>
            <input
              type="url"
              id="githubProfile"
              name="githubProfile"
              value={formData.githubProfile}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-codGray border border-gunSmoke/30 rounded text-quillGray font-ptMono text-sm focus:outline-none focus:border-accent-light/50 transition-colors"
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label htmlFor="learningTakeaway" className="block text-sm font-ptMono text-gunSmoke mb-2">
              What did you learn? (Optional)
            </label>
            <textarea
              id="learningTakeaway"
              name="learningTakeaway"
              value={formData.learningTakeaway}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 bg-codGray border border-gunSmoke/30 rounded text-quillGray font-ptMono text-sm focus:outline-none focus:border-accent-light/50 transition-colors resize-none"
              placeholder="Share your key takeaways from the bootcamp..."
            />
            <p className="text-xs text-gunSmoke/60 font-ptMono mt-1">Optional: Share what you learned or built during the bootcamp</p>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-1 w-4 h-4 rounded border-gunSmoke/30 bg-codGray text-accent-light focus:ring-accent-light/50 focus:ring-2"
            />
            <label htmlFor="consent" className="text-sm font-ptMono text-gunSmoke flex-1">
              I consent to have my name, college, and LinkedIn profile displayed on the bootcamp attendees list
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
              <p className="text-red-400 text-sm font-ptMono">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-darkGrey/50 border border-gunSmoke/40 rounded text-gunSmoke hover:border-gunSmoke/60 hover:text-quillGray transition-all duration-200 font-ptMono text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.consent}
              className="flex-1 px-4 py-2 bg-accent-light/10 border border-accent-light/40 rounded text-accent-light hover:bg-accent-light hover:text-codGray disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-ptMono text-sm font-bold"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendeeRequestForm;
