import React, { useEffect, useState } from 'react';
import { adminLogout } from '../../lib/admin';
import GalleryEditor from './GalleryEditorV2';
import ResumeManager from './ResumeManager';
import BlurbEditor from './BlurbEditor';

interface AdminDashboardProps {
  token: string;
  email: string;
  onLogout: () => void;
}

const SECTIONS = [
  { id: 'gallery', label: 'Gallery', lede: 'Upload photos, add notes and dates, and choose each roll’s cover.' },
  { id: 'resumes', label: 'Résumés', lede: 'Upload a new version; the résumé links on rishia.in always open the latest.' },
  { id: 'blurbs', label: 'Blurbs', lede: 'Write a blurb, upload its images, and export the JSON for rishia.in.' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

// The section lives in the URL hash, so a reload or bookmark returns to it.
const sectionFromHash = (): SectionId => {
  if (typeof window === 'undefined') return 'gallery';
  const id = window.location.hash.slice(1);
  return SECTIONS.some((section) => section.id === id) ? (id as SectionId) : 'gallery';
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, email, onLogout }) => {
  const [active, setActive] = useState<SectionId>(sectionFromHash);
  const section = SECTIONS.find((entry) => entry.id === active)!;

  useEffect(() => {
    const onHashChange = () => setActive(sectionFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleLogout = async () => {
    await adminLogout(token);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    onLogout();
  };

  return (
    <>
      <header className="admin-header wrap">
        <p className="admin-brand">Rishi Ahuja <span>· Admin</span></p>
        <nav className="admin-nav" aria-label="Admin sections">
          {SECTIONS.map((entry) => (
            <a key={entry.id} href={`#${entry.id}`} aria-current={entry.id === active ? 'page' : undefined}>
              {entry.label}
            </a>
          ))}
        </nav>
        <div className="admin-account">
          <span>{email}</span>
          <a href="/gallery">View gallery ↗</a>
          <button type="button" className="admin-link-button" onClick={handleLogout}>Sign out</button>
        </div>
      </header>

      <main className="admin-main wrap" id="main-content">
        <h1 className="admin-section-title">{section.label}</h1>
        <p className="admin-section-lede">{section.lede}</p>
        {active === 'gallery' && <GalleryEditor token={token} />}
        {active === 'resumes' && <ResumeManager token={token} />}
        {active === 'blurbs' && <BlurbEditor token={token} />}
      </main>
    </>
  );
};

export default AdminDashboard;
