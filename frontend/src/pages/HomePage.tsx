import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useTheme } from '../context/ThemeContext'
import Layout from '../components/Layout'

export default function HomePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { theme } = useTheme()

  const features = [
    {
      icon: '📚',
      title: 'Medical Library',
      description: 'Browse complete medical information database',
      path: '/diseases',
      gradient: 'from-blue-400 to-cyan-500',
      delay: '0s'
    },
    {
      icon: '🔍',
      title: 'Disease Guide',
      description: 'Get detailed information about diseases',
      path: '/search?type=disease',
      gradient: 'from-purple-400 to-pink-500',
      delay: '100ms'
    },
    {
      icon: '💊',
      title: 'Drug Info',
      description: 'Search medicines and side effects',
      path: '/search?type=drug',
      gradient: 'from-green-400 to-emerald-500',
      delay: '200ms'
    },
    {
      icon: '🩺',
      title: 'Symptom Check',
      description: 'Analyze your symptoms with AI',
      path: '/symptoms',
      gradient: 'from-orange-400 to-red-500',
      delay: '300ms'
    },
    {
      icon: '💬',
      title: 'AI Chat',
      description: 'Talk with medical AI assistant',
      path: '/chat',
      gradient: 'from-indigo-400 to-purple-500',
      delay: '400ms'
    },
  ]

  const commonDiseases = [
    'Diabetes',
    'Hypertension',
    'Asthma',
    'COVID-19',
    'Anxiety Disorder',
    'Depression',
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Layout>
      <div className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-transparent'
      }`}>
        {/* Header Section */}
        <header className={`relative z-10 px-6 py-12 md:py-16 transition-all duration-500`}>
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-start mb-12 animate-slideDown" style={{animation: 'slideDown 0.6s ease-out'}}>
              <div>
                <h1 className={`text-4xl md:text-5xl font-bold mb-3 transition-colors duration-500 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className={`text-lg transition-colors duration-500 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Your AI-powered medical information assistant
                </p>
              </div>
              <button
                onClick={handleLogout}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-110 ${
                  theme === 'dark'
                    ? 'bg-red-900/50 hover:bg-red-800 text-red-200'
                    : 'bg-red-500/20 hover:bg-red-500/30 text-red-600'
                }`}
              >
                Logout
              </button>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {features.map((feature, i) => (
                <button
                  key={i}
                  onClick={() => navigate(feature.path)}
                  style={{animation: `slideUp 0.6s ease-out ${feature.delay} both`}}
                  className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    theme === 'dark'
                      ? 'bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700'
                      : 'bg-white/70 hover:bg-white border border-white/40'
                  } backdrop-blur-xl text-left`}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                    <h3 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {feature.description}
                    </p>
                  </div>

                  {/* Animated Border */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    theme === 'dark' ? 'border border-teal-500/50' : 'border border-teal-400/50'
                  }`}></div>
                </button>
              ))}
            </div>

            {/* Common Diseases Section */}
            <div className={`rounded-2xl p-8 transition-all duration-500 ${
              theme === 'dark'
                ? 'bg-slate-800/50 border border-slate-700'
                : 'bg-white/70 border border-white/40'
            } backdrop-blur-xl`} style={{animation: 'slideUp 0.6s ease-out 500ms both'}}>
              <h2 className={`text-3xl font-bold mb-6 transition-colors duration-300 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Quick Access to Common Conditions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {commonDiseases.map((disease, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(`/medical-info/${encodeURIComponent(disease)}`)}
                    style={{animation: `slideUp 0.6s ease-out ${600 + i * 50}ms both`}}
                    className={`group relative overflow-hidden px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-teal-500/20 to-cyan-500/20 hover:from-teal-500/40 hover:to-cyan-500/40 text-teal-300 border border-teal-500/30'
                        : 'bg-gradient-to-br from-teal-100 to-cyan-100 hover:from-teal-200 hover:to-cyan-200 text-teal-900 border border-teal-300/50'
                    }`}
                  >
                    <span className="relative z-10">{disease}</span>
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      theme === 'dark' ? 'bg-teal-500/20' : 'bg-teal-300/20'
                    }`}></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                { label: 'Diseases Covered', value: '500+', icon: '🏥' },
                { label: 'Medications', value: '2000+', icon: '💊' },
                { label: 'Users', value: '10K+', icon: '👥' },
                { label: 'Success Rate', value: '98%', icon: '⭐' }
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{animation: `slideUp 0.6s ease-out ${600 + i * 100}ms both`}}
                  className={`text-center p-4 rounded-xl transition-all duration-500 ${
                    theme === 'dark'
                      ? 'bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50'
                      : 'bg-white/70 border border-white/40 hover:bg-white/90'
                  } backdrop-blur-xl hover:scale-105`}
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <p className={`text-2xl font-bold transition-colors duration-300 ${
                    theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                  }`}>
                    {stat.value}
                  </p>
                  <p className={`text-sm transition-colors duration-300 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Animations */}
        <style>{`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    </Layout>
  )
}
