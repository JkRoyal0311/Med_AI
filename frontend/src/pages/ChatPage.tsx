import { useState, useRef, useEffect } from 'react'
import { streamChat } from '../services/api'
import Layout from '../components/Layout'

interface Message {
  role: 'user' | 'assistant'
  content: string
  disclaimer?: string
}

const DISCLAIMER = (
  "⚠️ IMPORTANT DISCLAIMER: This is AI-generated health information for educational " +
  "purposes only. It is NOT medical advice, diagnosis, or prescription. Always consult " +
  "a qualified doctor or pharmacist before taking any medication or making health decisions."
)

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    // Add user message to chat history
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      // Get streaming response from backend
      const reader = await streamChat({
        message: userMessage,
        history: messages,
      })

      let assistantMessage = ''
      // Add empty assistant message that will be filled as stream arrives
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      try {
        // Read chunks from stream and display them in real-time
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = new TextDecoder().decode(value)
          assistantMessage += text
          
          // Filter out disclaimer from main display content
          const displayContent = assistantMessage
            .replace(/---[\s\S]*?IMPORTANT DISCLAIMER[\s\S]*?---/gi, '')
            .replace(/⚠️.*?DISCLAIMER[\s\S]*?healthcare professionals?[\s\n]*/gi, '')
            .trim()
          
          // Update the last message with accumulated content
          setMessages((prev) => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1].content = displayContent
            // Store full message with disclaimer flag
            newMessages[newMessages.length - 1].disclaimer = assistantMessage.includes('DISCLAIMER') 
              ? DISCLAIMER 
              : undefined
            return newMessages
          })
        }
      } catch (err) {
        console.error('Streaming error:', err)
      }
    } catch (err: any) {
      // Show error message if request fails
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, an error occurred. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">💬 AI Medical Chat</h1>

          {/* Messages */}
          <div className="flex-1 bg-white rounded-2xl p-6 shadow mb-6 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <p className="text-lg">Start a conversation with the medical AI</p>
                <p className="text-sm mt-2">Ask questions about diseases, medications, symptoms, and more</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div key={i}>
                    {/* Message Bubble - Full Width for better readability */}
                    <div className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-3xl px-5 py-4 rounded-xl ${
                          msg.role === 'user'
                            ? 'bg-teal-600 text-white rounded-br-none'
                            : 'bg-gray-50 text-gray-800 border border-gray-200 rounded-bl-none'
                        }`}
                      >
                        {/* Full message content rendered with proper line breaks */}
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                    
                    {/* Disclaimer Alert - Only shown when present */}
                    {msg.role === 'assistant' && msg.disclaimer && (
                      <div className="flex justify-start mb-4">
                        <div className="max-w-3xl">
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-xs text-yellow-800 leading-relaxed">
                            {msg.disclaimer}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {loading && (
              <div className="flex gap-2 mb-6">
                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about diseases, medications, symptoms..."
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              {loading ? '...' : 'Send'}
            </button>
          </form>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mt-6 text-sm text-yellow-800">
            ⚠️ Chat responses are educational only. Always consult a healthcare professional.
          </div>
        </div>
      </div>
    </Layout>
  )
}
