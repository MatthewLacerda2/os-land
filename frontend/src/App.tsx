import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddEnvironment from "./pages/AddEnvironment";
import Complete from "./pages/Complete";
import History from "./pages/History";
import NewService from "./pages/NewService";
import ReviewService from "./pages/ReviewService";

import MaintenanceView from "./pages/MaintenanceView";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-secondary font-sans selection:bg-primary/15 selection:text-primary">
        <div className="mobile-container bg-card min-h-screen border-x border-border">
          {/* Main Content */}
          <main className="grow pb-24">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<History />} />
              <Route path="/service/new" element={<NewService />} />
              <Route
                path="/service/environment/add"
                element={<AddEnvironment />}
              />
              <Route path="/service/review" element={<ReviewService />} />
              <Route path="/service/view/:id" element={<MaintenanceView />} />
              <Route path="/service/complete" element={<Complete />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
