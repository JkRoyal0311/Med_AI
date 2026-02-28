import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Layout from '../components/Layout'

const COMMON_DISEASES = [
  'Acid Reflux (GERD)',
  'Allergies',
  'Anemia',
  'Anxiety Disorder',
  'Appendicitis',
  'Arthritis (Osteoarthritis)',
  'Asthma',
  'Breast Cancer',
  'Chronic Kidney Disease',
  'Common Cold',
  'Constipation',
  'COPD',
  'COVID-19',
  'Dengue Fever',
  'Depression',
  'Diabetes',
  'Fatty Liver Disease',
  'Flu',
  'Hemorrhoids',
  'High Cholesterol',
  'Hypertension',
  'Hyperthyroidism',
  'Hypothyroidism',
  'Migraine',
  'Pneumonia',
  'Thyroiditis',
  'Ulcer',
]

export default function DiseasesListPage() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredDiseases, setFilteredDiseases] = useState(COMMON_DISEASES)

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDiseases(COMMON_DISEASES)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredDiseases(
        COMMON_DISEASES.filter(disease =>
          disease.toLowerCase().includes(query)
        )
      )
    }
  }, [searchQuery])

  const handleDiseaseClick = (disease: string) => {
    navigate(`/medical-info/${encodeURIComponent(disease)}`)
  }

  return (
    <Layout>
      <div className={`relative min-h-screen transition-colors duration-500 ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="mb-12 animate-slideDown" style={{animation: 'slideDown 0.6s ease-out'}}>
            <h1 className={`text-5xl font-bold mb-3 transition-colors duration-300 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              📚 Medical Information Library
            </h1>
            <p className={`text-lg transition-colors duration-300 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Browse comprehensive health information for various conditions
            </p>
          </div>

          {/* Search Box */}
          <div className="mb-10" style={{animation: 'slideUp 0.6s ease-out 100ms both'}}>
            <div className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-slate-800/50 border border-slate-700'
                : 'bg-white/70 border border-white/40'
            } backdrop-blur-xl`}>
              <input
                type="text"
                placeholder="🔍 Search diseases... (e.g., Diabetes, Cold, Fever)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-6 py-4 rounded-2xl outline-none text-lg transition-colors duration-300 ${
                  theme === 'dark'
                    ? 'bg-slate-800/50 text-white placeholder-gray-500'
                    : 'bg-transparent text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6" style={{animation: 'slideUp 0.6s ease-out 200ms both'}}>
            <p className={`transition-colors duration-300 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Found <span className={`font-bold ${theme === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}>{filteredDiseases.length}</span> condition{filteredDiseases.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Diseases Grid */}
          {filteredDiseases.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredDiseases.map((disease, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDiseaseClick(disease)}
                  style={{animation: `slideUp 0.6s ease-out ${300 + idx * 30}ms both`}}
                  className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-slate-700 hover:border-teal-500/50'
                      : 'bg-gradient-to-br from-white/80 to-white/60 border border-white/40 hover:border-teal-400/50'
                  } backdrop-blur-xl text-left`}
                >
                  {/* Animated Gradient Blob */}
                  <div className={`absolute -inset-full bg-gradient-to-r from-teal-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-full blur-3xl`}></div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`text-xl font-bold transition-colors duration-300 ${
                        theme === 'dark'
                          ? 'text-white group-hover:text-teal-400'
                          : 'text-gray-900 group-hover:text-teal-600'
                      }`}>
                        {disease}
                      </h3>
                      <span className="text-2xl group-hover:translate-x-2 group-hover:scale-125 transition-all duration-300">
                        →
                      </span>
                    </div>
                    <p className={`text-sm transition-colors duration-300 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      View detailed information
                    </p>
                  </div>

                  {/* Bubble Effect on Hover */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-teal-500 to-cyan-500'
                      : 'bg-gradient-to-br from-teal-300 to-cyan-300'
                  }`}></div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16" style={{animation: 'slideUp 0.6s ease-out 300ms both'}}>
              <div className="text-6xl mb-4">🔍</div>
              <p className={`text-xl mb-6 transition-colors duration-300 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No conditions found matching <span className="font-bold">"{searchQuery}"</span>
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-110 ${
                  theme === 'dark'
                    ? 'bg-teal-500/30 hover:bg-teal-500/50 text-teal-300'
                    : 'bg-teal-500/20 hover:bg-teal-500/30 text-teal-600'
                }`}
              >
                Clear search
              </button>
            </div>
          )}

          {/* Disclaimer */}
          <div className={`rounded-2xl p-6 transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-yellow-900/30 border border-yellow-800/50'
              : 'bg-yellow-50 border border-yellow-400'
          }`} style={{animation: 'slideUp 0.6s ease-out 400ms both'}}>
            <h3 className={`font-bold mb-2 transition-colors duration-300 ${
              theme === 'dark' ? 'text-yellow-400' : 'text-yellow-800'
            }`}>
              ⚠️ DISCLAIMER
            </h3>
            <p className={`text-sm transition-colors duration-300 ${
              theme === 'dark' ? 'text-yellow-300/80' : 'text-yellow-700'
            }`}>
              This information is for educational purposes only and not a substitute for professional medical advice. 
              Always consult a qualified healthcare professional for diagnosis and treatment decisions.
            </p>
          </div>
        </div>

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
        `}</style>
      </div>
    </Layout>
  )
}
