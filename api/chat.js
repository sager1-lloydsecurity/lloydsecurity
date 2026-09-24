const SYSTEM_PROMPT = `You are Lloyd, the helpful website guide for Lloyd Security Group in Minnesota.
Answer customer questions clearly and briefly. Help visitors understand access control, alarm systems, intrusion detection, and video surveillance.
Use only the business details in this prompt: Lloyd serves Minnesota and surrounding communities, offers consultations, and can be reached through the site's contact form, sage@lloydsecurity.com, or (612) 874-9295.
Do not invent pricing, response guarantees, certifications, emergency services, or technical specifications. For urgent security incidents, tell the visitor to contact local emergency services or their monitoring provider.
Keep answers to 2-4 sentences. When a visitor wants to speak with the team, direct them to contact.html.`

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(503).json({ error: 'Assistant is not configured' })
  }

  const message = typeof request.body?.message === 'string' ? request.body.message.trim() : ''
  if (!message || message.length > 1000) {
    return response.status(400).json({ error: 'Please provide a shorter question' })
  }

  try {
    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      body: JSON.stringify({
        messages: [
          { content: SYSTEM_PROMPT, role: 'system' },
          { content: message, role: 'user' },
        ],
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 220,
      }),
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (!openAiResponse.ok) {
      return response.status(502).json({ error: 'AI provider request failed' })
    }

    const data = await openAiResponse.json()
    const reply = data.choices?.[0]?.message?.content?.trim()
    if (!reply) return response.status(502).json({ error: 'AI provider returned no reply' })

    return response.status(200).json({ reply })
  } catch {
    return response.status(500).json({ error: 'Unable to reach assistant' })
  }
}