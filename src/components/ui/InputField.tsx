import type { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function InputField({
  label,
  error,
  type = "text",
  ...props
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block font-medium text-slate-700">{label}</label>

      <input
        type={type}
        {...props}
        className="
          w-full
          h-14
          px-4
          rounded-xl
          border
          border-slate-300
          bg-white
          text-slate-800
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-200
        "
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
