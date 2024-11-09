"use client"; // Ensure this is a Client Component

import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

type TableRow = {
  ID: number;
  "Account Number": string;
  "Upload Date": string;
  "Completion Date": string;
  Status: string;
  Categories: string;
  "Type of Issue": string;
  "Rejection Reason": string;
  Report: string; // URL path to the PDF report
  "Accept/Reject": string;
};

export default function Dashboard() {
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [acceptRejectStatus, setAcceptRejectStatus] = useState<
    Record<number, string>
  >({});
  const [statusData, setStatusData] = useState<number[]>([]);
  const [categoriesData, setCategoriesData] = useState<number[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [analyticsData, setAnalyticsData] = useState({
    labels: [] as string[],
    datasets: [] as any[],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/sampledata.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: TableRow[] = await response.json();
        setTableData(data);
        calculateChartData(data);

        // Set the initial values for Accept/Reject dropdowns from the data
        const statusMap: Record<number, string> = {};
        data.forEach((row) => {
          statusMap[row.ID] = row["Accept/Reject"];
        });
        setAcceptRejectStatus(statusMap);
      } catch (error) {
        console.error("Failed to fetch JSON:", error);
      }
    }

    fetchData();
  }, []);

  const calculateChartData = (data: TableRow[]) => {
    const reasons: string[] = [
      "Non-compliance",
      "Invalid Entry",
      "Incomplete Data",
    ];
    const monthlyData: Record<number, number[]> = {};

    for (let i = 0; i < 12; i++) {
      monthlyData[i] = reasons.map(() => 0);
    }

    data.forEach((item) => {
      const month = new Date(item["Upload Date"]).getMonth();
      const reasonIndex = reasons.indexOf(item["Rejection Reason"]);

      if (reasonIndex > -1) {
        monthlyData[month][reasonIndex] += 1;
      }
    });

    const statusCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    data.forEach((item) => {
      statusCounts[item.Status] = (statusCounts[item.Status] || 0) + 1;
      categoryCounts[item.Categories] =
        (categoryCounts[item.Categories] || 0) + 1;
    });

    setStatusData(Object.values(statusCounts));
    setCategoriesData(Object.values(categoryCounts));
    setTotalAmount(data.length);

    setAnalyticsData({
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: reasons.map((reason, index) => ({
        label: reason,
        data: Object.values(monthlyData).map((counts) => counts[index]),
        backgroundColor: ["#4F46E5", "#F59E0B", "#10B981"][index],
      })),
    });
  };

  const statusPieData = {
    labels: ["Pending", "Complete"],
    datasets: [
      {
        data: statusData,
        backgroundColor: ["#FBBF24", "#10B981"],
      },
    ],
  };

  const categoriesPieData = {
    labels: ["Bank Statements", "Utilities Bill", "Tenancy Agreement", "Other"],
    datasets: [
      {
        data: categoriesData,
        backgroundColor: ["#3B82F6", "#6366F1", "#10B981", "#F59E0B"],
      },
    ],
  };

  // Handle the change in dropdown status (Accept/Reject)
  const handleStatusChange = (id: number, status: string) => {
    setAcceptRejectStatus((prevStatus) => ({
      ...prevStatus,
      [id]: status,
    }));
  };

  // Function to handle opening the modal with the report PDF
  const handleViewReport = (reportPath: string) => {
    setCurrentReport(reportPath); // Set the report path
    setModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentReport(null);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-48 p-8 bg-gray-900 text-white">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-5 gap-4 mb-6">
          {/* Total Amount Card */}
          <div
            className="col-span-1 p-4 rounded-lg shadow-lg flex flex-col items-center justify-center"
            style={{
              background: "white",
              color: "black",
            }}
          >
            <h2 className="text-xl font-semibold text-center">Total Amount</h2>
            <p className="text-3xl font-bold mt-2 text-center">{totalAmount}</p>
          </div>

          {/* Analytics Chart */}
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-lg text-black">
            <h2 className="text-lg font-semibold">
              Analytics (Rejection Reasons)
            </h2>
            <Bar
              data={analyticsData}
              options={{
                plugins: {
                  legend: { position: "top" },
                },
                scales: {
                  x: { stacked: true },
                  y: { stacked: true },
                },
              }}
            />
          </div>

          {/* Status Pie Chart */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg text-black">
            <h2 className="text-lg font-semibold">Status</h2>
            <Pie data={statusPieData} />
          </div>

          {/* Categories Pie Chart */}
          <div className="col-span-1 bg-white p-6 rounded-lg shadow-lg text-black">
            <h2 className="text-lg font-semibold">Categories</h2>
            <Pie data={categoriesPieData} />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg text-black">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "ID",
                  "Account Number",
                  "Upload Date",
                  "Completion Date",
                  "Status",
                  "Categories",
                  "Type of Issue",
                  "Rejection Reason",
                  "Report",
                  "Accept/Reject",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((row) => (
                <tr key={row.ID}>
                  {Object.entries(row).map(([key, value], i) => (
                    <td
                      key={i}
                      className="px-4 py-2 whitespace-nowrap text-sm text-gray-700"
                    >
                      {key === "Report" ? (
                        value ? (
                          <button
                            onClick={() => handleViewReport(value as string)}
                            className="text-blue-500 underline"
                          >
                            View Report
                          </button>
                        ) : (
                          <span className="text-gray-400">View Report</span>
                        )
                      ) : key === "Accept/Reject" ? (
                        <select
                          className={`p-2 rounded ${
                            acceptRejectStatus[row.ID] === "Accept"
                              ? "bg-green-200 text-green-700"
                              : acceptRejectStatus[row.ID] === "Reject"
                              ? "bg-red-200 text-red-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                          value={acceptRejectStatus[row.ID] || "Pending"}
                          onChange={(e) =>
                            handleStatusChange(row.ID, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Accept">Accept</option>
                          <option value="Reject">Reject</option>
                        </select>
                      ) : (
                        (value as React.ReactNode)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for PDF Viewer */}
        {modalOpen && currentReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Report</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
              <iframe
                src={currentReport}
                title="PDF Report"
                className="w-full h-96 border rounded"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
