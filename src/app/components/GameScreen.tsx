import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { TreeIcon } from "./TreeIcon";
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

// ── Earth phase definitions ──────────────────────────────────────────────
// Add your image path for each phase below.
// Phase is determined by wrongRatio = wrongAnswers / answeredSoFar
// Thresholds: 0%, 16%, 33%, 50%, 66%, 83%
interface EarthPhase {
  image: string;   // path or URL to the phase image
  label: string;   // alt text
}

const EARTH_PHASES: EarthPhase[] = [
  // Phase 0 – 0–16% wrong answers
  { image: "/img/1.png", label: "Healthy Earth" },
  // Phase 1 – 16–33% wrong answers
  { image: "/img/2.png", label: "Slightly Stressed" },
  // Phase 2 – 33–50% wrong answers
  { image: "/img/3.png", label: "Damaged Earth" },
  // Phase 3 – 50–66% wrong answers
  { image: "/img/4.png", label: "Heavily Damaged" },
  // Phase 4 – 66–83% wrong answers
  { image: "/img/5.png", label: "Critical State" },
  // Phase 5 – 83–100% wrong answers
  { image: "/img/6.png", label: "Destroyed" },
];

function getEarthPhase(wrongAnswers: number): EarthPhase {
  // Map 0-5 errors to phases 0-5. 6+ stays at phase 5 (destroyed).
  const phaseIdx = Math.min(wrongAnswers, 5);
  return EARTH_PHASES[phaseIdx];
}

// Max wrong answers (lives)
const MAX_LIVES = 6;

// Lives counter: shows hearts below the globe
function LivesCounter({ wrongAnswers }: { wrongAnswers: number }) {
  return (
    <div className="flex flex-col items-center gap-1 mt-1">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: MAX_LIVES }).map((_, i) => {
          const lost = i < wrongAnswers;
          return (
            <span
              key={i}
              className={`text-xl sm:text-2xl transition-all duration-300 ${lost ? "grayscale opacity-20 scale-90" : "drop-shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-pulse"
                }`}
              style={{ animationDelay: `${i * 150}ms`, animationDuration: '2s' }}
            >
              ❤️
            </span>
          );
        })}
      </div>
      <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
        {wrongAnswers >= MAX_LIVES
          ? <span className="text-red-600 animate-bounce">Earth Destroyed!</span>
          : <span className="text-gray-500">6 failures destroys Earth</span>
        }
      </p>
    </div>
  );
}

// Globe: constant fixed size, shows only the phase image
function EarthGlobe({ phase }: { phase: EarthPhase }) {
  return (
    <img
      src={phase.image}
      alt={phase.label}
      className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain transition-all duration-700 drop-shadow-md"
    />
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
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
  const answeredSoFar = answerHistory.length;
  const earthPhase = getEarthPhase(wrongAnswers);

  const handleAnswerSelect = (answer: Answer, answerId: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerId);
    setIsAnswerCorrect(answer.isCorrect);
    if (answer.isCorrect) setCorrectAnswers((p: number) => p + 1);
    else setWrongAnswers((p: number) => p + 1);
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
  const q = currentQuestionData.question.length;

  const questionFontMobile =
    q > 600 ? "text-[10px]" :
      q > 450 ? "text-[11px]" :
        q > 300 ? "text-[12px]" :
          q > 150 ? "text-[13px]" : "text-sm";

  const questionFontDesktop =
    q > 600 ? "text-xs lg:text-[13px]" :
      q > 450 ? "text-[13px] lg:text-sm" :
        q > 300 ? "text-sm lg:text-[15px]" :
          q > 150 ? "text-base lg:text-lg" : "text-lg lg:text-xl";

  const getAnswerClasses = (answer: Answer, answerId: string) => {
    const isSelected = selectedAnswer === answerId;
    if (isSelected) {
      return isAnswerCorrect
        ? { btn: "border-emerald-500 bg-emerald-50", icon: "bg-emerald-500 text-white" }
        : { btn: "border-red-500 bg-red-50", icon: "bg-red-500 text-white" };
    }
    if (selectedAnswer && answer.isCorrect) return { btn: "border-emerald-500 bg-emerald-50 opacity-70", icon: "bg-emerald-500 text-white" };
    if (selectedAnswer) return { btn: "border-gray-200 opacity-50", icon: "bg-gray-100 text-gray-700" };
    return { btn: "border-gray-200 hover:border-emerald-300", icon: "bg-gray-100 text-gray-700" };
  };

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-gray-50 to-white flex flex-col">

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="max-w-6xl mx-auto px-3 py-2 sm:px-6 sm:py-3">
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
                  {state === "unanswered"
                    ? <div className={`w-5 h-5 rounded-full border-2 ${isCurrent ? "border-sky-400 bg-sky-50 animate-pulse" : "border-gray-200 bg-gray-50"}`} />
                    : <TreeIcon state={state} className="w-6 h-6 drop-shadow-sm" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="flex-1 p-3 sm:p-4">

        {/* ══ MOBILE layout ══ */}
        <div className="md:hidden flex flex-col gap-2">

          {/* Dynamic Earth globe + lives */}
          <div className="flex flex-col items-center gap-1">
            <EarthGlobe phase={earthPhase} />
            <LivesCounter wrongAnswers={wrongAnswers} />
          </div>

          {/* Question card */}
          <div
            className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 text-center"
          >
            <p className={`font-semibold text-gray-900 leading-snug ${questionFontMobile}`}>
              {currentQuestionData.question}
            </p>
          </div>

          {/* Answers */}
          <div className="flex flex-col gap-1.5">
            {currentQuestionData.answers.map((answer, index) => {
              const answerId = answerLabels[index % answerLabels.length];
              const { btn, icon } = getAnswerClasses(answer, answerId);
              return (
                <button
                  key={answerId}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswerSelect(answer, answerId)}
                  className={`w-full text-left bg-white rounded-xl p-2 border-2 transition-all flex items-center shadow-sm ${btn}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm ${icon}`}>
                      {answerId}
                    </div>
                    <span className="text-[12px] sm:text-[13px] text-gray-900 font-medium leading-snug">{answer.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ══ DESKTOP layout ══ */}
        <div className="hidden md:flex max-w-6xl mx-auto flex-col h-full w-full justify-between">

          {/* Globe + Question */}
          <div className="flex flex-col items-center gap-4 flex-1 justify-center min-h-0">
            <div className="flex flex-col items-center gap-2">
              <EarthGlobe phase={earthPhase} />
              <LivesCounter wrongAnswers={wrongAnswers} />
            </div>

            {/* Question card */}
            <div
              className="bg-white rounded-2xl p-6 lg:p-8 shadow-md border border-gray-100 max-w-2xl w-full text-center flex-shrink-0"
            >
              <h3 className={`font-semibold text-gray-900 leading-snug ${questionFontDesktop}`}>
                {currentQuestionData.question}
              </h3>
            </div>
          </div>

          {/* Answer grid 2×2 */}
          <div className="grid grid-cols-2 gap-3 max-w-4xl mx-auto w-full flex-shrink-0 pb-4">
            {currentQuestionData.answers.map((answer, index) => {
              const answerId = answerLabels[index % answerLabels.length];
              const { btn, icon } = getAnswerClasses(answer, answerId);
              return (
                <button
                  key={answerId}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswerSelect(answer, answerId)}
                  className={`bg-white rounded-xl lg:rounded-2xl p-4 border-2 transition-all shadow-sm hover:shadow-md ${btn} flex items-center gap-3`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${icon}`}>
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