import React, { useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'The study by Dr. Carter and Dr. Lee explores the impact of social media use on youth mental health. Key findings include a correlation between increased social media usage and higher rates of anxiety and depression among adolescents. The research suggests that while social media can offer benefits such as social connection, excessive use may negatively affect mental well-being.',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 2,
      type: 'user',
      content: 'Summarize in 3 bullet points',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [model, setModel] = useState('GPT-4o');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'Youth Mental Health summary', timestamp: new Date().toLocaleString() },
    { id: 2, title: 'Interventions list', timestamp: new Date().toLocaleString() },
  ]);

  const preBuiltPrompts = [
    'Summarize in 3 bullet points',
    'What interventions are tested?',
    'Generate advocacy actionables',
    'Identify key findings',
    'Compare methodologies'
  ];

  const handleSendMessage = (message = inputMessage) => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: generateAIResponse(message),
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage) => {
    const responses = {
      'summarize in 3 bullet points': '• Increased social media usage correlates with higher anxiety and depression rates in adolescents\n• Social media offers benefits like social connection but excessive use has negative impacts\n• The study suggests the need for balanced social media consumption strategies',
      'what interventions are tested': 'The study tested several interventions including:\n• Digital wellness programs\n• Screen time monitoring\n• Social media literacy education\n• Parental guidance strategies',
      'generate advocacy actionables': 'Key advocacy actionables include:\n• Implement digital wellness programs in schools\n• Create awareness campaigns about healthy social media use\n• Develop parental guidance resources\n• Advocate for platform responsibility measures',
      'identify key findings': 'Key findings from the research:\n• 73% of adolescents show increased anxiety with >3 hours daily social media use\n• Positive correlation between social comparison and depression\n• Peer support through social media can be beneficial when moderated\n• Family intervention programs show 40% improvement in mental health outcomes',
      'compare methodologies': 'The study used mixed-methods approach:\n• Quantitative: Survey of 2,500 adolescents (ages 13-18)\n• Qualitative: Focus groups with 150 participants\n• Longitudinal: 6-month follow-up study\n• Control group: 500 participants with limited social media access'
    };

    return responses[userMessage.toLowerCase()] || 'I understand you\'re asking about the research. Based on the study data, I can help you explore specific aspects of the findings, methodology, or implications. Could you be more specific about what you\'d like to know?';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleNewChat = () => {
    const newTitle = `New chat ${chatHistory.length + 1}`;
    setChatHistory([{ id: Date.now(), title: newTitle, timestamp: new Date().toLocaleString() }, ...chatHistory]);
    setMessages([]);
    setInputMessage('');
  };

  return (
    <div className="flex h-screen flex-col">

      <main className="flex flex-1 overflow-hidden">
        {/* History toggle above the Selected Paper column */}
        <div className="w-80 shrink-0 px-6 pt-4">
          <button
            aria-label="Open history"
            className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20 inline-flex items-center gap-2"
            onClick={() => setIsHistoryOpen(true)}
          >
            <span className="material-symbols-outlined">menu</span>
            History
          </button>
        </div>
        <aside className="w-80 shrink-0 border-r border-black/10 dark:border-white/10 p-6 pt-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Selected Paper</h2>
              <div className="mt-4 flex items-center gap-4 rounded-lg bg-gray-100 p-3 dark:bg-black/20">
                <div className="h-20 w-14 shrink-0 rounded bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC6qq3g-Hrs1tvSPIY2jQDwzlbl-X_24MW4hioNt-GO34MkXH_9lbTXx8C8wAh3PDM-9sSvHtYT5eoYNtTt0qQmOogphjsl_fXxXLemLaH-v1JLcP1V2UxYflVMNUXj9pnDtzc1q67ivUoYc7MBsTyqkyGaTk1TP1sSn8MslkUYdu_9iaJ6GJizJ2bNeVbC5hnlQ-gQubWjMeBaD1QjGhv2h0HE3K00u9q0JKVgTACtSwjl1S9zRjCaz8qafBPfX2ENH_Q1571BRUke")'}}></div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">The Impact of Social Media on Youth Mental Health</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Published: 2023</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Paper Details</h2>
              <div className="mt-4 space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-2 border-b border-black/5 pb-4 dark:border-white/5">
                  <p className="text-gray-500 dark:text-gray-400">Authors</p>
                  <p className="col-span-2 font-medium text-gray-800 dark:text-gray-200">Dr. Emily Carter, Dr. David Lee</p>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-black/5 pb-4 dark:border-white/5">
                  <p className="text-gray-500 dark:text-gray-400">Journal</p>
                  <p className="col-span-2 font-medium text-gray-800 dark:text-gray-200">Journal of Adolescent Health</p>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b border-black/5 pb-4 dark:border-white/5">
                  <p className="text-gray-500 dark:text-gray-400">Year</p>
                  <p className="col-span-2 font-medium text-gray-800 dark:text-gray-200">2023</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <p className="text-gray-500 dark:text-gray-400">DOI</p>
                  <p className="col-span-2 font-medium text-gray-800 dark:text-gray-200">10.1016/j.jadohealth.2023.01.005</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex flex-1 flex-col">
          {/* Chat Toolbar (tools) */}
          <div className="border-b border-white/10 bg-panel px-6 py-3">
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <select
                  aria-label="Model"
                  className="rounded-lg border border-white/10 bg-background-dark px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="GPT-4o">GPT-4o</option>
                  <option value="GPT-4.1">GPT-4.1</option>
                  <option value="GPT-3.5">GPT-3.5</option>
                </select>
                <button className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20" onClick={() => setMessages(messages)}>
                  Regenerate
                </button>
              </div>
              <div className="flex items-center gap-3">
                <label className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20 cursor-pointer">
                  <input type="file" accept=".pdf,.txt,.doc,.docx" className="hidden" />
                  Upload
                </label>
                <button onClick={handleClearChat} className="rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20">
                  Clear
                </button>
                <button onClick={handleNewChat} className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-black hover:opacity-90">
                  New Chat
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chat with Research Data</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Interact with your research data using AI-powered analysis. Ask questions, summarize findings, and generate insights.</p>
              </div>
              
              <div className="mb-8">
                <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">Pre-built Prompts</h3>
                <div className="flex flex-wrap gap-2">
                  {preBuiltPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(prompt)}
                      className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex items-start gap-4 ${message.type === 'user' ? 'justify-end' : ''}`}>
                    {message.type === 'ai' && (
                      <div className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoQLkQnO88zJIcJDvykDusximdWlc3qjtGmReGw0s0KsmtLQVCJEbcXyaJl0jDOuFrlZwuGQ8p9kHW0-Dh4W6rByLzUvZ6GYjJNfh7-nzXceZS48sPwYDqWQpF7ROj2y69hC9GH-uHiXuMhpTLbe3nHZZprz3mvgvb56qeDPABGe-p6XBmg0zR-f2j6se6ajJmPAyAz5M2xhdF8fky3e1DXJL1YE_mo5XIq6azyu5AzPiySVYJo5JO3eqTqjyf_OG7vjZBW1VsLO7R")'}}></div>
                    )}
                    <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        {message.type === 'ai' ? 'AI Assistant' : 'Sophia'}
                      </p>
                      <div className={`mt-1 rounded-lg p-3 ${
                        message.type === 'ai' 
                          ? 'rounded-tl-none bg-gray-100 dark:bg-black/20' 
                          : 'inline-block rounded-tr-none bg-primary text-black'
                      }`}>
                        <p className={`${message.type === 'ai' ? 'text-gray-800 dark:text-gray-200' : 'text-black'} whitespace-pre-line`}>
                          {message.content}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>
                    </div>
                    {message.type === 'user' && (
                      <div className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC6MFni3BaJm4AQwZP3AiBH2Iyjhx4HBmDEJZA4aXrk4zopTHPCkmaimO-Q1agsbJi1LAU1Kk9gXUzpCINlTzJQi1jdiFQNhU_KcfcPCEasFm0RZCVYGpkxEhJTtcdaOExcFKk6ujIzPQ3qXEFaq2kBUykx-HPDtnqI03rkFUkPyVy0OaYsRG4DgezBLfbK1TiPQHb35EeV4dHy2BC3pPgh3YjueF8Y_aMlBslvVx5SXl7xgOYVjOheBgLtZNxqAoRMovZyreoJPssz")'}}></div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoQLkQnO88zJIcJDvykDusximdWlc3qjtGmReGw0s0KsmtLQVCJEbcXyaJl0jDOuFrlZwuGQ8p9kHW0-Dh4W6rByLzUvZ6GYjJNfh7-nzXceZS48sPwYDqWQpF7ROj2y69hC9GH-uHiXuMhpTLbe3nHZZprz3mvgvb56qeDPABGe-p6XBmg0zR-f2j6se6ajJmPAyAz5M2xhdF8fky3e1DXJL1YE_mo5XIq6azyu5AzPiySVYJo5JO3eqTqjyf_OG7vjZBW1VsLO7R")'}}></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">AI Assistant</p>
                      <div className="mt-1 rounded-lg rounded-tl-none bg-gray-100 p-3 dark:bg-black/20">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                <button className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-bold text-gray-800 hover:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
                  Export Summary
                </button>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 border-t border-black/10 bg-background-dark/80 backdrop-blur-sm p-4 dark:border-white/10">
            <div className="mx-auto max-w-4xl">
              <div className="relative">
                <textarea
                  className="w-full resize-none rounded-lg border-white/10 bg-panel p-4 pr-16 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary"
                  placeholder="Ask a question about the research..."
                  rows="1"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-black transition-colors hover:bg-primary/90"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* History Sidebar & Backdrop */}
      {/* Sidebar overlays without affecting layout */}
      {isHistoryOpen && (
        <aside
          className="fixed left-0 z-40 w-80 bg-panel border-r border-white/10 p-4 flex flex-col shadow-lg"
          style={{ top: '72px', height: 'calc(100vh - 72px)' }}
        >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold">Chat History</h2>
              <button onClick={() => setIsHistoryOpen(false)} className="rounded-lg bg-white/10 px-2 py-1 text-white hover:bg-white/20">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {chatHistory.map((item) => (
                <button key={item.id} className="w-full rounded-lg border border-white/10 bg-background-dark px-3 py-2 text-left text-white/80 hover:bg-white/10">
                  <div className="text-sm font-medium text-white">{item.title}</div>
                  <div className="text-xs text-white/60">{item.timestamp}</div>
                </button>
              ))}
            </div>
        </aside>
      )}
    </div>
  );
};

export default Chat;
