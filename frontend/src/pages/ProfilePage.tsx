import { useAuthStore } from '../store/authStore'
import Layout from '../components/Layout'

export default function ProfilePage() {
  const { user, logout } = useAuthStore()

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-2xl p-8 shadow">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">👤 Profile</h1>

            {user ? (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Full Name</label>
                  <p className="text-lg text-gray-800 mt-1">{user.name}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <p className="text-lg text-gray-800 mt-1">{user.email}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    Account created and verified ✓
                  </p>
                </div>

                <button
                  onClick={() => {
                    logout()
                    window.location.href = '/login'
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <p className="text-gray-500">Loading profile...</p>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl p-8 shadow mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

            <div className="space-y-4">
              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <p className="font-semibold text-gray-800">Notification Settings</p>
                <p className="text-sm text-gray-500">Manage health alerts and reminders</p>
              </button>

              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <p className="font-semibold text-gray-800">Privacy & Security</p>
                <p className="text-sm text-gray-500">Control your data and privacy</p>
              </button>

              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <p className="font-semibold text-gray-800">Help & Support</p>
                <p className="text-sm text-gray-500">Get help and report issues</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
