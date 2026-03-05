import { useNavigate } from "react-router";
import { Leaf, Cpu, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import questionsData from "../questions.json";

export function StartScreen() {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate("/game", {
      state: {
        questions: questionsData,
        currentQuestionIdx: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        totalQuestions: questionsData.length,
        answerHistory: []
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">
            Information about the game - what to do?
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Discover the environmental impact of AI and technology through an interactive quiz.
            Answer questions, learn fascinating facts, and watch your progress grow with each correct answer.
            Your choices help us understand the hidden costs of our digital world.
          </p>
        </div>

        {/* Hero Visual - 3D Globe Effect */}
        <div className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-sky-50 rounded-3xl p-16 overflow-hidden shadow-2xl">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-sky-200 to-purple-200 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-200 to-green-200 rounded-full blur-3xl opacity-30"></div>

          <div className="absolute top-6 right-6 opacity-10">
            <Cpu className="w-24 h-24 text-sky-600" />
          </div>
          <div className="absolute bottom-6 left-6 opacity-10">
            <Leaf className="w-24 h-24 text-emerald-600" />
          </div>

          {/* Central Content */}
          <div className="relative text-center space-y-6">
            {/* 3D Globe Illustration */}
            <div className="relative inline-block mb-6">
              <div className="relative w-48 h-48 mx-auto">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-sky-400 rounded-full blur-2xl opacity-40"></div>

                {/* Main globe */}
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-sky-500 shadow-2xl overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1743082063778-bb0c2b04d2eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZ3JlZW4lMjBlYXJ0aCUyMHBsYW5ldCUyMGdsb2JlfGVufDF8fHx8MTc3MjUzMzEzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Healthy Earth"
                    className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                  />

                  {/* Continents overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-transparent to-blue-600 opacity-60"></div>

                  {/* Highlight effect */}
                  <div className="absolute top-4 left-8 w-16 h-16 bg-white rounded-full blur-xl opacity-40"></div>

                  {/* Tech icons overlay */}
                  <div className="absolute top-1/4 right-6">
                    <Sparkles className="w-6 h-6 text-yellow-300 opacity-80" />
                  </div>
                  <div className="absolute bottom-1/4 left-6">
                    <Leaf className="w-8 h-8 text-white opacity-70" />
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-sky-600 drop-shadow-sm">
              World healthy here!
            </h2>

            <p className="text-gray-700 text-lg max-w-md mx-auto font-medium">
              Where technology meets sustainability
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleStartGame}
          className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white text-lg font-semibold py-5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
        >
          Start the game!
        </button>
      </div>
    </div>
  );
}