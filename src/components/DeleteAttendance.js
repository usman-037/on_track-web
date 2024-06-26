import React, { useState } from 'react';
import axios from 'axios';

const DeleteAttendance = () => {
  const [criteria, setCriteria] = useState('');
  const [value, setValue] = useState('');
  const [attendanceToDelete, setAttendanceToDelete] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'criteria') {
      setCriteria(value);
    } else {
      setValue(value);
    }
  };

  const searchAttendance = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/attendance?option=${criteria}&value=${value}`);
      setAttendanceToDelete(response.data);
    } catch (error) {
      alert('Error searching attendance');
      console.error('Error searching attendance:', error);
    }
  };

  const handleCheckboxChange = (e, row) => {
    const { checked } = e.target;
    if (checked) {
      setSelectedRows([...selectedRows, row]);
    } else {
      const updatedSelectedRows = selectedRows.filter(selectedRow => selectedRow._id !== row._id);
      setSelectedRows(updatedSelectedRows);
    }
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectedRows([...attendanceToDelete]);
    } else {
      setSelectedRows([]);
    }
    setSelectAll(!selectAll);
  };

  const deleteSelectedRows = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/attendance`, {
        data: { rowsToDelete: selectedRows.map((row) => row._id) },
      });
      setAttendanceToDelete([]);
      setSelectedRows([]);
      setSelectAll(false);
      alert('Selected attendance deleted successfully');
    } catch (error) {
      alert('Error deleting attendance');
      console.error('Error deleting attendance:', error);
    }
  };

  return (
    <div className="manage-routes-container">
    <div className="header">
      <h1>Delete Attendance</h1>
      <hr className="bold-hr" />
    </div>

      <div className="criteria-selection">
        <label>Select Criteria:</label>
        <select name="criteria" value={criteria} onChange={handleInputChange}>
          <option value="">Select Criteria</option>
          <option value="route">Route</option>
          <option value="date">Date</option>
          <option value="email">Email</option>
        </select>
        <input type="text" name="value" value={value} onChange={handleInputChange} placeholder="Enter value" />
        <button onClick={searchAttendance}>Search</button>
      </div>

      {attendanceToDelete.length > 0 && (
        <div className="attendance-data">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" onChange={handleSelectAll} checked={selectAll} /></th>
                <th>Name</th>
                <th>Email</th>
                <th>Route</th>
                <th>Attendance Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {attendanceToDelete.map((attendance) => (
                <tr key={attendance._id}>
                  <td><input type="checkbox" onChange={(e) => handleCheckboxChange(e, attendance)} checked={selectedRows.some((row) => row._id === attendance._id)} /></td>
                  <td>{attendance.userName}</td>
                  <td>{attendance.femail}</td>
                  <td>{attendance.routeNo}</td>
                  <td>{attendance.attendanceStatus}</td>
                  <td>{attendance.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p></p>
          <button onClick={deleteSelectedRows}>Delete Selected Rows</button>
        </div>
      )}

      {attendanceToDelete.length === 0 && (
        <p>No attendance records found.</p>
      )}
    </div>
  );
};

export default DeleteAttendance;
