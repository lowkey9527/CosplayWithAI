import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, MessageCircle, Share2, Play, Pause } from 'lucide-react';

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
  personality: string;
  background: string;
  voicePreview?: string;
}

// 模拟角色详细数据
const mockCharacterDetail: Character = {
  id: '1',
  name: '艾莉亚',
  description: '温柔的精灵公主，拥有治愈系的声音和善良的心灵',
  avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20elf%20princess%20with%20long%20silver%20hair%20and%20gentle%20eyes%20fantasy%20portrait&image_size=portrait_4_3',
  category: '奇幻',
  tags: ['温柔', '治愈', '精灵', '公主', '善良'],
  rating: 4.8,
  conversations: 1250,
  isLiked: false,
  personality: '艾莉亚性格温和善良，总是以他人的需要为先。她拥有强烈的同理心，能够理解和感受他人的情感。作为精灵公主，她受过良好的教育，知识渊博，特别擅长自然魔法和治愈术。她说话轻柔，用词优雅，总是试图用积极的方式看待事物。',
  background: '艾莉亚出生在古老的精灵王国埃尔多拉多，是现任精灵女王的独生女。从小在森林中长大，与各种神奇生物为伴。她曾游历人类世界，学习不同文化，这让她对各种族都充满理解和包容。作为未来的女王继承人，她肩负着保护森林和维护种族和谐的重任。'
};

export default function CharacterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character] = useState<Character>(mockCharacterDetail);
  const [isLiked, setIsLiked] = useState(character.isLiked);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const handleStartChat = () => {
    // 导航到对话页面，传递角色ID
    navigate(`/chat/${id || character.id}`);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const toggleVoicePreview = () => {
    setIsPlayingVoice(!isPlayingVoice);
    // 这里将来会播放语音预览
  };

  const handleShare = () => {
    // 分享功能
    console.log('分享角色:', character.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* 返回按钮 */}
      <div className="sticky top-0 z-10 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：角色头像和基本信息 */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden sticky top-24">
              {/* 角色头像 */}
              <div className="relative">
                <img
                  src={character.avatar}
                  alt={character.name}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={toggleLike}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                      isLiked
                        ? 'bg-red-500/80 text-white'
                        : 'bg-black/30 text-white hover:bg-red-500/80'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-black/30 text-white hover:bg-slate-600/80 backdrop-blur-sm transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 基本信息 */}
              <div className="p-6">
                <h1 className="text-2xl font-bold text-white mb-2">{character.name}</h1>
                <p className="text-slate-300 mb-4">{character.description}</p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {character.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-600/20 text-blue-300 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 统计信息 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-semibold">{character.rating}</span>
                    </div>
                    <div className="text-slate-400 text-sm">评分</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-semibold">{character.conversations}</span>
                    </div>
                    <div className="text-slate-400 text-sm">对话次数</div>
                  </div>
                </div>

                {/* 语音预览 */}
                <div className="mb-6">
                  <div className="text-white text-sm font-medium mb-2">语音预览</div>
                  <button
                    onClick={toggleVoicePreview}
                    className="flex items-center gap-2 w-full p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors"
                  >
                    {isPlayingVoice ? (
                      <Pause className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Play className="w-4 h-4 text-blue-400" />
                    )}
                    <span className="text-slate-300 text-sm">
                      {isPlayingVoice ? '暂停预览' : '播放语音预览'}
                    </span>
                  </button>
                </div>

                {/* 开始对话按钮 */}
                <button
                  onClick={handleStartChat}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-lg"
                >
                  开始对话
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：详细信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 性格特点 */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">性格特点</h2>
              <p className="text-slate-300 leading-relaxed">{character.personality}</p>
            </div>

            {/* 背景故事 */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">背景故事</h2>
              <p className="text-slate-300 leading-relaxed">{character.background}</p>
            </div>

            {/* 对话示例 */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">对话示例</h2>
              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-2">用户：你好，艾莉亚</div>
                  <div className="text-slate-300">艾莉亚：你好呀～很高兴见到你！我是艾莉亚，来自精灵王国的公主。今天的森林特别美丽，你愿意和我一起欣赏这自然的奇迹吗？</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="text-slate-400 text-sm mb-2">用户：你会什么魔法吗？</div>
                  <div className="text-slate-300">艾莉亚：当然啦！我最擅长的是治愈魔法，可以帮助受伤的小动物和植物恢复健康。我还会一些自然魔法，比如让花朵绽放，或者与森林中的生灵对话。你想看看吗？</div>
                </div>
              </div>
            </div>

            {/* 相关角色推荐 */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">相关角色推荐</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-600/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=forest%20druid%20with%20nature%20magic&image_size=square"
                      alt="森林德鲁伊"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-white font-medium">森林德鲁伊</div>
                      <div className="text-slate-400 text-sm">自然的守护者</div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-600/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=fairy%20queen%20with%20magical%20wings&image_size=square"
                      alt="仙女女王"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-white font-medium">仙女女王</div>
                      <div className="text-slate-400 text-sm">魔法世界的统治者</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}