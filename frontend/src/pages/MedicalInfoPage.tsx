import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { medicalAPI } from '../services/api'
import { useTheme } from '../context/ThemeContext'
import Layout from '../components/Layout'

interface DiseaseInfo {
  name?: string
  description?: string
  symptoms?: string | string[]
  medications?: string | Array<{ name: string; description: string }>
  medications_to_avoid?: string | Array<{ name: string; reason: string }>
  foods_to_eat?: string | string[]
  foods_to_avoid?: string | Array<{ name: string; reason: string }>
  lifestyle_tips?: string | string[]
  [key: string]: any
}

export default function MedicalInfoPage() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { disease: diseaseParam } = useParams<{ disease: string }>()
  const [diseaseInfo, setDiseaseInfo] = useState<DiseaseInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDiseaseInfo = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const diseaseName = diseaseParam || 'Common Cold'
        const response = await medicalAPI.getDiseaseInfo(diseaseName)
        setDiseaseInfo(response)
      } catch (err: any) {
        console.error('Error fetching disease info:', err)
        setError(err.message || 'Failed to load disease information')
      } finally {
        setLoading(false)
      }
    }

    fetchDiseaseInfo()
  }, [diseaseParam])

  const parseContent = (content: any): string[] => {
    if (Array.isArray(content)) return content
    if (typeof content === 'string') {
      return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
    }
    return []
  }

  const parseStructuredContent = (content: any): Array<{ name: string; description: string }> => {
    if (Array.isArray(content)) {
      return content.map((item: any) => {
        if (typeof item === 'string') {
          const [name, ...desc] = item.split(':')
          return { name: name.trim(), description: desc.join(':').trim() }
        }
        return { name: item.name || '', description: item.description || '' }
      })
    }
    if (typeof content === 'string') {
      return parseContent(content).map(line => {
        const [name, ...desc] = line.split(':')
        return { name: name.trim(), description: desc.join(':').trim() }
      })
    }
    return []
  }

  if (loading) {
    return (
      <Layout>
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
          theme === 'dark' ? 'bg-slate-950' : 'bg-transparent'
        }`}>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border-4 border-teal-200 border-t-teal-600 animate-spin mx-auto mb-4"></div>
            <p className={`text-lg transition-colors duration-300 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Loading disease information...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !diseaseInfo) {
    return (
      <Layout>
        <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
          theme === 'dark' ? 'bg-slate-950' : 'bg-transparent'
        }`}>
          <div className="text-center">
            <p className={`text-xl mb-6 transition-colors duration-300 ${
              theme === 'dark' ? 'text-red-400' : 'text-red-600'
            }`}>
              {error || 'Disease information not found'}
            </p>
            <button
              onClick={() => navigate(-1)}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-110 ${
                theme === 'dark'
                  ? 'bg-teal-500/30 hover:bg-teal-500/50 text-teal-300'
                  : 'bg-teal-500/20 hover:bg-teal-500/30 text-teal-600'
              }`}
            >
              Go Back
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const title = diseaseInfo.name || 'Disease Information'
  const what = diseaseInfo.description || ''
  const symptoms = parseContent(diseaseInfo.symptoms)
  const medications = parseStructuredContent(diseaseInfo.medications)
  const medicationsToAvoid = parseStructuredContent(diseaseInfo.medications_to_avoid)
  const foodsToEat = parseContent(diseaseInfo.foods_to_eat)
  const foodsToAvoid = parseStructuredContent(diseaseInfo.foods_to_avoid)
  const lifestyleTips = parseContent(diseaseInfo.lifestyle_tips)

  return (
    <Layout>
      <div className={`relative min-h-screen transition-colors duration-500 ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-transparent'
      }`}>
        <div className="max-w-5xl mx-auto p-6">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className={`mb-6 font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-110 ${
              theme === 'dark'
                ? 'text-teal-400 hover:text-teal-300'
                : 'text-teal-600 hover:text-teal-700'
            }`}
          >
            ← Back
          </button>

          {/* Title */}
          <div className={`rounded-2xl p-8 mb-6 transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-slate-800/50 border border-slate-700'
              : 'bg-white/70 border border-white/40'
          } backdrop-blur-xl`} style={{animation: 'slideDown 0.6s ease-out'}}>
            <h1 className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h1>
            <span className={`h-1 w-20 rounded block transition-colors duration-300 ${
              theme === 'dark' ? 'bg-teal-400' : 'bg-teal-600'
            }`}></span>
          </div>

          {/* What is the disease */}
          {what && (
            <div className={`rounded-2xl p-8 mb-6 transition-all duration-500 ${
              theme === 'dark'
                ? 'bg-slate-800/50 border border-slate-700'
                : 'bg-white/70 border border-white/40'
            } backdrop-blur-xl`} style={{animation: 'slideUp 0.6s ease-out 150ms both'}}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 transition-colors duration-300 ${
                theme === 'dark' ? 'text-cyan-400' : 'text-teal-600'
              }`}>
                🔍 What is {title}?
              </h2>
              <p className={`leading-relaxed text-lg transition-colors duration-300 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {what}
              </p>
            </div>
          )}

          {/* Key Symptoms */}
          {symptoms.length > 0 && (
            <div className={`rounded-2xl p-8 mb-6 transition-all duration-500 ${
              theme === 'dark'
                ? 'bg-slate-800/50 border border-slate-700'
                : 'bg-white/70 border border-white/40'
            } backdrop-blur-xl`} style={{animation: 'slideUp 0.6s ease-out 200ms both'}}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 transition-colors duration-300 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                ⚠️ Key Symptoms
              </h2>
              <div className={`p-6 rounded-lg border transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-red-950/20 border-red-800/50'
                  : 'bg-red-50 border-red-200'
              }`}>
                <ul className="space-y-2">
                  {symptoms.map((symptom, idx) => (
                    <li key={idx} className={`flex items-start gap-3 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <span className={`font-bold mt-1 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-500'
                      }`}>•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Medications Used */}
          {medications.length > 0 && (
            <div className={`rounded-2xl p-8 mb-6 transition-all duration-500 ${
              theme === 'dark'
                ? 'bg-slate-800/50 border border-slate-700'
                : 'bg-white/70 border border-white/40'
            } backdrop-blur-xl`} style={{animation: 'slideUp 0.6s ease-out 250ms both'}}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 transition-colors duration-300 ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                💊 Medications Used
              </h2>
              <div className={`p-6 rounded-lg border transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-green-950/20 border-green-800/50'
                  : 'bg-green-50 border-green-200'
              }`}>
                <div className="space-y-4">
                  {medications.map((med, idx) => (
                    <div key={idx} className={`pb-3 last:border-b-0 border-b transition-colors duration-300 ${
                      theme === 'dark' ? 'border-green-800/50' : 'border-green-200'
                    }`}>
                      <h3 className={`font-semibold text-lg transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                      }`}>{med.name}</h3>
                      <p className={`mt-1 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>{med.description}</p>
                    </div>
                  ))}
                </div>
                <p className={`text-sm mt-4 italic transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Note: Always consult your doctor for appropriate dosage.</p>
              </div>
            </div>
          )}

          {/* Medications to Avoid */}
          {medicationsToAvoid.length > 0 && (
            <div className={`rounded-2xl p-8 mb-6 transition-all duration-500 ${
              theme === 'dark'
                ? 'bg-slate-800/50 border border-slate-700'
                : 'bg-white/70 border border-white/40'
            } backdrop-blur-xl`} style={{animation: 'slideUp 0.6s ease-out 300ms both'}}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 transition-colors duration-300 ${
                theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
              }`}>
                🚫 Medications to Avoid
              </h2>
              <div className={`p-6 rounded-lg border transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-orange-950/20 border-orange-800/50'
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <div className="space-y-4">
                  {medicationsToAvoid.map((med, idx) => (
                    <div key={idx} className={`pb-3 last:border-b-0 border-b transition-colors duration-300 ${
                      theme === 'dark' ? 'border-orange-800/50' : 'border-orange-200'
                    }`}>
                      <h3 className={`font-semibold text-lg transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                      }`}>{med.name}</h3>
                      <p className={`mt-1 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>{med.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Foods to Eat */}
          {foodsToEat.length > 0 && (
            <div className={`rounded-2xl p-8 mb-6 transition-all duration-500 ${
              theme === 'dark'
                ? 'bg-slate-800/50 border border-slate-700'
                : 'bg-white/70 border border-white/40'
            } backdrop-blur-xl`} style={{animation: 'slideUp 0.6s ease-out 350ms both'}}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 transition-colors duration-300 ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                🍎 Foods to Eat
              </h2>
              <div className={`p-6 rounded-lg border transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-green-950/20 border-green-800/50'
                  : 'bg-green-50 border-green-200'
              }`}>
                <ul className="space-y-2">
                  {foodsToEat.map((food, idx) => (
                    <li key={idx} className={`flex items-start gap-3 transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <span className={`font-bold mt-1 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-500'
                      }`}>✓</span>
                      <span>{food}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Foods to Avoid */}
          {foodsToAvoid.length > 0 && (
            <div className={`rounded-2xl p-8 mb-6 transition-all duration-500 ${
              theme === 'dark'
                ? 'bg-slate-800/50 border border-slate-700'
                : 'bg-white/70 border border-white/40'
            } backdrop-blur-xl`} style={{animation: 'slideUp 0.6s ease-out 400ms both'}}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 transition-colors duration-300 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                ⛔ Foods to Avoid
              </h2>
              <div className={`p-6 rounded-lg border transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-red-950/20 border-red-800/50'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="space-y-4">
                  {foodsToAvoid.map((food, idx) => (
                    <div key={idx} className={`pb-3 last:border-b-0 border-b transition-colors duration-300 ${
                      theme === 'dark' ? 'border-red-800/50' : 'border-red-200'
                    }`}>
                      <h3 className={`font-semibold text-lg transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                      }`}>{food.name}</h3>
                      <p className={`mt-1 transition-colors duration-300 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>{food.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Lifestyle Tips */}
          {lifestyleTips.length > 0 && (
            <div className={`rounded-2xl p-8 mb-6 transition-all duration-500 ${
              theme === 'dark'
                ? 'bg-slate-800/50 border border-slate-700'
                : 'bg-white/70 border border-white/40'
            } backdrop-blur-xl`} style={{animation: 'slideUp 0.6s ease-out 450ms both'}}>
              <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 transition-colors duration-300 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                🏃 Lifestyle Tips
              </h2>
              <div className={`p-6 rounded-lg border transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-blue-950/20 border-blue-800/50'
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <ol className="space-y-3">
                  {lifestyleTips.map((tip, idx) => (
                    <li key={idx} className={`transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <span className={`font-semibold transition-colors duration-300 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                      }`}>{idx + 1}. </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* Important Disclaimer */}
          <div className={`rounded-2xl p-8 mb-6 border-l-4 transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-yellow-950/30 border-l-yellow-500 border border-yellow-800/50'
              : 'bg-yellow-50/70 border-l-yellow-400 border border-yellow-200'
          } backdrop-blur-xl`} style={{animation: 'slideUp 0.6s ease-out 500ms both'}}>
            <h3 className={`font-bold mb-2 transition-colors duration-300 ${
              theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800'
            }`}>⚠️ IMPORTANT DISCLAIMER</h3>
            <p className={`transition-colors duration-300 mb-3 leading-relaxed ${
              theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
            }`}>
              This is AI-generated health information for educational purposes only. It is <strong>NOT</strong> medical advice, diagnosis, or prescription.
            </p>
            <p className={`transition-colors duration-300 mb-3 leading-relaxed ${
              theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
            }`}>
              Always consult a qualified doctor or pharmacist before taking any medication or making any health decisions.
            </p>
            <div className={`p-4 rounded border transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-yellow-900/20 border-yellow-800/50'
                : 'bg-white bg-opacity-50 border-yellow-300'
            }`}>
              <p className={`text-sm font-semibold mb-2 transition-colors duration-300 ${
                theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800'
              }`}>See a doctor if:</p>
              <ul className={`text-sm space-y-1 transition-colors duration-300 ${
                theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'
              }`}>
                <li>• Fever exceeds 103°F</li>
                <li>• Symptoms persist beyond 10 days</li>
                <li>• You experience shortness of breath or chest pain</li>
                <li>• You develop severe sore throat with white spots</li>
                <li>• Green or yellow sputum appears (may indicate pneumonia)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
