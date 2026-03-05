import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { TreeIcon } from "./TreeIcon";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import questionsData from "../data/questions.json";

interface Answer {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface Question {
  question: string;
  answers: Answer[];
  tip: string;
}

export function GameScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const [questions, setQuestions] = useState<Question[]>(location.state?.questions || []);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(location.state?.currentQuestionIdx || 0);
  const totalQuestions = questionsData.length;

  const [correctAnswers, setCorrectAnswers] = useState(location.state?.correctAnswers || 0);
  const [wrongAnswers, setWrongAnswers] = useState(location.state?.wrongAnswers || 0);
  const [answerHistory, setAnswerHistory] = useState<boolean[]>(location.state?.answerHistory || []);

  useEffect(() => {
    if (questions.length === 0) {
      const shuffled = [...questionsData].sort(() => 0.5 - Math.random());
      setQuestions(shuffled.slice(0, totalQuestions));
    }
  }, []);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-500 font-semibold">Loading questions...</p>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestionIdx];
  const currentQuestionNumber = currentQuestionIdx + 1;

  const handleAnswerSelect = (answer: Answer, answerId: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerId);
    setIsAnswerCorrect(answer.isCorrect);

    if (answer.isCorrect) {
      setCorrectAnswers((prev: number) => prev + 1);
    } else {
      setWrongAnswers((prev: number) => prev + 1);
    }

    const newHistory = [...answerHistory, answer.isCorrect];
    setAnswerHistory(newHistory);

