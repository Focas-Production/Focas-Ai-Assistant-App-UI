// import { useState } from 'react';
// import StudentSidebar from './Sidebar';
// import logo from '../../assets/logo.png';

// const Allocation = () => {
//   // Modal open by default for this UI
//   const [subject, setSubject] = useState('');
//   const [chapter, setChapter] = useState('');
//   const [session, setSession] = useState('');
//   const [room, setRoom] = useState('');

//   // Example table data
//   const tableRows = [
//     { subject: 'Accounts', chapter: 'Chapter 4', topic: 'Topic 2', status: 'Pending' },
//     { subject: 'Accounts', chapter: 'Chapter 3', topic: 'Topic 1.2', status: 'Come to live' },
//     { subject: 'Accounts', chapter: 'Chapter 2', topic: 'Topic 1.1', status: 'Completed' },
//     { subject: 'Accounts', chapter: 'Chapter 1', topic: 'Topic 1', status: 'Completed' },
//     { subject: 'Tax', chapter: 'Chapter 2', topic: 'Topic 1.1', status: 'Completed' },
//     { subject: 'Tax', chapter: 'Chapter 1', topic: 'Topic 1', status: 'Completed' },
//   ];

//   return (
//     <div className="flex h-screen bg-[#f7f9fc]">
//       <StudentSidebar />
//       <div className="flex-1 ml-60 flex flex-col relative">
//         {/* Header */}
//         <div className="flex justify-end items-center h-20 px-10 border-b border-gray-200 bg-transparent">
//           <img src={logo} alt="FOCAS Logo" className="h-10 w-auto" />
//         </div>
//         {/* Table background */}
//         <div className="flex-1 flex items-center justify-center relative">
//           <div className="w-full max-w-3xl mt-10">
//             <table className="w-full border border-[#120088] text-sm rounded-lg overflow-hidden bg-white">
//               <thead className="bg-white border-b border-[#120088]">
//                 <tr>
//                   <th className="py-2 px-4 text-[#120088] text-lg font-bold">Subject</th>
//                   <th className="py-2 px-4 text-[#120088] text-lg font-bold">Chapter</th>
//                   <th className="py-2 px-4 text-[#120088] text-lg font-bold">Topic</th>
//                   <th className="py-2 px-4 text-[#120088] text-lg font-bold">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {tableRows.map((row, idx) => (
//                   <tr key={idx} className="border-b border-[#120088] last:border-b-0">
//                     <td className="py-2 px-4">{row.subject}</td>
//                     <td className="py-2 px-4">{row.chapter}</td>
//                     <td className="py-2 px-4">{row.topic}</td>
//                     <td className={`py-2 px-4 font-semibold ${
//                       row.status === 'Completed'
//                         ? 'text-green-500'
//                         : row.status === 'Come to live'
//                         ? 'text-blue-600'
//                         : 'text-gray-500'
//                     }`}>
//                       {row.status}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           {/* Modal Overlay */}
//           <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
//             <div className="bg-white rounded-xl shadow-2xl p-10 min-w-[400px] max-w-[420px] mx-4 flex flex-col items-center relative">
//               <form className="w-full flex flex-col items-center gap-6">
//                 <div className="flex gap-6 w-full">
//                   <div className="flex-1">
//                     <select
//                       className="w-full border-2 border-[#120088] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#120088] appearance-none"
//                       value={subject}
//                       onChange={e => setSubject(e.target.value)}
//                     >
//                       <option value="" disabled>Select subject</option>
//                       <option value="Subject 1">Subject 1</option>
//                       <option value="Subject 2">Subject 2</option>
//                       <option value="Subject 3">Subject 3</option>
//                     </select>
//                   </div>
//                   <div className="flex-1">
//                     <select
//                       className="w-full border-2 border-[#120088] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#120088] appearance-none"
//                       value={chapter}
//                       onChange={e => setChapter(e.target.value)}
//                     >
//                       <option value="" disabled>Select chapter</option>
//                       <option value="Chapter 1">Chapter 1</option>
//                       <option value="Chapter 2">Chapter 2</option>
//                       <option value="Chapter 3">Chapter 3</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="flex gap-6 w-full">
//                   <div className="flex-1">
//                     <select
//                       className="w-full border-2 border-[#120088] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#120088] appearance-none"
//                       value={session}
//                       onChange={e => setSession(e.target.value)}
//                     >
//                       <option value="" disabled>Select session</option>
//                       <option value="Session 1">Session 1</option>
//                       <option value="Session 2">Session 2</option>
//                     </select>
//                   </div>
//                   <div className="flex-1">
//                     <select
//                       className="w-full border-2 border-[#120088] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#120088] appearance-none"
//                       value={room}
//                       onChange={e => setRoom(e.target.value)}
//                     >
//                       <option value="" disabled>Select room</option>
//                       <option value="Room 1">Room 1</option>
//                       <option value="Room 2">Room 2</option>
//                     </select>
//                   </div>
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg text-lg mt-4 shadow-md transition"
//                 >
//                   Submit
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Allocation; 