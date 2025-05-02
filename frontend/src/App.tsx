import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Home from "./components/Home"
import Manage from "./components/Manage"
import Birthday from "./components/Birthday"

function App() {
  return (
    <Router>
      <div className="app-container min-h-screen flex flex-col bg-gray-50">
        <header className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 shadow-md">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
              <Link to="/" className="flex items-center">
                <img src="/hbdgen.png" alt="Logo" className="w-10 h-10 mr-2" />
                hbdgen
              </Link>
            </h1>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link to="/" className="hover:text-pink-200 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/manage" className="hover:text-pink-200 transition-colors">
                    Manage
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="flex-grow container mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manage" element={<Manage />} />
            <Route path="/birthday/:id" element={<Birthday />} />
          </Routes>
        </main>

        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4 text-center">
            <p>© {new Date().getFullYear()} Happy Birthday Generator</p>
            <p className="text-sm text-gray-400 mt-2">Create beautiful birthday pages for your loved ones</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
