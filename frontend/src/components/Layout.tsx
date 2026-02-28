import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'dark bg-slate-950' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50'}`}>
      {/* Animated Background Blobs */}
      {theme === 'dark' ? (
        <>
          <div className="fixed top-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-blob"></div>
          <div className="fixed bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </>
      ) : (
        <>
          <div className="fixed top-0 right-0 w-96 h-96 bg-teal-300/30 rounded-full blur-3xl animate-blob" style={{animation: 'blob 7s infinite'}}></div>
          <div className="fixed bottom-0 left-0 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-blob" style={{animation: 'blob 7s infinite 2s'}}></div>
          <div className="fixed top-1/3 right-1/3 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-blob" style={{animation: 'blob 7s infinite 4s'}}></div>
        </>
      )}

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-slate-900/90 border-slate-800 text-white' 
          : 'bg-white/70 border-gray-200 text-gray-900'
      } border-b shadow-lg`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-bold text-xl bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300"
          >
            🏥 MedAI
          </button>

          {/* Nav Links */}
          <div className="hidden md:flex gap-8 items-center">
            {['Home', 'Search', 'Chat', 'Profile'].map((link) => (
              <button
                key={link}
                onClick={() => navigate(link === 'Home' ? '/' : `/${link.toLowerCase()}`)}
                className={`font-semibold transition-all duration-300 relative group ${
                  theme === 'dark' ? 'hover:text-teal-400' : 'hover:text-teal-600'
                }`}
              >
                {link}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 ${theme === 'dark' ? 'bg-teal-400' : 'bg-teal-600'} group-hover:w-full transition-all duration-300`}></span>
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-full transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400'
                : 'bg-gray-200 hover:bg-gray-300 text-blue-500'
            } hover:scale-110 hover:shadow-lg`}
            title="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className={`${
        theme === 'dark'
          ? 'bg-slate-900/80 border-slate-800 text-gray-400'
          : 'bg-gradient-to-r from-slate-800 to-slate-900 text-gray-300'
      } py-8 mt-12 border-t backdrop-blur-sm transition-colors duration-500`}>
        <div className="max-w-6xl mx-auto px-6 text-center text-sm">
          <p className="font-semibold text-gray-200">🏥 MedAI - AI-Powered Medical Information Assistant</p>
          <p className={`mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            Disclaimer: This app provides educational information only. Always consult a healthcare professional.
          </p>
        </div>
      </footer>

      {/* Animations CSS */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
