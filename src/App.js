import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { StockDetail } from "./pages/StockDetail";
import { StockOverview } from "./pages/StockOverview";
import { WatchListContextProvider } from "./context/WatchListContext";


function App() {
  return (
    <main className="container">
      <WatchListContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<StockOverview />} />
            <Route path="/detail/:symbol" element={<StockDetail />} />
          </Routes>
        </Router>
      </WatchListContextProvider>
    </main>
  );
}

export default App;
