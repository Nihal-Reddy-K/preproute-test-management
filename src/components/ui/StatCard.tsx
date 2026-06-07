import { motion } from "framer-motion";

interface StatCardProps {
  title: string;

  value: number;
}

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -5,
      }}
      className="bg-white rounded-2xl shadow-md p-6"
    >
      <h3 className="text-slate-500 text-sm">{title}</h3>

      <p className="text-3xl font-bold mt-2 text-blue-600">{value}</p>
    </motion.div>
  );
}
