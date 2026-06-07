import Navbar from "../components/layout/Navbar";

import { useTestStore } from "../store/testStore";

import toast from "react-hot-toast";

export default function PreviewPage() {
  const { testData, questions } = useTestStore();

  const handlePublish = () => {
    toast.success("Test Published");
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8">Preview Test</h1>

          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {testData?.name}
            </p>

            <p>
              <strong>Subject:</strong> {testData?.subject}
            </p>

            <p>
              <strong>Topics:</strong> {testData?.topics}
            </p>

            <p>
              <strong>Duration:</strong> {testData?.duration}
            </p>
          </div>

          <div className="mt-10 space-y-6">
            {questions.length === 0 ? (
              <div className="bg-slate-50 rounded-xl p-8 text-center text-slate-500">
                No Questions Added
              </div>
            ) : (
              questions.map((q, index) => (
                <div key={q.id} className="bg-slate-50 rounded-xl p-5">
                  <h2 className="font-bold">
                    Q{index + 1}. {q.question}
                  </h2>

                  <ul className="mt-3 space-y-2">
                    <li>{q.option1}</li>
                    <li>{q.option2}</li>
                    <li>{q.option3}</li>
                    <li>{q.option4}</li>
                  </ul>

                  <p className="text-green-600 mt-3">
                    Correct Answer: {q.correct_option}
                  </p>
                </div>
              ))
            )}
          </div>

          <button
            onClick={handlePublish}
            className="mt-10 bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition"
          >
            Publish Test
          </button>
        </div>
      </div>
    </>
  );
}
