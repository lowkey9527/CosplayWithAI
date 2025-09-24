import { useState } from 'react';
import { Search, Star, MessageCircle, Users, Sparkles, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  category: string;
  rating: number;
  conversations: number;
  tags: string[];
  isNew?: boolean;
  isHot?: boolean;
}

// 模拟角色数据
const featuredCharacters: Character[] = [
  {
    id: '1',
    name: '艾莉亚',
    description: '温柔善良的精灵公主，拥有治愈内心的力量',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20elf%20princess%20with%20long%20silver%20hair&image_size=square',
    category: '奇幻',
    rating: 4.9,
    conversations: 12580,
    tags: ['治愈', '温柔', '奇幻'],
    isHot: true
  },
  {
    id: '2',
    name: '赛博朋克侦探',
    description: '未来都市的冷酷侦探，擅长解决复杂案件',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cyberpunk%20detective%20with%20neon%20lights&image_size=square',
    category: '科幻',
    rating: 4.8,
    conversations: 8960,
    tags: ['推理', '冷酷', '科幻'],
    isNew: true
  },
  {
    id: '3',
    name: '古风才女',
    description: '博学多才的古代才女，精通诗词歌赋',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20ancient%20chinese%20scholar%20woman&image_size=square',
    category: '古风',
    rating: 4.7,
    conversations: 6420,
    tags: ['诗词', '文雅', '古风']
  },
  {
    id: '4',
    name: '机械工程师',
    description: '天才机械工程师，热爱创造和发明',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20engineer%20with%20mechanical%20tools&image_size=square',
    category: '科幻',
    rating: 4.6,
    conversations: 5280,
    tags: ['技术', '创新', '理性']
  }
];

const categories = [
  { name: '全部', icon: '🌟', count: 156 },
  { name: '奇幻', icon: '🧚‍♀️', count: 42 },
  { name: '科幻', icon: '🤖', count: 38 },
  { name: '古风', icon: '🏮', count: 28 },
  { name: '现代', icon: '🏙️', count: 35 },
  { name: '动漫', icon: '🎭', count: 13 }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('搜索:', searchTerm);
    // 这里将来会导航到搜索结果页面
  };

  const handleStartChat = (characterId: string) => {
    console.log('开始对话:', characterId);
    // 这里将来会导航到对话页面
  };

  return (
    <div className="min-h-screen">
      {/* 英雄区域 */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              与AI角色
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                深度对话
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              沉浸式语音交互体验，与各种个性鲜明的AI角色进行真实对话，探索无限可能的故事世界
            </p>
          </div>
          
          {/* 搜索栏 */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6" />
              <input
                type="text"
                placeholder="搜索你想要对话的角色类型或名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
              >
                搜索
              </button>
            </div>
          </form>
          
          {/* 统计数据 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">156+</div>
              <div className="text-slate-300">AI角色</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">50K+</div>
              <div className="text-slate-300">对话次数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">4.8</div>
              <div className="text-slate-300">平均评分</div>
            </div>
          </div>
        </div>
      </section>

      {/* 分类导航 */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">角色分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category.name
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-800/50 border-slate-600 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="font-medium mb-1">{category.name}</div>
                <div className="text-sm opacity-70">{category.count} 个角色</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 推荐角色 */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              热门推荐
            </h2>
            <Link
              to="/characters"
              className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
            >
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCharacters.map(character => (
              <div key={character.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                {/* 角色头像 */}
                <div className="relative mb-4">
                  <img
                    src={character.avatar}
                    alt={character.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {character.isNew && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      新角色
                    </span>
                  )}
                  {character.isHot && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      热门
                    </span>
                  )}
                </div>
                
                {/* 角色信息 */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">{character.name}</h3>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">{character.description}</p>
                  
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {character.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* 统计信息 */}
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{character.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{character.conversations.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <Link
                    to={`/character/${character.id}`}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg text-center transition-colors"
                  >
                    查看详情
                  </Link>
                  <button
                    onClick={() => handleStartChat(character.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    开始对话
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 功能特色 */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">平台特色</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">智能对话</h3>
              <p className="text-slate-400">基于先进AI技术，提供自然流畅的对话体验</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">丰富角色</h3>
              <p className="text-slate-400">多样化的角色设定，满足不同用户的需求</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">个性化体验</h3>
              <p className="text-slate-400">记忆对话历史，提供个性化的交互体验</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}