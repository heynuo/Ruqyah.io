(() => {
  'use strict';

  const AI_ENDPOINT = 'https://ruqyah-ai.zahiruddin44044.workers.dev/api/ask';

  const QUICK_PROMPTS = [
    { label: '🕊️ Du\'a for Anxiety & Distress', prompt: 'What are the authentic du\'as and Qur\'anic verses for relieving anxiety, stress, and grief?' },
    { label: '🛡️ Ayat al-Kursi Virtues', prompt: 'What are the spiritual virtues and protective benefits of Ayat al-Kursi (Al-Baqarah 2:255)?' },
    { label: '🌿 Self-Ruqyah Guide', prompt: 'How do I perform authentic Ruqyah on myself according to the Sunnah?' },
    { label: '✨ Morning & Evening Adhkar', prompt: 'What are the core morning and evening protective remembrances (Adhkar) from the Prophet (pbuh)?' }
  ];

  function formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•\s*(.*?)(?=(\n•|\n\n|$))/gs, '<li class="ml-4 list-disc mb-1">$1</li>')
      .replace(/\n\n+/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  function initRuqyahAI() {
    if (document.getElementById('ruqyah-ai-container')) return;

    // Styles
    const style = document.createElement('style');
    style.id = 'ruqyah-ai-styles';
    style.textContent = `
      .ruqyah-ai-fab {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 999;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        background: linear-gradient(135deg, #0F766E 0%, #005c55 100%);
        color: #ffffff;
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 13px;
        font-weight: 600;
        border-radius: 9999px;
        box-shadow: 0 4px 20px rgba(15, 118, 110, 0.35);
        border: 1px solid rgba(245, 194, 107, 0.4);
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .ruqyah-ai-fab:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 24px rgba(15, 118, 110, 0.5);
        border-color: rgba(245, 194, 107, 0.8);
      }
      .ruqyah-ai-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        z-index: 1000;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }
      .ruqyah-ai-modal-backdrop.is-open {
        display: flex;
      }
      .ruqyah-ai-card {
        background: var(--bg-surface, #ffffff);
        color: var(--on-surface, #1e293b);
        border-radius: 18px;
        border: 1px solid rgba(15, 118, 110, 0.25);
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
        width: 100%;
        max-width: 580px;
        max-height: 85vh;
        display: flex;
        flex-col: column;
        flex-direction: column;
        overflow: hidden;
      }
      .ruqyah-ai-header {
        background: linear-gradient(135deg, #0F766E 0%, #004d47 100%);
        color: #ffffff;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .ruqyah-ai-chat-body {
        padding: 18px;
        overflow-y: auto;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 14px;
        min-height: 220px;
        max-height: 480px;
      }
      .ruqyah-ai-bubble-user {
        align-self: flex-end;
        background: #0F766E;
        color: #ffffff;
        padding: 10px 14px;
        border-radius: 14px 14px 2px 14px;
        font-size: 13.5px;
        max-width: 85%;
        line-height: 1.45;
      }
      .ruqyah-ai-bubble-ai {
        align-self: flex-start;
        background: rgba(15, 118, 110, 0.08);
        border: 1px solid rgba(15, 118, 110, 0.15);
        color: inherit;
        padding: 12px 16px;
        border-radius: 14px 14px 14px 2px;
        font-size: 13.5px;
        max-width: 92%;
        line-height: 1.6;
      }
      .ruqyah-ai-chip {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 9999px;
        background: rgba(15, 118, 110, 0.08);
        border: 1px solid rgba(15, 118, 110, 0.2);
        color: #0F766E;
        font-size: 11.5px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .ruqyah-ai-chip:hover {
        background: #0F766E;
        color: #ffffff;
      }
      .ruqyah-ai-input-bar {
        padding: 14px 16px;
        border-top: 1px solid rgba(15, 118, 110, 0.15);
        display: flex;
        gap: 10px;
        background: rgba(15, 118, 110, 0.02);
      }
    `;
    document.head.appendChild(style);

    // Modal DOM
    const container = document.createElement('div');
    container.id = 'ruqyah-ai-container';
    container.innerHTML = `
      <!-- Floating Action Button -->
      <button class="ruqyah-ai-fab" id="ruqyah-ai-open-btn" aria-label="Open Ruqyah AI Spiritual Companion">
        <span style="color: #F5C26B; font-size: 15px;">✦</span>
        <span>Ask Ruqyah AI</span>
      </button>

      <!-- Modal Backdrop -->
      <div class="ruqyah-ai-modal-backdrop" id="ruqyah-ai-modal" role="dialog" aria-modal="true" aria-labelledby="ruqyah-ai-modal-title">
        <div class="ruqyah-ai-card">
          <!-- Header -->
          <div class="ruqyah-ai-header">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #F5C26B; font-size: 18px;">✦</span>
              <div>
                <h3 id="ruqyah-ai-modal-title" style="margin: 0; font-size: 15px; font-weight: 700; letter-spacing: -0.01em;">Ruqyah AI Spiritual Companion</h3>
                <div style="font-size: 11px; opacity: 0.85;">Powered by Cloudflare Workers AI · Meta LLaMA 3.1</div>
              </div>
            </div>
            <button id="ruqyah-ai-close-btn" style="background: transparent; border: none; color: #fff; cursor: pointer; font-size: 20px; padding: 4px;" aria-label="Close">✕</button>
          </div>

          <!-- Body -->
          <div class="ruqyah-ai-chat-body" id="ruqyah-ai-chat">
            <div class="ruqyah-ai-bubble-ai">
              <strong>Assalamu Alaikum.</strong> Welcome to the Ruqyah Scholastic Companion. How may I assist your spiritual reflections or understanding of healing verses today?
            </div>
            
            <div id="ruqyah-ai-chips-wrapper" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
              ${QUICK_PROMPTS.map(p => `<button class="ruqyah-ai-chip" data-prompt="${p.prompt.replace(/"/g, '&quot;')}">${p.label}</button>`).join('')}
            </div>
          </div>

          <!-- Input Bar -->
          <form class="ruqyah-ai-input-bar" id="ruqyah-ai-form">
            <input type="text" id="ruqyah-ai-input" placeholder="Ask about a verse, du'a, or Ruqyah reflection..." 
              style="flex: 1; padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(15, 118, 110, 0.25); font-size: 13.5px; outline: none; background: #fff; color: #1e293b;" />
            <button type="submit" id="ruqyah-ai-send-btn" 
              style="background: #0F766E; color: #fff; border: none; padding: 10px 16px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer;">
              Ask
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Event Handlers
    const modal = document.getElementById('ruqyah-ai-modal');
    const openBtn = document.getElementById('ruqyah-ai-open-btn');
    const closeBtn = document.getElementById('ruqyah-ai-close-btn');
    const chat = document.getElementById('ruqyah-ai-chat');
    const form = document.getElementById('ruqyah-ai-form');
    const input = document.getElementById('ruqyah-ai-input');
    const sendBtn = document.getElementById('ruqyah-ai-send-btn');

    function openModal() {
      modal.classList.add('is-open');
      input.focus();
    }

    function closeModal() {
      modal.classList.remove('is-open');
    }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    // Chips
    document.querySelectorAll('.ruqyah-ai-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const p = chip.getAttribute('data-prompt');
        if (p) submitPrompt(p);
      });
    });

    async function submitPrompt(promptText) {
      const text = String(promptText || '').trim();
      if (!text) return;

      input.value = '';
      input.disabled = true;
      sendBtn.disabled = true;

      // Append user bubble
      const userBubble = document.createElement('div');
      userBubble.className = 'ruqyah-ai-bubble-user';
      userBubble.textContent = text;
      chat.appendChild(userBubble);

      // Append AI loading bubble
      const aiBubble = document.createElement('div');
      aiBubble.className = 'ruqyah-ai-bubble-ai';
      aiBubble.innerHTML = '<span style="opacity: 0.7;">Seeking authentic reflection... ✦</span>';
      chat.appendChild(aiBubble);
      chat.scrollTop = chat.scrollHeight;

      try {
        const res = await fetch(AI_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: text })
        });
        const data = await res.json();
        if (data.reply) {
          aiBubble.innerHTML = formatMarkdown(data.reply);
        } else {
          aiBubble.textContent = data.error || 'Unable to load reflection. Please try again.';
        }
      } catch (err) {
        aiBubble.textContent = 'Connection error. Please check your internet connection.';
      } finally {
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
        chat.scrollTop = chat.scrollHeight;
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submitPrompt(input.value);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRuqyahAI, { once: true });
  } else {
    initRuqyahAI();
  }
})();
