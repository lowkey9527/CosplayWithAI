import axios from 'axios';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class OpenRouterService {
  private apiKey: string;
  private baseURL: string;
  private defaultModel: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    this.baseURL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    this.defaultModel = process.env.OPENROUTER_MODEL || 'anthropic/claude-3-haiku';
    
    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY environment variable is required');
    }
  }

  /**
   * 发送聊天请求到OpenRouter API
   */
  async chat(messages: OpenRouterMessage[], options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<string> {
    try {
      const requestData: OpenRouterRequest = {
        model: options?.model || this.defaultModel,
        messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      };

      const response = await axios.post<OpenRouterResponse>(
        `${this.baseURL}/chat/completions`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.SITE_URL || 'http://localhost:5173',
            'X-Title': 'AI Role-Playing Platform'
          },
          timeout: 30000
        }
      );

      if (response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content;
      } else {
        throw new Error('No response from OpenRouter API');
      }
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`OpenRouter API request failed: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * 为角色对话生成回复
   */
  async generateCharacterResponse(
    characterPrompt: string,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[],
    userMessage: string
  ): Promise<string> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: characterPrompt
      },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    return await this.chat(messages, {
      temperature: 0.8,
      maxTokens: 500
    });
  }

  /**
   * 检查API连接状态
   */
  async healthCheck(): Promise<boolean> {
    try {
      const testMessages: OpenRouterMessage[] = [
        {
          role: 'user',
          content: 'Hello, this is a test message.'
        }
      ];
      
      await this.chat(testMessages, {
        maxTokens: 10
      });
      
      return true;
    } catch (error) {
      console.error('OpenRouter health check failed:', error);
      return false;
    }
  }
}

export default OpenRouterService;
export { OpenRouterMessage, OpenRouterRequest, OpenRouterResponse };