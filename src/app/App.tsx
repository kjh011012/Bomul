import { createBrowserRouter, RouterProvider, Outlet } from 'react-router';
import { GameProvider } from './context/GameContext';
import { SplashPage } from './pages/SplashPage';
import { IntroPage } from './pages/IntroPage';
import { TeamPage } from './pages/TeamPage';
import { RolePage } from './pages/RolePage';
import { BongiIntroPage } from './pages/BongiIntroPage';
import { KitPage } from './pages/KitPage';
import { MapPage } from './pages/MapPage';
import { InventoryPage } from './pages/InventoryPage';
import { ARScanPage } from './pages/ARScanPage';
import { StageRouter } from './pages/StageRouter';
import { StageClearPage } from './pages/StageClearPage';
import { EndingPage } from './pages/EndingPage';
import { ReportPage } from './pages/ReportPage';

function RootLayout() {
  return (
    <GameProvider>
      <div
        className="h-screen w-full max-w-md mx-auto relative overflow-hidden"
        style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
      >
        <Outlet />
      </div>
    </GameProvider>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: SplashPage },
      { path: 'intro/:step', Component: IntroPage },
      { path: 'team', Component: TeamPage },
      { path: 'role', Component: RolePage },
      { path: 'bongi', Component: BongiIntroPage },
      { path: 'kit', Component: KitPage },
      { path: 'map', Component: MapPage },
      { path: 'inventory', Component: InventoryPage },
      { path: 'stage/:stageId', Component: ARScanPage },
      { path: 'stage/:stageId/puzzle', Component: StageRouter },
      { path: 'stage/:stageId/clear', Component: StageClearPage },
      { path: 'ending', Component: EndingPage },
      { path: 'report', Component: ReportPage },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
