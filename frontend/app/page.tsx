export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent text-lg font-semibold">
                ✨ Welcome to the Future of Task Management
              </span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Task Management
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                System
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your productivity with our sleek, intuitive task management platform.
              Create, organize, and conquer your goals with unparalleled ease and style.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="/register"
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a
                href="/login"
                className="inline-flex items-center px-8 py-4 bg-gray-800/50 backdrop-blur-sm text-indigo-300 font-semibold rounded-xl border border-indigo-400/30 hover:bg-gray-700/50 hover:border-indigo-400/50 transition-all duration-300"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Features Section */}
      <div className="relative py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage your tasks efficiently and elegantly
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-indigo-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-indigo-300 transition-colors duration-300">Create Tasks</h3>
                <p className="text-gray-400 leading-relaxed">
                  Effortlessly create and organize your tasks with rich titles, detailed descriptions, and smart categorization.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors duration-300">Track Progress</h3>
                <p className="text-gray-400 leading-relaxed">
                  Monitor your productivity with comprehensive statistics, progress bars, and insightful analytics.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-teal-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-green-300 transition-colors duration-300">Secure & Private</h3>
                <p className="text-gray-400 leading-relaxed">
                  Your data is protected with enterprise-grade security, ensuring your tasks remain private and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to Get Started?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of users who have transformed their productivity with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105 transition-all duration-300"
            >
              Start Your Journey
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 Task Management System. Built with ❤️ for productivity enthusiasts.
          </p>
        </div>
      </footer>
    </div>
  );
}
