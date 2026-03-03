import { useState } from "react";
import { useNavigate } from "react-router";
import { TreeIcon } from "./TreeIcon";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function GameScreen() {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const currentQuestion = 4;
  const totalQuestions = 20;
  
  // Track correct and wrong answers
  const correctAnswers = 5;
  const wrongAnswers = 10;

  const question = "How much water does a prompt consume?";
  const answers = [
    { id: "A", text: "About 500ml (one water bottle)" },
    { id: "B", text: "About 50ml (a shot glass)" },
    { id: "C", text: "About 5 liters (a large jug)" },
    { id: "D", text: "No water at all" },
  ];

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
    // Simulate a delay before navigating to feedback
    setTimeout(() => {
      navigate("/feedback");
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Desktop & Mobile Header with Progress */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5">
          {/* Question Progress Text */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 md:text-xl">
              Question {currentQuestion}/{totalQuestions}
            </h2>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-sky-500 h-full transition-all duration-500"
                style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Tree Counters */}
          <div className="flex items-center gap-6">
            {/* Good Trees Counter */}
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
              <TreeIcon state="correct" className="w-8 h-8 flex-shrink-0" />
              <span className="text-lg font-bold text-emerald-700">{correctAnswers}</span>
            </div>
            
            {/* Bad Trees Counter */}
            <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
              <TreeIcon state="wrong" className="w-8 h-8 flex-shrink-0" />
              <span className="text-lg font-bold text-amber-800">{wrongAnswers}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout: Vertical Stack */}
      <div className="md:hidden px-6 py-8 space-y-6">
        {/* Globe Visual - Slightly Damaged State */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-2xl opacity-30"></div>
            
            {/* Mixed state globe - partially green with brown areas */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-green-400 via-yellow-500 to-orange-400 shadow-2xl overflow-hidden border-4 border-white">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1602960477687-bafbdda6f229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW1hZ2VkJTIwZWFydGglMjBjbGltYXRlJTIwY2hhbmdlfGVufDF8fHx8MTc3MjUzMzEzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Earth in mixed state"
                className="w-full h-full object-cover opacity-70 mix-blend-overlay"
              />
              
              {/* Damage overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-yellow-600 to-orange-700 opacity-50"></div>
              
              {/* Dried areas effect */}
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-amber-900 rounded-full blur-md opacity-40"></div>
              <div className="absolute top-4 left-4 w-12 h-12 bg-yellow-700 rounded-full blur-sm opacity-30"></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-500">Question {currentQuestion}</span>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 leading-tight">
            {question}
          </h3>
        </div>

        {/* Answer Options - Vertical List */}
        <div className="space-y-3">
          {answers.map((answer) => (
            <button
              key={answer.id}
              onClick={() => handleAnswerSelect(answer.id)}
              className={`w-full text-left bg-white rounded-xl p-5 border-2 transition-all shadow-sm hover:shadow-md ${
                selectedAnswer === answer.id
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-emerald-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                  selectedAnswer === answer.id
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {answer.id}
                </div>
                <span className="text-gray-900 font-medium">{answer.text}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Layout: Grid with Cards */}
      <div className="hidden md:block max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Globe & Question Card */}
          <div className="flex flex-col items-center gap-6">
            {/* Globe Visual - Slightly Damaged State */}
            <div className="relative w-40 h-40">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl opacity-30"></div>
              
              {/* Mixed state globe */}
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-green-400 via-yellow-500 to-orange-400 shadow-2xl overflow-hidden border-4 border-white">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1602960477687-bafbdda6f229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW1hZ2VkJTIwZWFydGglMjBjbGltYXRlJTIwY2hhbmdlfGVufDF8fHx8MTc3MjUzMzEzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Earth in mixed state"
                  className="w-full h-full object-cover opacity-70 mix-blend-overlay"
                />
                
                {/* Damage overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-yellow-600 to-orange-700 opacity-50"></div>
                
                {/* Dried areas effect */}
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-amber-900 rounded-full blur-xl opacity-40"></div>
                <div className="absolute top-6 left-6 w-16 h-16 bg-yellow-700 rounded-full blur-lg opacity-30"></div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl w-full text-center">
              <span className="text-sm font-medium text-gray-500 mb-3 block">
                Question {currentQuestion}
              </span>
              <h3 className="text-3xl font-semibold text-gray-900">
                {question}
              </h3>
            </div>
          </div>

          {/* Answer Grid - 2x2 */}
          <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
            {answers.map((answer) => (
              <button
                key={answer.id}
                onClick={() => handleAnswerSelect(answer.id)}
                className={`bg-white rounded-2xl p-8 border-2 transition-all shadow-md hover:shadow-xl ${
                  selectedAnswer === answer.id
                    ? "border-emerald-500 bg-emerald-50 transform scale-[1.02]"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
              >
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-2xl ${
                    selectedAnswer === answer.id
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {answer.id}
                  </div>
                  <p className="text-lg text-gray-900 font-medium text-left">
                    {answer.text}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}