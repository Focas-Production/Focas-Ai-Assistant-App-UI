# Focas AI Assistant App UI

## Data Persistence

All data entered in the application is automatically saved and persists across logout/login cycles. The following data is stored in the browser's localStorage:

### Student Data
- **Allocation Data**: Subject, chapter, session, room, and submission date
- **Allocation Status**: Whether allocation is completed or skipped
- **Active Link**: Current page/state in the student interface

### Tutor Data
- **Tutor Sessions**: Date, session time, and room for each created session
- **Sprint Data**: Student assignments, topics, timers, feedback, and status
- **Session Students**: List of students matched with tutor sessions

### Admin Data
- **People Management**: Names, phone numbers, roles, and levels for all users
- **Student Details**: Student information and contact details
- **Tutor Details**: Tutor information and qualifications

### Cross-Platform Data
- **Session Students**: Students who have matched with tutor sessions
- **Sprint Progress**: Real-time timer data and topic assignments
- **User Authentication**: Current user information (cleared on logout)

### Data Storage Keys
- `studentAllocationData` - Student's allocation choices
- `studentAllocationCompleted` - Allocation completion status
- `studentSkipAllocation` - Whether allocation was skipped
- `studentActiveLink` - Current student page
- `tutorSessions` - Tutor-created sessions
- `sessionStudents` - Students matched with sessions
- `sprintData` - Sprint management data
- `adminPeopleData` - Admin-managed people list
- `userInfo` - Current user authentication (cleared on logout)

### Logout Behavior
When users logout, only the `userInfo` (authentication data) is cleared. All other data including:
- Student allocations
- Tutor sessions
- Sprint progress
- Admin people management
- Session assignments

Remains intact and will be available when logging back in.

## Development

This project uses:
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- LocalStorage for data persistence

### Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```
