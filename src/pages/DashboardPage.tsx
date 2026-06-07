import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import StatCard from "../components/ui/StatCard";
import TestCard from "../components/ui/TestCard";

import { Search } from "lucide-react";
import { motion } from "framer-motion";

import toast from "react-hot-toast";

import { useTestStore } from "../store/testStore";

export default function DashboardPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const { tests, deleteTest, setTestData } = useTestStore();

  const filteredTests = tests.filter((test) =>
    test.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100 p-8">
        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">Dashboard</h1>

              <p className="text-slate-500 mt-2">Manage all tests</p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/tests/create")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              + Create Test
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Tests" value={tests.length} />

          <StatCard
            title="Draft Tests"
            value={tests.filter((t) => t.status === "Draft").length}
          />

          <StatCard
            title="Published Tests"
            value={tests.filter((t) => t.status === "Published").length}
          />
        </div>

        <div className="relative mb-8">
          <Search size={18} className="absolute left-4 top-4 text-slate-400" />

          <input
            type="text"
            placeholder="Search tests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white rounded-xl p-4 pl-12 shadow-md outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {filteredTests.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center text-slate-500">
              No tests found
            </div>
          ) : (
            filteredTests.map((test) => (
              <TestCard
                key={test.id}
                test={test}
                onView={() => navigate(`/tests/${test.id}/preview`)}
                onEdit={() => {
                  setTestData(test);

                  navigate("/tests/create");
                }}
                onDelete={() => {
                  deleteTest(test.id);

                  toast.success("Test deleted");
                }}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
