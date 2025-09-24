import { useState } from 'react';
import { Search, Filter, Heart, Star, MessageCircle } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  category: string;
  tags: string[];
  rating: number;
  conversations: number;
  isLiked: boolean;
}

// 模拟角色数据
const mockCharacters: Character[] = [
  {
    id: '1',
    name: '艾莉亚',
    description: '温柔的精灵公主，拥有治愈系的声音和善良的心灵',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20elf%20princess%20with%20long%20silver%20hair%20and%20gentle%20eyes&image_size=square',
    category: '奇幻',
    tags: ['温柔', '治愈', '精灵'],
    rating: 4.8,
    conversations: 1250,
    isLiked: false
  },
  {
    id: '2',
    name: '赛博朋克侦探',
    description: '未来都市的冷酷侦探，擅长解决复杂案件',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cyberpunk%20detective%20with%20neon%20lights%20and%20futuristic%20coat&image_size=square',
    category: '科幻',
    tags: ['冷酷', '智慧', '未来'],
    rating: 4.6,
    conversations: 890,
    isLiked: true
  },
  {
    id: '3',
    name: '古风才女',
    description: '博学多才的古代才女，精通诗词歌赋',
    avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20ancient%20chinese%20scholar%20woman%20in%20traditional%20hanfu&image_size=square',
    category: '古风',
    tags: ['才华', '优雅', '古典'],
    rating: 4.9,
    conversations: 2100,
    isLiked: false
  }
];

const categories = ['全部', '奇幻', '科幻', '古风', '现代', '历史'];

export default function Characters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [characters, setCharacters] = useState(mockCharacters);
  const [showFilters, setShowFilters] = useState(false);

  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || character.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleLike = (characterId: string) => {
    setCharacters(prev => prev.map(char => 
      char.id === characterId ? { ...char, isLiked: !char.isLiked } : char
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* 头部搜索区域 */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white mb-6">角色库</h1>
          
          {/* 搜索栏 */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜索角色名称或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 筛选按钮 */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            高级筛选
          </button>
        </div>
      </div>

      {/* 角色网格 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCharacters.map(character => (
            <div key={character.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
              {/* 角色头像 */}
              <div className="relative">
                <img
                  src={character.avatar}
                  alt={character.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => toggleLike(character.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
                    character.isLiked
                      ? 'bg-red-500/80 text-white'
                      : 'bg-black/30 text-white hover:bg-red-500/80'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${character.isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* 角色信息 */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2">{character.name}</h3>
                <p className="text-slate-300 text-sm mb-3 line-clamp-2">{character.description}</p>
                
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
                    <span>{character.conversations}</span>
                  </div>
                </div>

                {/* 开始对话按钮 */}
                <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium">
                  开始对话
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {filteredCharacters.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg mb-2">未找到匹配的角色</div>
            <div className="text-slate-500 text-sm">尝试调整搜索条件或筛选器</div>
          </div>
        )}
      </div>
    </div>
  );
}