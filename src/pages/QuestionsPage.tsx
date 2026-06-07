import { useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";

import type { Question } from "../types/question.types";

import { useTestStore } from "../store/testStore";

import toast from "react-hot-toast";

export default function QuestionsPage() {
  const navigate = useNavigate();

  const { questions, addQuestion, deleteQuestion } = useTestStore();

  const [question, setQuestion] = useState("");

  const [option1, setOption1] = useState("");

  const [option2, setOption2] = useState("");

  const [option3, setOption3] = useState("");

  const [option4, setOption4] = useState("");

  const [correctOption, setCorrectOption] =
    useState<Question["correct_option"]>("option1");

  const handleAddQuestion = () => {
    if (!question) {
      toast.error("Question cannot be empty");

      return;
    }

    const newQuestion: Question = {
      id: Date.now(),

      question,

      option1,

      option2,

      option3,

      option4,

      correct_option: correctOption,
    };

    addQuestion(newQuestion);

    toast.success("Question added");

    setQuestion("");

    setOption1("");

    setOption2("");

    setOption3("");

    setOption4("");

    setCorrectOption("option1");
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100 p-8">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold mb-8">Add Questions</h1>

          <div className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Question"
              className="w-full border rounded-xl p-4"
            />

            <input
              value={option1}
              onChange={(e) => setOption1(e.target.value)}
              placeholder="Option 1"
              className="w-full border rounded-xl p-3"
            />

            <input
              value={option2}
              onChange={(e) => setOption2(e.target.value)}
              placeholder="Option 2"
              className="w-full border rounded-xl p-3"
            />

            <input
              value={option3}
              onChange={(e) => setOption3(e.target.value)}
              placeholder="Option 3"
              className="w-full border rounded-xl p-3"
            />

            <input
              value={option4}
              onChange={(e) => setOption4(e.target.value)}
              placeholder="Option 4"
              className="w-full border rounded-xl p-3"
            />

            <select
              value={correctOption}
              onChange={(e) =>
                setCorrectOption(e.target.value as Question["correct_option"])
              }
              className="w-full border rounded-xl p-3"
            >
              <option value="option1">Option 1</option>

              <option value="option2">Option 2</option>

              <option value="option3">Option 3</option>

              <option value="option4">Option 4</option>
            </select>

            <button
              onClick={handleAddQuestion}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl"
            >
              Add Question
            </button>
          </div>

          <div className="mt-10 space-y-4">
            {questions.map((q, index) => (
              <div key={q.id} className="bg-slate-50 p-5 rounded-xl">
                <h2 className="font-bold">
                  Q{index + 1}. {q.question}
                </h2>

                <button
                  onClick={() => deleteQuestion(q.id)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/tests/1/preview")}
            className="mt-10 bg-green-600 text-white px-8 py-3 rounded-xl"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </>
  );
}
