import React, { useState, useEffect } from 'react';
import { getPendingBootcampStudents, getAllBootcampStudents, updateBootcampStudentStatus, deleteBootcampStudent, type BootcampStudent } from '../../lib/admin';

interface BootcampStudentsManagerProps {
  token: string;
}

const BootcampStudentsManager: React.FC<BootcampStudentsManagerProps> = ({ token }) => {
  const [pendingStudents, setPendingStudents] = useState<BootcampStudent[]>([]);
  const [allStudents, setAllStudents] = useState<BootcampStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const [pending, all] = await Promise.all([
        getPendingBootcampStudents(token),
        getAllBootcampStudents(token)
      ]);
      setPendingStudents(pending);
      setAllStudents(all);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const success = await updateBootcampStudentStatus(token, id, 'approved');
      if (success) {
        await loadStudents();
      }
    } catch (error) {
      console.error('Error approving student:', error);
      alert('Failed to approve student');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this request?')) return;
    
    try {
      const success = await updateBootcampStudentStatus(token, id, 'rejected');
      if (success) {
        await loadStudents();
      }
    } catch (error) {
      console.error('Error rejecting student:', error);
      alert('Failed to reject student');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
      const success = await deleteBootcampStudent(token, id);
      if (success) {
        await loadStudents();
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gunSmoke/10 text-gunSmoke border-gunSmoke/30';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-light"></div>
      </div>
    );
  }

  const studentsToShow = activeTab === 'pending' ? pendingStudents : allStudents;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-quillGray font-ptMono">Bootcamp Students</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded font-ptMono text-sm transition-all ${
              activeTab === 'pending'
                ? 'bg-accent-light text-codGray'
                : 'bg-darkGrey/30 text-gunSmoke hover:bg-darkGrey/50'
            }`}
          >
            Pending ({pendingStudents.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded font-ptMono text-sm transition-all ${
              activeTab === 'all'
                ? 'bg-accent-light text-codGray'
                : 'bg-darkGrey/30 text-gunSmoke hover:bg-darkGrey/50'
            }`}
          >
            All Students ({allStudents.length})
          </button>
        </div>
      </div>

      {studentsToShow.length === 0 ? (
        <div className="text-center py-12 bg-darkGrey/20 rounded-lg border border-darkGrey/50">
          <svg className="w-16 h-16 text-gunSmoke/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gunSmoke font-ptMono">
            {activeTab === 'pending' ? 'No pending requests' : 'No students found'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {studentsToShow.map((student) => (
            <div
              key={student.id}
              className="bg-darkGrey/20 border border-darkGrey/50 rounded-lg p-4 hover:border-accent-light/20 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-accent-light/10 flex items-center justify-center text-accent-light font-ptMono font-bold text-sm">
                      {student.initials}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-quillGray font-ptMono">
                        {student.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-ptMono border ${getStatusBadgeClass(student.status)}`}>
                          {student.status}
                        </span>
                        {student.consent && (
                          <span className="text-xs text-green-400 font-ptMono">✓ Consented</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 ml-13">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gunSmoke/80 font-ptMono mb-1">
                      {student.email && (
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                          </svg>
                          {student.email}
                        </span>
                      )}
                      {student.college && (
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                          </svg>
                          {student.college}
                        </span>
                      )}
                      {student.year_of_study && (
                        <span className="inline-flex items-center gap-1">
                          Year {student.year_of_study}
                        </span>
                      )}
                    </div>
                    <a
                      href={student.linkedin_profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent-light/80 hover:text-accent-light font-ptMono inline-flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                    {student.linkedin_post && (
                      <a
                        href={student.linkedin_post}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gunSmoke/80 hover:text-accent-light font-ptMono inline-flex items-center gap-1 ml-4"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                        </svg>
                        Post
                      </a>
                    )}
                    {student.github_profile && (
                      <a
                        href={student.github_profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gunSmoke/80 hover:text-accent-light font-ptMono inline-flex items-center gap-1 ml-4"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </a>
                    )}
                    {student.learning_takeaway && (
                      <p className="text-xs text-gunSmoke/70 font-ptMono mt-2 italic">
                        "{student.learning_takeaway}"
                      </p>
                    )}
                    <p className="text-xs text-gunSmoke/60 font-ptMono mt-1">
                      Requested: {new Date(student.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {student.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(student.id)}
                        className="px-3 py-1.5 bg-green-500/10 border border-green-500/40 rounded text-green-400 hover:bg-green-500 hover:text-white transition-all duration-200 font-ptMono text-xs"
                        title="Approve"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleReject(student.id)}
                        className="px-3 py-1.5 bg-red-500/10 border border-red-500/40 rounded text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 font-ptMono text-xs"
                        title="Reject"
                      >
                        ✗ Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="px-3 py-1.5 bg-red-500/10 border border-red-500/40 rounded text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200 font-ptMono text-xs"
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BootcampStudentsManager;
