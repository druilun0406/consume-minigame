import { useNavigate, useLocation } from "react-router";
import { CheckCircle, XCircle, Lightbulb, Flame } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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
      navigate("/finish", {
        state: {
          correctAnswers,
          wrongAnswers,
          totalQuestions,
          answerHistory
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

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Globe - Bad State (Barren & On Fire) or Good State */}
      <div className="absolute top-10 right-10 md:right-20 opacity-20 pointer-events-none">
        {isCorrect ? (
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 rounded-full blur-3xl opacity-60 animate-pulse"></div>
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-sky-400 to-emerald-400 shadow-2xl overflow-hidden border-4 border-emerald-300">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aHxlbnwwfHx8fDE2OTk5OTk5OTl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Healthy earth"
                className="w-full h-full object-cover opacity-80 mix-blend-overlay"
              />
            </div>
          </div>
        ) : (
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full blur-3xl opacity-60 animate-pulse"></div>
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-gray-700 via-red-700 to-orange-600 shadow-2xl overflow-hidden border-4 border-red-900">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1602960477687-bafbdda6f229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW1hZ2VkJTIwZWFydGglMjBjbGltYXRlJTIwY2hhbmdlfGVufDF8fHx8MTc3MjUzMzEzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Damaged burning earth"
                className="w-full h-full object-cover opacity-60 mix-blend-overlay grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-red-800 via-orange-700 to-amber-900 opacity-70"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600 rounded-full blur-2xl opacity-60"></div>
              <div className="absolute top-10 right-10 w-24 h-24 bg-orange-500 rounded-full blur-xl opacity-50"></div>
              <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-yellow-500 rounded-full blur-lg opacity-40"></div>
              <div className="absolute top-1/4 right-1/4">
                <Flame className="w-8 h-8 text-orange-400 opacity-80" />
              </div>
              <div className="absolute bottom-1/3 left-1/3">
                <Flame className="w-10 h-10 text-red-400 opacity-70" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-2xl w-full h-full flex flex-col space-y-3 sm:space-y-4 relative z-10 py-2 sm:py-6">
        {/* Result Header */}
        <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center shadow-lg sm:shadow-2xl border-2 flex-shrink-0 flex flex-col justify-center min-h-[100px] sm:min-h-[160px] ${isCorrect
          ? "bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border-emerald-300"
          : "bg-gradient-to-br from-red-50 via-orange-50 to-red-100 border-red-300"
          }`}>
          <div className="flex flex-col items-center gap-1 sm:gap-4">
            {isCorrect ? (
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-40"></div>
                <CheckCircle className="relative w-12 h-12 sm:w-20 sm:h-20 text-emerald-600" />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-40"></div>
                <XCircle className="relative w-12 h-12 sm:w-20 sm:h-20 text-red-600" />
              </div>
            )}
            <h1 className={`text-3xl sm:text-5xl font-bold ${isCorrect ? "text-emerald-900" : "text-red-900"
              }`}>
              {isCorrect ? "Correct" : "False"}
            </h1>
          </div>
        </div>

        {/* Information Cards - Using min-h-0 and overflow-auto to fit screen */}
        <div className="flex flex-col flex-1 min-h-0 gap-2 sm:gap-4">
          {/* Primary Explanation Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-md border border-gray-100 flex-1 overflow-y-auto min-h-0 relative">
            <div className="sticky top-0 bg-white pb-1 mb-2">
              <h2 className={`text-base sm:text-xl font-semibold leading-tight ${isCorrect ? "text-emerald-700" : "text-red-700"}`}>
                {isCorrect ? "Correct" : "Not quite"} because
              </h2>
            </div>
            <p className="text-gray-700 text-[13px] sm:text-base leading-snug sm:leading-relaxed">
              {explanation}
            </p>
          </div>

          {/* Trivia Card */}
          <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-md border-2 border-sky-100 flex-shrink-0 sm:flex-shrink max-h-[120px] sm:max-h-none overflow-y-auto">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-sky-400 rounded-full blur-md opacity-30"></div>
                <Lightbulb className="relative w-5 h-5 sm:w-7 sm:h-7 text-sky-600 flex-shrink-0" />
              </div>
              <h3 className="text-base sm:text-xl font-semibold text-sky-900 leading-tight">
                Did you know?
              </h3>
            </div>
            <p className="text-sky-900 text-[13px] sm:text-base leading-snug sm:leading-relaxed">
              {tip}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex-shrink-0 pt-1 sm:pt-2">
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white text-base sm:text-lg font-semibold py-3 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isGameOver ? "Finish Game" : "Next Question"}
          </button>

          {/* Optional: Back to Start */}
          <button
            onClick={() => navigate("/")}
            className="w-full text-gray-400 hover:text-gray-900 text-xs sm:text-sm font-medium py-1.5 sm:py-3 mt-1 transition-colors"
          >
            Back to Start
          </button>
        </div>
      </div>
    </div>
  );
}