import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testSchema } from "../utils/testSchema";
import type { TestSchemaType } from "../utils/testSchema";
import Layout from "../components/layout/Layout";
import {
  getSubjects,
  getTopicsBySubject,
  getSubtopicsByTopics,
  createTest,
  updateTest
} from "../services/testService";
import { useTestStore } from "../store/testStore";
import toast from "react-hot-toast";

const mapBackendToUI = (test: any) => {
  if (!test) return null;
  let uiType: "Chapter Wise" | "PYQ" | "Mock Test" = "Chapter Wise";
  if (test.type === "pyq") {
    uiType = "PYQ";
  } else if (test.type === "mock") {
    uiType = "Mock Test";
  }
  let uiDifficulty: "easy" | "medium" | "difficult" = "easy";
  if (test.difficulty === "medium") {
    uiDifficulty = "medium";
  } else if (test.difficulty === "hard") {
    uiDifficulty = "difficult";
  }
  return {
    ...test,
    type: uiType,
    difficulty: uiDifficulty
  };
};

const mapUIToBackend = (uiData: any) => {
  let backendType = "chapterwise";
  if (uiData.type === "PYQ") {
    backendType = "pyq";
  } else if (uiData.type === "Mock Test") {
    backendType = "mock";
  }
  let backendDifficulty = "easy";
  if (uiData.difficulty === "medium") {
    backendDifficulty = "medium";
  } else if (uiData.difficulty === "difficult") {
    backendDifficulty = "hard";
  }
  const { sub_topics, ...rest } = uiData;
  return {
    ...rest,
    type: backendType,
    difficulty: backendDifficulty,
    sub_topic: sub_topics // map array to backend field
  };
};

