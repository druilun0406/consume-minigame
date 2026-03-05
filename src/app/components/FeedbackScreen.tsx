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

  const isGameOver = currentQuestionIdx + 1 >= totalQuestions;

  const handleNext = () => {
    if (isGameOver) {
      navigate("/finish", { state: { correctAnswers, wrongAnswers, totalQuestions, answerHistory } });
    } else {
      navigate("/game", {
        state: { questions, currentQuestionIdx: currentQuestionIdx + 1, correctAnswers, wrongAnswers, totalQuestions, answerHistory }
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
    <div className="h-[100dvh] w-full bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="h-full max-w-2xl mx-auto flex flex-col justify-between p-3 sm:p-5 gap-4 sm:gap-6 text-center">

        {/* ── Earth Globe ── */}
        <div className="flex justify-center flex-shrink-0">
          <img
            src={getEarthImage(wrongAnswers)}
            alt="Earth state"
            className="w-32 h-32 sm:w-36 sm:h-36 md:w-48 md:h-48 object-contain drop-shadow-md"
          />
        </div>

        {/* ── Result badge ── */}
        <div className={`rounded-xl sm:rounded-2xl px-4 py-3 sm:py-4 text-center border-2 flex-shrink-0 flex items-center justify-center gap-3
            ${isCorrect
            ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300"
            : "bg-gradient-to-br from-red-50 to-red-100 border-red-300"
          }`}
        >
          {isCorrect
            ? <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 flex-shrink-0" />
            : <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 flex-shrink-0" />
          }
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${isCorrect ? "text-emerald-900" : "text-red-900"}`}>
            {isCorrect ? "Correct!" : "Incorrect"}
          </h1>
        </div>

        {/* ── Explanation ── */}
        <div
          className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex-shrink-0"
        >
          <h2 className={`text-sm sm:text-base font-semibold mb-1 sm:mb-2 ${isCorrect ? "text-emerald-700" : "text-red-700"}`}>
            {isCorrect ? "Correct" : "Not quite"} — here's why:
          </h2>
          <p className={`text-gray-700 leading-relaxed ${explanationFont}`}>
            {explanation}
          </p>
        </div>

        {/* ── Did you know tip (capped at 18vh) ── */}
        <div
          className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 shadow-md border-2 border-sky-100 flex-shrink-0 overflow-y-auto"
          style={{ maxHeight: '18vh' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600 flex-shrink-0" />
            <h3 className="text-sm sm:text-base font-semibold text-sky-900">Did you know?</h3>
          </div>
          <p className="text-sky-900 text-[12px] sm:text-sm leading-snug sm:leading-relaxed">
            {tip}
          </p>
        </div>

        {/* ── CTA buttons ── */}
        <div className="flex-shrink-0 flex flex-col gap-1">
          <button
            onClick={handleNext}
            className={`w-full font-semibold py-3 sm:py-4 px-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] text-white text-sm sm:text-base
                ${isCorrect
                ? "bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600"
                : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              }`}
          >
            {isGameOver ? "🏁 See Final Score" : "Next Question →"}
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full text-gray-400 hover:text-gray-700 text-xs sm:text-sm font-medium py-1.5 transition-colors"
          >
            Back to Start
          </button>
        </div>

      </div>
    </div>
  );
}