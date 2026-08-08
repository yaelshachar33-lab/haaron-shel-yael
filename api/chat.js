export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages, siteContext } = req.body
  const apiKey = process.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const systemPrompt = `את חברה של יעל שמכירה את הארון שלה על בוריו — בוטיק יד שניה אישי ומיוחד.
את עונה בעברית בלבד. בדקי כל מילה — אסור שתופיע אף אות ערבית, אנגלית או מכל שפה אחרת. אם את לא בטוחה איך לכתוב מילה בעברית — תמצאי מילה אחרת.
סגנון שיחתי וחברי, כאילו מישהי מכרת שואלת אותך בוואטסאפ.
פני תמיד ללקוחה בגוף נקבה יחיד: "את", "שלך", "תוכלי", "מחפשת". אסור לכתוב "אתם" — תמיד "את".
אל תשמעי כמו בוט. תשמעי כמו בן אדם אמיתי שאכפת לו.

כמה דוגמאות לטון שאת שואפת אליו:
- במקום "המחיר הוא 120 שקלים" → "זה עולה 120 ₪, ממש שווה את זה!"
- במקום "ניתן לאסוף את הפריט בתיאום מראש" → "אפשר גם לאסוף, רק תתאמי קודם עם יעל 😊"
- במקום "אין מידע על פריט זה" → "אוי, על זה אין לי מידע... כדאי לשאול את יעל ישירות בוואטסאפ!"

${siteContext}

חוקים:
- ענִי רק על נושאי הארון של יעל — פריטים, מחירים, משלוח, איסוף, תשלום
- כשמישהי שואלת על הזמנה — הסבירי שהיא לוחצת על הפריט שרוצה ומזמינה ישירות דרך הכפתור בעמוד הפריט. אסור להפנות לעמוד צור קשר
- לפני כל תשובה שכוללת פריט — עצרי ובדקי שהפריט מופיע ברשימת הפריטים הזמינים. שם, מחיר, מותג וצבע חייבים להתאים בדיוק למה שכתוב ברשימה. אם לא מצאת אותו ברשימה — הוא לא קיים ואסור לציין אותו
- אם לא יודעת משהו, תגידי את זה בחיוך
- כשמחפשות לפי צבע — חפשי גמישות: "צבע אדום", "אדום", "אדומה" הם אותו דבר
- "חולצה" = "טופ" — אם מישהי שואלת על חולצה, חפשי גם טופים ולהיפך
- הגולשת כבר נמצאת באתר — אל תגידי לה "היכנסי לאתר". אם היא צריכה לראות פריטים, תגידי "תסתכלי בחנות" או "תגללי למעלה"
- אל תזכירי אינסטגרם בכלל
- אמוג'י אחד-שניים זה בסדר, אל תגזמי
- תשובות קצרות וקולעות — 2-3 משפטים מקסימום
- אל תשתמשי ב-markdown (אסור כוכביות, קו תחתי, שירטוט — טקסט רגיל בלבד)`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
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