export default function CreateTestPage() {
  const navigate = useNavigate();
  const { setTestData, testData } = useTestStore();

  const [subjectsList, setSubjectsList] = useState<{ id: string; name: string }[]>([]);
  const [topicsList, setTopicsList] = useState<{ id: string; name: string }[]>([]);
  const [subTopicsList, setSubTopicsList] = useState<{ id: string; name: string }[]>([]);

  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const mappedTestData = mapBackendToUI(testData);

  const [activeType, setActiveType] = useState<"Chapter Wise" | "PYQ" | "Mock Test">(
    mappedTestData?.type || "Chapter Wise"
  );

  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const [subtopicDropdownOpen, setSubtopicDropdownOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<TestSchemaType>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: mappedTestData?.name || "",
      type: mappedTestData?.type || "Chapter Wise",
      subject: mappedTestData?.subject || "",
      topics: mappedTestData?.topics || [],
      sub_topics: mappedTestData?.sub_topics || [],
      correct_marks: mappedTestData?.correct_marks ?? 5,
      wrong_marks: mappedTestData?.wrong_marks ?? -1,
      unattempt_marks: mappedTestData?.unattempt_marks ?? 0,
      difficulty: mappedTestData?.difficulty || "easy",
      total_time: mappedTestData?.total_time || 60,
      total_questions: mappedTestData?.total_questions || 50,
      total_marks: mappedTestData?.total_marks || 250,
    }
  });

  const selectedSubject = watch("subject");
  const selectedTopics = watch("topics");
  const correctMarks = watch("correct_marks");
  const totalQuestions = watch("total_questions");

  useEffect(() => {
    async function loadSubjects() {
      setLoadingSubjects(true);
      try {
        const res = await getSubjects();
        const list = Array.isArray(res) ? res : res.data || res.subjects || [];
        const formatted = list.map((s: any) => ({
          id: s.id || s._id || s.subjectId || s.name || "",
          name: s.name || s.title || s.subjectName || ""
        })).filter((s: any) => s.id);
        setSubjectsList(formatted);
      } catch (err: any) {
        console.error("Failed to load subjects:", err);
        toast.error("Failed to load subjects");
      } finally {
        setLoadingSubjects(false);
      }
    }
    loadSubjects();
  }, []);

  useEffect(() => {
    if (!selectedSubject) {
      setTopicsList([]);
      setValue("topics", []);
      return;
    }

    async function loadTopics() {
      try {
        const res = await getTopicsBySubject(selectedSubject);
        const list = Array.isArray(res) ? res : res.data || res.topics || [];
        const formatted = list.map((t: any) => ({
          id: t.id || t._id || t.topicId || t.name || "",
          name: t.name || t.title || t.topicName || ""
        })).filter((t: any) => t.id);
        setTopicsList(formatted);
        setValue("topics", []);
      } catch (err: any) {
        console.error("Failed to load topics:", err);
      }
    }
    loadTopics();
  }, [selectedSubject, setValue]);

  useEffect(() => {
    if (!selectedTopics || selectedTopics.length === 0) {
      setSubTopicsList([]);
      setValue("sub_topics", []);
      return;
    }

    async function loadSubtopics() {
      try {
        const res = await getSubtopicsByTopics(selectedTopics);
        const list = Array.isArray(res) ? res : res.data || res.subtopics || res.sub_topics || [];
        const formatted = list.map((st: any) => ({
          id: st.id || st._id || st.subTopicId || st.name || "",
          name: st.name || st.title || st.subTopicName || ""
        })).filter((st: any) => st.id);
        setSubTopicsList(formatted);

        const currentSubtopics = watch("sub_topics") || [];
        const validSubtopics = currentSubtopics.filter(id => formatted.some((item: any) => item.id === id));
        setValue("sub_topics", validSubtopics);
      } catch (err: any) {
        console.error("Failed to load subtopics:", err);
      }
    }
    loadSubtopics();
  }, [selectedTopics, setValue]);

  useEffect(() => {
    if (correctMarks !== undefined && totalQuestions !== undefined) {
      setValue("total_marks", correctMarks * totalQuestions);
    }
  }, [correctMarks, totalQuestions, setValue]);

  const onSubmit = async (data: TestSchemaType) => {
    try {
      const payload = {
        ...mapUIToBackend(data),
        status: "draft"
      };

      let response;
      if (testData?.id || testData?._id) {
        const id = testData.id || testData._id;
        response = await updateTest(id, payload);
      } else {
        response = await createTest(payload);
      }
      const testId = response.data?.id || response.data?._id || response.id || response._id || "1";

      setTestData({ ...payload, id: testId });

      toast.success("Test saved successfully");
      navigate(`/tests/${testId}/questions`);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to save test";
      toast.error(errorMsg);
      console.error(error);
    }
  };

  const selectType = (type: "Chapter Wise" | "PYQ" | "Mock Test") => {
    setActiveType(type);
    setValue("type", type);
  };

  return (
    <Layout activeTab="test-creation" breadcrumbs={["Test Creation", "Create Test", activeType]}>
      <div className="p-8">
        <div className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-2xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
            <h1 className="text-2xl font-bold text-slate-800">Edit Test creation</h1>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-slate-400 hover:text-slate-600 transition"
            >
              ✕
            </button>
          </div>

          <div className="flex bg-slate-50 p-1.5 rounded-xl w-fit gap-2 mb-8">
            {(["Chapter Wise", "PYQ", "Mock Test"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => selectType(t)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  activeType === t
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="relative">
                <label className="block text-slate-700 font-medium mb-2 text-sm">Subject</label>
                <input type="hidden" {...register("subject")} />
                <div
                  onClick={() =>
                    !loadingSubjects && (
                      setSubjectDropdownOpen(!subjectDropdownOpen),
                      setTopicDropdownOpen(false),
                      setSubtopicDropdownOpen(false)
                    )
                  }
                  className={`w-full h-12 px-4 rounded-xl border flex items-center justify-between cursor-pointer ${
                    errors.subject ? "border-red-400" : "border-slate-200"
                  } bg-white ${loadingSubjects ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className="text-slate-500 truncate text-sm">
                    {selectedSubject
                      ? subjectsList.find((s) => s.id === selectedSubject)?.name || selectedSubject
                      : "Choose from Drop-down"}
                  </span>
                  <span className="text-slate-400">▼</span>
                </div>
                {subjectDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-2 space-y-1">
                    {subjectsList.length === 0 ? (
                      <div className="p-3 text-sm text-slate-400 text-center">
                        No subjects found
                      </div>
                    ) : (
                      subjectsList.map((sub) => {
                        const isSelected = selectedSubject === sub.id;
                        return (
                          <div
                            key={sub.id}
                            onClick={() => {
                              setValue("subject", sub.id);
                              setSubjectDropdownOpen(false);
                            }}
                            className={`p-2.5 rounded-lg hover:bg-slate-50 cursor-pointer text-sm transition flex justify-between items-center ${
                              isSelected ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-700"
                            }`}
                          >
                            <span>{sub.name}</span>
                            {isSelected && <span className="text-blue-600">✓</span>}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2 text-sm">Name of Test</label>
                <input
                  type="text"
                  placeholder="Enter name of Test"
                  {...register("name")}
                  className={`w-full h-12 px-4 rounded-xl border ${
                    errors.name ? "border-red-400" : "border-slate-200"
                  } outline-none focus:border-blue-500 transition`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-slate-700 font-medium mb-2 text-sm">Topic</label>
                <div
                  onClick={() => (
                    setTopicDropdownOpen(!topicDropdownOpen),
                    setSubjectDropdownOpen(false),
                    setSubtopicDropdownOpen(false)
                  )}
                  className={`w-full h-12 px-4 rounded-xl border flex items-center justify-between cursor-pointer ${
                    errors.topics ? "border-red-400" : "border-slate-200"
                  } bg-white`}
                >
                  <span className="text-slate-500 truncate text-sm">
                    {selectedTopics && selectedTopics.length > 0
                      ? selectedTopics
                          .map((id) => topicsList.find((t) => t.id === id)?.name || id)
                          .join(", ")
                      : "Choose from Drop-down"}
                  </span>
                  <span className="text-slate-400">▼</span>
                </div>
                {topicDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-2 space-y-1">
                    {topicsList.length === 0 ? (
                      <div className="p-3 text-sm text-slate-400 text-center">
                        {selectedSubject ? "No topics found" : "Please select a Subject first"}
                      </div>
                    ) : (
                      topicsList.map((top) => {
                        const isChecked = selectedTopics?.includes(top.id);
                        return (
                          <label
                            key={top.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const current = selectedTopics || [];
                                const next = checked
                                  ? [...current, top.id]
                                  : current.filter((id) => id !== top.id);
                                setValue("topics", next);
                              }}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                            />
                            {top.name}
                          </label>
                        );
                      })
                    )}
                  </div>
                )}
                {errors.topics && (
                  <p className="text-red-500 text-xs mt-1">{errors.topics.message}</p>
                )}
              </div>

              <div className="relative">
                <label className="block text-slate-700 font-medium mb-2 text-sm">Sub Topic</label>
                <div
                  onClick={() => (
                    setSubtopicDropdownOpen(!subtopicDropdownOpen),
                    setSubjectDropdownOpen(false),
                    setTopicDropdownOpen(false)
                  )}
                  className="w-full h-12 px-4 rounded-xl border flex items-center justify-between cursor-pointer border-slate-200 bg-white"
                >
                  <span className="text-slate-500 truncate text-sm">
                    {watch("sub_topics") && watch("sub_topics")!.length > 0
                      ? watch("sub_topics")!
                          .map((id) => subTopicsList.find((st) => st.id === id)?.name || id)
                          .join(", ")
                      : "Choose from Drop-down"}
                  </span>
                  <span className="text-slate-400">▼</span>
                </div>
                {subtopicDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-2 space-y-1">
                    {subTopicsList.length === 0 ? (
                      <div className="p-3 text-sm text-slate-400 text-center">
                        {selectedTopics && selectedTopics.length > 0
                          ? "No subtopics found"
                          : "Please select Topic(s) first"}
                      </div>
                    ) : (
                      subTopicsList.map((subtop) => {
                        const isChecked = watch("sub_topics")?.includes(subtop.id);
                        return (
                          <label
                            key={subtop.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                const current = watch("sub_topics") || [];
                                const next = checked
                                  ? [...current, subtop.id]
                                  : current.filter((id) => id !== subtop.id);
                                setValue("sub_topics", next);
                              }}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                            />
                            {subtop.name}
                          </label>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2 text-sm">Duration (Minutes)</label>
                <input
                  type="number"
                  placeholder="Enter the time"
                  {...register("total_time", { valueAsNumber: true })}
                  className={`w-full h-12 px-4 rounded-xl border ${
                    errors.total_time ? "border-red-400" : "border-slate-200"
                  } outline-none focus:border-blue-500 transition`}
                />
                {errors.total_time && (
                  <p className="text-red-500 text-xs mt-1">{errors.total_time.message}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-3 text-sm">Test Difficulty Level</label>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-6 mt-1.5">
                      {(["easy", "medium", "difficult"] as const).map((diff) => (
                        <label key={diff} className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-slate-700 select-none">
                          <input
                            type="radio"
                            checked={field.value === diff}
                            onChange={() => field.onChange(diff)}
                            className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                          />
                          <span className="capitalize">{diff}</span>
                        </label>
                      ))}
                    </div>
                  )}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 border-b border-slate-100 pb-3">
                Marking Scheme:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 items-end">
                
                <div>
                  <label className="block text-slate-600 font-medium mb-2 text-xs">Wrong Answer</label>
                  <Controller
                    name="wrong_marks"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center h-12 border border-slate-200 rounded-xl overflow-hidden px-2 justify-between">
                        <button
                          type="button"
                          onClick={() => field.onChange(field.value - 1)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold text-slate-800">{field.value}</span>
                        <button
                          type="button"
                          onClick={() => field.onChange(Math.min(0, field.value + 1))}
                          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 font-bold"
                        >
                          +
                        </button>
                      </div>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-2 text-xs">Unattempted</label>
                  <Controller
                    name="unattempt_marks"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center h-12 border border-slate-200 rounded-xl overflow-hidden px-2 justify-between">
                        <button
                          type="button"
                          onClick={() => field.onChange(field.value - 1)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold text-slate-800">
                          {field.value >= 0 ? `+${field.value}` : field.value}
                        </span>
                        <button
                          type="button"
                          onClick={() => field.onChange(field.value + 1)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 font-bold"
                        >
                          +
                        </button>
                      </div>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-2 text-xs">Correct Answer</label>
                  <Controller
                    name="correct_marks"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center h-12 border border-slate-200 rounded-xl overflow-hidden px-2 justify-between">
                        <button
                          type="button"
                          onClick={() => field.onChange(Math.max(0, field.value - 1))}
                          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold text-slate-800">+{field.value}</span>
                        <button
                          type="button"
                          onClick={() => field.onChange(field.value + 1)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 font-bold"
                        >
                          +
                        </button>
                      </div>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-2 text-xs">No of Questions</label>
                  <input
                    type="number"
                    placeholder="Ex: 50"
                    {...register("total_questions", { valueAsNumber: true })}
                    className={`w-full h-12 px-4 rounded-xl border ${
                      errors.total_questions ? "border-red-400" : "border-slate-200"
                    } outline-none focus:border-blue-500 transition text-sm`}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-2 text-xs">Total Marks</label>
                  <input
                    type="number"
                    placeholder="Ex:250 Marks"
                    disabled
                    {...register("total_marks", { valueAsNumber: true })}
                    className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 outline-none text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold transition cursor-pointer disabled:bg-blue-400 flex items-center gap-2"
              >
                {isSubmitting ? "Saving..." : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
