import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Mic, MicOff, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  emotion?: string;
}

interface Character {
  id: string;
  name: string;
  description: string;
  personality: string;
  background: string;
  avatarUrl: string;
  promptTemplate: string;
}

const Chat: React.FC = () => {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // 滚动到消息底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 获取角色信息
  useEffect(() => {
    const fetchCharacter = async () => {
      if (!characterId) return;
      
      try {
        const response = await fetch(`/api/characters/${characterId}`);
        const data = await response.json();
        
        if (data.success) {
          setCharacter(data.character);
          // 生成会话ID
          setSessionId(`session_${characterId}_${Date.now()}`);
          // 添加欢迎消息
          const welcomeMessage: Message = {
            id: `welcome_${Date.now()}`,
            content: `你好！我是${data.character.name}。${data.character.description}。很高兴与你对话！`,
            isUser: false,
            timestamp: new Date(),
            emotion: 'friendly'
          };
          setMessages([welcomeMessage]);
        } else {
          toast.error('角色不存在');
          navigate('/');
        }
      } catch (error) {
        console.error('获取角色信息失败:', error);
        toast.error('获取角色信息失败');
        navigate('/');
      }
    };

    fetchCharacter();
  }, [characterId, navigate]);

  // 初始化语音识别
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'zh-CN';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('语音识别错误:', event.error);
        setIsListening(false);
        toast.error('语音识别失败，请重试');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // 初始化语音合成
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // 开始语音识别
  const startListening = () => {
    if (!recognitionRef.current) {
      toast.error('您的浏览器不支持语音识别');
      return;
    }

    try {
      setIsListening(true);
      recognitionRef.current.start();
    } catch (error) {
      console.error('启动语音识别失败:', error);
      setIsListening(false);
      toast.error('启动语音识别失败');
    }
  };

  // 停止语音识别
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // 语音播放
  const speakMessage = (text: string) => {
    if (!synthRef.current) {
      toast.error('您的浏览器不支持语音合成');
      return;
    }

    // 停止当前播放
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast.error('语音播放失败');
    };

    synthRef.current.speak(utterance);
  };

  // 停止语音播放
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  // 发送消息
  const sendMessage = async () => {
    if (!inputMessage.trim() || !character || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: inputMessage.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage.content,
          characterId: character.id,
          sessionId: sessionId,
          characterPrompt: character.promptTemplate
        })
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: Message = {
          id: `ai_${Date.now()}`,
          content: data.response,
          isUser: false,
          timestamp: new Date(),
          emotion: data.emotion || 'neutral'
        };
        setMessages(prev => [...prev, aiMessage]);
        
        // 自动播放AI回复（可选）
        // speakMessage(data.response);
      } else {
        toast.error(data.error || '发送消息失败');
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      toast.error('发送消息失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 重置对话
  const resetChat = () => {
    if (!character) return;
    
    setMessages([{
      id: `welcome_${Date.now()}`,
      content: `你好！我是${character.name}。${character.description}。很高兴与你对话！`,
      isUser: false,
      timestamp: new Date(),
      emotion: 'friendly'
    }]);
    setSessionId(`session_${character.id}_${Date.now()}`);
    toast.success('对话已重置');
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <img
                  src={character.avatarUrl}
                  alt={character.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h1 className="font-semibold text-gray-900">{character.name}</h1>
                  <p className="text-sm text-gray-500">在线</p>
                </div>
              </div>
            </div>
            <button
              onClick={resetChat}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="重置对话"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm min-h-[60vh] max-h-[60vh] overflow-y-auto p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-[80%] ${
                  message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {!message.isUser && (
                    <img
                      src={character.avatarUrl}
                      alt={character.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className={`rounded-lg px-4 py-2 ${
                    message.isUser
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${
                        message.isUser ? 'text-purple-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {!message.isUser && (
                        <button
                          onClick={() => speakMessage(message.content)}
                          className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                          title="播放语音"
                        >
                          <Volume2 className="w-3 h-3 text-gray-500" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <img
                    src={character.avatarUrl}
                    alt={character.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入消息...（按 Enter 发送）"
                className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
            </div>
            
            {/* 语音控制按钮 */}
            <div className="flex space-x-2">
              {isSpeaking ? (
                <button
                  onClick={stopSpeaking}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  title="停止播放"
                >
                  <VolumeX className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                  title={isListening ? '停止录音' : '开始录音'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
              
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="发送消息"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {isListening && (
            <div className="mt-2 text-center">
              <span className="text-sm text-red-500 animate-pulse">正在录音...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;