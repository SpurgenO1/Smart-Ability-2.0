/**
 * ArticuTwin / EchoSeed - SLP Speech Companion & Chatbot
 * Interactive pediatric therapy assistant for kids and caregivers.
 */

window.SpeechBuddy = {
  isOpen: false,

  knowledgeBase: [
    {
      keywords: ['ka', 'क', 'tongue', 'k sound'],
      response: "For the 'क' (Ka) sound, tap the back of your tongue against the soft roof of your mouth! Watch the teacher's video to see how the mouth stays relaxed while the back of the tongue does the work! 🐉",
    },
    {
      keywords: ['ta', 'ट', 'curl', 'retroflex'],
      response: "For the retroflex 'ट' (Ta) sound, curl your tongue tip backward towards the roof of your mouth like a little spoon! Then release with a crisp tap! 🥄",
    },
    {
      keywords: ['alert', '5 failure', 'help', 'stuck'],
      response: "Whenever you try a sound 5 times, our smart system gently lets Dr. Ritu know so she can unlock special clinical teacher videos to help you succeed without frustration! 🌟",
    },
    {
      keywords: ['parent', 'home', 'practice'],
      response: "Dear parent, practice for 10-15 minutes daily using positive reinforcement. If your child struggles with a sound, use the 'Launch Unlocked Video' button to guide them through the teacher demonstration! 👨‍👩‍👧",
    },
  ],

  defaultResponse: "Hello explorer! I'm your SLP Speech Buddy! You can ask me how to place your tongue for any Hindi sound, or ask how your practice sessions work! ✨",

  toggle() {
    this.isOpen = !this.isOpen;
    const drawer = document.getElementById('slp-chatbot-drawer');
    if (drawer) {
      drawer.classList.toggle('active', this.isOpen);
      if (this.isOpen) {
        document.getElementById('chatbot-input')?.focus();
      }
    }
  },

  sendMessage() {
    const input = document.getElementById('chatbot-input');
    const msg = input?.value.trim();
    if (!msg) return;

    this.appendMessage('user', msg);
    input.value = '';

    const lower = msg.toLowerCase();
    let reply = this.defaultResponse;

    for (const entry of this.knowledgeBase) {
      if (entry.keywords.some((k) => lower.includes(k))) {
        reply = entry.response;
        break;
      }
    }

    setTimeout(() => {
      this.appendMessage('buddy', reply);
    }, 400);
  },

  appendMessage(sender, text) {
    const messagesBox = document.getElementById('chatbot-messages');
    if (!messagesBox) return;

    const el = document.createElement('div');
    el.className = `chat-msg ${sender}`;
    el.innerHTML = `
      <div class="msg-avatar">${sender === 'user' ? '🧒' : '🩺'}</div>
      <div class="msg-bubble">${text}</div>
    `;

    messagesBox.appendChild(el);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  },
};
