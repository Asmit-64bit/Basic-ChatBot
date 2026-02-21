// Chat History — localStorage persistence

const STORAGE_KEY = 'gemini-chatbot-history';

export function loadHistory() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function saveConversation(id, title, messages) {
    const history = loadHistory();
    const existing = history.findIndex((c) => c.id === id);
    const entry = {
        id,
        title: title || 'New Chat',
        messages,
        updatedAt: Date.now(),
    };

    if (existing >= 0) {
        history[existing] = entry;
    } else {
        history.unshift(entry);
    }

    // Keep max 50 conversations
    const trimmed = history.slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return trimmed;
}

export function deleteConversation(id) {
    const history = loadHistory();
    const filtered = history.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
}

export function getTheme() {
    return localStorage.getItem('gemini-chatbot-theme') || 'dark';
}

export function setTheme(theme) {
    localStorage.setItem('gemini-chatbot-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

export function exportChat(messages) {
    const lines = messages.map((m) => {
        const label = m.sender === 'user' ? 'You' : 'Gemini';
        return `${label}: ${m.message}`;
    });
    const text = lines.join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}
