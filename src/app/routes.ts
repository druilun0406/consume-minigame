import { createBrowserRouter } from "react-router";
import { StartScreen } from "./components/StartScreen";
import { GameScreen } from "./components/GameScreen";
import { FeedbackScreen } from "./components/FeedbackScreen";
import { FinishScreen } from "./components/FinishScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: StartScreen,
  },
  {
    path: "/game",
    Component: GameScreen,
  },
  {
    path: "/feedback",
    Component: FeedbackScreen,
  },
  {
    path: "/finish",
    Component: FinishScreen,
  },
]);