    setTimeout(() => {
      navigate("/feedback", {
        state: {
          isCorrect: answer.isCorrect,
          explanation: answer.explanation,
          tip: currentQuestionData.tip,
          correctAnswers: correctAnswers + (answer.isCorrect ? 1 : 0),
          wrongAnswers: wrongAnswers + (!answer.isCorrect ? 1 : 0),
          answerHistory: newHistory,
          currentQuestionIdx,
          totalQuestions,
          questions
        }
      });
    }, 1200);
  };

  const answerLabels = ["A", "B", "C", "D"];

  // Dynamic font size for question text
  const questionFontClass =
    currentQuestionData.question.length > 400
      ? "text-[11px] sm:text-[12px]"
      : currentQuestionData.question.length > 250
        ? "text-[12px] sm:text-[13px]"
        : "text-[13px] sm:text-sm";

  const questionFontClassDesktop =
    currentQuestionData.question.length > 400
      ? "text-sm lg:text-[15px]"
      : currentQuestionData.question.length > 250
        ? "text-base lg:text-lg"
        : "text-lg lg:text-xl";

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-b from-gray-50 to-white flex flex-col overflow-hidden">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 z-10">
        <div className="max-w-6xl mx-auto px-3 py-2 sm:px-6 sm:py-3">

          {/* Question counter + tree badges */}
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900">
              Question {currentQuestionNumber}/{totalQuestions}
            </h2>
            <div className="flex items-center gap-2 sm:gap-6">
              <div className="flex items-center gap-1 sm:gap-2 bg-emerald-50 px-2 sm:px-4 py-1 rounded-lg border border-emerald-200">
                <TreeIcon state="correct" className="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-sm sm:text-base font-bold text-emerald-700">{correctAnswers}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-amber-50 px-2 sm:px-4 py-1 rounded-lg border border-amber-200">
                <TreeIcon state="wrong" className="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0" />
                <span className="text-sm sm:text-base font-bold text-amber-800">{wrongAnswers}</span>
              </div>
            </div>
          </div>

          {/* Mobile: progress bar | Desktop: tree track */}
          <div>
            <div className="md:hidden w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-sky-500 h-full transition-all duration-500"
                style={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}
              />
            </div>
            <div className="hidden md:flex items-center gap-1.5 justify-center w-full max-w-4xl mx-auto flex-wrap">
              {Array.from({ length: totalQuestions }).map((_, i) => {
                const state: "correct" | "wrong" | "unanswered" =
                  i < answerHistory.length
                    ? answerHistory[i] ? "correct" : "wrong"
                    : "unanswered";
                const isCurrent = i === currentQuestionIdx;
                return (
                  <div key={i} className={`relative flex items-center justify-center transition-all ${isCurrent ? "scale-125 mx-1.5" : ""}`}>
                    {state === "unanswered" ? (
                      <div className={`w-5 h-5 rounded-full border-2 ${isCurrent ? "border-sky-400 bg-sky-50 animate-pulse" : "border-gray-200 bg-gray-50"}`} />
                    ) : (
                      <TreeIcon state={state} className="w-6 h-6 drop-shadow-sm" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ── Main content (fills remaining height exactly) ─ */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden p-3 sm:p-4">

        {/* ── MOBILE layout ──────────────────────────────── */}
        <div className="md:hidden flex flex-col h-full gap-2">

          {/* Globe – fixed small size, never grows */}
          <div className="flex justify-center flex-shrink-0">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-xl opacity-30" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-green-400 via-yellow-500 to-orange-400 shadow-md overflow-hidden border-2 border-white">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1602960477687-bafbdda6f229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW1hZ2VkJTIwZWFydGglMjBjbGltYXRlJTIwY2hhbmdlfGVufDF8fHx8MTc3MjUzMzEzMXww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral"
                  alt="Earth"
                  className="w-full h-full object-cover opacity-70 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-yellow-600 to-orange-700 opacity-50" />
              </div>
            </div>
          </div>

          {/* Question – takes all spare space, scrolls internally if needed */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex-1 min-h-0 flex flex-col justify-center text-center overflow-hidden">
            <div className="overflow-y-auto hide-scrollbar">
              <h3 className={`font-semibold text-gray-900 leading-snug ${questionFontClass}`}>
                {currentQuestionData.question}
              </h3>
            </div>
          </div>

          {/* Answers – fixed at bottom, never grows */}
          <div className="flex flex-col gap-1.5 flex-shrink-0">
            {currentQuestionData.answers.map((answer, index) => {
              const answerId = answerLabels[index % answerLabels.length];
              const isSelected = selectedAnswer === answerId;

              let btnClasses = "border-gray-200 hover:border-emerald-300";
              let iconClasses = "bg-gray-100 text-gray-700";

              if (isSelected) {
                if (isAnswerCorrect) {
                  btnClasses = "border-emerald-500 bg-emerald-50";
                  iconClasses = "bg-emerald-500 text-white";
                } else {
                  btnClasses = "border-red-500 bg-red-50";
                  iconClasses = "bg-red-500 text-white";
                }
              } else if (selectedAnswer && answer.isCorrect) {
                btnClasses = "border-emerald-500 bg-emerald-50 opacity-70";
                iconClasses = "bg-emerald-500 text-white";
              } else if (selectedAnswer) {
                btnClasses = "border-gray-200 opacity-50";
              }

              return (
                <button
                  key={answerId}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswerSelect(answer, answerId)}
                  className={`w-full text-left bg-white rounded-xl p-2 border-2 transition-all flex items-center shadow-sm ${btnClasses}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm ${iconClasses}`}>
                      {answerId}
                    </div>
                    <span className="text-[12px] sm:text-[13px] text-gray-900 font-medium leading-snug">{answer.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── DESKTOP layout ─────────────────────────────── */}
        <div className="hidden md:flex max-w-6xl mx-auto flex-col h-full w-full justify-between">

          {/* Globe + Question (centred, takes leftover space) */}
          <div className="flex flex-col items-center gap-4 flex-1 justify-center min-h-0">
            <div className="relative w-28 h-28 lg:w-32 lg:h-32 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl opacity-30" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-green-400 via-yellow-500 to-orange-400 shadow-lg overflow-hidden border-2 border-white">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1602960477687-bafbdda6f229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW1hZ2VkJTIwZWFydGglMjBjbGltYXRlJTIwY2hhbmdlfGVufDF8fHx8MTc3MjUzMzEzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Earth in mixed state"
                  className="w-full h-full object-cover opacity-70 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-yellow-600 to-orange-700 opacity-50" />
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-amber-900 rounded-full blur-xl opacity-40" />
                <div className="absolute top-6 left-6 w-16 h-16 bg-yellow-700 rounded-full blur-lg opacity-30" />
              </div>
            </div>

            {/* Question card – max height + internal scroll */}
            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-md border border-gray-100 max-w-2xl w-full text-center flex-shrink-0 max-h-[200px] flex flex-col justify-center">
              <div className="overflow-y-auto hide-scrollbar">
                <h3 className={`font-semibold text-gray-900 leading-snug ${questionFontClassDesktop}`}>
                  {currentQuestionData.question}
                </h3>
              </div>
            </div>
          </div>

          {/* Answer grid 2×2 – stays anchored at bottom */}
          <div className="grid grid-cols-2 gap-3 max-w-4xl mx-auto w-full flex-shrink-0 pb-4">
            {currentQuestionData.answers.map((answer, index) => {
              const answerId = answerLabels[index % answerLabels.length];
              const isSelected = selectedAnswer === answerId;

              let btnClasses = "border-gray-200 hover:border-emerald-300";
              let iconClasses = "bg-gray-100 text-gray-700";

              if (isSelected) {
                if (isAnswerCorrect) {
                  btnClasses = "border-emerald-500 bg-emerald-50 scale-[1.02]";
                  iconClasses = "bg-emerald-500 text-white";
                } else {
                  btnClasses = "border-red-500 bg-red-50 scale-[1.02]";
                  iconClasses = "bg-red-500 text-white";
                }
              } else if (selectedAnswer && answer.isCorrect) {
                btnClasses = "border-emerald-500 bg-emerald-50 opacity-70";
                iconClasses = "bg-emerald-500 text-white";
              } else if (selectedAnswer) {
                btnClasses = "border-gray-200 opacity-50";
              }

              return (
                <button
                  key={answerId}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswerSelect(answer, answerId)}
                  className={`bg-white rounded-xl lg:rounded-2xl p-4 border-2 transition-all shadow-sm hover:shadow-md ${btnClasses} flex items-center gap-3`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${iconClasses}`}>
                    {answerId}
                  </div>
                  <p className="text-sm lg:text-base text-gray-900 font-medium text-left leading-snug">
                    {answer.text}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}