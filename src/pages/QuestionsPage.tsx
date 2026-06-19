import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import type { Question } from "../types/question.types";
import { getTestById } from "../services/testService";
import { bulkCreateQuestions } from "../services/questionService";
import { useTestStore } from "../store/testStore";
import toast from "react-hot-toast";
import { Trash2, Plus, FileSpreadsheet, ArrowLeft, ArrowRight } from "lucide-react";

export default function QuestionsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { testData, setTestData } = useTestStore();

  const [test, setTest] = useState<any>(null);
  const [loadingTest, setLoadingTest] = useState(true);
  const [saving, setSaving] = useState(false);

  const [questions, setQuestions] = useState<Partial<Question>[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    async function loadTest() {
      if (!id) return;
      setLoadingTest(true);
      try {
        const res = await getTestById(id);
        const data = res.data || res;
        setTest(data);
        if (!testData) {
          setTestData(data);
        }

        const count = data.total_questions || 50;
        const initialQuestions: Partial<Question>[] = Array.from({ length: count }, () => ({
          type: "mcq",
          question: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          correct_option: "option1",
          explanation: "",
          difficulty: data.difficulty || "easy",
          topic: "",
          subtopic: "",
        }));
        setQuestions(initialQuestions);
      } catch (err: any) {
        console.error("Failed to load test details:", err);

        if (testData) {
          setTest(testData);
          const count = testData.total_questions || 50;
          const initialQuestions: Partial<Question>[] = Array.from({ length: count }, () => ({
            type: "mcq",
            question: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            correct_option: "option1",
            explanation: "",
            difficulty: testData.difficulty || "easy",
            topic: "",
            subtopic: "",
          }));
          setQuestions(initialQuestions);
        } else {
          toast.error("Failed to load test details");
        }
      } finally {
        setLoadingTest(false);
      }
    }
    loadTest();
  }, [id, setTestData, testData]);

  const updateCurrentQuestion = (fields: Partial<Question>) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[currentIdx] = { ...updated[currentIdx], ...fields };
      return updated;
    });
  };

  const currentQ = questions[currentIdx] || {
    type: "mcq",
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correct_option: "option1",
    explanation: "",
    difficulty: "easy",
    topic: "",
    subtopic: "",
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleSaveAll();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSaveAll = async () => {

    const filledQuestions = questions.filter((q) => q.question?.trim());
    if (filledQuestions.length === 0) {
      toast.error("Please fill in at least one question before saving.");
      return;
    }

    setSaving(true);
    try {
      const payload = {

        questions: filledQuestions.map((q) => ({
          type: q.type || "mcq",
          question: q.question,
          option1: q.option1 || "",
          option2: q.option2 || "",
          option3: q.option3 || "",
          option4: q.option4 || "",
          correct_option: q.correct_option || "option1",
          explanation: q.explanation || "",
          difficulty: q.difficulty || test?.difficulty || "easy",
          topic: q.topic || "",
          sub_topic: q.subtopic || "",
          media_url: "",
          test_id: id
        }))
      };

      await bulkCreateQuestions(payload);
      toast.success("Questions saved successfully");
      navigate(`/tests/${id}/preview`);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to save questions";
      toast.error(msg);
      console.error("Save questions failed:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loadingTest) {
    return (
      <Layout activeTab="test-creation" breadcrumbs={["Test Creation", "Create Test", "Questions"]}>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  const isQuestionFilled = (q: Partial<Question>) => {
    return !!(q.question?.trim() && q.option1?.trim() && q.option2?.trim());
  };

  return (
    <Layout
      activeTab="test-creation"
      breadcrumbs={["Test Creation", "Create Test", test?.type || "Chapter Wise"]}
    >
      <div className="flex h-[calc(100vh-80px)] overflow-hidden">
        
        <aside className="w-64 border-r border-slate-100 bg-white flex flex-col flex-shrink-0">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-800 text-sm">Question creation</span>
            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-full font-medium">
              Total Questions: {questions.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {questions.map((q, idx) => {
              const active = idx === currentIdx;
              const filled = isQuestionFilled(q);
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left text-sm font-medium transition cursor-pointer ${
                    active
                      ? "bg-blue-50 text-blue-600 border border-blue-100"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent"
                  }`}
                >
                  <span className="truncate">Question {idx + 1}</span>
                  {filled ? (
                    <span className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-200">
                      ✓
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-xs text-slate-400">
                      {idx + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 flex flex-col justify-between">
          <div className="max-w-4xl w-full mx-auto space-y-6">

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold text-xs">
                    {test?.type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 font-bold text-xs capitalize">
                    {test?.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-800">{test?.name}</h2>
                <div className="flex gap-4 mt-2 text-xs font-semibold text-slate-500">
                  <span>Subject: {test?.subject}</span>
                  {test?.topics && test.topics.length > 0 && (
                    <span>Topics: {test.topics.join(", ")}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-4 border-l border-slate-100 pl-4 h-fit text-sm text-slate-500">
                <div className="text-center">
                  <div className="font-bold text-slate-800">{test?.total_time} min</div>
                  <div className="text-xs text-slate-400">Duration</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-800">{test?.total_questions} Q's</div>
                  <div className="text-xs text-slate-400">Questions</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-slate-800">{test?.total_marks} Marks</div>
                  <div className="text-xs text-slate-400">Total Marks</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm space-y-6">

              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-lg">
                  Question {currentIdx + 1} <span className="text-slate-300">/ {questions.length}</span>
                </h3>
                
                <div className="flex gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition cursor-pointer">
                    <Plus size={14} /> MCQ
                  </button>
                  <button
                    onClick={() => toast.error("CSV import functionality is coming soon.")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
                  >
                    <FileSpreadsheet size={14} /> CSV
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex flex-wrap gap-4 text-slate-400 select-none">
                  <span className="font-bold cursor-pointer hover:text-slate-600">B</span>
                  <span className="italic cursor-pointer hover:text-slate-600">I</span>
                  <span className="underline cursor-pointer hover:text-slate-600">U</span>
                  <span className="cursor-pointer hover:text-slate-600">🔗</span>
                  <span className="cursor-pointer hover:text-slate-600">≡</span>
                  <span className="cursor-pointer hover:text-slate-600">⁝</span>
                  <span className="cursor-pointer hover:text-slate-600">📷</span>
                </div>
                <textarea
                  value={currentQ.question}
                  onChange={(e) => updateCurrentQuestion({ question: e.target.value })}
                  placeholder="Type the question here..."
                  className="w-full h-32 p-4 outline-none border-none resize-none text-slate-800"
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-700">Type the options below:</h4>
                
                {(["option1", "option2", "option3", "option4"] as const).map((opt, idx) => {
                  const isChecked = currentQ.correct_option === opt;
                  return (
                    <div key={opt} className="flex items-center gap-3">
                      
                      <button
                        type="button"
                        onClick={() => updateCurrentQuestion({ correct_option: opt })}
                        className={`w-6 h-6 rounded-full flex items-center justify-center border transition cursor-pointer ${
                          isChecked
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-slate-300 hover:border-blue-500"
                        }`}
                      >
                        {isChecked && "✓"}
                      </button>

                      <input
                        type="text"
                        placeholder={`Type Option ${idx + 1} here`}
                        value={currentQ[opt] || ""}
                        onChange={(e) => updateCurrentQuestion({ [opt]: e.target.value })}
                        className="flex-1 h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500 transition text-sm"
                      />

                      <button
                        type="button"
                        onClick={() => updateCurrentQuestion({ [opt]: "" })}
                        className="p-2 text-slate-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-700">Add Solution</h4>
                <textarea
                  placeholder="Type explanation / solution here..."
                  value={currentQ.explanation}
                  onChange={(e) => updateCurrentQuestion({ explanation: e.target.value })}
                  className="w-full h-24 p-4 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition text-slate-800"
                />
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="text-sm font-semibold text-slate-800">Question settings</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  <div>
                    <label className="block text-slate-500 text-xs mb-2">Level of Difficulty</label>
                    <select
                      value={currentQ.difficulty}
                      onChange={(e) => updateCurrentQuestion({ difficulty: e.target.value })}
                      className="w-full h-11 px-3 border border-slate-200 rounded-xl bg-white outline-none focus:border-blue-500 text-sm"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="difficult">Difficult</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-xs mb-2">Topic</label>
                    <select
                      value={currentQ.topic}
                      onChange={(e) => updateCurrentQuestion({ topic: e.target.value })}
                      className="w-full h-11 px-3 border border-slate-200 rounded-xl bg-white outline-none focus:border-blue-500 text-sm"
                    >
                      <option value="">Choose from Drop-down</option>
                      {test?.topics?.map((t: string) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 text-xs mb-2">Sub-topic</label>
                    <select
                      value={currentQ.subtopic}
                      onChange={(e) => updateCurrentQuestion({ subtopic: e.target.value })}
                      className="w-full h-11 px-3 border border-slate-200 rounded-xl bg-white outline-none focus:border-blue-500 text-sm"
                    >
                      <option value="">Choose from Drop-down</option>
                      {test?.sub_topics?.map((st: string) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="max-w-4xl w-full mx-auto flex justify-between items-center border-t border-slate-100 pt-6 mt-8">
            <button
              onClick={() => {
                if (confirm("Are you sure you want to exit? Any unsaved edits will be lost.")) {
                  navigate("/dashboard");
                }
              }}
              className="px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold transition cursor-pointer text-sm"
            >
              Exit Test Creation
            </button>

            <div className="flex gap-4 items-center">
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-500 disabled:opacity-40 transition cursor-pointer"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-500 transition cursor-pointer"
                >
                  <ArrowRight size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveAll}
                disabled={saving}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm transition disabled:bg-blue-400 cursor-pointer text-sm"
              >
                {saving ? "Saving..." : "Save & Preview"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
