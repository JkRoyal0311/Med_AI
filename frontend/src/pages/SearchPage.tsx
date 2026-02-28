import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { medicalAPI } from '../services/api'
import Layout from '../components/Layout'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || 'disease'
  const [query, setQuery] = useState(searchParams.get('query') || '')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const data =
        type === 'disease'
          ? await medicalAPI.getDiseaseInfo(query)
          : type === 'drug'
          ? await medicalAPI.getDrugInfo(query)
          : null

      setResults(data)
    } catch (err: any) {
      setError(err?.error || 'Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto p-6">
          {/* Search Form */}
          <div className="bg-white rounded-2xl p-8 shadow mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              {type === 'disease' ? '🏗️ Disease Guide' : '💊 Drug Info'}
            </h1>

            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  type === 'disease'
                    ? 'Search for a disease (e.g., Diabetes)'
                    : 'Search for a drug (e.g., Metformin)'
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold transition"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>

          {/* Results */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {results && (
            <div className="bg-white rounded-2xl p-8 shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{results.name}</h2>

              {results.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600">{results.description}</p>
                </div>
              )}

              {results.symptoms && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Symptoms</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{results.symptoms}</p>
                  </div>
                </div>
              )}

              {results.medications && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Medications</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{results.medications}</p>
                  </div>
                </div>
              )}

              {results.uses && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Uses</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{results.uses}</p>
                  </div>
                </div>
              )}

              {results.side_effects && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Side Effects</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{results.side_effects}</p>
                  </div>
                </div>
              )}

              {results.foods_to_eat && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Foods to Eat</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{results.foods_to_eat}</p>
                  </div>
                </div>
              )}

              {results.foods_to_avoid && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Foods to Avoid</h3>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{results.foods_to_avoid}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!results && !error && !loading && (
            <div className="text-center text-gray-500 py-12">
              <p className="text-lg">Start searching to see results</p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>Disclaimer:</strong> This information is for educational purposes only. Always consult with a healthcare professional.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
