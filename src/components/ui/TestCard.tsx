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
  const isPublished =
    test.status?.toLowerCase() === "published" ||
    test.status?.toLowerCase() === "live";

  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.2,
      }}
      className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition flex flex-col justify-between"
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="font-bold text-xl text-slate-800">{test.name}</h2>
          <p className="text-slate-500 mt-2 text-sm">Subject: {test.subject}</p>
          {test.created_at && (
            <p className="text-sm text-slate-400 mt-1">
              Created: {test.created_at}
            </p>
          )}
        </div>

        <span
          className={`px-3 py-1 rounded-full h-fit text-xs font-semibold uppercase tracking-wider ${
            isPublished
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-yellow-50 text-yellow-600 border border-yellow-200"
          }`}
        >
          {isPublished ? "Published" : "Draft"}
        </span>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onView}
          className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-100 transition text-sm font-medium cursor-pointer"
        >
          <Eye size={16} />
          View
        </button>

        <button
          onClick={onEdit}
          className="flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-100 transition text-sm font-medium cursor-pointer"
        >
          <Pencil size={16} />
          Edit
        </button>

        <button
          onClick={onDelete}
          className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition text-sm font-medium cursor-pointer"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </motion.div>
  );
}
