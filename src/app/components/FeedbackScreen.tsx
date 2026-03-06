import { useNavigate, useLocation } from "react-router";
import { CheckCircle, XCircle, Lightbulb } from "lucide-react";

// Match GameScreen logic: phase depends on count of failures, not ratio
function getEarthImage(wrong: number): string {
  switch (wrong) {
    case 0: return "/img/1.png";
    case 1: return "/img/2.png";
    case 2: return "/img/3.png";
    case 3: return "/img/4.png";
    case 4: return "/img/5.png";
    default: return "/img/6.png";
  }
}

export function FeedbackScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};
  const isCorrect = state.isCorrect !== undefined ? state.isCorrect : true;
  const explanation = state.explanation || "No explanation provided.";
  const tip = state.tip || "Here is a tip.";
  const correctAnswers = state.correctAnswers || 0;
  const wrongAnswers = state.wrongAnswers || 0;
  const currentQuestionIdx = state.currentQuestionIdx || 0;
  const totalQuestions = state.totalQuestions || 20;
  const questions = state.questions || [];
  const answerHistory = state.answerHistory || [];

  const isFailed = wrongAnswers >= 6;
  const isGameOver = isFailed || (currentQuestionIdx + 1 >= totalQuestions);

  const handleNext = () => {
    if (isGameOver) {
      navigate("/finish", {
        state: {
          correctAnswers,
          wrongAnswers,
          totalQuestions,
          answerHistory,
          isDead: isFailed
        }
      });
    } else {
      navigate("/game", {
        state: {
          questions,
          currentQuestionIdx: currentQuestionIdx + 1,
          correctAnswers,
          wrongAnswers,
          totalQuestions,
          answerHistory
        }
      });
    }
  };

  // Dynamic font for explanation
  const e = explanation.length;
  const explanationFont =
    e > 600 ? "text-[11px] sm:text-xs" :
      e > 400 ? "text-[12px] sm:text-[13px]" :
        e > 200 ? "text-[13px] sm:text-sm" :
          "text-sm sm:text-base";

  return (
    <div className="h-[100dvh] w-full bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      {/* CRT Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-20"></div>

      <div className="h-full max-w-2xl mx-auto flex flex-col justify-between p-3 sm:p-5 gap-4 sm:gap-6 text-center z-10 w-full relative">

        {/* ── Earth Globe ── */}
        <div className="flex justify-center flex-shrink-0 animate-bounce">
          <img
            src={getEarthImage(wrongAnswers)}
            alt="Earth state"
            className="w-32 h-32 sm:w-36 sm:h-36 md:w-48 md:h-48 object-contain drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        {/* ── Result badge ── */}
        <div className={`px-4 py-3 sm:py-4 text-center border-4 shadow-[6px_6px_0_0_rgba(0,0,0,0.5)] flex-shrink-0 flex items-center justify-center gap-4
            ${isCorrect
            ? "bg-emerald-900/80 border-emerald-500 shadow-[6px_6px_0_0_#10b981]"
            : "bg-red-900/80 border-red-500 shadow-[6px_6px_0_0_#ef4444]"
          }`}
        >
          {isCorrect
            ? <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 flex-shrink-0 animate-pulse" />
            : <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 flex-shrink-0 animate-pulse" />
          }
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-widest ${isCorrect ? "text-emerald-300 drop-shadow-[0_0_5px_#34d399]" : "text-red-300 drop-shadow-[0_0_5px_#f87171]"}`}>
            {isCorrect ? "CORRECT!" : "WARNING!"}
          </h1>
        </div>

        {/* ── Explanation ── */}
        <div
          className="bg-slate-900 p-4 sm:p-5 border-4 border-emerald-500 shadow-[6px_6px_0_0_#10b981] flex-shrink-0 text-left relative"
        >
          <div className="absolute top-0 right-0 p-2 opacity-50">
            <div className={`w-3 h-3 rounded-full animate-pulse ${isCorrect ? "bg-emerald-400" : "bg-red-500"}`}></div>
          </div>
          <h2 className={`text-xl sm:text-2xl font-black mb-2 uppercase tracking-wide ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
            {isCorrect ? "> ANALYSIS: APPROVED" : "> ANALYSIS: REJECTED"}
          </h2>
          <p className={`text-emerald-100/90 leading-relaxed font-semibold uppercase ${explanationFont}`}>
            {explanation}
          </p>
        </div>

        {/* ── Did you know tip (capped at 18vh) ── */}
        <div
          className="bg-sky-950 px-4 py-3 border-4 border-sky-500 shadow-[6px_6px_0_0_#0ea5e9] flex-shrink-0 overflow-y-auto"
          style={{ maxHeight: '18vh' }}
        >
          <div className="flex items-center gap-3 mb-2 border-b-2 border-sky-500/30 pb-2">
            <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400 flex-shrink-0 animate-pulse" />
            <h3 className="text-lg sm:text-xl font-black text-sky-300 uppercase tracking-widest">DATA FRAGMENT</h3>
          </div>
          <p className="text-sky-100 font-bold text-sm sm:text-base leading-snug sm:leading-relaxed uppercase text-left">
            {tip}
          </p>
        </div>

        {/* ── CTA buttons ── */}
        <div className="flex-shrink-0 flex flex-col gap-3">
          <button
            onClick={handleNext}
            className={`w-full font-black py-4 sm:py-5 px-6 border-4 shadow-[6px_6px_0_0_rgba(255,255,255,0.2)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-2 active:translate-y-2 transition-all duration-150 text-slate-950 text-xl sm:text-2xl uppercase tracking-widest
                ${isCorrect
                ? "bg-emerald-500 border-emerald-300 text-slate-950 hover:bg-emerald-400"
                : "bg-red-500 border-red-300 text-slate-950 hover:bg-red-400"
              }`}
          >
            {isGameOver ? "TERMINATE SESSION" : "PROCEED"}
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full text-slate-500 hover:text-emerald-400 text-sm sm:text-base font-bold py-2 transition-colors uppercase tracking-widest"
          >
            &lt; RETURN TO BASE
          </button>
        </div>

      </div>
    </div>
  );
}