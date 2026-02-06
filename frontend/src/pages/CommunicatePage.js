import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getProcurementList } from '../utils/inventory';
import { formatDate, formatTime } from '../utils/formatters';
import VEGETABLE_DB from '../data/vegetables';
import { THRESHOLD } from '../data/defaults';
import Card from '../components/Card';
import './CommunicatePage.css';

function CommunicatePage() {
  const { inventory, todayMenu, logs } = useApp();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'system',
      text: 'Welcome to Viniyoga Connect! Share menus, lists, and updates with your group.',
      time: '09:00',
    },
  ]);

  const procurement = getProcurementList(inventory);

  const quickMessages = [
    {
      label: '\u{1F4CB} Today\'s Menu',
      gen: () =>
        todayMenu
          ? `\u{1F37D}\uFE0F *Today's Menu*\n${todayMenu.name}\nServings: ${todayMenu.servings}\n\n_Sent via Viniyoga_`
          : 'No menu selected for today yet.',
    },
    {
      label: '\u{1F6D2} Shopping List',
      gen: () => {
        const items = Object.entries(procurement).map(
          ([k, v]) =>
            `${VEGETABLE_DB[k]?.icon || ''} ${VEGETABLE_DB[k]?.en || k}: ${v} ${VEGETABLE_DB[k]?.unit || 'kg'}`
        );
        return items.length > 0
          ? `\u{1F6D2} *Shopping List*\n${formatDate(new Date())}\n\n${items.join('\n')}`
          : 'All items are well-stocked! \u{1F389}';
      },
    },
    {
      label: '\u{1F4CA} Stock Report',
      gen: () => {
        const low = Object.entries(inventory).filter(
          ([k, v]) => v < (THRESHOLD[k] || 0.1)
        );
        return `\u{1F4CA} *Stock Report*\n${formatDate(new Date())}\n\nTotal items: ${Object.keys(inventory).length}\nIn stock: ${Object.values(inventory).filter(v => v > 0).length}\nLow stock: ${low.length}\n\n${low.map(([k, v]) => `\u26A0\uFE0F ${VEGETABLE_DB[k]?.en || k}: ${v}`).join('\n')}`;
      },
    },
  ];

  const sendMessage = (text) => {
    const t = text || message;
    if (!t.trim()) return;
    setMessages(prev => [
      ...prev,
      { id: Date.now(), from: 'user', text: t, time: formatTime() },
    ]);
    setMessage('');
  };

  return (
    <div className="communicate-page">
      <h2 className="communicate-page__title">
        &#x1F4AC; Viniyoga Connect
      </h2>
      <p className="communicate-page__subtitle">
        Broadcast menus, lists &amp; updates
      </p>

      <div className="communicate-page__quick">
        {quickMessages.map((qm, i) => (
          <button
            key={i}
            className="communicate-page__quick-btn"
            onClick={() => sendMessage(qm.gen())}
          >
            {qm.label}
          </button>
        ))}
      </div>

      <Card className="communicate-page__chat">
        <div className="communicate-page__messages">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`chat-msg ${msg.from === 'user' ? 'chat-msg--user' : 'chat-msg--system'}`}
            >
              <div className="chat-msg__bubble">{msg.text}</div>
              <div className="chat-msg__time">{msg.time}</div>
            </div>
          ))}
        </div>

        <div className="communicate-page__input-bar">
          <input
            className="communicate-page__input"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button
            className="communicate-page__send"
            onClick={() => sendMessage()}
          >
            &#x27A4;
          </button>
        </div>
      </Card>

      {logs.length > 0 && (
        <div className="communicate-page__logs">
          <div className="communicate-page__logs-title">Activity Log</div>
          {logs
            .slice(-5)
            .reverse()
            .map((log, i) => (
              <div key={i} className="communicate-page__log-item">
                <span>
                  &#x1F373; Cooked <strong>{log.menu}</strong> ({log.servings}
                  &times; servings)
                </span>
                <span>
                  {new Date(log.time).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default CommunicatePage;
