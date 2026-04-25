import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Container */}
      <div className="max-w-5xl mx-auto border-x border-gray-100 min-h-screen flex flex-col">
        
        {/* Hero Section */}
        <section className="flex-grow flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="relative mb-12 group">
            {/* Hero Images Stack */}
            <div className="relative w-48 h-48 mx-auto">
              <img 
                src={heroImg} 
                className="absolute inset-0 w-full h-full object-contain z-0 transition-transform duration-500 group-hover:scale-105" 
                alt="Hero" 
              />
              <img 
                src={reactLogo} 
                className="absolute top-8 left-1/2 -translate-x-1/2 w-10 h-10 z-10 animate-spin-slow" 
                style={{ transform: 'perspective(1000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg) scale(1.4)' }}
                alt="React logo" 
              />
              <img 
                src={viteLogo} 
                className="absolute bottom-10 left-1/2 -translate-x-1/2 w-8 h-8 z-10" 
                style={{ transform: 'perspective(1000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg) scale(0.8)' }}
                alt="Vite logo" 
              />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-gray-900 mb-6">
            Get started
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-md mx-auto">
            Edit <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-900">src/App.tsx</code> and save to test <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-900">HMR</code>
          </p>

          <button
            type="button"
            className="px-6 py-3 rounded-xl bg-purple-50 text-purple-600 font-medium border border-transparent hover:border-purple-200 transition-all active:scale-95 shadow-sm"
            onClick={() => setCount((count) => count + 1)}
          >
            Count is {count}
          </button>
        </section>

        {/* Divider */}
        <div className="h-px bg-gray-100 relative">
          <div className="absolute left-0 -top-1 w-2 h-2 border-l border-t border-gray-300"></div>
          <div className="absolute right-0 -top-1 w-2 h-2 border-r border-t border-gray-300"></div>
        </div>

        {/* Bottom Sections */}
        <section className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 text-left">
          {/* Documentation */}
          <div className="p-10 space-y-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500 mb-6">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-gray-900">Documentation</h2>
            <p className="text-gray-500">Your questions, answered</p>
            <ul className="flex gap-3 pt-4">
              <li>
                <a href="https://vite.dev/" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                  <img className="w-4 h-4" src={viteLogo} alt="" />
                  <span className="text-sm font-medium text-gray-900">Explore Vite</span>
                </a>
              </li>
              <li>
                <a href="https://react.dev/" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                  <img className="w-4 h-4" src={reactLogo} alt="" />
                  <span className="text-sm font-medium text-gray-900">Learn more</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="p-10 space-y-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500 mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-gray-900">Connect with us</h2>
            <p className="text-gray-500">Join the Vite community</p>
            <div className="flex flex-wrap gap-3 pt-4">
              <a href="https://github.com/vitejs/vite" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-gray-900">GitHub</span>
              </a>
              <a href="https://chat.vite.dev/" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-gray-900">Discord</span>
              </a>
            </div>
          </div>
        </section>

        {/* Footer Spacer */}
        <footer className="h-24 border-t border-gray-100 flex items-center justify-center">
           <div className="h-px bg-gray-100 w-full relative">
            <div className="absolute left-0 -top-1 w-2 h-2 border-l border-b border-gray-300"></div>
            <div className="absolute right-0 -top-1 w-2 h-2 border-r border-b border-gray-300"></div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
