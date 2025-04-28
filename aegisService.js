export const askAegis = async (prompt) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 250
      })
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response.';
  } catch (err) {
  console.error('AEGIS error:', err);
}
    return 'AEGIS connection failed.';
  }
};