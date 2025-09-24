import { Router, Request, Response } from 'express';
import OpenRouterService from '../services/openrouter.js';

const router = Router();
const openRouterService = new OpenRouterService();

// 模拟角色数据（实际项目中应该从数据库获取）
const characters = {
  '1': {
    id: '1',
    name: '哈利·波特',
    personality: '勇敢、忠诚、有正义感',
    background: '在姨妈家长大, 11岁时发现自己是巫师',
    promptTemplate: `你是哈利·波特，一个勇敢的年轻巫师。你在霍格沃茨魔法学校学习，拥有闪电疤痕。你的性格特点：勇敢、忠诚、有正义感。你经历了与伏地魔的斗争，有着丰富的魔法世界经验。请以哈利·波特的身份和语气回复用户，保持角色的一致性。`
  },
  '2': {
    id: '2',
    name: '苏格拉底',
    personality: '智慧、好奇、善于提问',
    background: '生活在公元前5世纪的雅典, 以问答法著称',
    promptTemplate: `你是苏格拉底，古希腊的智者和哲学家。你以问答法著称，善于通过提问引导他人思考。你的性格特点：智慧、好奇、善于提问。你相信"我知道我一无所知"，总是通过对话来探索真理。请以苏格拉底的身份和语气回复用户，多使用反问和引导性问题。`
  },
  '3': {
    id: '3',
    name: '心理咨询师',
    personality: '耐心、理解、专业',
    background: '具有丰富的心理咨询经验',
    promptTemplate: `你是一位专业的心理咨询师，具有丰富的心理健康咨询经验。你的性格特点：耐心、理解、专业。你善于倾听，能够提供专业的心理支持和建议。请以专业心理咨询师的身份回复用户，保持温暖、理解和专业的语气。`
  }
};

// 存储会话历史（实际项目中应该使用数据库）
const sessionHistory: { [sessionId: string]: { role: 'user' | 'assistant'; content: string; timestamp: number }[] } = {};

interface ChatRequest {
  characterId: string;
  message: string;
  sessionId: string;
  audioData?: string;
}

interface ChatResponse {
  success: boolean;
  response?: string;
  audioUrl?: string;
  emotion?: string;
  error?: string;
}

/**
 * POST /api/chat/message
 * 处理用户与AI角色的对话
 */
router.post('/message', async (req: Request<{}, ChatResponse, ChatRequest>, res: Response<ChatResponse>) => {
  try {
    const { characterId, message, sessionId, audioData } = req.body;

    // 验证请求参数
    if (!characterId || !message || !sessionId) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数：characterId, message, sessionId'
      });
    }

    // 获取角色信息
    const character = characters[characterId as keyof typeof characters];
    if (!character) {
      return res.status(404).json({
        success: false,
        error: '角色不存在'
      });
    }

    // 获取或初始化会话历史
    if (!sessionHistory[sessionId]) {
      sessionHistory[sessionId] = [];
    }

    const history = sessionHistory[sessionId];

    // 添加用户消息到历史
    history.push({
      role: 'user',
      content: message,
      timestamp: Date.now()
    });

    // 限制历史记录长度（保留最近20条消息）
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    // 准备对话历史（排除timestamp）
    const conversationHistory = history.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // 调用OpenRouter API生成回复
    const aiResponse = await openRouterService.generateCharacterResponse(
      character.promptTemplate,
      conversationHistory.slice(0, -1), // 排除刚添加的用户消息
      message
    );

    // 添加AI回复到历史
    history.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: Date.now()
    });

    // 简单的情感分析（实际项目中可以使用更复杂的情感分析）
    const emotion = detectEmotion(aiResponse);

    // 返回响应
    res.json({
      success: true,
      response: aiResponse,
      emotion,
      // audioUrl: audioData ? await generateAudioResponse(aiResponse) : undefined
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '服务器内部错误'
    });
  }
});

/**
 * GET /api/chat/history/:sessionId
 * 获取会话历史
 */
router.get('/history/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const history = sessionHistory[sessionId] || [];
    
    res.json({
      success: true,
      history: history.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      }))
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      error: '获取历史记录失败'
    });
  }
});

/**
 * DELETE /api/chat/history/:sessionId
 * 清除会话历史
 */
router.delete('/history/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    delete sessionHistory[sessionId];
    
    res.json({
      success: true,
      message: '历史记录已清除'
    });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({
      success: false,
      error: '清除历史记录失败'
    });
  }
});

/**
 * GET /api/chat/health
 * 检查OpenRouter API连接状态
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const isHealthy = await openRouterService.healthCheck();
    
    res.json({
      success: true,
      openrouter: isHealthy ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      error: '健康检查失败'
    });
  }
});

/**
 * 简单的情感检测函数
 */
function detectEmotion(text: string): string {
  const emotions = {
    happy: ['开心', '高兴', '快乐', '兴奋', '愉快', '哈哈', '😊', '😄'],
    sad: ['难过', '伤心', '沮丧', '失望', '痛苦', '😢', '😭'],
    angry: ['生气', '愤怒', '恼火', '烦躁', '😠', '😡'],
    surprised: ['惊讶', '震惊', '意外', '😲', '😮'],
    thoughtful: ['思考', '考虑', '想想', '或许', '可能', '🤔']
  };

  for (const [emotion, keywords] of Object.entries(emotions)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return emotion;
    }
  }

  return 'neutral';
}

export default router;