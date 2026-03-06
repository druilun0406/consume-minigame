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
        className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 lg:w-64 lg:h-64 object-contain drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] animate-pulse"
        style={{ imageRendering: "pixelated" }}
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
    <div className="flex flex-col items-center bg-slate-900 px-4 py-3 rounded-xl border-4 border-emerald-500 shadow-[4px_4px_0_0_#10b981]">
      <div className="grid grid-cols-2 gap-2 mb-2">
        {[...Array(MAX_LIVES)].map((_, i) => {
          const isFull = i < livesLeft;
          return (
            <div
              key={i}
              className={`transition-all duration-500 transform ${!isFull ? "scale-75 opacity-20 grayscale" : "hover:scale-110"}`}
            >
              <img
                src="/src/app/img/heart.png"
                alt={isFull ? "Life" : "Lost"}
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                style={isFull ? { filter: 'drop-shadow(0 0 6px rgba(220,38,38,0.7))' } : {}}
              />
            </div>
          );
        })}
      </div>
      <span className={`text-[12px] font-black uppercase tracking-widest ${isDestroyed ? "text-red-500 animate-pulse" : "text-emerald-400"}`}>
        {isDestroyed ? "SYSTEM FAILURE" : "FAILURES LEFT"}
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
    }, 800);
  };

  const answerLabels = ["A", "B", "C", "D"];

  const questionLen = currentQuestionData.question.length;
  const questionFontMobile = questionLen > 100 ? "text-sm" : "text-lg";
  const questionFontDesktop = questionLen > 100 ? "text-2xl" : "text-4xl";

  const getAnswerClasses = (answer: Answer, label: string) => {
    if (selectedAnswer === label) {
      return answer.isCorrect
        ? { btn: "border-emerald-400 bg-emerald-900/80 shadow-[inset_0_0_15px_rgba(52,211,153,0.5)] translate-x-1 translate-y-1 shadow-none", icon: "bg-emerald-500 text-slate-900", text: "text-emerald-200" }
        : { btn: "border-red-500 bg-red-900/80 shadow-[inset_0_0_15px_rgba(239,68,68,0.5)] translate-x-1 translate-y-1 shadow-none", icon: "bg-red-600 text-slate-900", text: "text-red-200" };
    }
    if (selectedAnswer && answer.isCorrect) return { btn: "border-emerald-500 bg-emerald-900/50 opacity-80", icon: "bg-emerald-600 text-white", text: "text-emerald-300" };
    if (selectedAnswer) return { btn: "border-slate-700 bg-slate-800 opacity-40", icon: "bg-slate-700 text-slate-400", text: "text-slate-500" };
    return { btn: "border-slate-600 bg-slate-800 hover:border-emerald-500 hover:bg-slate-700 shadow-[4px_4px_0_0_#334155] hover:shadow-[4px_4px_0_0_#10b981] hover:-translate-y-1", icon: "bg-slate-700 text-emerald-400", text: "text-slate-200" };
  };

  return (
    <div className="h-[100dvh] w-full bg-slate-950 flex flex-col overflow-hidden relative">
      {/* CRT Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-20"></div>

      {/* ── Header ── */}
      <div className="bg-slate-900 border-b-4 border-emerald-500 shadow-[0_4px_0_0_#10b981] flex-shrink-0 relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg sm:text-2xl font-black text-emerald-400 tracking-widest uppercase">
              LEVEL {currentQuestionNumber}/{totalQuestions}
            </h2>
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2 sm:gap-3 bg-emerald-950 px-3 sm:px-5 py-1.5 rounded-lg border-2 border-emerald-500 shadow-[2px_2px_0_0_#10b981]">
                <img src={IMG_RIGHT} alt="Correct" className="w-5 h-5 sm:w-7 sm:h-7 flex-shrink-0 object-contain drop-shadow-[0_0_3px_rgba(52,211,153,0.8)]" style={{ imageRendering: "pixelated" }} />
                <span className="text-lg sm:text-xl font-black text-emerald-300">{correctAnswers}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 bg-red-950 px-3 sm:px-5 py-1.5 rounded-lg border-2 border-red-500 shadow-[2px_2px_0_0_#ef4444]">
                <img src={IMG_WRONG} alt="Wrong" className="w-5 h-5 sm:w-7 sm:h-7 flex-shrink-0 object-contain drop-shadow-[0_0_3px_rgba(239,68,68,0.8)]" style={{ imageRendering: "pixelated" }} />
                <span className="text-lg sm:text-xl font-black text-red-400">{wrongAnswers}</span>
              </div>
            </div>
          </div>
          {/* Mobile progress bar */}
          <div className="md:hidden w-full bg-slate-800 rounded-none border-2 border-slate-700 h-3 overflow-hidden mt-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}
            />
          </div>
          {/* Desktop tree track */}
          <div className="hidden md:flex items-center gap-2 py-1 justify-center w-full max-w-4xl mx-auto flex-wrap">
            {Array.from({ length: totalQuestions }).map((_, i) => {
              const state: "correct" | "wrong" | "unanswered" =
                i < answerHistory.length ? (answerHistory[i] ? "correct" : "wrong") : "unanswered";
              const isCurrent = i === currentQuestionIdx;
              return (
                <div key={i} className={`relative flex items-center justify-center transition-all ${isCurrent ? "scale-150 mx-3 animate-pulse" : "scale-100"}`}>
                  {state === "unanswered" ? (
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-sm border-2 ${isCurrent ? "border-emerald-400 bg-emerald-900 shadow-[0_0_10px_#34d399]" : "border-slate-600 bg-slate-800"}`} />
                  ) : state === "correct" ? (
                    <img src={IMG_RIGHT} alt="Correct" className="w-6 h-6 object-contain drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" style={{ imageRendering: "pixelated" }} />
                  ) : (
                    <img src={IMG_WRONG} alt="Wrong" className="w-6 h-6 object-contain drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" style={{ imageRendering: "pixelated" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="flex-1 min-h-0 overflow-hidden p-4 sm:p-6 relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center">

        {/* ══ MOBILE layout ══ */}
        <div className="md:hidden flex flex-col h-full justify-center gap-4 pb-2">

          {/* Dynamic Earth globe + lives */}
          <div className="flex flex-row items-center justify-center gap-4 py-2">
            <EarthGlobe phase={earthPhase} />
            <LivesCounter wrongAnswers={wrongAnswers} />
          </div>

          {/* Question card */}
          <div
            className="bg-slate-900 rounded-xl px-5 py-4 border-4 border-emerald-500 shadow-[4px_4px_0_0_#10b981] text-center max-h-32 overflow-y-auto flex items-center justify-center mx-1"
          >
            <p className={`font-black tracking-wide uppercase text-emerald-300 leading-snug w-full ${questionFontMobile}`}>
              {currentQuestionData.question}
            </p>
          </div>

          {/* Answers */}
          <div className="flex flex-col gap-3 mt-2">
            {currentQuestionData.answers.map((answer, index) => {
              const answerId = answerLabels[index % answerLabels.length];
              const { btn, icon, text } = getAnswerClasses(answer, answerId);
              return (
                <button
                  key={answerId}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswerSelect(answer, answerId)}
                  className={`w-full text-left rounded-xl p-2.5 border-4 transition-all flex items-center ${btn}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center font-black text-sm border-2 border-inherit shadow-inner ${icon}`}>
                    {answerId}
                  </div>
                  <span className={`text-[12px] sm:text-[14px] font-bold leading-tight uppercase ml-3 tracking-wide ${text}`}>{answer.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ══ DESKTOP layout ══ */}
        <div className="hidden md:flex flex-col h-full w-full justify-between gap-6 pb-8">

          {/* Globe + Question */}
          <div className="flex flex-col items-center gap-8 flex-1 justify-center min-h-0 pt-6">
            <div className="flex flex-row items-center justify-center gap-12 w-full max-w-5xl">
              <div className="flex-1 flex justify-end">
                <EarthGlobe phase={earthPhase} />
              </div>

              {/* Question card */}
              <div
                className="bg-slate-900 rounded-2xl p-6 lg:p-8 border-4 border-emerald-500 shadow-[8px_8px_0_0_#10b981] max-w-2xl w-full text-center flex-shrink-0 max-h-48 overflow-y-auto flex items-center justify-center relative"
              >
                {/* Decorative retro corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-300"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-300"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-300"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-300"></div>

                <h3 className={`font-black text-emerald-300 leading-snug w-full tracking-widest uppercase drop-shadow-[0_0_8px_rgba(52,211,153,0.3)] ${questionFontDesktop}`}>
                  {currentQuestionData.question}
                </h3>
              </div>

              <div className="flex-1 flex justify-start">
                <LivesCounter wrongAnswers={wrongAnswers} />
              </div>
            </div>
          </div>

          {/* Answer grid 2×2 */}
          <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto w-full flex-shrink-0 pt-4">
            {currentQuestionData.answers.map((answer, index) => {
              const answerId = answerLabels[index % answerLabels.length];
              const { btn, icon, text } = getAnswerClasses(answer, answerId);
              return (
                <button
                  key={answerId}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswerSelect(answer, answerId)}
                  className={`rounded-2xl p-4 border-4 transition-all flex items-center gap-4 ${btn}`}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 border-inherit flex items-center justify-center font-black text-2xl shadow-inner ${icon}`}>
                    {answerId}
                  </div>
                  <p className={`text-xl font-bold text-left leading-tight uppercase tracking-wider ${text}`}>
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