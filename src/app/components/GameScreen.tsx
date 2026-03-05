import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { CheckCircle, XCircle, Lightbulb } from "lucide-react";

const IMG_RIGHT = "/src/app/img/easyAI_right.png";
const IMG_WRONG = "/src/app/img/easyAI_wrong.png";

// --- Types ---
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

// --- Dynamic Earth EarthGlobe (v1-v6) ---
const EarthGlobe = ({ phase }: { phase: number }) => {
  const imgSrc = `/img/${phase}.png`;
  return (
    <div className="flex justify-center transition-all duration-700 hover:scale-105">
      <img
        src={imgSrc}
        alt="The Earth"
        className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 lg:w-64 lg:h-64 object-contain drop-shadow-2xl"
      />
    </div>
  );
};

// --- Hearts Lives Counter ---
const MAX_LIVES = 6;
const LivesCounter = ({ wrongAnswers }: { wrongAnswers: number }) => {
  const livesLeft = Math.max(0, MAX_LIVES - wrongAnswers);
  const isDestroyed = livesLeft <= 0;

  return (
    <div className="flex flex-col items-center bg-white/40 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/50 shadow-sm">
      <div className="grid grid-cols-2 gap-1.5 mb-1.5">
        {[...Array(MAX_LIVES)].map((_, i) => {
          const isFull = i < livesLeft;
          return (
            <div
              key={i}
              className={`transition-all duration-500 transform ${!isFull ? "scale-75 opacity-30" : "animate-pulse"}`}
            >
              <span className="text-xl sm:text-2xl">
                {isFull ? "❤️" : "🤍"}
              </span>
            </div>
          );
        })}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${isDestroyed ? "text-red-600" : "text-emerald-700"}`}>
        {isDestroyed ? "Destroyed!" : "6 failures destroys Earth"}
      </span>
    </div>
  );
};

export function GameScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const questions: Question[] = location.state?.questions || [];
  const currentQuestionIdx: number = location.state?.currentQuestionIdx || 0;
  const initialCorrect: number = location.state?.correctAnswers || 0;
  const initialWrong: number = location.state?.wrongAnswers || 0;
  const totalQuestions: number = location.state?.totalQuestions || questions.length;
  const answerHistory: boolean[] = location.state?.answerHistory || [];

  const [correctAnswers, setCorrectAnswers] = useState(initialCorrect);
  const [wrongAnswers, setWrongAnswers] = useState(initialWrong);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (questions.length === 0) {
      navigate("/");
    }
  }, [questions, navigate]);

  if (questions.length === 0) return null;

  const currentQuestionData = questions[currentQuestionIdx];
  const currentQuestionNumber = currentQuestionIdx + 1;

  // Determination of Earth phase: phase = wrong + 1 (capped at 6)
  const getEarthPhase = (wrong: number) => {
    return Math.min(6, wrong + 1);
  };
  const earthPhase = getEarthPhase(wrongAnswers);

  const handleAnswerSelect = (answer: Answer, answerId: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answerId);

    const isCorrect = answer.isCorrect;
    const newCorrect = isCorrect ? correctAnswers + 1 : correctAnswers;
    const newWrong = isCorrect ? wrongAnswers : wrongAnswers + 1;
    const newHistory = [...answerHistory, isCorrect];

    setCorrectAnswers(newCorrect);
    setWrongAnswers(newWrong);

    setTimeout(() => {
      navigate("/feedback", {
        state: {
          isCorrect,
          explanation: answer.explanation,
          tip: currentQuestionData.tip,
          correctAnswers: newCorrect,
          wrongAnswers: newWrong,
          currentQuestionIdx,
          totalQuestions,
          questions,
          answerHistory: newHistory
        }
      });
    }, 600);
  };

  const answerLabels = ["A", "B", "C", "D"];

  const questionLen = currentQuestionData.question.length;
  const questionFontMobile = questionLen > 150 ? "text-sm" : "text-base";
  const questionFontDesktop = questionLen > 150 ? "text-xl" : "text-2xl";

  const getAnswerClasses = (answer: Answer, label: string) => {
    if (selectedAnswer === label) {
      return answer.isCorrect
        ? { btn: "border-emerald-500 bg-emerald-50", icon: "bg-emerald-500 text-white" }
        : { btn: "border-red-500 bg-red-50", icon: "bg-red-500 text-white" };
    }
    if (selectedAnswer && answer.isCorrect) return { btn: "border-emerald-500 bg-emerald-50 opacity-70", icon: "bg-emerald-500 text-white" };
    if (selectedAnswer) return { btn: "border-gray-200 opacity-50", icon: "bg-gray-100 text-gray-700" };
    return { btn: "border-gray-200 hover:border-emerald-300", icon: "bg-gray-100 text-gray-700" };
  };

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-b from-gray-50 to-white flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="max-w-6xl mx-auto px-3 py-2 sm:px-6 sm:py-3">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900">
              Question {currentQuestionNumber}/{totalQuestions}
            </h2>
            <div className="flex items-center gap-2 sm:gap-6">
              <div className="flex items-center gap-1 sm:gap-2 bg-emerald-50 px-2 sm:px-4 py-1 rounded-lg border border-emerald-200">
                <img src={IMG_RIGHT} alt="Correct" className="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0 object-contain" />
                <span className="text-sm sm:text-base font-bold text-emerald-700">{correctAnswers}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-amber-50 px-2 sm:px-4 py-1 rounded-lg border border-amber-200">
                <img src={IMG_WRONG} alt="Wrong" className="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0 object-contain" />
                <span className="text-sm sm:text-base font-bold text-amber-800">{wrongAnswers}</span>
              </div>
            </div>
          </div>
          {/* Mobile progress bar */}
          <div className="md:hidden w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-sky-500 h-full transition-all duration-500"
              style={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}
            />
          </div>
          {/* Desktop tree track */}
          <div className="hidden md:flex items-center gap-1.5 justify-center w-full max-w-4xl mx-auto flex-wrap">
            {Array.from({ length: totalQuestions }).map((_, i) => {
              const state: "correct" | "wrong" | "unanswered" =
                i < answerHistory.length ? (answerHistory[i] ? "correct" : "wrong") : "unanswered";
              const isCurrent = i === currentQuestionIdx;
              return (
                <div key={i} className={`relative flex items-center justify-center transition-all ${isCurrent ? "scale-125 mx-1.5" : ""}`}>
                  {state === "unanswered" ? (
                    <div className={`w-5 h-5 rounded-full border-2 ${isCurrent ? "border-sky-400 bg-sky-50 animate-pulse" : "border-gray-200 bg-gray-50"}`} />
                  ) : state === "correct" ? (
                    <img src={IMG_RIGHT} alt="Correct" className="w-6 h-6 object-contain drop-shadow-sm" />
                  ) : (
                    <img src={IMG_WRONG} alt="Wrong" className="w-6 h-6 object-contain drop-shadow-sm" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="flex-1 min-h-0 overflow-hidden p-3 sm:p-4">

        {/* ══ MOBILE layout ══ */}
        <div className="md:hidden flex flex-col h-full gap-2">

          {/* Dynamic Earth globe + lives */}
          <div className="flex flex-row items-center justify-center gap-3 py-1 flex-shrink">
            <EarthGlobe phase={earthPhase} />
            <LivesCounter wrongAnswers={wrongAnswers} />
          </div>

          <div className="flex flex-col gap-4 flex-1 min-h-0">
            {/* Question card */}
            <div
              className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 text-center h-24 flex-shrink-0 overflow-y-auto flex items-center justify-center"
            >
              <p className={`font-semibold text-gray-900 leading-snug w-full ${questionFontMobile}`}>
                {currentQuestionData.question}
              </p>
            </div>

            {/* Answers */}
            <div className="flex flex-col gap-1.5 overflow-y-auto pb-2">
              {currentQuestionData.answers.map((answer, index) => {
                const answerId = answerLabels[index % answerLabels.length];
                const { btn, icon } = getAnswerClasses(answer, answerId);
                return (
                  <button
                    key={answerId}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleAnswerSelect(answer, answerId)}
                    className={`w-full text-left bg-white rounded-xl p-1.5 border-2 transition-all flex items-center shadow-sm ${btn}`}
                  >
                    <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${icon}`}>
                      {answerId}
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-gray-900 font-medium leading-tight ml-2">{answer.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ══ DESKTOP layout ══ */}
        <div className="hidden md:flex max-w-6xl mx-auto flex-col h-full w-full justify-between">

          {/* Globe + Question */}
          <div className="flex flex-col items-center gap-8 flex-1 justify-center min-h-0 py-4">
            <div className="flex flex-row items-center gap-8 flex-shrink">
              <EarthGlobe phase={earthPhase} />
              <LivesCounter wrongAnswers={wrongAnswers} />
            </div>

            {/* Question card */}
            <div
              className="bg-white rounded-2xl p-6 lg:p-8 shadow-md border border-gray-100 max-w-4xl w-full text-center flex-shrink-0 h-32 overflow-y-auto flex items-center justify-center"
            >
              <h3 className={`font-semibold text-gray-900 leading-snug w-full ${questionFontDesktop}`}>
                {currentQuestionData.question}
              </h3>
            </div>
          </div>

          {/* Answer grid 2×2 - added margin top */}
          <div className="grid grid-cols-2 gap-3 max-w-4xl mx-auto w-full flex-shrink-0 pb-6 mt-4">
            {currentQuestionData.answers.map((answer, index) => {
              const answerId = answerLabels[index % answerLabels.length];
              const { btn, icon } = getAnswerClasses(answer, answerId);
              return (
                <button
                  key={answerId}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswerSelect(answer, answerId)}
                  className={`bg-white rounded-xl lg:rounded-2xl p-2.5 border-2 transition-all shadow-sm hover:shadow-md ${btn} flex items-center gap-3`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base ${icon}`}>
                    {answerId}
                  </div>
                  <p className="text-[13px] lg:text-sm text-gray-900 font-medium text-left leading-tight">
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