import type { Test } from "../../types/test.types";

import { Eye, Pencil, Trash2 } from "lucide-react";

import { motion } from "framer-motion";

interface TestCardProps {
  test: Test;

  onView: () => void;

  onEdit: () => void;

  onDelete: () => void;
}

export default function TestCard({
  test,
  onView,
  onEdit,
  onDelete,
}: TestCardProps) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
      }}
      transition={{
        duration: 0.2,
      }}
      className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl"
    >
      <div className="flex justify-between">
        <div>
          <h2 className="font-bold text-xl text-slate-800">{test.name}</h2>

          <p className="text-slate-500 mt-2">Subject: {test.subject}</p>

          <p className="text-sm text-slate-400 mt-1">
            Created: {test.created_at}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full h-fit text-sm ${
            test.status === "Published"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {test.status}
        </span>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onView}
          className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition"
        >
          <Eye size={16} />
          View
        </button>

        <button
          onClick={onEdit}
          className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition"
        >
          <Pencil size={16} />
          Edit
        </button>

        <button
          onClick={onDelete}
          className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </motion.div>
  );
}
