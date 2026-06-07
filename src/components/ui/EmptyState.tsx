interface EmptyStateProps {
  text: string;
}

export default function EmptyState({ text }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl p-10 text-center text-slate-500 shadow-md">
      {text}
    </div>
  );
}
