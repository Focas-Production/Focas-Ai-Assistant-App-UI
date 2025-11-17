import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

// Level-based curriculum mapping
const LEVEL_SUBJECTS: Record<string, { name: string; chapters: string[] }[]> = {
  Foundation: [
    { name: 'Principles and Practice of Accounting', chapters: ['Theoretical Framework', 'Accounting Process', 'Financial Statements', 'Bank Reconciliation & Depreciation'] },
    { name: 'Business Laws and BCR', chapters: ['Business Laws Basics', 'Sale of Goods', 'Contracts', 'Correspondence & Reporting'] },
    { name: 'Business Mathematics, LR & Statistics', chapters: ['Business Mathematics', 'Logical Reasoning', 'Statistics'] },
    { name: 'Business Economics & BCK', chapters: ['Economics Basics', 'Market Structures', 'Business & Commercial Knowledge'] },
  ],
  Intermediate: [
    { name: 'Advanced Accounting', chapters: ['Ind AS Framework', 'Presentation & Disclosures', 'Consolidation', 'Amalgamation & Reconstruction'] },
    { name: 'Corporate and Other Laws', chapters: ['Companies Act', 'LLP Act', 'Other Laws'] },
    { name: 'Taxation', chapters: ['Income Tax', 'GST'] },
    { name: 'Cost & Management Accounting', chapters: ['Cost Sheet', 'Process & Service Costing', 'Standard & Budgetary Control', 'Marginal & ABC'] },
    { name: 'Auditing & Ethics', chapters: ['Standards on Auditing', 'Audit Process', 'Internal Control', 'Professional Ethics'] },
    { name: 'Financial Management & Strategic Management', chapters: ['FM Basics', 'Working Capital', 'Investment Decisions', 'Strategic Analysis'] },
  ],
  Final: [
    { name: 'Financial Reporting', chapters: ['Ind AS & Framework', 'Consolidation', 'Schedule III Disclosures'] },
    { name: 'Advanced Financial Management', chapters: ['Risk Management', 'Valuation & M&A', 'International Finance'] },
    { name: 'Advanced Auditing & Professional Ethics', chapters: ['Assurance & Quality Control', 'Professional Ethics', 'Group Audits'] },
    { name: 'Direct Tax Laws & International Taxation', chapters: ['Domestic Tax Planning', 'Transfer Pricing & DTAA'] },
    { name: 'Indirect Tax Laws', chapters: ['GST In-Depth', 'Customs & FTP'] },
    { name: 'Integrated Business Solutions', chapters: ['Case Studies', 'Strategic Costing', 'Corporate & Economic Laws'] },
  ],
};

// --- Mock Session Manager (Placeholder for the missing utility) ---
const sessionManager = {
  startSession: (sessionDetails: {
    studentName: string;
    date: string;
    session: string;
    room: string;
    subject: string;
    chapter: string;
  }) => {
    const sessionId = `session_${Date.now()}`;
    console.log("Starting new session with details:", { ...sessionDetails, sessionId });
    return { sessionId, ...sessionDetails };
  },
};

interface AllocationData {
  subject: string;
  chapter: string;
  session: string;
  room: string;
}

interface AllocationProps {
  onSubmit?: (data: AllocationData) => void;
  onSkip?: () => void;
}

interface FormErrors {
  subject?: string;
  chapter?: string;
  session?: string;
  room?: string;
}

interface CustomDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  onFocus?: () => void;
}

interface Subject {
  _id: string;
  name: string;
  description?: string;
  chapters: Array<{
    _id: string;
    title: string;
    topics: Array<{
      _id: string;
      title: string;
      description?: string;
    }>;
  }>;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ label, options, value, onChange, placeholder, error, onFocus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onFocus={onFocus}
          className={`w-full px-4 py-3 border rounded-xl text-left transition-colors duration-200 ${
            error ? 'border-red-500' : 'border-gray-300 hover:border-blue-400'
          } ${isOpen ? 'border-blue-500' : ''}`}
        >
          <span className={value ? 'text-gray-800' : 'text-gray-500'}>{value || placeholder}</span>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {isOpen ? '▲' : '▼'}
          </span>
        </button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-800"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

// --- Main Allocation Component ---
const Allocation: React.FC<AllocationProps> = ({ onSubmit, onSkip }) => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [session, setSession] = useState('');
  const [room, setRoom] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Database data states
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  // Session and room options (these can be hardcoded or fetched from config)
  const sessionOptions = ["6am - 9am", "10am - 1pm", "2pm - 5pm", "7pm - 10pm"];
  const roomOptions = ["Room 1", "Room 2"];

