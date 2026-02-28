import { useState } from 'react'
import { medicalAPI } from '../services/api'
import Layout from '../components/Layout'

// Render markdown content with proper HTML elements
// Handles: **bold**, ##headers, - lists, paragraphs, and emojis
function renderMarkdown(content: string) {
  const lines = content.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      // Empty line - skip
      i++
      continue
    }

    // Headers with ### or ##
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="text-base font-bold text-gray-800 mt-4 mb-2">
          {trimmed.substring(4).replace(/\*\*/g, '').trim()}
        </h4>
      )
      i++
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg font-bold text-gray-800 mt-5 mb-3">
          {trimmed.substring(3).replace(/\*\*/g, '').trim()}
        </h3>
      )
      i++
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-2xl font-bold text-gray-800 mt-6 mb-4">
          {trimmed.substring(2).replace(/\*\*/g, '').trim()}
        </h2>
      )
      i++
    }
    // Headers with **text**
    else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      elements.push(
        <h3 key={`bold-${i}`} className="text-lg font-bold text-gray-800 mt-4 mb-2">
          {trimmed.substring(2, trimmed.length - 2)}
        </h3>
      )
      i++
    }
    // Ordered lists
    else if (trimmed.match(/^\d+\./)) {
      const listItems = []
      while (i < lines.length && lines[i].trim().match(/^\d+\./)) {
        const item = lines[i].trim().replace(/^\d+\.\s*/, '')
        listItems.push(
          <li key={`li-${i}`} className="text-gray-700 text-sm leading-relaxed ml-2">
            {item}
          </li>
        )
        i++
      }
      elements.push(
        <ol key={`ol-${elements.length}`} className="list-decimal list-inside space-y-1 my-3">
          {listItems}
        </ol>
      )
    }
    // Unordered lists with -
    else if (trimmed.startsWith('- ')) {
      const listItems = []
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        const item = lines[i].trim().substring(2)
        listItems.push(
          <li key={`li-${i}`} className="text-gray-700 text-sm leading-relaxed ml-2">
            {item}
          </li>
        )
        i++
      }
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-3">
          {listItems}
        </ul>
      )
    }
    // Regular paragraph with ** bold **
    else {
      const parts = trimmed.split(/(\*\*.*?\*\*)/)
      const formatted = parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={idx}>{part.substring(2, part.length - 2)}</strong>
        }
        return part
      })
      elements.push(
        <p key={`p-${i}`} className="text-gray-700 text-sm leading-relaxed my-3">
          {formatted}
        </p>
      )
      i++
    }
  }

  return elements
}

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
              {/* Results Title */}
              <h2 className="text-3xl font-bold text-gray-800 mb-8">📊 Symptom Analysis Results</h2>

              {/* Full Analysis Content: Display complete formatted response */}
              {(results.analysis || results.prediction) && (
                <div className="mb-8">
                  <div className="bg-gradient-to-br from-purple-50 to-gray-50 p-8 rounded-xl border border-purple-100">
                    {/* Render full analysis content with proper markdown parsing */}
                    <div>
                      {renderMarkdown(results.analysis || results.prediction)}
                    </div>
                  </div>
                </div>
              )}

              {/* Important Disclaimer - Always shown for medical info */}
              {results.disclaimer && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg my-8">
                  <p className="text-yellow-800 text-sm font-semibold">{results.disclaimer}</p>
                </div>
              )}

              {/* Education Note */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-6">
                <p className="text-blue-800 text-xs">
                  💡 <strong>Note:</strong> This analysis is based on the symptoms you provided and is for educational purposes only.
                  Please consult with a healthcare professional for proper evaluation and treatment.
                </p>
              </div>
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
