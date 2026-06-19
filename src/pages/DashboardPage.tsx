import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import StatCard from "../components/ui/StatCard";
import TestCard from "../components/ui/TestCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTestStore } from "../store/testStore";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { tests, loading, error, fetchTests, deleteTest, setTestData } = useTestStore();

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteTest(id);
      toast.success("Test deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete test");
    }
  };

  const totalTests = tests.length;
  const draftTests = tests.filter(
    (t) => t.status?.toLowerCase() === "draft"
  ).length;
  const publishedTests = tests.filter(
    (t) => t.status?.toLowerCase() === "live" || t.status?.toLowerCase() === "published"
  ).length;

  return (
    <Layout activeTab="dashboard">
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
              <p className="text-slate-500 mt-1">Manage and track all tests</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setTestData(null); // Clear previous creation cache
                navigate("/tests/create");
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-sm cursor-pointer"
            >
              + Create Test
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Tests" value={totalTests} />
          <StatCard title="Draft Tests" value={draftTests} />
          <StatCard title="Published Tests" value={publishedTests} />
        </div>

        <div className="relative mb-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl p-4 pl-12 shadow-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 rounded-2xl p-6 border border-red-100 text-center">
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => fetchTests()}
              className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition font-medium cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
            {search ? "No tests match your search" : "No tests created yet"}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTests.map((test) => (
              <TestCard
                key={test.id}
                test={test}
                onView={() => navigate(`/tests/${test.id}/preview`)}
                onEdit={() => {
                  setTestData(test);
                  navigate("/tests/create");
                }}
                onDelete={() => handleDelete(test.id)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