  // Initialize subjects from student's level; falls back to API if level is missing
  useEffect(() => {
    const level = (user as any)?.level as string | undefined;
    const levelData = level ? LEVEL_SUBJECTS[level] : undefined;
    if (levelData) {
      // Map to Subject shape for local use
      setSubjects(
        levelData.map((s, idx) => ({
          _id: String(idx + 1),
          name: s.name,
          description: '',
          chapters: s.chapters.map((c, i) => ({ _id: `${idx + 1}-${i + 1}`, title: c, topics: [] })),
        }))
      );
    } else {
      // No level available; try API as a fallback
      (async () => {
        try {
          setLoading(true);
          const response = await apiService.getSubjects();
          if (Array.isArray(response)) setSubjects(response as any);
        } catch (e) {
          // ignore; user will see empty and can retry
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [user]);

  // Fetch chapters when subject changes
  useEffect(() => {
    const fetchChapters = async () => {
      if (!selectedSubjectId) {
        setChapters([]);
        setChapter('');
        return;
      }

      // Find chapters from local subject list based on selectedSubjectId
      const subj = subjects.find((s) => s._id === selectedSubjectId);
      if (subj && subj.chapters) {
        setChapters(subj.chapters.map((c: any) => c.title));
      } else {
        setChapters([]);
      }
    };

    fetchChapters();
  }, [selectedSubjectId, subjects]);

  // Load saved data on component mount
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const savedAllocationData = localStorage.getItem('studentAllocationData');
    if (savedAllocationData) {
      const data = JSON.parse(savedAllocationData);
      setSubject(data.subject || '');
      setChapter(data.chapter || '');
      setSession(data.session || '');
      setRoom(data.room || '');
    }
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  const handleSubjectChange = (selectedSubject: string) => {
    setSubject(selectedSubject);
    setChapter(''); // Reset chapter when subject changes
    
    // Find the subject ID
    const foundSubject = subjects.find(s => s.name === selectedSubject);
    if (foundSubject) {
      setSelectedSubjectId(foundSubject._id);
    }
    
    setErrors(prev => ({ ...prev, subject: undefined }));
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const newErrors: FormErrors = {};
  //   if (!subject) newErrors.subject = "Please select a subject.";
  //   if (!chapter) newErrors.chapter = "Please select a chapter.";
  //   if (!session) newErrors.session = "Please select a session.";
  //   if (!room) newErrors.room = "Please select a room.";

  //   setErrors(newErrors);
  //   if (Object.keys(newErrors).length > 0) return;

  //   try {
  //     setLoading(true);
      
  //     // Create session in database
  //     const sessionData = {
  //       studentName: user?.name || 'Student',
  //       date: new Date().toLocaleDateString('en-GB'),
  //       session,
  //       room,
  //       subject,
  //       chapter,
  //       studentId: user?.id || '',
  //       tutorId: '', // You can assign a tutor here if needed
  //     };

  //     const newSession = await apiService.createSession(sessionData);
  //     console.log('Session created in database:', newSession);

  //     // Also save to localStorage for backward compatibility
  //     const studentInfo = {
  //       id: (newSession as { _id?: string })._id || Date.now(),
  //       name: user?.name || 'Student',
  //       phoneNumber: user?.phone || '',
  //       subject,
  //       chapter,
  //       session,
  //       room,
  //       date: new Date().toLocaleDateString('en-GB'),
  //       tutorName: ''
  //     };

  //     const existingStudents = JSON.parse(localStorage.getItem('sessionStudents') || '[]');
  //     const updatedStudents = [...existingStudents, studentInfo];
  //     localStorage.setItem('sessionStudents', JSON.stringify(updatedStudents));

  //     const allocationDataWithDate = { subject, chapter, session, room, date: new Date().toLocaleDateString('en-GB') };
  //     localStorage.setItem('studentAllocationData', JSON.stringify(allocationDataWithDate));

  //     console.log('Session data saved to localStorage as well');
  //     onSubmit?.({ subject, chapter, session, room });
      
  //   } catch (error) {
  //     console.error('Error creating session:', error);
  //     // Fallback to localStorage only
  //     const studentInfo = {
  //       id: Date.now(),
  //       name: user?.name || 'Student',
  //       phoneNumber: user?.phone || '',
  //       subject,
  //       chapter,
  //       session,
  //       room,
  //       date: new Date().toLocaleDateString('en-GB'),
  //       tutorName: ''
  //     };

  //     const existingStudents = JSON.parse(localStorage.getItem('sessionStudents') || '[]');
  //     const updatedStudents = [...existingStudents, studentInfo];
  //     localStorage.setItem('sessionStudents', JSON.stringify(updatedStudents));

  //     const allocationDataWithDate = { subject, chapter, session, room, date: new Date().toLocaleDateString('en-GB') };
  //     localStorage.setItem('studentAllocationData', JSON.stringify(allocationDataWithDate));

  //     onSubmit?.({ subject, chapter, session, room });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // src/components/Allocation.tsx (REVISED)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Validation logic remains the same...
  const newErrors: FormErrors = {};
  if (!subject) newErrors.subject = "Please select a subject.";
  if (!chapter) newErrors.chapter = "Please select a chapter.";
  if (!session) newErrors.session = "Please select a session.";
  if (!room) newErrors.room = "Please select a room.";

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  try {
    setLoading(true);
    
    // The only data source we need to update is the database.
    const sessionData = {
      studentName: user?.name || 'Student',
      // The backend expects a proper date format, let's create it properly
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      session,
      room,
      subject,
      chapter,
      studentId: user?.id || '', 
    };

    // This API call creates the session in the database. That's all we need.
    await apiService.createSession(sessionData);
    
    console.log('Session created successfully in the database.');

    // The onSubmit callback will tell the parent component to close the modal 
    // and refresh its data from the API.
    onSubmit?.({ subject, chapter, session, room });
    
  } catch (error) {
    console.error('Error creating session:', error);
    // You might want to show an error message to the user here
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 overflow-hidden bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 w-8 h-8 text-gray-400 rounded-full flex items-center justify-center transition-colors duration-200 text-2xl font-bold hover:text-gray-600"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Student Allocation</h2>
        
        {loading && (
          <div className="text-center mb-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600 mt-2">Loading data...</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          
          <CustomDropdown 
            label="Subject"
            options={subjects.map(s => s.name)}
            value={subject}
            onChange={handleSubjectChange}
            placeholder={loading ? "Loading subjects..." : "Select subject"}
            error={errors.subject}
            onFocus={() => setErrors(prev => ({ ...prev, subject: undefined }))}
          />

          <CustomDropdown 
            label="Chapter"
            options={chapters}
            value={chapter}
            onChange={setChapter}
            placeholder={loading ? "Loading chapters..." : "Select chapter"}
            error={errors.chapter}
            onFocus={() => setErrors(prev => ({ ...prev, chapter: undefined }))}
          />

          <CustomDropdown 
            label="Session"
            options={sessionOptions}
            value={session}
            onChange={setSession}
            placeholder="Select session"
            error={errors.session}
            onFocus={() => setErrors(prev => ({ ...prev, session: undefined }))}
          />

          <CustomDropdown 
            label="Room"
            options={roomOptions}
            value={room}
            onChange={setRoom}
            placeholder="Select room"
            error={errors.room}
            onFocus={() => setErrors(prev => ({ ...prev, room: undefined }))}
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl shadow-lg text-lg mt-2 transition"
          >
            {loading ? 'Creating Session...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Allocation;