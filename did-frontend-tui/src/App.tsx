import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import GameInterface from "./components/GameInterface";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<GameInterface />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;