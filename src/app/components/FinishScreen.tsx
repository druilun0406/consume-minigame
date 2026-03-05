import { useNavigate, useLocation } from "react-router";
import { Star, RotateCcw } from "lucide-react";
import { TreeIcon } from "./TreeIcon";

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

export function FinishScreen() {
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state || {};
    const correctAnswers = state.correctAnswers || 0;
    const wrongAnswers = state.wrongAnswers || 0;
    const totalQuestions = state.totalQuestions || 20;

    // Calculate stars (0 to 3)
    const scorePercentage = correctAnswers / totalQuestions;
    let stars = 0;
    if (scorePercentage >= 0.33) stars = 1;
    if (scorePercentage >= 0.66) stars = 2;
    if (scorePercentage >= 0.99) stars = 3;

    return (
        <div className="min-h-[100dvh] w-full bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4 sm:p-6">
            <div className="max-w-md w-full h-full flex flex-col items-center justify-center gap-4 sm:gap-6 z-10 py-2 min-h-0">

                {/* Title */}
                <h1 className="text-3xl sm:text-5xl font-bold text-emerald-900 text-center drop-shadow-sm flex-shrink-0">
                    Game Completed!
                </h1>

                {/* Globe Visualization */}
                <div className="flex-shrink-0">
                    <img
                        src={getEarthImage(wrongAnswers)}
                        alt="Earth final state"
                        className="w-40 h-40 sm:w-56 sm:h-56 object-contain drop-shadow-lg"
                    />
                </div>

                {/* Star Rating Section */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 my-2">
                    {[1, 2, 3].map((starIdx) => (
                        <div key={starIdx} className="relative">
                            {/* Glow behind earned stars */}
                            {stars >= starIdx && (
                                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-60"></div>
                            )}
                            <Star
                                className={`relative w-12 h-12 sm:w-16 sm:h-16 ${stars >= starIdx
                                    ? "text-yellow-400 fill-yellow-400 drop-shadow-md"
                                    : "text-gray-300 fill-gray-200"
                                    } transition-all duration-500`}
                            />
                        </div>
                    ))}
                </div>

                {/* Score Details */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-gray-100 w-full flex items-center justify-around flex-shrink-0">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                            <TreeIcon state="correct" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                            <span className="text-xl sm:text-2xl font-bold text-emerald-700">{correctAnswers}</span>
                        </div>
                        <span className="text-sm font-medium text-emerald-800 mt-2">Correct</span>
                    </div>

                    <div className="h-12 w-px bg-gray-200"></div>

                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
                            <TreeIcon state="wrong" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                            <span className="text-xl sm:text-2xl font-bold text-amber-800">{wrongAnswers}</span>
                        </div>
                        <span className="text-sm font-medium text-amber-900 mt-2">Incorrect</span>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => navigate("/")}
                    className="w-full flex-shrink-0 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white text-lg font-semibold py-3 sm:py-4 px-8 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] mt-2"
                >
                    <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                    Play Again
                </button>

            </div>
        </div>
    );
}