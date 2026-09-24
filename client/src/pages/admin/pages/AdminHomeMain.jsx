import { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import api from "../../../utils/api";
import { IconUsers, IconCar, IconCalendarEvent, IconCurrencyRupee } from "@tabler/icons-react";

const AdminHomeMain = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/admin/dashboard-stats");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!stats) return <div className="p-10">Error loading dashboard</div>;



  return (
    <div className="p-6 md:p-10 w-full bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back. Here is what's happening today.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Earnings</p>
            <p className="text-2xl font-bold text-slate-800">₹{stats.totalEarnings.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <IconCurrencyRupee size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Active Users</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalUsers.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <IconUsers size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Vehicles</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalVehicles.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <IconCar size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Bookings</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalBookings.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
            <IconCalendarEvent size={24} />
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Earnings Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Earnings Overview</h2>
          <div className="h-[300px]">
            {stats.monthlyEarningsChartData[0].data.length > 0 ? (
              <ResponsiveBar
                data={stats.monthlyEarningsChartData[0].data}
                keys={["y"]}
                indexBy="x"
                margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={["#3b82f6"]}
                borderRadius={6}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Month',
                    legendPosition: 'middle',
                    legendOffset: 40
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Earnings (₹)',
                    legendPosition: 'middle',
                    legendOffset: -50
                }}
                enableGridY={true}
                enableLabel={false}
                theme={{
                  axis: { ticks: { text: { fill: '#64748b' } } },
                  grid: { line: { stroke: '#e2e8f0', strokeWidth: 1 } },
                  tooltip: { container: { background: '#1e293b', color: '#fff', fontSize: '12px', borderRadius: '8px' } }
                }}
                tooltip={({ id, value, color }) => (
                  <div className="bg-slate-800 text-white p-2 rounded-lg text-xs shadow-lg">
                    <strong>Earnings:</strong> ₹{value.toLocaleString()}
                  </div>
                )}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No earnings data available for the last 6 months.</div>
            )}
          </div>
        </div>

        {/* Bookings Status Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Analytics Overview</h2>
          <div className="h-[300px]">
            {stats.bookingStatusChartData.length > 0 ? (
              <ResponsivePie
                data={stats.bookingStatusChartData}
                margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
                innerRadius={0.7}
                padAngle={2}
                cornerRadius={6}
                activeOuterRadiusOffset={8}
                colors={{ scheme: 'set2' }}
                borderWidth={1}
                borderColor={{
                    from: 'color',
                    modifiers: [ [ 'darker', 0.2 ] ]
                }}
                enableArcLinkLabels={true}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#64748b"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor="#ffffff"
                theme={{
                  tooltip: { container: { background: '#1e293b', color: '#fff', fontSize: '12px', borderRadius: '8px' } }
                }}
              />
            ) : (
               <div className="h-full flex items-center justify-center text-slate-400">No analytics data available.</div>
            )}
          </div>
        </div>

      </div>

      {/* Second Row: Bar Chart & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Vehicle Performance Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Vehicle Performance</h2>
          <div className="h-[300px]">
            <ResponsiveBar
              data={stats.vehiclePerformanceChartData || []}
              keys={["bookings"]}
              indexBy="type"
              margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
              padding={0.4}
              valueScale={{ type: "linear" }}
              colors={{ scheme: "accent" }}
              borderRadius={4}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              enableGridY={true}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor="#ffffff"
              theme={{
                axis: { ticks: { text: { fill: "#64748b" } } },
                grid: { line: { stroke: "#f1f5f9", strokeWidth: 1 } },
                tooltip: { container: { background: "#1e293b", color: "#fff", fontSize: "12px", borderRadius: "8px" } }
              }}
            />
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-hidden flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 font-semibold rounded-lg">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">ID</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions && stats.recentTransactions.map((tx, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4 font-medium text-slate-800">{tx.id}</td>
                    <td className="px-4 py-4">{tx.user}</td>
                    <td className="px-4 py-4">{tx.vehicle}</td>
                    <td className="px-4 py-4 font-semibold text-slate-700">{tx.amount}</td>
                    <td className="px-4 py-4 text-slate-500">{tx.date}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        tx.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                        tx.status === "Pending" ? "bg-orange-100 text-orange-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminHomeMain;
