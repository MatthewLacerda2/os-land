import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AddEnvironment from './pages/AddEnvironment'
import Complete from './pages/Complete'
import History from './pages/History'
import NewService from './pages/NewService'
import ReviewService from './pages/ReviewService'

import MaintenanceView from './pages/MaintenanceView'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 font-sans selection:bg-blue-100 selection:text-blue-900">
        <div className="mobile-container bg-white min-h-screen border-x border-slate-200">
          {/* Main Content */}
          <main className="grow pb-24">
            <Routes>
              <Route path="/" element={<History />} />
              <Route path="/service/new" element={<NewService />} />
              <Route path="/service/environment/add" element={<AddEnvironment />} />
              <Route path="/service/review" element={<ReviewService />} />
              <Route path="/service/view" element={<MaintenanceView />} />
              <Route path="/service/complete" element={<Complete />} />
            </Routes>
          </main>

        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
