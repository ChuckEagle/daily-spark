exports.handler = async function(event) {
  const { date } = JSON.parse(event.body);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Today is ${date}. Generate a single energising, thought-provoking quote that has a genuine and interesting connection to this specific date. The connection can be anything: a historical event, a famous person's birthday or death, a scientific discovery, a cultural moment, a seasonal or natural event, an astronomical event, or anything else meaningfully tied to this date in history or nature.

Respond ONLY with a valid JSON object and nothing else — no markdown, no backticks, no preamble:
{
  "quote": "the quote itself",
  "author": "name of person or source (if original, write 'Daily Spark')",
  "connection": "one punchy sentence explaining the specific tie to today's date",
  "theme": "one word theme e.g. Courage / Discovery / Wonder / Change / Resilience"
}`
      }]
    })
  });

  const data = await response.json();
  const text = data.content.map(b => b.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: clean
  };
};
