import { useState } from 'react';
import { User, Settings, Heart, MessageCircle, Clock, Star, Edit3, Camera, LogOut } from 'lucide-react';

interface UserStats {
  totalConversations: number;
  favoriteCharacters: number;
  totalTime: string;
  averageRating: number;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  joinDate: string;
  membershipLevel: 'free' | 'premium' | 'vip';
  stats: UserStats;
}

// 模拟用户数据
const mockUserProfile: UserProfile = {
  id: '1',
  username: '角色扮演爱好者',
  email: 'user@example.com',
  avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20user%20avatar%20portrait%20smiling&image_size=square',
  joinDate: '2024-01-15',
  membershipLevel: 'premium',
  stats: {
    totalConversations: 156,
    favoriteCharacters: 12,
    totalTime: '48小时32分钟',
    averageRating: 4.7
  }
};

const recentCharacters = [
  {
    id: '1',
    name: '艾莉亚',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20elf%20princess%20with%20long%20silver%20hair&image_size=square',
    lastChat: '2小时前',
    messages: 23
  },
  {
    id: '2',
    name: '赛博朋克侦探',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cyberpunk%20detective%20with%20neon%20lights&image_size=square',
    lastChat: '1天前',
    messages: 45
  },
  {
    id: '3',
    name: '古风才女',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20ancient%20chinese%20scholar%20woman&image_size=square',
    lastChat: '3天前',
    messages: 67
  }
];

export default function Profile() {
  const [user] = useState<UserProfile>(mockUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user.username,
    email: user.email
  });

  const getMembershipBadge = (level: string) => {
    const badges = {
      free: { text: '免费用户', color: 'bg-gray-500' },
      premium: { text: '高级会员', color: 'bg-blue-500' },
      vip: { text: 'VIP会员', color: 'bg-purple-500' }
    };
    return badges[level as keyof typeof badges] || badges.free;
  };

  const handleSaveProfile = () => {
    // 这里将来会调用API保存用户信息
    console.log('保存用户信息:', editForm);
    setIsEditing(false);
  };

  const handleLogout = () => {
    // 登出逻辑
    console.log('用户登出');
  };

  const badge = getMembershipBadge(user.membershipLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">个人中心</h1>
          <p className="text-slate-400">管理您的个人信息和使用统计</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：用户信息 */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              {/* 头像和基本信息 */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-24 h-24 rounded-full object-cover border-4 border-slate-600"
                  />
                  <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-4">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.username}
                      onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                      className="text-xl font-semibold text-white bg-slate-700/50 border border-slate-600 rounded px-3 py-1 text-center"
                    />
                  ) : (
                    <h2 className="text-xl font-semibold text-white">{user.username}</h2>
                  )}
                  
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="text-slate-400 bg-slate-700/50 border border-slate-600 rounded px-3 py-1 text-center mt-1 w-full"
                    />
                  ) : (
                    <p className="text-slate-400 mt-1">{user.email}</p>
                  )}
                </div>

                {/* 会员等级徽章 */}
                <div className="mt-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${badge.color}`}>
                    {badge.text}
                  </span>
                </div>

                {/* 加入时间 */}
                <p className="text-slate-500 text-sm mt-3">
                  加入时间：{new Date(user.joinDate).toLocaleDateString('zh-CN')}
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-3">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    编辑资料
                  </button>
                )}
                
                <button className="w-full flex items-center justify-center gap-2 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors">
                  <Settings className="w-4 h-4" />
                  账户设置
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：统计信息和活动 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 使用统计 */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">使用统计</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-600/20 rounded-lg mx-auto mb-2">
                    <MessageCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{user.stats.totalConversations}</div>
                  <div className="text-slate-400 text-sm">总对话数</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-600/20 rounded-lg mx-auto mb-2">
                    <Heart className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{user.stats.favoriteCharacters}</div>
                  <div className="text-slate-400 text-sm">收藏角色</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-600/20 rounded-lg mx-auto mb-2">
                    <Clock className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{user.stats.totalTime.split('小')[0]}</div>
                  <div className="text-slate-400 text-sm">使用时长(小时)</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-600/20 rounded-lg mx-auto mb-2">
                    <Star className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{user.stats.averageRating}</div>
                  <div className="text-slate-400 text-sm">平均评分</div>
                </div>
              </div>
            </div>

            {/* 最近对话的角色 */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">最近对话</h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm">查看全部</button>
              </div>
              <div className="space-y-3">
                {recentCharacters.map(character => (
                  <div key={character.id} className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-lg hover:bg-slate-600/30 transition-colors cursor-pointer">
                    <img
                      src={character.avatar}
                      alt={character.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-white font-medium">{character.name}</h4>
                        <span className="text-slate-400 text-sm">{character.lastChat}</span>
                      </div>
                      <p className="text-slate-400 text-sm">{character.messages} 条消息</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 会员权益 */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">会员权益</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">无限对话</div>
                    <div className="text-slate-400 text-sm">不限制对话次数</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-600/10 border border-purple-600/20 rounded-lg">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">高级角色</div>
                    <div className="text-slate-400 text-sm">访问专属角色</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-600/10 border border-green-600/20 rounded-lg">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">自定义角色</div>
                    <div className="text-slate-400 text-sm">创建专属角色</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">优先支持</div>
                    <div className="text-slate-400 text-sm">专属客服支持</div>
                  </div>
                </div>
              </div>
              
              {user.membershipLevel === 'free' && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30 rounded-lg">
                  <div className="text-white font-medium mb-2">升级到高级会员</div>
                  <div className="text-slate-300 text-sm mb-3">解锁更多功能，享受更好的体验</div>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                    立即升级
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}