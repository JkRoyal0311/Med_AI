import { useState } from 'react'
import { medicalAPI } from '../services/api'
import Layout from '../components/Layout'

export default function SymptomsPage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [symptomInput, setSymptomInput] = useState('')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const commonSymptoms = [
    'fever',
    'cough',
    'fatigue',
    'headache',
    'body ache',
    'sore throat',
    'shortness of breath',
    'diarrhea',
    'nausea',
    'frequent urination',
    'blurred vision',
    'chest pain',
    'joint pain',
    'skin rash',
  ]

  function handleAddSymptom(symptom: string) {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  function handleRemoveSymptom(symptom: string) {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom))
  }

  function handleAddCustom() {
    if (symptomInput.trim() && !selectedSymptoms.includes(symptomInput.trim())) {
      setSelectedSymptoms([...selectedSymptoms, symptomInput.trim()])
      setSymptomInput('')
    }
  }

  async function handleAnalyze() {
    if (selectedSymptoms.length === 0) {
      setError('Please add at least one symptom')
      return
    }

    setLoading(true)
    setError('')
    setResults(null)

    try {
      const data = await medicalAPI.predictDisease(selectedSymptoms)
      setResults(data)
    } catch (err: any) {
      setError(err?.error || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto p-6">
          {/* Symptoms Input */}
          <div className="bg-white rounded-2xl p-8 shadow mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">🩺 Symptom Checker</h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Common Symptoms */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Common Symptoms</h2>
              <div className="flex flex-wrap gap-3">
                {commonSymptoms.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() =>
                      selectedSymptoms.includes(symptom)
                        ? handleRemoveSymptom(symptom)
                        : handleAddSymptom(symptom)
                    }
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedSymptoms.includes(symptom)
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Symptom */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Custom Symptom</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
                  placeholder="Enter a symptom..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={handleAddCustom}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Selected Symptoms */}
            {selectedSymptoms.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Selected Symptoms ({selectedSymptoms.length})
                </h2>
                <div className="flex flex-wrap gap-3">
                  {selectedSymptoms.map((symptom) => (
                    <div
                      key={symptom}
                      className="bg-teal-100 text-teal-800 px-4 py-2 rounded-lg flex items-center gap-3"
                    >
                      <span>{symptom}</span>
                      <button
                        onClick={() => handleRemoveSymptom(symptom)}
                        className="text-teal-600 hover:text-teal-900 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || selectedSymptoms.length === 0}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? `Analyzing ${selectedSymptoms.length} symptom(s)...` : `Analyze ${selectedSymptoms.length} Symptom(s)`}
            </button>
          </div>

          {/* Results */}
          {results && (
            <div className="bg-white rounded-2xl p-8 shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Possible Conditions</h2>

              {results.conditions && results.conditions.length > 0 ? (
                <div className="space-y-4">
                  {results.conditions.map((condition: any, i: number) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-gray-800">{condition.name}</h3>
                        <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          {Math.round(condition.confidence * 100)}% match
                        </span>
                      </div>
                      {condition.description && (
                        <p className="text-gray-600 text-sm">{condition.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No conditions found. Try different symptoms.</p>
              )}
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded mt-8">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>Disclaimer:</strong> This is an educational tool only. The results should NOT be used for self-diagnosis. Always consult a qualified healthcare professional for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
