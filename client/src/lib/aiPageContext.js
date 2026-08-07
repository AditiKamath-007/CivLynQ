// 🤖 AI INTEGRATION POINT 1: Page context
// This file holds per-page metadata for the floating AI helper.
// When the teammate wires the AI, they can read `getPageContext(pathname)`
// and pass it to the LLM as system context so the AI knows what page
// the user is on and what they're trying to do.

export function getPageContext(pathname) {
  if (pathname === '/') return { name: 'Home', subtitle: 'Browsing the home page', greeting: "Hi! Looking for a specific government process? I can help you find one.", chips: ['Show me popular schemes', 'How do I start a journey?', 'What can LynQbot do?'] };
  if (pathname.startsWith('/schemes') && !pathname.includes('/pm-') && !pathname.includes('/ayushman')) return { name: 'Schemes', subtitle: 'Browsing government schemes', greeting: "Hi! You're on the Schemes page. I can help you find or compare schemes.", chips: ['Compare two schemes', 'Schemes for farmers', 'Schemes for students'] };
  if (pathname.startsWith('/schemes/')) return { name: 'Scheme Details', subtitle: 'Viewing scheme details', greeting: "Hi! Looking at this scheme's details? Ask me anything about eligibility or how to apply.", chips: ['Am I eligible?', 'What documents do I need?', 'How long does it take?'] };
  if (pathname.startsWith('/dashboard')) return { name: 'Dashboard', subtitle: 'Your journey dashboard', greeting: "Hi! Need help managing your journeys? I can guide you through any active step.", chips: ['How do I delete a journey?', "What's next on my journey?", 'How do I finish a journey?'] };
  if (pathname.startsWith('/profile')) return { name: 'Profile', subtitle: 'Your profile', greeting: "Hi! Need help with your profile or settings?", chips: ['How do I log out?', 'Where are my drafts?', 'How do I edit my info?'] };
  if (pathname.startsWith('/roadmap/questions')) return { name: 'Intake Questions', subtitle: 'Personalizing your journey', greeting: "Hi! Stuck on a question? Tell me what you're unsure about and I'll help you answer.", chips: ["I don't understand this question", 'Can you give me an example?', 'What if none of these apply?'] };
  if (pathname.startsWith('/roadmap/')) return { name: 'Roadmap', subtitle: 'On a journey step', greeting: "Hi! Need help with this step? I can explain what to do or what documents you need.", chips: ['What does this step mean?', 'Where do I get this document?', "I'm stuck — what now?"] };
  return { name: 'CivLynQ', subtitle: '', greeting: "Hi! How can I help?", chips: [] };
}
