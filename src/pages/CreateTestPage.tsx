import InputField from "../components/ui/InputField";

import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { testSchema } from "../utils/testSchema";
import type { TestSchemaType } from "../utils/testSchema";

import { useTestStore } from "../store/testStore";

import toast from "react-hot-toast";

export default function CreateTestPage() {
  const navigate = useNavigate();

  const { setTestData, addTest, testData } = useTestStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestSchemaType>({
    resolver: zodResolver(testSchema),

    defaultValues: {
      name: testData?.name || "",
      subject: testData?.subject || "",
      topics: testData?.topics || "",
      negativeMarks: testData?.negativeMarks || 0,
      duration: testData?.duration || 0,
    },
  });

  const onSubmit = (data: TestSchemaType) => {
    setTestData(data);

    addTest({
      id: Date.now().toString(),
      name: data.name,
      subject: data.subject,
      status: "Draft",
      created_at: new Date().toLocaleDateString(),
    });

    toast.success("Test created successfully");

    navigate("/tests/1/questions");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8">Create Test</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            label="Test Name"
            placeholder="Enter test name"
            error={errors.name?.message}
            {...register("name")}
          />

          <InputField
            label="Subject"
            placeholder="Enter subject"
            error={errors.subject?.message}
            {...register("subject")}
          />

          <InputField
            label="Topics"
            placeholder="Enter topics"
            error={errors.topics?.message}
            {...register("topics")}
          />

          <InputField
            label="Negative Marks"
            type="number"
            error={errors.negativeMarks?.message}
            {...register("negativeMarks", {
              valueAsNumber: true,
            })}
          />

          <InputField
            label="Duration (minutes)"
            type="number"
            error={errors.duration?.message}
            {...register("duration", {
              valueAsNumber: true,
            })}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}
