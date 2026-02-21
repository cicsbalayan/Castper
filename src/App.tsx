import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

const SelectionPage = lazy(() => import("./pages/selection-page").then(m => ({ default: m.SelectionPage })));
const CreateRoomFragment = lazy(() => import("./pages/create-room-fragment").then(m => ({ default: m.CreateRoomFragment })));
const JoinControl = lazy(() => import("./pages/join-control").then(m => ({ default: m.JoinControl })));
const MainPage = lazy(() => import("./pages/main-page").then(m => ({ default: m.MainPage })));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<SelectionPage />} />
        <Route path="/create-room" element={<CreateRoomFragment />} />
        <Route path="/join-room" element={<JoinControl />} />
        <Route path="/present/:roomCode" element={<MainPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <div className="min-h-screen text-foreground relative overflow-hidden">
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none"></div>

      <main>
        <Suspense fallback={<PageLoader />}>
          <AnimatedRoutes />
        </Suspense>
      </main>
    </div>
  );
}

export default App;

