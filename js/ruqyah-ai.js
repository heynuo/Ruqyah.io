/**
 * Ruqyah Scholastic AI Companion
 * Powered by Claude Fable 5.2 & Cloudflare AI Gateway
 *
 * Provides contextual Qur'anic reflections, authentic supplications (Adhkar),
 * and scholastic guidance with speech synthesis, voice dictation, and full responsive design.
 */
(() => {
  'use strict';

  const AI_ENDPOINT = 'https://ruqyah-ai.zahiruddin44044.workers.dev/api/ask';
  const MODEL_NAME = 'anthropic/claude-fable-5.2';

  const QUICK_PROMPTS = [
    { label: '🕊️ Du\'a for Anxiety & Distress', prompt: 'What are the authentic du\'as and Qur\'anic verses for relieving anxiety, distress, and heavy hearts?' },
    { label: '🛡️ Ayat al-Kursi Virtues', prompt: 'What are the spiritual virtues and protective benefits of Ayat al-Kursi (Surah Al-Baqarah 2:255)?' },
    { label: '🌿 Authentic Ruqyah Guide', prompt: 'How do I perform authentic Ruqyah on myself according to the prophetic Sunnah?' },
    { label: '✨ Morning & Evening Adhkar', prompt: 'What are the core morning and evening protective remembrances (Adhkar) taught by the Prophet (pbuh)?' },
    { label: '🤲 Tawakkul in Daily Trials', prompt: 'How does true Tawakkul (reliance on Allah) balance taking practical means with complete surrender?' }
  ];

  let conversationHistory = [];
  let isListening = false;
  let recognitionInstance = null;
  let isSpeaking = false;

  function formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="ruqyah-ai-code">$1</code>')
      .replace(/•\s*(.*?)(?=(\n•|\n\n|$))/gs, '<li class="ruqyah-ai-li">$1</li>')
      .replace(/\n\n+/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  function stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      document.querySelectorAll('.ruqyah-ai-listen-btn').forEach(btn => {
        btn.innerHTML = '🔊 Listen';
      });
    }
  }

  function speakText(text, btnElement) {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      stopSpeech();
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/[*_#•`]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      isSpeaking = true;
      if (btnElement) btnElement.innerHTML = '⏹ Stop';
    };
    utterance.onend = utterance.onerror = () => {
      isSpeaking = false;
      if (btnElement) btnElement.innerHTML = '🔊 Listen';
    };

    window.speechSynthesis.speak(utterance);
  }

  function initRuqyahAI() {
    if (document.getElementById('ruqyah-ai-container')) return;

    // Inject Stylesheet
    const style = document.createElement('style');
    style.id = 'ruqyah-ai-styles';
    style.textContent = `
      .ruqyah-ai-fab {
        position: fixed;
        bottom: calc(24px + env(safe-area-inset-bottom, 0px));
        right: 24px;
        z-index: 85;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 11px 18px;
        background: linear-gradient(135deg, #0F766E 0%, #004d47 100%);
        color: #ffffff !important;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        font-size: 13.5px;
        font-weight: 600;
        border-radius: 9999px;
        box-shadow: 0 8px 24px rgba(15, 118, 110, 0.38), 0 2px 6px rgba(0,0,0,0.12);
        border: 1px solid rgba(245, 194, 107, 0.55);
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease;
        user-select: none;
      }
      .ruqyah-ai-fab:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 12px 30px rgba(15, 118, 110, 0.55), 0 4px 10px rgba(0,0,0,0.18);
        border-color: rgba(245, 194, 107, 0.95);
      }
      .ruqyah-ai-fab:active {
        transform: translateY(0) scale(0.98);
      }
      .ruqyah-ai-fab-sparkle {
        color: #F5C26B;
        font-size: 16px;
        line-height: 1;
        animation: ruqyahSparkle 2.5s ease-in-out infinite;
      }
      @keyframes ruqyahSparkle {
        0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
        50% { transform: scale(1.2) rotate(15deg); opacity: 1; }
      }

      /* Offset FAB when audio player is active */
      body.has-active-audio .ruqyah-ai-fab,
      body.audio-bar-active .ruqyah-ai-fab {
        bottom: calc(90px + env(safe-area-inset-bottom, 0px));
      }

      @media (max-width: 640px) {
        .ruqyah-ai-fab {
          right: 16px;
          bottom: calc(20px + env(safe-area-inset-bottom, 0px));
          padding: 10px 14px;
          font-size: 12.5px;
        }
        body.has-active-audio .ruqyah-ai-fab,
        body.audio-bar-active .ruqyah-ai-fab {
          bottom: calc(105px + env(safe-area-inset-bottom, 0px));
        }
      }

      /* Modal Backdrop */
      .ruqyah-ai-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(3, 8, 7, 0.68);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        z-index: 999;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
        opacity: 0;
        transition: opacity 0.22s ease-out;
      }
      .ruqyah-ai-modal-backdrop.is-open {
        display: flex;
        opacity: 1;
      }

      /* Dialog Card */
      .ruqyah-ai-card {
        background: var(--color-surface, #ffffff);
        color: var(--color-on-surface, #1e293b);
        border-radius: 20px;
        border: 1px solid rgba(15, 118, 110, 0.28);
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.45);
        width: 100%;
        max-width: 620px;
        max-height: 86vh;
        max-height: calc(88dvh - env(safe-area-inset-top, 0px));
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: scale(0.96) translateY(8px);
        transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .ruqyah-ai-modal-backdrop.is-open .ruqyah-ai-card {
        transform: scale(1) translateY(0);
      }

      [data-theme="dark"] .ruqyah-ai-card {
        background: #0d1615;
        border-color: rgba(15, 118, 110, 0.4);
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.75);
      }
      [data-theme="sepia"] .ruqyah-ai-card {
        background: #fbf5e8;
        border-color: rgba(15, 118, 110, 0.3);
      }

      /* Header */
      .ruqyah-ai-header {
        background: linear-gradient(135deg, #0F766E 0%, #004d47 100%);
        color: #ffffff;
        padding: 13px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .ruqyah-ai-header-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .ruqyah-ai-header-badge {
        font-size: 10.5px;
        font-family: 'JetBrains Mono', monospace;
        background: rgba(255, 255, 255, 0.16);
        color: #F5C26B;
        padding: 2px 7px;
        border-radius: 6px;
        font-weight: 600;
        letter-spacing: 0.02em;
      }
      .ruqyah-ai-header-actions {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .ruqyah-ai-icon-btn {
        background: rgba(255, 255, 255, 0.12);
        color: #ffffff;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 15px;
        transition: background 0.15s ease, transform 0.15s ease;
      }
      .ruqyah-ai-icon-btn:hover {
        background: rgba(255, 255, 255, 0.22);
        transform: scale(1.05);
      }

      /* Chat Body */
      .ruqyah-ai-chat-body {
        padding: 16px 18px;
        overflow-y: auto;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 14px;
        min-height: 250px;
        max-height: 480px;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }
      .ruqyah-ai-chat-body::-webkit-scrollbar {
        width: 6px;
      }
      .ruqyah-ai-chat-body::-webkit-scrollbar-thumb {
        background: rgba(15, 118, 110, 0.25);
        border-radius: 9999px;
      }

      /* Message Bubbles */
      .ruqyah-ai-bubble-user {
        align-self: flex-end;
        background: linear-gradient(135deg, #0F766E 0%, #0d6962 100%);
        color: #ffffff;
        padding: 10px 15px;
        border-radius: 16px 16px 3px 16px;
        font-size: 13.5px;
        line-height: 1.5;
        max-width: 86%;
        box-shadow: 0 2px 8px rgba(15, 118, 110, 0.22);
        word-break: break-word;
      }
      .ruqyah-ai-bubble-ai {
        align-self: flex-start;
        background: rgba(15, 118, 110, 0.08);
        border: 1px solid rgba(15, 118, 110, 0.18);
        color: inherit;
        padding: 13px 16px;
        border-radius: 16px 16px 16px 3px;
        font-size: 13.5px;
        line-height: 1.65;
        max-width: 94%;
        word-break: break-word;
      }
      [data-theme="dark"] .ruqyah-ai-bubble-ai {
        background: rgba(15, 118, 110, 0.14);
        border-color: rgba(15, 118, 110, 0.3);
      }
      [data-theme="sepia"] .ruqyah-ai-bubble-ai {
        background: rgba(15, 118, 110, 0.06);
        border-color: rgba(15, 118, 110, 0.18);
      }

      .ruqyah-ai-code {
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        background: rgba(0, 0, 0, 0.07);
        padding: 2px 5px;
        border-radius: 4px;
      }
      [data-theme="dark"] .ruqyah-ai-code {
        background: rgba(255, 255, 255, 0.1);
      }

      .ruqyah-ai-li {
        margin-left: 1.25rem;
        list-style-type: disc;
        margin-bottom: 0.25rem;
      }

      /* Bubble Actions */
      .ruqyah-ai-bubble-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1px dashed rgba(15, 118, 110, 0.18);
      }
      .ruqyah-ai-action-btn {
        background: transparent;
        border: 1px solid rgba(15, 118, 110, 0.28);
        color: #0F766E;
        font-size: 11px;
        font-weight: 600;
        border-radius: 6px;
        padding: 3px 9px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        transition: all 0.15s ease;
      }
      [data-theme="dark"] .ruqyah-ai-action-btn {
        color: #2dd4bf;
        border-color: rgba(45, 212, 191, 0.3);
      }
      .ruqyah-ai-action-btn:hover {
        background: #0F766E;
        color: #ffffff !important;
        border-color: #0F766E;
      }

      /* Quick Chips */
      .ruqyah-ai-chip {
        display: inline-flex;
        align-items: center;
        font-size: 12px;
        background: rgba(15, 118, 110, 0.08);
        border: 1px solid rgba(15, 118, 110, 0.22);
        color: #0F766E;
        padding: 5px 11px;
        border-radius: 9999px;
        cursor: pointer;
        transition: all 0.15s ease;
        text-align: left;
      }
      [data-theme="dark"] .ruqyah-ai-chip {
        color: #5eead4;
        background: rgba(15, 118, 110, 0.18);
        border-color: rgba(94, 234, 212, 0.25);
      }
      .ruqyah-ai-chip:hover {
        background: #0F766E;
        color: #ffffff !important;
        transform: translateY(-1px);
      }

      /* Input Bar */
      .ruqyah-ai-input-bar {
        padding: 12px 18px;
        border-top: 1px solid rgba(15, 118, 110, 0.15);
        background: var(--color-surface, #ffffff);
      }
      [data-theme="dark"] .ruqyah-ai-input-bar {
        background: #0a1110;
        border-top-color: rgba(15, 118, 110, 0.25);
      }
      .ruqyah-ai-form {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .ruqyah-ai-input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid rgba(15, 118, 110, 0.25);
        border-radius: 12px;
        font-size: 16px; /* 16px avoids auto-zoom on mobile iOS */
        background: rgba(15, 118, 110, 0.03);
        color: inherit;
        outline: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }
      [data-theme="dark"] .ruqyah-ai-input {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(15, 118, 110, 0.35);
      }
      .ruqyah-ai-input:focus {
        border-color: #0F766E;
        box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.15);
      }
      .ruqyah-ai-mic-btn {
        width: 40px;
        height: 40px;
        min-width: 40px;
        border-radius: 10px;
        border: 1px solid rgba(15, 118, 110, 0.25);
        background: transparent;
        color: #0F766E;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.15s ease;
      }
      [data-theme="dark"] .ruqyah-ai-mic-btn {
        color: #2dd4bf;
        border-color: rgba(45, 212, 191, 0.3);
      }
      .ruqyah-ai-mic-btn.is-recording {
        background: #dc2626;
        color: #ffffff !important;
        border-color: #dc2626;
        animation: ruqyahPulse 1.2s infinite;
      }
      @keyframes ruqyahPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.08); }
      }
      .ruqyah-ai-send-btn {
        padding: 9px 18px;
        min-height: 40px;
        background: #0F766E;
        color: #ffffff;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        font-size: 13.5px;
        cursor: pointer;
        transition: background 0.15s ease, opacity 0.15s ease;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .ruqyah-ai-send-btn:hover:not(:disabled) {
        background: #0d6962;
      }
      .ruqyah-ai-send-btn:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .ruqyah-ai-footer-note {
        font-size: 10.5px;
        font-family: 'JetBrains Mono', monospace;
        color: rgba(15, 118, 110, 0.7);
        text-align: center;
        margin-top: 6px;
      }
      [data-theme="dark"] .ruqyah-ai-footer-note {
        color: rgba(94, 234, 212, 0.6);
      }
    `;
    document.head.appendChild(style);

    // Create Container
    const container = document.createElement('div');
    container.id = 'ruqyah-ai-container';
    container.innerHTML = `
      <!-- Floating Action Button -->
      <button id="ruqyah-ai-open-btn" class="ruqyah-ai-fab" type="button" aria-haspopup="dialog" aria-expanded="false" aria-label="Open Ruqyah AI Companion">
        <span class="ruqyah-ai-fab-sparkle" aria-hidden="true">✦</span>
        <span>Ask Ruqyah AI</span>
      </button>

      <!-- Modal Dialog -->
      <div id="ruqyah-ai-modal" class="ruqyah-ai-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="ruqyah-ai-title">
        <div class="ruqyah-ai-card">
          <!-- Header -->
          <div class="ruqyah-ai-header">
            <div class="ruqyah-ai-header-info">
              <span style="font-size: 18px; color: #F5C26B;" aria-hidden="true">✦</span>
              <div>
                <h3 id="ruqyah-ai-title" style="margin: 0; font-size: 14.5px; font-weight: 700; letter-spacing: -0.01em;">Ruqyah Scholastic Companion</h3>
                <span class="ruqyah-ai-header-badge">Claude Fable 5.2 • AI Gateway</span>
              </div>
            </div>
            <div class="ruqyah-ai-header-actions">
              <button id="ruqyah-ai-clear-btn" class="ruqyah-ai-icon-btn" type="button" title="Start new conversation" aria-label="Start new conversation">🔄</button>
              <button id="ruqyah-ai-close-btn" class="ruqyah-ai-icon-btn" type="button" title="Close" aria-label="Close dialog">✕</button>
            </div>
          </div>

          <!-- Chat History -->
          <div id="ruqyah-ai-chat" class="ruqyah-ai-chat-body" role="log" aria-live="polite">
            <div class="ruqyah-ai-bubble-ai">
              <strong>Assalamu Alaikum wa Rahmatullah.</strong> Welcome to the Ruqyah Scholastic Companion powered by <em>Claude Fable 5.2</em>. How may I assist your understanding of Qur'anic healing verses, authentic du'as, or spiritual reflections today?
            </div>
            <div id="ruqyah-ai-chips-wrapper" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
              ${QUICK_PROMPTS.map(p => `<button type="button" class="ruqyah-ai-chip" data-prompt="${p.prompt.replace(/"/g, '&quot;')}">${p.label}</button>`).join('')}
            </div>
          </div>

          <!-- Input Bar -->
          <div class="ruqyah-ai-input-bar">
            <form id="ruqyah-ai-form" class="ruqyah-ai-form">
              <button id="ruqyah-ai-mic-btn" class="ruqyah-ai-mic-btn" type="button" title="Dictate with voice" aria-label="Dictate prompt with voice">🎙️</button>
              <input id="ruqyah-ai-input" class="ruqyah-ai-input" type="text" placeholder="Ask about an ayah, du'a, or authentic reflection..." autocomplete="off" />
              <button id="ruqyah-ai-send-btn" class="ruqyah-ai-send-btn" type="submit">
                <span>Send</span>
                <span aria-hidden="true">→</span>
              </button>
            </form>
            <div class="ruqyah-ai-footer-note">✦ Scholastic reflections derived from authentic Sunnah &amp; Qur'an. Free of fees.</div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(container);

    // Bind DOM References
    const modal = document.getElementById('ruqyah-ai-modal');
    const openBtn = document.getElementById('ruqyah-ai-open-btn');
    const closeBtn = document.getElementById('ruqyah-ai-close-btn');
    const clearBtn = document.getElementById('ruqyah-ai-clear-btn');
    const chat = document.getElementById('ruqyah-ai-chat');
    const form = document.getElementById('ruqyah-ai-form');
    const input = document.getElementById('ruqyah-ai-input');
    const sendBtn = document.getElementById('ruqyah-ai-send-btn');
    const micBtn = document.getElementById('ruqyah-ai-mic-btn');

    function openModal() {
      modal.classList.add('is-open');
      openBtn.setAttribute('aria-expanded', 'true');
      setTimeout(() => input.focus(), 80);
    }

    function closeModal() {
      modal.classList.remove('is-open');
      openBtn.setAttribute('aria-expanded', 'false');
      stopSpeech();
      if (isListening && recognitionInstance) {
        recognitionInstance.stop();
      }
    }

    function resetConversation() {
      conversationHistory = [];
      stopSpeech();
      chat.innerHTML = `
        <div class="ruqyah-ai-bubble-ai">
          <strong>Assalamu Alaikum wa Rahmatullah.</strong> Welcome to the Ruqyah Scholastic Companion powered by <em>Claude Fable 5.2</em>. How may I assist your understanding of Qur'anic healing verses, authentic du'as, or spiritual reflections today?
        </div>
        <div id="ruqyah-ai-chips-wrapper" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
          ${QUICK_PROMPTS.map(p => `<button type="button" class="ruqyah-ai-chip" data-prompt="${p.prompt.replace(/"/g, '&quot;')}">${p.label}</button>`).join('')}
        </div>
      `;
      attachChipListeners();
    }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    clearBtn.addEventListener('click', resetConversation);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    // Voice Dictation (Speech Recognition)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        isListening = true;
        micBtn.classList.add('is-recording');
        micBtn.setAttribute('aria-label', 'Listening... click to stop');
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          input.value = (input.value ? input.value + ' ' : '') + transcript;
        }
      };

      recognitionInstance.onerror = recognitionInstance.onend = () => {
        isListening = false;
        micBtn.classList.remove('is-recording');
        micBtn.setAttribute('aria-label', 'Dictate prompt with voice');
      };

      micBtn.addEventListener('click', () => {
        if (isListening) {
          recognitionInstance.stop();
        } else {
          try {
            recognitionInstance.start();
          } catch (e) {
            /* already started */
          }
        }
      });
    } else {
      micBtn.style.display = 'none';
    }

    function attachChipListeners() {
      document.querySelectorAll('.ruqyah-ai-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const p = chip.getAttribute('data-prompt');
          if (p) submitPrompt(p);
        });
      });
    }
    attachChipListeners();

    async function submitPrompt(promptText) {
      const text = String(promptText || '').trim();
      if (!text) return;

      input.value = '';
      input.disabled = true;
      sendBtn.disabled = true;

      // Add user turn to conversation history
      conversationHistory.push({ role: 'user', content: text });

      // Append user bubble
      const userBubble = document.createElement('div');
      userBubble.className = 'ruqyah-ai-bubble-user';
      userBubble.textContent = text;
      chat.appendChild(userBubble);

      // Append AI loading bubble
      const aiBubble = document.createElement('div');
      aiBubble.className = 'ruqyah-ai-bubble-ai';
      aiBubble.innerHTML = '<span style="opacity: 0.75;">Contemplating authentic reflection via Claude Fable 5.2... ✦</span>';
      chat.appendChild(aiBubble);
      chat.scrollTop = chat.scrollHeight;

      try {
        const res = await fetch(AI_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: MODEL_NAME,
            messages: conversationHistory.slice(-8)
          })
        });

        const data = await res.json();
        if (data && data.reply) {
          conversationHistory.push({ role: 'assistant', content: data.reply });
          aiBubble.innerHTML = formatMarkdown(data.reply);

          // Add Copy and Listen action buttons
          const actions = document.createElement('div');
          actions.className = 'ruqyah-ai-bubble-actions';

          const copyBtn = document.createElement('button');
          copyBtn.type = 'button';
          copyBtn.className = 'ruqyah-ai-action-btn';
          copyBtn.innerHTML = '📋 Copy';
          copyBtn.addEventListener('click', () => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(data.reply).then(() => {
                copyBtn.innerHTML = '✓ Copied';
                setTimeout(() => { copyBtn.innerHTML = '📋 Copy'; }, 2000);
              }).catch(() => {});
            }
          });

          const listenBtn = document.createElement('button');
          listenBtn.type = 'button';
          listenBtn.className = 'ruqyah-ai-action-btn ruqyah-ai-listen-btn';
          listenBtn.innerHTML = '🔊 Listen';
          listenBtn.addEventListener('click', () => {
            speakText(data.reply, listenBtn);
          });

          actions.appendChild(copyBtn);
          actions.appendChild(listenBtn);
          aiBubble.appendChild(actions);
        } else {
          aiBubble.textContent = (data && data.error) ? data.error : 'Unable to load reflection. Please try again.';
        }
      } catch (err) {
        aiBubble.textContent = 'Connection error. Please check your internet connection and try again.';
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
