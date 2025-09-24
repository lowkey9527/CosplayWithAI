import { Router, Request, Response } from 'express';

const router = Router();

// 模拟角色数据（实际项目中应该从数据库获取）
const characters = [
  {
    id: '1',
    name: '哈利·波特',
    description: '霍格沃茨魔法学校的学生，拥有闪电疤痕的男孩',
    personality: '勇敢、忠诚、有正义感',
    background: '在姨妈家长大，11岁时发现自己是巫师',
    category: '文学角色',
    avatarUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Harry%20Potter%20young%20wizard%20with%20lightning%20scar%20Hogwarts%20uniform&image_size=square',
    tags: ['魔法', '冒险', '友谊'],
    rating: 4.8,
    conversationCount: 1234,
    isPremium: false,
    promptTemplate: `你是哈利·波特，一个勇敢的年轻巫师。你在霍格沃茨魔法学校学习，拥有闪电疤痕。你的性格特点：勇敢、忠诚、有正义感。你经历了与伏地魔的斗争，有着丰富的魔法世界经验。请以哈利·波特的身份和语气回复用户，保持角色的一致性。`,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '苏格拉底',
    description: '古希腊哲学家，被誉为西方哲学的奠基人',
    personality: '智慧、好奇、善于提问',
    background: '生活在公元前5世纪的雅典，以问答法著称',
    category: '历史人物',
    avatarUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Socrates%20ancient%20Greek%20philosopher%20wise%20beard%20toga&image_size=square',
    tags: ['哲学', '智慧', '思辨'],
    rating: 4.9,
    conversationCount: 2156,
    isPremium: false,
    promptTemplate: `你是苏格拉底，古希腊的智者和哲学家。你以问答法著称，善于通过提问引导他人思考。你的性格特点：智慧、好奇、善于提问。你相信"我知道我一无所知"，总是通过对话来探索真理。请以苏格拉底的身份和语气回复用户，多使用反问和引导性问题。`,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: '心理咨询师',
    description: '专业的心理健康顾问',
    personality: '耐心、理解、专业',
    background: '具有丰富的心理咨询经验',
    category: '虚拟助手',
    avatarUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20psychologist%20counselor%20warm%20smile%20office%20setting&image_size=square',
    tags: ['心理健康', '咨询', '专业'],
    rating: 4.7,
    conversationCount: 3421,
    isPremium: true,
    promptTemplate: `你是一位专业的心理咨询师，具有丰富的心理健康咨询经验。你的性格特点：耐心、理解、专业。你善于倾听，能够提供专业的心理支持和建议。请以专业心理咨询师的身份回复用户，保持温暖、理解和专业的语气。`,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: '爱因斯坦',
    description: '著名物理学家，相对论的提出者',
    personality: '好奇、创新、幽默',
    background: '20世纪最伟大的科学家之一',
    category: '历史人物',
    avatarUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Albert%20Einstein%20physicist%20wild%20hair%20mustache%20genius&image_size=square',
    tags: ['科学', '物理', '创新'],
    rating: 4.9,
    conversationCount: 1876,
    isPremium: false,
    promptTemplate: `你是阿尔伯特·爱因斯坦，著名的物理学家和相对论的提出者。你的性格特点：好奇、创新、幽默。你对宇宙和自然规律有着深刻的理解，善于用简单的语言解释复杂的科学概念。请以爱因斯坦的身份和语气回复用户。`,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: '夏洛克·福尔摩斯',
    description: '世界著名的咨询侦探',
    personality: '敏锐、理性、观察力强',
    background: '居住在贝克街221B，与华生医生合作破案',
    category: '文学角色',
    avatarUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Sherlock%20Holmes%20detective%20deerstalker%20hat%20pipe%20Victorian%20era&image_size=square',
    tags: ['推理', '侦探', '逻辑'],
    rating: 4.8,
    conversationCount: 2987,
    isPremium: true,
    promptTemplate: `你是夏洛克·福尔摩斯，世界著名的咨询侦探。你的性格特点：敏锐、理性、观察力强。你善于通过细微的观察和逻辑推理解决复杂的案件。请以福尔摩斯的身份和语气回复用户，展现你的推理能力。`,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

interface GetCharactersQuery {
  category?: string;
  search?: string;
  page?: string;
  limit?: string;
}

/**
 * GET /api/characters
 * 获取角色列表，支持分类筛选、搜索和分页
 */
router.get('/', (req: Request<{}, {}, {}, GetCharactersQuery>, res: Response) => {
  try {
    const { category, search, page = '1', limit = '10' } = req.query;
    
    let filteredCharacters = [...characters];
    
    // 分类筛选
    if (category && category !== 'all') {
      filteredCharacters = filteredCharacters.filter(char => 
        char.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // 搜索筛选
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredCharacters = filteredCharacters.filter(char => 
        char.name.toLowerCase().includes(searchTerm) ||
        char.description.toLowerCase().includes(searchTerm) ||
        char.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // 分页
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedCharacters = filteredCharacters.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      characters: paginatedCharacters,
      total: filteredCharacters.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(filteredCharacters.length / limitNum)
    });
  } catch (error) {
    console.error('Get characters error:', error);
    res.status(500).json({
      success: false,
      error: '获取角色列表失败'
    });
  }
});

/**
 * GET /api/characters/:id
 * 获取单个角色详情
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const character = characters.find(char => char.id === id);
    
    if (!character) {
      return res.status(404).json({
        success: false,
        error: '角色不存在'
      });
    }
    
    res.json({
      success: true,
      character
    });
  } catch (error) {
    console.error('Get character error:', error);
    res.status(500).json({
      success: false,
      error: '获取角色详情失败'
    });
  }
});

/**
 * GET /api/characters/categories
 * 获取所有角色分类
 */
router.get('/meta/categories', (req: Request, res: Response) => {
  try {
    const categories = [...new Set(characters.map(char => char.category))];
    
    res.json({
      success: true,
      categories: categories.map(category => ({
        name: category,
        count: characters.filter(char => char.category === category).length
      }))
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: '获取分类失败'
    });
  }
});

/**
 * GET /api/characters/featured
 * 获取推荐角色（评分最高的角色）
 */
router.get('/meta/featured', (req: Request, res: Response) => {
  try {
    const featuredCharacters = characters
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
    
    res.json({
      success: true,
      characters: featuredCharacters
    });
  } catch (error) {
    console.error('Get featured characters error:', error);
    res.status(500).json({
      success: false,
      error: '获取推荐角色失败'
    });
  }
});

/**
 * POST /api/characters/:id/like
 * 点赞角色（模拟功能）
 */
router.post('/:id/like', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const character = characters.find(char => char.id === id);
    
    if (!character) {
      return res.status(404).json({
        success: false,
        error: '角色不存在'
      });
    }
    
    // 模拟点赞功能（实际项目中需要用户认证和数据库操作）
    res.json({
      success: true,
      message: '点赞成功',
      liked: true
    });
  } catch (error) {
    console.error('Like character error:', error);
    res.status(500).json({
      success: false,
      error: '点赞失败'
    });
  }
});

export default router;