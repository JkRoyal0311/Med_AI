import { useNavigate } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-bold text-xl text-teal-600"
          >
            🏥 MedAI
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-700 hover:text-teal-600 font-semibold transition"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/search')}
              className="text-gray-700 hover:text-teal-600 font-semibold transition"
            >
              Search
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="text-gray-700 hover:text-teal-600 font-semibold transition"
            >
              Chat
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="text-gray-700 hover:text-teal-600 font-semibold transition"
            >
              Profile
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm">
          <p>🏥 MedAI - AI-Powered Medical Information Assistant</p>
          <p className="text-gray-500 mt-2">
            Disclaimer: This app provides educational information only. Always consult a healthcare professional.
          </p>
        </div>
      </footer>
    </div>
  )
}
