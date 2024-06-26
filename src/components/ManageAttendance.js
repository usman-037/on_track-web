import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import "../styling/Manage.css";

const ManageAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('all');
  const [selectedValue, setSelectedValue] = useState('');
  const [attendanceToDelete, setAttendanceToDelete] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(''); // State for selected attendance status
  const [selectedDate, setSelectedDate] = useState(''); // State for selected date
  const [selectedMonth, setSelectedMonth] = useState(''); // State for selected month
  const [selectedYear, setSelectedYear] = useState(''); // State for selected year

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/attendance', {
        params: {
          option: selectedOption,
          value: selectedValue,
          status: selectedStatus,
          date: selectedDate, // Include selected date in the request params
          month: selectedMonth, // Include selected month in the request params
          year: selectedYear // Include selected year in the request params
        }
      });
      setAttendanceData(response.data);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedOption, selectedValue, selectedStatus, selectedDate, selectedMonth, selectedYear]); // Include selectedDate, selectedMonth, and selectedYear in dependency array

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setSelectedValue(''); // Reset selected value when option changes
  };

  const handleValueChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleDeleteAttendance = async (id) => {
    setAttendanceToDelete(id);
    setIsOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/attendance/${attendanceToDelete}`);
      console.log("Attendance Record Deleted Successfully");
      alert('Attendance record deleted successfully.');
      fetchAttendanceData();
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting attendance record:", error);
      setIsOpen(false);
    } finally {
      setAttendanceToDelete('');
    }
  };

  const cancelDelete = () => {
    setIsOpen(false);
    setAttendanceToDelete('');
  };

  const filteredAttendance = attendanceData.filter(entry =>
    (entry.routeNo?.toString() || '').includes(searchTerm) &&
    (selectedStatus === '' || entry.attendanceStatus.toLowerCase() === selectedStatus.toLowerCase()) && // Filter by selected status (case insensitive)
    (selectedDate === '' || entry.date.split('-')[2] === selectedDate) && // Filter by selected date
    (selectedMonth === '' || entry.date.split('-')[1] === selectedMonth) && // Filter by selected month
    (selectedYear === '' || entry.date.split('-')[0] === selectedYear) // Filter by selected year
  );  

  return (
    <div className="container">
      <div className="header">
        <div className="manage" style={{ fontFamily: 'Poppins-Medium, sans-serif', display: 'flex', alignItems: 'center' }}>
          <h1>Manage Attendance</h1>
        </div>
        <hr className="bold-hr" />
        <div >

          <FontAwesomeIcon icon={faSearch} style={{ marginRight: "10px" }} />
          <input type="number" placeholder="Search Route-Wise" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "220px", fontFamily: 'Poppins, sans-serif', height: "40px", paddingLeft: "10px" }}
          />

          <Link to="/add-attendance">
            <button className="add-route-button">Add Record</button>
          </Link>

          <div className="spacer15"></div>

          <label
            style={{ width: "320px", fontFamily: 'Poppins, sans-serif', height: "0px", paddingLeft: "3px" }}
            htmlFor="role">Search Date-Wise:</label>
          <div className="spacer8"></div>
          <input type="text" placeholder="Date (dd)" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: "170px", fontFamily: 'Poppins, sans-serif', height: "40px", paddingLeft: "10px", marginLeft: '3px' }}
          />
          <input type="text" placeholder="Month (mm)" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ width: "170px", fontFamily: 'Poppins, sans-serif', height: "40px", paddingLeft: "10px", marginLeft: "10px" }}
          />
          <input type="text" placeholder="Year (yyyy)" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
            style={{ width: "170px", fontFamily: 'Poppins, sans-serif', height: "40px", paddingLeft: "10px", marginLeft: "10px" }}
          />
        </div>

        <div className="spacer15"></div>

        <div className="role-filter" style={{ paddingLeft: "3px", paddingRight: "3px" }}>
          <label
            style={{ width: "320px", fontFamily: 'Poppins, sans-serif', height: "0px", paddingLeft: "3px" }}
            htmlFor="role">Filter by Attendance Status:</label>
          <div className="spacer8"></div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ fontFamily: 'Poppins, sans-serif' }}>
            <option value="">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <div className="spacer25"></div>
        <div className="spacer15"></div>

        {filteredAttendance.length > 0 ? (
          <table className="routes-table">
            {/* Table Header */}
            <thead>
              <tr>
                <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Email</th>
                <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Name</th>
                <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Route No</th>
                <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Attendance Status</th>
                <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Date</th>
                <th className="centered" style={{ fontFamily: 'Poppins, sans-serif' }}>Actions</th> {/* New column for action buttons */}
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.femail}</td>
                  <td>{entry.userName}</td>
                  <td>{entry.routeNo}</td>
                  <td>{entry.attendanceStatus}</td>
                  <td>{entry.date}</td>
                  <td>
                    <Link to={`/edit-attendance/${entry.femail}`}>
                      <button className="manage-button">Update</button>
                    </Link>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteAttendance(entry._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Attendance Record found.</p>
        )}
      </div>
      <Popup open={isOpen} closeOnDocumentClick onClose={cancelDelete}>
        <div className="confirmation-dialog">
          <h3>Are you sure you want to delete this attendance record?</h3>
          <p>This action cannot be undone.</p>
          <div className="confirmation-buttons">
            <button className="confirm-button" onClick={confirmDelete}>
              Confirm Delete
            </button>
            <button className="cancel-button" onClick={cancelDelete}>
              Cancel
            </button>
          </div>
        </div>
      </Popup>

    </div>
  );
};

export default ManageAttendance;