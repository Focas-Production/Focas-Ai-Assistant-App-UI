import React, { useState, useEffect, useRef } from 'react';

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
  onFocus?: () => void; // <-- added
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    onFocus?.(); // clear the error when clicked
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          className={`w-full text-left px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 flex justify-between items-center ${error ? 'border-red-500' : 'border-blue-600'}`}
        >
          <span className={value ? 'text-gray-800' : 'text-gray-500'}>
            {value || placeholder}
          </span>
         <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>

        </button>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-600 rounded-lg shadow-lg z-20">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 text-gray-800"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

// --- Main Allocation Component ---
const Allocation: React.FC<AllocationProps> = ({ onSubmit, onSkip }) => {
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [session, setSession] = useState('');
  const [room, setRoom] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    if (!subject) newErrors.subject = "Please select a subject.";
    if (!chapter) newErrors.chapter = "Please select a chapter.";
    if (!session) newErrors.session = "Please select a session.";
    if (!room) newErrors.room = "Please select a room.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null;
    const studentName = userInfo ? userInfo.name : 'Student';
    const currentDate = new Date().toLocaleDateString('en-GB');
    let tutorName = '';
    if (userInfo && userInfo.role === 'tutor') tutorName = userInfo.name;
    // If you have a way to assign a tutor to a student, set tutorName accordingly

    const studentInfo = {
      id: Date.now(),
      name: studentName,
      phoneNumber: userInfo ? userInfo.phoneNumber : '',
      subject,
      chapter,
      session,
      room,
      date: currentDate,
      tutorName // <-- add this line
    };

    const existingStudents = JSON.parse(localStorage.getItem('sessionStudents') || '[]');
    const updatedStudents = [...existingStudents, studentInfo];
    localStorage.setItem('sessionStudents', JSON.stringify(updatedStudents));

    const allocationDataWithDate = { subject, chapter, session, room, date: currentDate };
    localStorage.setItem('studentAllocationData', JSON.stringify(allocationDataWithDate));

    const newSession = sessionManager.startSession({
      studentName,
      date: currentDate,
      session,
      room,
      subject,
      chapter
    });

    console.log('Started new session with ID:', newSession.sessionId);
    onSubmit?.({ subject, chapter, session, room });
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
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          
          <CustomDropdown 
            label="Subject"
            options={["Tax", "Account", "Finance"]}
            value={subject}
            onChange={setSubject}
            placeholder="Select subject"
            error={errors.subject}
            onFocus={() => setErrors(prev => ({ ...prev, subject: undefined }))}
          />

          <CustomDropdown 
            label="Chapter"
            options={["Chapter 1", "Chapter 2", "Chapter 3"]}
            value={chapter}
            onChange={setChapter}
            placeholder="Select chapter"
            error={errors.chapter}
            onFocus={() => setErrors(prev => ({ ...prev, chapter: undefined }))}
          />

          <CustomDropdown 
            label="Session"
            options={["6am - 9am", "10am - 1pm", "2pm - 5pm", "7pm - 10pm"]}
            value={session}
            onChange={setSession}
            placeholder="Select session"
            error={errors.session}
            onFocus={() => setErrors(prev => ({ ...prev, session: undefined }))}
          />

          <CustomDropdown 
            label="Room"
            options={["Room 1", "Room 2"]}
            value={room}
            onChange={setRoom}
            placeholder="Select room"
            error={errors.room}
            onFocus={() => setErrors(prev => ({ ...prev, room: undefined }))}
          />
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg text-lg mt-2 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Allocation;