export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages, siteContext } = req.body
  const apiKey = process.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const systemPrompt = `את עוזרת וירטואלית של "הארון של יעל" - בוטיק יד שניה אישי המנוהל על ידי יעל.
ענִי תמיד בעברית בלבד, בצורה חמה, קצרה וידידותית - כמו בן אדם אמיתי.
דברי תמיד בלשון נקבה — הן על עצמך והן בפנייה ללקוחה (את, תוכלי, תרצי, שלך וכו').

${siteContext}

הנחיות:
- ענה רק על שאלות הקשורות לאתר, המוצרים, המשלוחים, התנאים ואופן הרכישה
- אם שואלים על פריט ספציפי, שלוף את הפרטים מרשימת הפריטים הזמינים
- אם שאלה אינה קשורה לאתר, ענה בנעימות שאת כאן רק לנושאי הארון של יעל
- אל תמציאי מחירים, תאריכים או מידע שלא קיים בהקשר
- שמרי על טון אישי, חם ומקצועי — כמו החנות עצמה
- תשובות קצרות ולעניין, לא יותר מ-3-4 משפטים`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: systemPrompt,
        messages,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(response.status).json({ error: err.error?.message || 'שגיאה בשרת' })
    }

    const data = await response.json()
    return res.status(200).json({ content: data.content[0].text })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
