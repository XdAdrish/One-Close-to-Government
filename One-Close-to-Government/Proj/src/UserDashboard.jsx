import { useContext, useState, useEffect } from "react";
import { NotificationContext } from "./NotificationContext";
import { useReports } from "./ReportsContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";


export default function UserDashboard() {
  const { notifications } = useContext(NotificationContext);
  const { reports, setReports } = useReports();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);


  // State for filters
  const [issueFilter, setIssueFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");


  // Fetch user reports on mount
  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        const token = await getToken();
        const response = await fetch("http://localhost:5000/api/reports/my", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        
        if (response.ok) {
          const userReports = await response.json();
          setReports(userReports);
        } else {
          console.warn("Failed to fetch user reports:", response.status);
        }
      } catch (error) {
        console.warn("Error fetching user reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReports();
  }, [getToken, setReports]);

  // Safe fallback for reports
  const safeReports = Array.isArray(reports) ? reports : [];


  // Unique filter options
  const uniqueIssueTypes = ["All", ...new Set(safeReports.map((r) => r.issueType))];
  const uniqueDepartments = ["All", ...new Set(safeReports.map((r) => r.department))];


  // Apply filters + search
  const filteredReports = safeReports.filter((report) => {
    const issueMatch = issueFilter === "All" || report.issueType === issueFilter;
    const departmentMatch = departmentFilter === "All" || report.department === departmentFilter;


    const searchMatch =
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.issueType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.department.toLowerCase().includes(searchQuery.toLowerCase());


    return issueMatch && departmentMatch && searchMatch;
  });


  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <h1 className="text-3xl font-bold pt-16 mb-6">User Dashboard</h1>


      {/* Notifications Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No new notifications</p>
        ) : (
          <ul className="space-y-2">
            {notifications.map((note) => (
              <li
                key={note.id}
                className="p-3 bg-blue-100 rounded border border-blue-300"
              >
                {note.message}
              </li>
            ))}
          </ul>
        )}
      </div>


      {/* Reported Issues Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Reported Issues</h2>


        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by description, location, issue or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>


        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Issue Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Filter by Issue
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Filter by Department
            </label>
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
               <p className="text-blue-700">Report ID:#{report.id}</p>
                <p className="text-gray-700">
                  {report.images.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto mb-3">
                    {report.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Uploaded"
                        className="h-24 w-24 object-cover rounded-lg shadow-md"
                      />
                    ))}
                  </div>
                )}
                  <strong>Description:</strong> {report.description}
                </p>
                <p>
                  <strong>Issue:</strong> {report.issueType}
                </p>
                <p>
                  <strong>Department:</strong> {report.department}
                </p>
                <p>
                  <strong>Location:</strong> {report.location}
                </p>
                {report.voiceNote && (
                  <audio controls src={report.voiceNote} className="mt-2 w-full" />
                )}
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
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-col items-center justify-center gap-6 p-6">
         <motion.button
        onClick={() => navigate("/working-w")}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        Report New Issue
      </motion.button>
      </div>
    </div>
  );
}