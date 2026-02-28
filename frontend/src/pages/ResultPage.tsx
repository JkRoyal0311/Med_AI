import { useLocation, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

export default function ResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state?.result

  if (!result) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-6">No result to display</p>
            <button
              onClick={() => navigate('/search')}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Back to Search
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto p-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-teal-600 hover:text-teal-700 font-semibold"
          >
            ← Back
          </button>

          <div className="bg-white rounded-2xl p-8 shadow">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{result.name}</h1>

            {result.category && (
              <div className="mb-6 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                {result.category}
              </div>
            )}

            {result.description && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-700 mb-3">Overview</h2>
                <p className="text-gray-600 leading-relaxed">{result.description}</p>
              </div>
            )}

            {result.symptoms && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-700 mb-3">Symptoms</h2>
                <div className="bg-gradient-to-r from-red-50 to-red-50 p-6 rounded-lg border border-red-200">
                  <p className="text-gray-700 whitespace-pre-wrap">{result.symptoms}</p>
                </div>
              </div>
            )}

            {result.medications && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-700 mb-3">Medications</h2>
                <div className="bg-gradient-to-r from-green-50 to-green-50 p-6 rounded-lg border border-green-200">
                  <p className="text-gray-700 whitespace-pre-wrap">{result.medications}</p>
                </div>
              </div>
            )}

            {result.foods_to_eat && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-700 mb-3">Recommended Foods</h2>
                <div className="bg-gradient-to-r from-green-50 to-green-50 p-6 rounded-lg border border-green-200">
                  <p className="text-gray-700 whitespace-pre-wrap">{result.foods_to_eat}</p>
                </div>
              </div>
            )}

            {result.foods_to_avoid && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-700 mb-3">Foods to Avoid</h2>
                <div className="bg-gradient-to-r from-red-50 to-red-50 p-6 rounded-lg border border-red-200">
                  <p className="text-gray-700 whitespace-pre-wrap">{result.foods_to_avoid}</p>
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded mt-8">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>Disclaimer:</strong> This information is for educational purposes only. Do not use this as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
