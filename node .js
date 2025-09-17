const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
const students = [
    { 'Registration id': 'S101', name: 'Ayush Kumar', major: 'Computer Science', section: 'C-202' },
    { 'Registration id': 'S102', name: 'Sahil Saha', major: 'Electrical Engineering', section: 'E-422' },
    { 'Registration id': 'S103', name: 'Abhishek Mallick', major: 'Mechanical Engineering', section: 'E-423' },
];
const attendanceRecords = {
    'S101': {
        '2024-05-15': true,
        '2024-05-16': true,
        '2024-05-17': false
    },
    'S102': {
        '2024-05-15': true,
        '2024-05-16': true,
        '2024-05-17': true
    },
    'S103': {
        '2024-05-15': false,
        '2024-05-16': true,
        '2024-05-17': false
    }
};
app.get('/students', (req, res) => {
    console.log('GET /students - Request received.');
    res.json(students);
});
app.post('/attendance', (req, res) => {
    const { studentId, isPresent, date } = req.body;
    if (!studentId || typeof isPresent !== 'boolean' || !date) {
        console.error('POST /attendance - Missing required fields.');
        return res.status(400).json({ error: 'Missing studentId, isPresent, or date in request body.' });
    }
    const studentExists = students.some(student => student['Registration id'] === studentId);
    if (!studentExists) {
        console.error(`POST /attendance - Student with Registration ID ${studentId} not found.`);
        return res.status(404).json({ error: `Student with Registration ID ${studentId} not found.` });
    }
    if (!attendanceRecords[studentId]) {
        attendanceRecords[studentId] = {};
    }
    attendanceRecords[studentId][date] = isPresent;

    console.log(`POST /attendance - Attendance marked for student ${studentId} on ${date}.`);
    res.status(201).json({ message: `Attendance for student with Registration ID ${studentId} on ${date} marked as ${isPresent ? 'Present' : 'Absent'}.` });
});
app.get('/analytics/attendance/:studentId', (req, res) => {
    const studentId = req.params.studentId;
    console.log(`GET /analytics/attendance/${studentId} - Request received.`);

    
    const student = students.find(s => s['Registration id'] === studentId);
    if (!student) {
        console.error(`GET /analytics/attendance/${studentId} - Student not found.`);
        return res.status(404).json({ error: `Student with Registration ID ${studentId} not found.` });
    }

    
    const studentAttendance = attendanceRecords[studentId] || {};
    const attendanceDates = Object.keys(studentAttendance);
    const totalDays = attendanceDates.length;

    
    const presentCount = attendanceDates.filter(date => studentAttendance[date] === true).length;
    const absentCount = totalDays - presentCount;
    const attendancePercentage = totalDays > 0 ? (presentCount / totalDays) * 100 : 0;

    const analytics = {
        studentId: student['Registration id'],
        studentName: student.name,
        totalClasses: totalDays,
        presentCount: presentCount,
        absentCount: absentCount,
        attendancePercentage: parseFloat(attendancePercentage.toFixed(2)),
        detailedAttendance: studentAttendance
    };

    res.json(analytics);
});


app.get('/analytics/class-summary', (req, res) => {
    console.log('GET /analytics/class-summary - Request received.');
    const classSummary = students.map(student => {
        const studentAttendance = attendanceRecords[student['Registration id']] || {};
        const attendanceDates = Object.keys(studentAttendance);
        const totalDays = attendanceDates.length;
        const presentCount = attendanceDates.filter(date => studentAttendance[date] === true).length;
        const attendancePercentage = totalDays > 0 ? (presentCount / totalDays) * 100 : 0;

        return {
            studentId: student['Registration id'],
            studentName: student.name,
            totalClasses: totalDays,
            presentCount: presentCount,
            attendancePercentage: parseFloat(attendancePercentage.toFixed(2))
        };
    });

    res.json(classSummary);
});


app.listen(port, () => {
    console.log(`Student attendance system backend listening at http://localhost:${port}`);
    console.log('This server handles API requests from your frontend website.');
});