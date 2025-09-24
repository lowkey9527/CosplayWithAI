import { useState } from 'react';
import { Search, Filter, MessageCircle, Clock, Star, Play, Trash2, Download } from 'lucide-react';

interface ChatSession {
  id: string;
  characterName: string;
  characterAvatar: string;
  startTime: string;
  duration: string;
  messageCount: number;
  rating?: number;
  lastMessage: string;
  tags: string[];
}

// 模拟对话历史数据
const mockChatHistory: ChatSession[] = [
  {
    id: '1',
    characterName: '艾莉亚',
    characterAvatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20elf%20princess%20with%20long%20silver%20hair&image_size=square',
    startTime: '2024-01-20 14:30',
    duration: '45分钟',
    messageCount: 23,
    rating: 5,
    lastMessage: '谢谢你陪我度过这美好的时光，希望我们还能再见面！',
    tags: ['治愈', '温馨']
  },
  {
    id: '2',
    characterName: '赛博朋克侦探',
    characterAvatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cyberpunk%20detective%20with%20neon%20lights&image_size=square',
    startTime: '2024-01-19 20:15',
    duration: '1小时12分钟',
    messageCount: 45,
    rating: 4,
    lastMessage: '案件已经解决，这座城市又恢复了平静...',
    tags: ['推理', '悬疑']
  },
  {
    id: '3',
    characterName: '古风才女',
    characterAvatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20ancient%20chinese%20scholar%20woman&image_size=square',
    startTime: '2024-01-18 16:45',
    duration: '32分钟',
    messageCount: 18,
    rating: 5,
    lastMessage: '愿君多采撷，此物最相思。今日一别，不知何时再相逢。',
    tags: ['诗词', '文雅']
  },
  {
    id: '4',
    characterName: '艾莉亚',
    characterAvatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20elf%20princess%20with%20long%20silver%20hair&image_size=square',
    startTime: '2024-01-17 10:20',
    duration: '28分钟',
    messageCount: 15,
    lastMessage: '森林里的花儿都为你绽放，愿你每天都有好心情！',
    tags: ['日常', '温馨']
  },
  {
    id: '5',
    characterName: '机械工程师',
    characterAvatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20engineer%20with%20mechanical%20tools&image_size=square',
    startTime: '2024-01-16 19:30',
    duration: '55分钟',
    messageCount: 31,
    rating: 4,
    lastMessage: '这个设计方案很有创意，我们下次继续讨论技术细节。',
    tags: ['技术', '创新']
  }
];

export default function ChatHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState('全部');
  const [sortBy, setSortBy] = useState<'time' | 'duration' | 'rating'>('time');
  const [chatHistory, setChatHistory] = useState(mockChatHistory);

  // 获取所有角色名称用于筛选
  const characters = ['全部', ...Array.from(new Set(chatHistory.map(chat => chat.characterName)))];

  // 筛选和排序对话历史
  const filteredAndSortedHistory = chatHistory
    .filter(chat => {
      const matchesSearch = chat.characterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCharacter = selectedCharacter === '全部' || chat.characterName === selectedCharacter;
      return matchesSearch && matchesCharacter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'time':
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        case 'duration':
          return parseInt(b.duration) - parseInt(a.duration);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  const handleReplay = (chatId: string) => {
    console.log('回放对话:', chatId);
    // 这里将来会导航到对话回放页面
  };

  const handleDelete = (chatId: string) => {
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
  };

  const handleExport = (chatId: string) => {
    console.log('导出对话:', chatId);
    // 这里将来会实现对话导出功能
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '今天';
    if (diffDays === 2) return '昨天';
    if (diffDays <= 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* 头部搜索和筛选区域 */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white mb-6">对话历史</h1>
          
          {/* 搜索栏 */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索角色名称或对话内容..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* 角色筛选 */}
            <select
              value={selectedCharacter}
              onChange={(e) => setSelectedCharacter(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {characters.map(character => (
                <option key={character} value={character}>{character}</option>
              ))}
            </select>
            
            {/* 排序选择 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'time' | 'duration' | 'rating')}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="time">按时间排序</option>
              <option value="duration">按时长排序</option>
              <option value="rating">按评分排序</option>
            </select>
          </div>

          {/* 统计信息 */}
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <span>共 {filteredAndSortedHistory.length} 条对话记录</span>
            <span>总时长 {chatHistory.reduce((total, chat) => total + parseInt(chat.duration), 0)} 分钟</span>
            <span>平均评分 {(chatHistory.filter(chat => chat.rating).reduce((sum, chat) => sum + (chat.rating || 0), 0) / chatHistory.filter(chat => chat.rating).length).toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* 对话历史列表 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {filteredAndSortedHistory.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <div className="text-slate-400 text-lg mb-2">暂无对话记录</div>
            <div className="text-slate-500 text-sm">开始与AI角色对话，创造美好回忆吧！</div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedHistory.map(chat => (
              <div key={chat.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  {/* 角色头像 */}
                  <img
                    src={chat.characterAvatar}
                    alt={chat.characterName}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                  
                  {/* 对话信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">{chat.characterName}</h3>
                        {chat.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-yellow-400 text-sm">{chat.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReplay(chat.id)}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-colors"
                          title="回放对话"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleExport(chat.id)}
                          className="p-2 text-green-400 hover:text-green-300 hover:bg-green-600/20 rounded-lg transition-colors"
                          title="导出对话"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(chat.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-colors"
                          title="删除对话"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* 对话统计 */}
                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(chat.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{chat.messageCount} 条消息</span>
                      </div>
                      <span>时长 {chat.duration}</span>
                    </div>
                    
                    {/* 最后一条消息 */}
                    <p className="text-slate-300 mb-3 line-clamp-2">{chat.lastMessage}</p>
                    
                    {/* 标签 */}
                    <div className="flex flex-wrap gap-2">
                      {chat.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* 加载更多按钮 */}
        {filteredAndSortedHistory.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600/50 transition-colors">
              加载更多
            </button>
          </div>
        )}
      </div>
    </div>
  );
}