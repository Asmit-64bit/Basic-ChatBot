import './Sidebar.css';

export function Sidebar({ isOpen, onClose, history, onLoadChat, onDeleteChat, onNewChat }) {
    return (
        <>
            {/* Backdrop */}
            {isOpen && <div className="sidebar-backdrop" onClick={onClose}></div>}

            <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">Chats</h2>
                    <button className="sidebar-new-btn" onClick={onNewChat} title="New chat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>

                <div className="sidebar-list">
                    {history.length === 0 ? (
                        <p className="sidebar-empty">No conversations yet</p>
                    ) : (
                        history.map((chat) => (
                            <div key={chat.id} className="sidebar-item">
                                <button
                                    className="sidebar-item-btn"
                                    onClick={() => { onLoadChat(chat); onClose(); }}
                                >
                                    <span className="sidebar-item-title">{chat.title}</span>
                                    <span className="sidebar-item-date">
                                        {new Date(chat.updatedAt).toLocaleDateString()}
                                    </span>
                                </button>
                                <button
                                    className="sidebar-item-delete"
                                    onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                                    title="Delete"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </aside>
        </>
    );
}
