import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { getTestById, publishTest } from "../services/testService";
import { fetchBulkQuestions } from "../services/questionService";
import toast from "react-hot-toast";
import { Calendar, Clock } from "lucide-react";

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  const [publishMode, setPublishMode] = useState<"now" | "schedule">("now");
  const [liveDuration, setLiveDuration] = useState("always");

  useEffect(() => {
    async function loadPreviewData() {
      if (!id) return;
      setLoading(true);
      try {
        const testRes = await getTestById(id);
        const testData = testRes.data || testRes;
        setTest(testData);

        const questionIds = testData.questions || [];
        if (questionIds.length > 0) {
          try {
            const questionsRes = await fetchBulkQuestions(questionIds);
            const questionList = Array.isArray(questionsRes)
              ? questionsRes
              : questionsRes.data || [];
            setQuestions(questionList);
          } catch (qErr) {
            console.error("Failed to load questions via fetchBulk:", qErr);
          }
        }
      } catch (err: any) {
        console.error("Failed to load preview details:", err);
        toast.error("Failed to load preview details");
      } finally {
        setLoading(false);
      }
    }
    loadPreviewData();
  }, [id]);

  const handlePublishConfirm = async () => {
    if (!id) return;
    setPublishing(true);
    try {
      await publishTest(id);
      toast.success("Test published successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to publish test";
      toast.error(errorMsg);
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <Layout activeTab="test-creation" breadcrumbs={["Test Creation", "Create Test", "Preview"]}>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      activeTab="test-creation"
      breadcrumbs={["Test Creation", "Create Test", test?.type || "Chapter Wise"]}
    >
      <div className="p-8 bg-slate-50 min-h-[calc(100vh-80px)] space-y-8">

        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Preview & Publish</h1>
            <p className="text-slate-500 text-sm mt-1">Review the test layout and schedule live availability.</p>
          </div>
          <button
            onClick={handlePublishConfirm}
            disabled={publishing}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold shadow-sm transition cursor-pointer text-sm"
          >
            {publishing ? "Publishing..." : "Publish Now"}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm max-w-4xl mx-auto space-y-6">
          
          <div className="flex justify-between items-start border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase">
                  {test?.type}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 font-bold text-xs capitalize">
                  {test?.difficulty}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-xs flex items-center gap-1 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  All {test?.total_questions} Questions Done
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800">{test?.name}</h2>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-slate-500 font-medium">
                <span>Subject: <strong className="text-slate-700">{test?.subject}</strong></span>
                {test?.topics && test.topics.length > 0 && (
                  <span>Topics: <strong className="text-slate-700">{test.topics.join(", ")}</strong></span>
                )}
                {test?.sub_topics && test.sub_topics.length > 0 && (
                  <span>Sub Topics: <strong className="text-slate-700">{test.sub_topics.join(", ")}</strong></span>
                )}
              </div>
            </div>

            <div className="flex gap-6 text-center">
              <div>
                <div className="text-lg font-bold text-slate-800">{test?.total_time} min</div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Duration</div>
              </div>
              <div className="border-l border-slate-100 h-10"></div>
              <div>
                <div className="text-lg font-bold text-slate-800">{test?.total_questions}</div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Questions</div>
              </div>
              <div className="border-l border-slate-100 h-10"></div>
              <div>
                <div className="text-lg font-bold text-slate-800">{test?.total_marks}</div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Total Marks</div>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
              Publish Settings:
            </h3>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setPublishMode("now")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition cursor-pointer ${
                  publishMode === "now"
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Publish Now
              </button>
              <button
                type="button"
                onClick={() => setPublishMode("schedule")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition cursor-pointer ${
                  publishMode === "schedule"
                    ? "bg-blue-50 text-blue-600 border-blue-200"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Schedule Publish
              </button>
            </div>

            {publishMode === "schedule" && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-700">Select Date and Time</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full h-12 px-4 pr-10 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
                    />
                    <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <input
                      type="time"
                      className="w-full h-12 px-4 pr-10 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
                    />
                    <Clock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 pt-2">
              <div>
                <h4 className="text-sm font-medium text-slate-700">Live Until</h4>
                <p className="text-xs text-slate-400 mt-1">Choose how long this test should remain available on the platform.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: "always", label: "Always Available" },
                  { id: "1week", label: "1 Week" },
                  { id: "2weeks", label: "2 Weeks" },
                  { id: "3weeks", label: "3 Weeks" },
                  { id: "1month", label: "1 Month" },
                  { id: "custom", label: "Custom Duration" },
                ].map((dur) => (
                  <label
                    key={dur.id}
                    className={`flex items-center gap-3 p-3 px-4 border rounded-xl cursor-pointer hover:bg-slate-50 transition text-sm font-medium ${
                      liveDuration === dur.id
                        ? "border-blue-500 bg-blue-50/20 text-blue-600"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={liveDuration === dur.id}
                      onChange={() => setLiveDuration(dur.id)}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                    />
                    {dur.label}
                  </label>
                ))}
              </div>

              {liveDuration === "custom" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-2">
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full h-12 px-4 pr-10 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
                    />
                    <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <input
                      type="time"
                      className="w-full h-12 px-4 pr-10 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm"
                    />
                    <Clock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4 border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold transition cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublishConfirm}
                disabled={publishing}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold shadow-sm transition cursor-pointer text-sm"
              >
                {publishing ? "Publishing..." : "Confirm & Publish"}
              </button>
            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm max-w-4xl mx-auto space-y-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
            Questions List Preview ({questions.length} Questions)
          </h3>

          {questions.length === 0 ? (
            <div className="text-slate-400 text-center py-8 text-sm">
              No questions found for this test.
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id || idx} className="border border-slate-100 rounded-xl p-5 bg-slate-50/50">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-bold text-slate-800 text-sm leading-relaxed">
                      Q{idx + 1}. {q.question}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider h-fit">
                      {q.difficulty || "Easy"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {["option1", "option2", "option3", "option4"].map((opt) => {
                      const isCorrect = q.correct_option === opt;
                      return (
                        <div
                          key={opt}
                          className={`p-3 rounded-lg border text-xs font-medium ${
                            isCorrect
                              ? "bg-green-50 border-green-200 text-green-700 font-semibold"
                              : "bg-white border-slate-100 text-slate-600"
                          }`}
                        >
                          <span className="mr-1.5 uppercase font-bold text-[10px] opacity-60">
                            {opt.replace("option", "Opt ")}:
                          </span>
                          {q[opt]}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                      <strong className="text-slate-700 block mb-1">Solution Explanation:</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
