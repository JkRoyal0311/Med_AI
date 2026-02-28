import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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
        <h3 key={`bold-${i}`} className="text-lg font-bold text-gray-800 mt-4 mb-2 flex items-center gap-2">
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
              {/* Title: Disease or Drug name */}
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                {results.disease || results.drug || results.name || 'Information'}
              </h2>

              {/* Main Content: Display full markdown-formatted response */}
              {(results.content || results.description) && (
                <div className="mb-8 text-gray-700">
                  <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-8 rounded-xl border border-blue-100">
                    {/* Render properly formatted markdown content */}
                    {renderMarkdown(results.content || results.description)}
                  </div>
                </div>
              )}

              {/* Important Disclaimer Alert Box */}
              {results.disclaimer && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg my-8">
                  <p className="text-yellow-800 text-sm font-semibold">{results.disclaimer}</p>
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
