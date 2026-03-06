import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Leaf, Cpu, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import questionsData from "../questions.json";

export function StartScreen() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState(1);

  const difficultyCounts: Record<number, number> = {
    1: 10,
    2: 15,
    3: 20,
    4: 30
  };

  const shuffleArray = (array: any[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const handleStartGame = () => {
    const targetCount = difficultyCounts[difficulty] || 10;
    const poolSame = shuffleArray(questionsData.filter(q => q.difficulty === difficulty));
    const poolLower = shuffleArray(questionsData.filter(q => q.difficulty < difficulty));

    let selected: any[] = [];
    if (poolSame.length >= targetCount) {
      selected = poolSame.slice(0, targetCount);
    } else {
      selected = [...poolSame];
      const remaining = targetCount - selected.length;
      selected = [...selected, ...poolLower.slice(0, remaining)];
    }

    const finalQuestions = shuffleArray(selected);
    navigate("/game", {
      state: {
        questions: finalQuestions,
        currentQuestionIdx: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        totalQuestions: finalQuestions.length,
        answerHistory: []
      }
    });
  };

  const difficultyLabels = [
    { level: 1, label: "Easy", color: "bg-emerald-500" },
    { level: 2, label: "Medium", color: "bg-amber-500" },
    { level: 3, label: "Hard", color: "bg-orange-600" },
    { level: 4, label: "Expert", color: "bg-red-600" }
  ];

  return (
    <div className="h-[100dvh] w-full bg-slate-950 flex items-center justify-center p-4 sm:p-8 overflow-hidden relative">
      {/* CRT Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-20"></div>

      <div className="max-w-6xl w-full h-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 relative z-10 transition-all">

        {/* Left Side: Visuals & Tagline */}
        <div className="flex-1 flex flex-col items-center lg:items-end justify-center text-center lg:text-right space-y-6">
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes breathe {
              0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px rgba(52, 211, 153, 0.4)); }
              50% { transform: scale(1.08); filter: drop-shadow(0 0 40px rgba(52, 211, 153, 0.8)); }
            }
            .animate-breathe {
              animation: breathe 5s ease-in-out infinite;
            }
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
            .animate-blink { animation: blink 1s step-end infinite; }
          `}} />

          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <img
              src="/img/1.png"
              alt="Pixel Earth"
              className="relative w-40 h-40 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-contain animate-breathe drop-shadow-2xl"
              style={{ imageRendering: "pixelated" }}
            />
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)] uppercase tracking-wide">
              WORLD HEALTHY HERE<span className="animate-blink">_</span>
            </h2>
            <p className="text-emerald-200/80 text-xl sm:text-2xl font-bold tracking-widest uppercase">
              &gt; TECH_MEETS_SUSTAINABILITY
            </p>
          </div>
        </div>

        {/* Right Side: Information & Controls */}
        <div className="flex-1 max-w-md w-full flex flex-col justify-center space-y-8">

          {/* Header Info Card */}
          <div className="bg-slate-900 p-6 border-4 border-emerald-500 shadow-[6px_6px_0_0_#10b981] space-y-4 hover:shadow-[2px_2px_0_0_#10b981] hover:translate-x-1 hover:translate-y-1 transition-all duration-200">
            <div className="flex items-center gap-4 border-b-2 border-emerald-500/30 pb-4">
              <Leaf className="w-8 h-8 text-emerald-400 animate-pulse" />
              <h1 className="text-2xl sm:text-3xl font-bold text-emerald-300 uppercase tracking-widest">
                HOW TO PLAY
              </h1>
            </div>
            <p className="text-emerald-100/90 text-xl sm:text-2xl leading-relaxed">
              Explore the impact of AI. Answer questions, earn points, and save the planet.
            </p>
          </div>

          {/* Difficulty Selector */}
          <div className="bg-slate-900 p-6 border-4 border-emerald-500 shadow-[6px_6px_0_0_#10b981] space-y-6 hover:shadow-[2px_2px_0_0_#10b981] hover:translate-x-1 hover:translate-y-1 transition-all duration-200">
            <div className="flex items-center gap-4 border-b-2 border-emerald-500/30 pb-4">
              <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
              <h3 className="text-2xl sm:text-3xl font-bold text-emerald-300 uppercase tracking-widest">SELECT LEVEL</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {difficultyLabels.map((d) => (
                <button
                  key={d.level}
                  onClick={() => setDifficulty(d.level)}
                  className={`flex flex-col items-center justify-center p-3 border-4 transition-all duration-150 uppercase transform ${difficulty === d.level
                      ? `border-emerald-400 bg-emerald-900/60 text-emerald-300 shadow-[inset_0_0_15px_rgba(52,211,153,0.4)] translate-x-1 translate-y-1`
                      : "border-slate-700 bg-slate-800 text-slate-400 hover:border-emerald-500 hover:text-emerald-400 shadow-[4px_4px_0_0_#334155] hover:shadow-[4px_4px_0_0_#10b981]"
                    }`}
                >
                  <div className={`w-4 h-4 rounded-sm mb-2 shadow-inner ${difficulty === d.level ? d.color : "bg-slate-600"}`} />
                  <span className="text-2xl font-bold tracking-wider">{d.label}</span>
                  <span className="text-sm font-bold opacity-80 pt-1 border-t-2 border-dashed border-current mt-1 w-full text-center">
                    {difficultyCounts[d.level]} Qs
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleStartGame}
            className="w-full bg-emerald-500 text-slate-950 text-4xl font-black py-4 px-8 border-4 border-emerald-300 shadow-[6px_6px_0_0_#34d399] hover:bg-emerald-400 hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_0_#34d399] active:translate-x-2 active:translate-y-2 active:shadow-none transition-all duration-150 uppercase tracking-widest"
          >
            <div className="flex items-center justify-center gap-4">
              <Cpu className="w-8 h-8 animate-bounce" />
              START
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}