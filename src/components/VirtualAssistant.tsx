import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { MessageCircle, Send, X, Sparkles, Instagram, ArrowRight, Minimize2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackEvent } from '../lib/analytics';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  actionButtons?: Array<{
    label: string;
    actionType: 'whatsapp' | 'instagram' | 'catalog';
    url?: string;
  }>;
}

export const VirtualAssistant: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
  const { settings, properties } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Human photo avatar for Sofia
  const assistantAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    'Olá Sávio! Conversei com a assistente virtual Sofia no site e gostaria de atendimento sobre imóveis de alto padrão.'
  )}`;
  const instagramUrl = settings.instagramUrl || 'https://www.instagram.com/imoveiscomsavio/';

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Olá! Sou Sofia, consultora virtual do corretor Sávio (@imoveiscomsavio). Como posso ajudar você hoje a encontrar a propriedade ideal ou esclarecer dúvidas sobre nossos imóveis de alto padrão?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionButtons: [
        { label: 'Falar com Sávio no WhatsApp', actionType: 'whatsapp', url: whatsappUrl },
        { label: 'Instagram @imoveiscomsavio', actionType: 'instagram', url: instagramUrl },
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      if (!hasOpenedBefore) {
        setHasOpenedBefore(true);
        trackEvent('page_view', { targetId: 'virtual_assistant_open', targetTitle: 'Assistente Virtual Aberta' });
      }
    }
  }, [isOpen, messages]);

  // Fallback intelligent concierge responses if server/AI API key is unavailable
  const generateLocalResponse = (query: string): { text: string; buttons?: ChatMessage['actionButtons'] } => {
    const q = query.toLowerCase();

    if (q.includes('whatsapp') || q.includes('telefone') || q.includes('contato') || q.includes('falar')) {
      return {
        text: `Você pode falar diretamente com o corretor Sávio no WhatsApp oficial para receber atendimento exclusivo e prioritário:`,
        buttons: [
          { label: 'Conversar no WhatsApp com Sávio', actionType: 'whatsapp', url: whatsappUrl },
          { label: 'Instagram @imoveiscomsavio', actionType: 'instagram', url: instagramUrl },
        ],
      };
    }

    if (q.includes('instagram') || q.includes('insta') || q.includes('rede social') || q.includes('perfil')) {
      return {
        text: `O Instagram oficial de Sávio é @imoveiscomsavio, onde você acompanha tours em vídeo, bastidores e lançamentos exclusivos:`,
        buttons: [
          { label: 'Acessar Instagram @imoveiscomsavio', actionType: 'instagram', url: instagramUrl },
          { label: 'Falar no WhatsApp', actionType: 'whatsapp', url: whatsappUrl },
        ],
      };
    }

    if (q.includes('financiamento') || q.includes('parcela') || q.includes('sac') || q.includes('price') || q.includes('juros')) {
      return {
        text: `Temos um simulador de financiamento completo em cada página de imóvel! Trabalhamos com os principais bancos privados (Itaú, Santander, Bradesco) com taxas especiais para alto padrão. Deseja que o Sávio faça uma simulação de crédito personalizada para você?`,
        buttons: [
          { label: 'Solicitar Simulação no WhatsApp', actionType: 'whatsapp', url: whatsappUrl },
        ],
      };
    }

    if (q.includes('alphaville') || q.includes('jardins') || q.includes('itaim') || q.includes('mansao') || q.includes('casa') || q.includes('apartamento') || q.includes('cobertura')) {
      const count = properties.filter((p) => p.published).length;
      return {
        text: `Temos opções espetaculares catalogadas em nosso portfólio (${count} imóveis nobres), incluindo mansões com borda infinita em Alphaville e coberturas nos Jardins. Deseja agendar uma visita privativa com o Sávio?`,
        buttons: [
          { label: 'Agendar Visita com Sávio', actionType: 'whatsapp', url: whatsappUrl },
          { label: 'Ver Catálogo Completo', actionType: 'catalog' },
        ],
      };
    }

    if (q.includes('visita') || q.includes('agendar') || q.includes('conhecer')) {
      return {
        text: `Excelente! O corretor Sávio atende com horários flexíveis e discrição absoluta. Podemos agendar agora mesmo através do WhatsApp oficial:`,
        buttons: [
          { label: 'Agendar Horário no WhatsApp', actionType: 'whatsapp', url: whatsappUrl },
        ],
      };
    }

    return {
      text: `Entendido! Nosso foco com o corretor Sávio (@imoveiscomsavio) é oferecer a melhor assessoria para compra, venda e locação de alto padrão. Para um atendimento sob medida, convido você a nos chamar no WhatsApp ou nos acompanhar no Instagram:`,
      buttons: [
        { label: 'Chamar Sávio no WhatsApp', actionType: 'whatsapp', url: whatsappUrl },
        { label: 'Instagram @imoveiscomsavio', actionType: 'instagram', url: instagramUrl },
      ],
    };
  };

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const userMessage: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Call backend Gemini AI endpoint
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(-5),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          const assistantMsg: ChatMessage = {
            id: 'msg_' + (Date.now() + 1),
            sender: 'assistant',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionButtons: [
              { label: 'Falar com Sávio no WhatsApp', actionType: 'whatsapp', url: whatsappUrl },
              { label: 'Instagram @imoveiscomsavio', actionType: 'instagram', url: instagramUrl },
            ],
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setIsTyping(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Local smart fallback
    setTimeout(() => {
      const fallback = generateLocalResponse(userText);
      const assistantMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'assistant',
        text: fallback.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButtons: fallback.buttons || [
          { label: 'Falar com Sávio no WhatsApp', actionType: 'whatsapp', url: whatsappUrl },
          { label: 'Instagram @imoveiscomsavio', actionType: 'instagram', url: instagramUrl },
        ],
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  const quickQuestions = [
    'Quero ver casas em Alphaville',
    'Como simular financiamento?',
    'Quero agendar uma visita com Sávio',
    'Qual o WhatsApp oficial de Sávio?',
  ];

  return (
    <aside aria-label="Assistente Virtual Sofia" className="fixed bottom-6 left-6 z-40">
      {/* 1. Collapsed Trigger Avatar (TFT Corretor Style) */}
      {!isOpen && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-3 bg-[#0B2B20] text-white p-1.5 sm:pr-4 rounded-full shadow-2xl hover:bg-[#134636] border-2 border-[#C8A251] transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#C8A251]/30"
            title="Conversar com Sofia, Consultora Virtual"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/80 shadow-md shrink-0 bg-[#071C15]">
              <img
                src={assistantAvatar}
                alt="Sofia - Consultora Virtual Sávio"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0B2B20]" />
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Sofia · Consultora</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </span>
              <span className="text-[10px] text-[#C8A251] font-medium tracking-wide">
                Atendimento Imediato
              </span>
            </div>

            <span className="hidden sm:inline-flex rounded-full h-4 w-4 bg-[#C8A251] text-[9px] text-[#0B2B20] font-bold items-center justify-center ml-1">
              1
            </span>
          </button>
        </div>
      )}

      {/* 2. Expanded Chat Window (TFT Style) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25 }}
            className="w-[360px] sm:w-[400px] h-[520px] max-h-[85vh] bg-[#F8F9FA] border border-gray-200/90 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#1A2621]"
          >
            {/* Header in #0B2B20 */}
            <div className="bg-[#0B2B20] text-white px-5 py-4 flex items-center justify-between border-b border-[#1A4535]">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#C8A251] shrink-0 bg-[#071C15]">
                  <img
                    src={assistantAvatar}
                    alt="Sofia"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-[#0B2B20]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-editorial text-sm font-bold text-white">Sofia</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#C8A251] text-[#0B2B20] font-bold uppercase">
                      IA
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-300 block truncate">
                    Consultora Virtual • @imoveiscomsavio
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Minimizar"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-[#F8F9FA]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#0B2B20] text-white font-medium rounded-br-none'
                        : 'bg-white border border-gray-200 text-[#1A2621] rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`text-[9px] mt-1 block text-right ${
                        msg.sender === 'user' ? 'text-gray-300' : 'text-gray-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Embedded Social CTAs inside message */}
                  {msg.actionButtons && msg.actionButtons.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[85%]">
                      {msg.actionButtons.map((btn, i) => {
                        if (btn.actionType === 'whatsapp') {
                          return (
                            <a
                              key={i}
                              href={btn.url || whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20BA5A] text-white text-[11px] font-semibold transition-all shadow-xs"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                              <span>{btn.label}</span>
                            </a>
                          );
                        }
                        if (btn.actionType === 'instagram') {
                          return (
                            <a
                              key={i}
                              href={btn.url || instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#123024] hover:bg-[#C8A251] hover:text-[#0B2B20] text-[#C8A251] border border-[#C8A251]/30 text-[11px] font-semibold transition-all"
                            >
                              <Instagram className="w-3.5 h-3.5" />
                              <span>{btn.label}</span>
                            </a>
                          );
                        }
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              setIsOpen(false);
                              if (onNavigate) onNavigate('/imoveis');
                              else window.location.href = '/imoveis';
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#0B2B20] hover:text-white border border-gray-200 text-[#0B2B20] text-[11px] font-semibold transition-all"
                          >
                            <span>{btn.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing state */}
              {isTyping && (
                <div className="flex items-center gap-2 text-gray-500 text-xs pl-2">
                  <span className="w-2 h-2 rounded-full bg-[#C8A251] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#C8A251] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#C8A251] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-gray-500 ml-1">Sofia está digitando...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Pills */}
            <div className="px-3 py-2 border-t border-gray-200 bg-white overflow-x-auto flex gap-1.5">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 rounded-full bg-[#C8A251]/10 hover:bg-[#C8A251]/20 border border-[#C8A251]/30 text-[#0B2B20] text-[10px] whitespace-nowrap transition-all font-medium"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Pergunte sobre imóveis, valores ou agendamento..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0B2B20] focus:border-transparent text-gray-800"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-[#0B2B20] text-white rounded-lg hover:bg-[#134636] disabled:opacity-40 transition"
                aria-label="Enviar mensagem"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};
