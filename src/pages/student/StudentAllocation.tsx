import { useState, useEffect } from 'react';

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

const Allocation: React.FC<AllocationProps> = ({ onSubmit, onSkip }) => {
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [session, setSession] = useState('');
  const [room, setRoom] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    // Load saved allocation data from localStorage
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
    if (subject && chapter && session && room) {
      // Get user info for the student
      const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')!) : null;
      const studentName = userInfo ? userInfo.name : 'Student';
      
      // Always use current date
      const currentDate = new Date().toLocaleDateString('en-GB');
      console.log('Current date being saved:', currentDate);
      
      // Check if there's a matching tutor session
      const tutorSessions = JSON.parse(localStorage.getItem('tutorSessions') || '[]');
      const matchingSession = tutorSessions.find((s: any) => 
        s.session === session && s.room === room
      );

      // Always add student to sessionStudents (regardless of matching tutor session)
      const studentInfo = {
        id: Date.now(),
        name: studentName,
        phoneNumber: userInfo ? userInfo.phoneNumber : '',
        subject,
        chapter,
        session,
        room,
        date: currentDate // Always use current date
      };

      const existingStudents = JSON.parse(localStorage.getItem('sessionStudents') || '[]');
      const updatedStudents = [...existingStudents, studentInfo];
      localStorage.setItem('sessionStudents', JSON.stringify(updatedStudents));

      // Save allocation data with current date
      const allocationDataWithDate = {
        subject,
        chapter,
        session,
        room,
        date: currentDate // Always use current date
      };
      
      localStorage.setItem('studentAllocationData', JSON.stringify(allocationDataWithDate));

      onSubmit?.({
        subject,
        chapter,
        session,
        room
      });
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
        {/* Blue Close Button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 w-8 h-8   text-gray-400 rounded-full flex items-center justify-center transition-colors duration-200  text-2xl font-bold"
          aria-label="Close"
        >
          ×
        
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Student Allocation</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Subject</label>
            <select
              className="w-full border border-blue-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
            >
              <option value="" disabled>Select subject</option>
              <option value="Tax">Tax</option>
              <option value="Account">Account</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Chapter</label>
            <select
              className="w-full border border-blue-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
              value={chapter}
              onChange={e => setChapter(e.target.value)}
              required
            >
              <option value="" disabled>Select chapter</option>
              <option value="Chapter 1">Chapter 1</option>
              <option value="Chapter 2">Chapter 2</option>
              <option value="Chapter 3">Chapter 3</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Session</label>
            <select
              className="w-full border border-blue-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
              value={session}
              onChange={e => setSession(e.target.value)}
              required
            >
              <option value="" disabled>Select session</option>
              <option value="6am - 9am">6am - 9am</option>
              <option value="10am - 1pm">10am - 1pm</option>
              <option value="2pm - 5pm">2pm - 5pm</option>
              <option value="7pm - 10pm">7pm - 10pm</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Room</label>
            <select
              className="w-full border border-blue-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
              value={room}
              onChange={e => setRoom(e.target.value)}
              required
            >
              <option value="" disabled>Select room</option>
              <option value="Room 1">Room 1</option>
              <option value="Room 2">Room 2</option>
            </select>
          </div>
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