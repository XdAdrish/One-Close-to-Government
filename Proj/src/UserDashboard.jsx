import { useContext, useState } from "react";
import { NotificationContext } from "./NotificationContext";
import { useReports } from "./ReportsContext";


export default function UserDashboard() {
  const { notifications } = useContext(NotificationContext);
  const { reports } = useReports();


  // State for filters
  const [issueFilter, setIssueFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");


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


  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <h1 className="text-3xl font-bold pt-16 mb-6">User Dashboard</h1>


      {/* Profile Section */}
      <div className="flex items-center gap-6 bg-white p-6 shadow rounded-lg mb-6">
        <img
          src="/default-profile.png"
          alt="Profile"
          className="w-20 h-20 rounded-full border cursor-pointer"
        />
        <div>
          <h2 className="text-xl font-bold">Souvik Mandal</h2>
          <p className="text-gray-600">Username: souvik123</p>
          <p className="text-gray-600">Password: ********</p>
        </div>
      </div>


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
                <p className="text-blue-700 font-bold">
                  Report ID: #{String(index + 1).padStart(5, "0")}
                </p>
                <p>
                  <b>Description:</b> {report.description}
                </p>
                <p>
                  <b>Issue:</b> {report.issueType}
                </p>
                <p>
                  <b>Department:</b> {report.department}
                </p>
                <p>
                  <b>Location:</b> {report.location}
                </p>
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
    </div>
  );
}