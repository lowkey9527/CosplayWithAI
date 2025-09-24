import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { User, MessageCircle, Library, Home as HomeIcon, LogIn } from 'lucide-react';
import Home from '@/pages/Home';
import Characters from '@/pages/Characters';
import CharacterDetail from '@/pages/CharacterDetail';
import Chat from '@/pages/Chat';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import ChatHistory from '@/pages/ChatHistory';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-white">AI角色扮演平台</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="border-transparent text-slate-300 hover:text-white hover:border-blue-500 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors"
                  >
                    <HomeIcon className="w-4 h-4" />
                    首页
                  </Link>
                  <Link
                    to="/characters"
                    className="border-transparent text-slate-300 hover:text-white hover:border-blue-500 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors"
                  >
                    <Library className="w-4 h-4" />
                    角色库
                  </Link>
                  <Link
                    to="/chat-history"
                    className="border-transparent text-slate-300 hover:text-white hover:border-blue-500 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    对话历史
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <User className="w-5 h-5" />
                </Link>
                <Link
                  to="/auth"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  登录
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/character/:id" element={<CharacterDetail />} />
            <Route path="/chat/:characterId" element={<Chat />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat-history" element={<ChatHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
