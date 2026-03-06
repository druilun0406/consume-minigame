import { useNavigate, useLocation } from "react-router";
import { Star, RotateCcw } from "lucide-react";

const IMG_RIGHT = "/src/app/img/easyAI_right.png";
const IMG_WRONG = "/src/app/img/easyAI_wrong.png";

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
    const isDead = state.isDead || false;

    // Calculate stars (0 to 3)
    let stars = 0;
    if (!isDead) {
        const scorePercentage = correctAnswers / totalQuestions;
        if (scorePercentage >= 0.33) stars = 1;
        if (scorePercentage >= 0.66) stars = 2;
        if (scorePercentage >= 0.99) stars = 3;
    }

    return (
        <div className="h-[100dvh] w-full bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden relative">
            {/* CRT Scanline overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-20"></div>

            <div className="max-w-md w-full h-full flex flex-col items-center justify-center gap-6 z-10 py-4 min-h-0">

                {/* Title */}
                <h1 className={`text-4xl sm:text-6xl font-black text-center tracking-widest uppercase flex-shrink-0 animate-pulse ${isDead ? "text-red-500 drop-shadow-[0_0_10px_#ef4444]" : "text-emerald-400 drop-shadow-[0_0_10px_#34d399]"}`}>
                    {isDead ? "GAME OVER" : "MISSION SUCCESS"}
                </h1>

                {/* Globe Visualization */}
                <div className="flex-shrink-0 relative">
                    <div className={`absolute inset-0 rounded-full blur-3xl opacity-30 ${isDead ? "bg-red-600" : "bg-emerald-500"}`}></div>
                    <img
                        src={getEarthImage(isDead ? 6 : wrongAnswers)}
                        alt="Earth final state"
                        className={`relative w-40 h-40 sm:w-56 sm:h-56 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ${!isDead && "animate-pulse"}`}
                        style={{ imageRendering: "pixelated" }}
                    />
                </div>

                {/* Star Rating Section */}
                <div className="flex items-center justify-center gap-3 sm:gap-5 my-2">
                    {[1, 2, 3].map((starIdx) => (
                        <div key={starIdx} className="relative">
                            {/* Glow behind earned stars */}
                            {stars >= starIdx && (
                                <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                            )}
                            <Star
                                className={`relative w-12 h-12 sm:w-16 sm:h-16 border-2 border-transparent transition-all duration-500 ${stars >= starIdx
                                    ? "text-yellow-300 fill-amber-400 drop-shadow-[0_0_8px_#fbbf24] scale-110"
                                    : "text-slate-800 fill-slate-900 scale-90"
                                    }`}
                            />
                        </div>
                    ))}
                </div>

                {/* Score Details */}
                <div className="bg-slate-900 border-4 border-emerald-500 shadow-[6px_6px_0_0_#10b981] p-4 sm:p-6 w-full flex flex-col items-center justify-around flex-shrink-0 relative overflow-hidden gap-6">

                    {/* Retro Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 bg-emerald-300"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-300"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 bg-emerald-300"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-300"></div>

                    <div className="flex w-full items-center justify-between">
                        <span className="text-xl font-black text-emerald-500 tracking-widest uppercase">CORRECT :</span>
                        <div className="flex items-center gap-3 bg-emerald-950 px-4 py-2 border-4 border-emerald-500 shadow-[4px_4px_0_0_#064e3b]">
                            <img src={IMG_RIGHT} alt="Correct" className="w-8 h-8 flex-shrink-0 object-contain drop-shadow-sm" style={{ imageRendering: "pixelated" }} />
                            <span className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_5px_#34d399]">{correctAnswers}</span>
                        </div>
                    </div>

                    <div className="w-full h-1 border-b-4 border-dashed border-slate-700"></div>

                    <div className="flex w-full items-center justify-between">
                        <span className="text-xl font-black text-red-500 tracking-widest uppercase">FAILURES:</span>
                        <div className="flex items-center gap-3 bg-red-950 px-4 py-2 border-4 border-red-500 shadow-[4px_4px_0_0_#450a0a]">
                            <img src={IMG_WRONG} alt="Wrong" className="w-8 h-8 flex-shrink-0 object-contain drop-shadow-sm" style={{ imageRendering: "pixelated" }} />
                            <span className="text-3xl font-black text-red-400 drop-shadow-[0_0_5px_#f87171]">{wrongAnswers}</span>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => navigate("/")}
                    className="w-full flex-shrink-0 flex items-center justify-center gap-4 bg-emerald-500 text-slate-950 text-2xl font-black py-4 sm:py-5 px-8 border-4 border-emerald-300 shadow-[6px_6px_0_0_rgba(255,255,255,0.2)] hover:bg-emerald-400 hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-2 active:translate-y-2 transition-all duration-150 uppercase tracking-widest mt-4"
                >
                    <RotateCcw className="w-8 h-8 font-black" />
                    REBOOT SYSTEM
                </button>

            </div>
        </div>
    );
}