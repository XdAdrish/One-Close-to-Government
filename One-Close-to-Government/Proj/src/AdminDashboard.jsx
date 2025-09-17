import { useState, useContext, useEffect } from "react";
import { NotificationContext } from "./NotificationContext";
import { useReports } from "./ReportsContext"; // ✅ Get reports context
import { useAuth } from "@clerk/clerk-react";


export default function AdminDashboard() {
  const { addNotification } = useContext(NotificationContext);
  const { reports, setReports } = useReports(); // ✅ Access reports and updater function
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);


  // Fetch all reports on mount
  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        const token = await getToken();
        const response = await fetch("http://localhost:5000/api/reports", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        
        if (response.ok) {
          const allReports = await response.json();
          setReports(allReports);
        } else {
          console.warn("Failed to fetch all reports:", response.status);
        }
      } catch (error) {
        console.warn("Error fetching all reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllReports();
  }, [getToken, setReports]);

  // Make sure reports is always an array
  const safeReports = Array.isArray(reports) ? reports : [];


  // State for filters & search
  const [issueFilter, setIssueFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // ✅ NEW STATUS FILTER
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState("");


  // Handle sending notifications
  const handleSend = () => {
    if (!notification.trim()) return;
    addNotification(notification);
    setNotification("");
    alert("✅ Notification sent!");
  };


  // Handle status change for a specific report
  const handleStatusChange = async (reportId, newStatus) => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedReport = await response.json();
        const updatedReports = safeReports.map((report) =>
          report._id === reportId ? updatedReport : report
        );
        setReports(updatedReports);
        alert(`✅ Status updated to "${newStatus}"`);
      } else {
        console.warn("Failed to update status:", response.status);
        alert("❌ Failed to update status");
      }
    } catch (error) {
      console.warn("Error updating status:", error);
      alert("❌ Error updating status");
    }
  };


  // Unique options for filters
  const uniqueIssueTypes = ["All", ...new Set(safeReports.map((r) => r.issueType))];
  const uniqueDepartments = ["All", ...new Set(safeReports.map((r) => r.department))];
  const uniqueStatuses = ["All", "Pending", "In Progress", "Resolved"]; // ✅ NEW STATUS OPTIONS


  // Apply filters + search
  const filteredReports = safeReports.filter((report) => {
    const issueMatch = issueFilter === "All" || report.issueType === issueFilter;
    const departmentMatch = departmentFilter === "All" || report.department === departmentFilter;
    const statusMatch = statusFilter === "All" || (report.status || "Pending") === statusFilter;


    const searchMatch =
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.issueType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.department.toLowerCase().includes(searchQuery.toLowerCase());


    return issueMatch && departmentMatch && statusMatch && searchMatch;
  });


  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading all reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Admin Dashboard Heading */}
      <h1 className="text-3xl font-bold pt-16 mb-6">Admin Dashboard</h1>


      {/* Notification Sender */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Send Notifications</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Type notification..."
            value={notification}
            onChange={(e) => setNotification(e.target.value)}
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSend}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Send
          </button>
        </div>
      </div>


      {/* All Submitted Reports Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">All Reported Issues</h2>


        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by description, location, issue, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>


        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Issue Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Filter by Issue</label>
            <select
              value={issueFilter}
              onChange={(e) => setIssueFilter(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-48"
            >
              {uniqueIssueTypes.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>


          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Filter by Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-48"
            >
              {uniqueDepartments.map((dept, idx) => (
                <option key={idx} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>


          {/* ✅ Status Filter (New Feature) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-48"
            >
              {uniqueStatuses.map((status, idx) => (
                <option key={idx} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>


        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <p className="text-gray-500">No reports match your search or filters.</p>
        ) : (
          <ul className="space-y-4">
            {filteredReports.map((report, index) => (
              <li
                key={report.id || index}
                className="p-4 border rounded-lg bg-gray-50 shadow-sm"
              >
                <p className="text-blue-700 font-bold">
                  Report ID: #{String(index + 1).padStart(5, "0")}
                </p>
                <p><b>Description:</b> {report.description}</p>
                <p><b>Issue:</b> {report.issueType}</p>
                <p><b>Department:</b> {report.department}</p>
                <p><b>Location:</b> {report.location}</p>
                <p>
                  <b>Status:</b>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      report.status === "Resolved"
                        ? "bg-green-600"
                        : report.status === "In Progress"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {report.status || "Pending"}
                  </span>
                </p>


                {/* Status Update Dropdown */}
                <div className="mt-3">
                  <label className="text-sm font-medium mr-2">Update Status:</label>
                  <select
                    value={report.status || "Pending"}
                    onChange={(e) => handleStatusChange(report._id, e.target.value)}
                    className="border border-gray-300 rounded-lg p-2"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}