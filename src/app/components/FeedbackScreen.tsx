import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, XCircle, Lightbulb, Flame } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function FeedbackScreen() {
  const navigate = useNavigate();
  const [isCorrect] = useState(true); // Toggle this to see different states

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Globe - Bad State (Barren & On Fire) */}
      <div className="absolute top-20 right-10 md:right-20 opacity-20 pointer-events-none">
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          {/* Fire glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full blur-3xl opacity-60 animate-pulse"></div>
          
          {/* Barren globe on fire */}
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-gray-700 via-red-700 to-orange-600 shadow-2xl overflow-hidden border-4 border-red-900">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1602960477687-bafbdda6f229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW1hZ2VkJTIwZWFydGglMjBjbGltYXRlJTIwY2hhbmdlfGVufDF8fHx8MTc3MjUzMzEzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Damaged burning earth"
              className="w-full h-full object-cover opacity-60 mix-blend-overlay grayscale"
            />
            
            {/* Damage/burn overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-800 via-orange-700 to-amber-900 opacity-70"></div>
            
            {/* Fire effects */}
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600 rounded-full blur-2xl opacity-60"></div>
            <div className="absolute top-10 right-10 w-24 h-24 bg-orange-500 rounded-full blur-xl opacity-50"></div>
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-yellow-500 rounded-full blur-lg opacity-40"></div>
            
            {/* Flame icons */}
            <div className="absolute top-1/4 right-1/4">
              <Flame className="w-8 h-8 text-orange-400 opacity-80" />
            </div>
            <div className="absolute bottom-1/3 left-1/3">
              <Flame className="w-10 h-10 text-red-400 opacity-70" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        {/* Result Header */}
        <div className={`rounded-2xl p-8 text-center shadow-2xl border-2 ${
          isCorrect 
            ? "bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border-emerald-300" 
            : "bg-gradient-to-br from-red-50 via-orange-50 to-red-100 border-red-300"
        }`}>
          <div className="flex flex-col items-center gap-4">
            {isCorrect ? (
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-40"></div>
                <CheckCircle className="relative w-24 h-24 text-emerald-600" />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-40"></div>
                <XCircle className="relative w-24 h-24 text-red-600" />
              </div>
            )}
            <h1 className={`text-5xl font-bold ${
              isCorrect ? "text-emerald-900" : "text-red-900"
            }`}>
              {isCorrect ? "Correct" : "False"}
            </h1>
          </div>
        </div>

        {/* Information Cards */}
        <div className="space-y-4">
          {/* Primary Explanation Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className={`text-xl font-semibold mb-3 ${
              isCorrect ? "text-emerald-700" : "text-red-700"
            }`}>
              {isCorrect ? "Correct" : "False"} because
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {isCorrect 
                ? "AI models consume significant amounts of water for cooling data centers. A single ChatGPT prompt can use approximately 500ml of water, equivalent to one standard water bottle. This highlights the hidden environmental cost of our digital interactions."
                : "Actually, AI models do consume water. Data centers require cooling systems that use about 500ml of water per prompt. This is often overlooked but represents a significant environmental consideration."
              }
            </p>
          </div>

          {/* Trivia Card */}
          <div className="bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border-2 border-sky-200">
            <div className="flex items-start gap-3 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-sky-400 rounded-full blur-md opacity-30"></div>
                <Lightbulb className="relative w-7 h-7 text-sky-600 flex-shrink-0 mt-1" />
              </div>
              <h3 className="text-xl font-semibold text-sky-900">
                Did you know?
              </h3>
            </div>
            <p className="text-sky-900 leading-relaxed">
              Training a large AI model like GPT-3 can consume as much water as it takes to 
              produce 370 BMW cars or fill an Olympic-sized swimming pool. The AI industry 
              is working on solutions like using renewable energy and more efficient cooling 
              systems to reduce this environmental footprint.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/game")}
          className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white text-lg font-semibold py-5 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
        >
          Next Question
        </button>

        {/* Optional: Back to Start */}
        <button
          onClick={() => navigate("/")}
          className="w-full text-gray-600 hover:text-gray-900 text-sm font-medium py-3 transition-colors"
        >
          Back to Start
        </button>
      </div>
    </div>
  );
}