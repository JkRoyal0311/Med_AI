import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Layout from '../components/Layout'

export default function HomePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const features = [
    {
      icon: '🏗️',
      title: 'Disease Guide',
      description: 'Get detailed information about diseases',
      path: '/search?type=disease',
    },
    {
      icon: '💊',
      title: 'Drug Info',
      description: 'Search medicines and side effects',
      path: '/search?type=drug',
    },
    {
      icon: '🩺',
      title: 'Symptom Check',
      description: 'Analyze your symptoms with AI',
      path: '/symptoms',
    },
    {
      icon: '💬',
      title: 'AI Chat',
      description: 'Talk with medical AI assistant',
      path: '/chat',
    },
  ]

  const commonDiseases = [
    'Diabetes',
    'Hypertension',
    'Hypothyroidism',
    'Anxiety Disorder',
    'Asthma',
    'Arthritis',
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white p-6 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome, {user?.name?.split(' ')[0]}</h1>
                <p className="text-teal-100">Your AI-powered medical information assistant</p>
              </div>
              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto p-6">
          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, i) => (
              <button
                key={i}
                onClick={() => navigate(feature.path)}
                className="bg-white rounded-2xl p-8 shadow hover:shadow-xl transition text-left"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </button>
            ))}
          </div>

          {/* Common Diseases */}
          <div className="bg-white rounded-2xl p-8 shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Common Conditions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {commonDiseases.map((disease, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/search?type=disease&query=${disease}`)}
                  className="bg-gradient-to-r from-teal-50 to-blue-50 hover:from-teal-100 hover:to-blue-100 text-gray-800 px-4 py-3 rounded-lg font-semibold transition border border-teal-200"
                >
                  {disease}
                </button>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8 rounded">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>Disclaimer:</strong> This app provides educational information only. It is not a substitute for professional medical advice. Always consult with a qualified healthcare professional for diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
