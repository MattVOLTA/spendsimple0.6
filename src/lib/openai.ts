import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function callOpenAI(input: string | { image: string }, budgets: any[]) {
  if (!openai.apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const budgetNames = budgets.map(b => ({
      name: b.name,
      id: b.id
    }));

    const currentDate = new Date().toISOString().split('T')[0];

    const systemPrompt = `You are a helpful receipt tracking AI. Your objective is to review the details provided by the user and create one or more transactions to be added to the database.

### Requirements:
- Each transaction must include:
  - Description
  - Amount (as a number)
  - Date (YYYY-MM-DD format)
  - Budget
  - BudgetID

### Budget Categories:
${JSON.stringify(budgetNames, null, 2)}

### Response Format:
Your response must be valid JSON with this exact structure:
{
  "transactions": [
    {
      "Description": "string",
      "Amount": number,
      "Date": "YYYY-MM-DD",
      "Budget": "string",
      "BudgetID": "string"
    }
  ]
}

### Special Notes:
- Today's date is: ${currentDate}
- Use the exact BudgetID from the provided categories
- Amounts must be numbers (not strings)
- Ensure the JSON is properly formatted`;

    let response;
    
    if (typeof input === 'string') {
      response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input }
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" }
      });
    } else {
      response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Please analyze this receipt and extract the relevant information.' },
              {
                type: 'image_url',
                image_url: {
                  url: input.image
                }
              }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" }
      });
    }

    if (!response.choices[0]?.message?.content) {
      throw new Error('No response from OpenAI');
    }

    try {
      const parsedResponse = JSON.parse(response.choices[0].message.content);
      
      // Validate response structure
      if (!parsedResponse.transactions || !Array.isArray(parsedResponse.transactions)) {
        throw new Error('Invalid response structure');
      }

      // Validate each transaction
      parsedResponse.transactions.forEach((transaction: any, index: number) => {
        if (!transaction.Description || 
            typeof transaction.Amount !== 'number' ||
            !transaction.Date ||
            !transaction.Budget ||
            !transaction.BudgetID) {
          throw new Error(`Invalid transaction at index ${index}`);
        }
      });

      return parsedResponse;
    } catch (parseError) {
      console.error('OpenAI parsing error:', parseError);
      throw new Error('Failed to parse OpenAI response as JSON');
    }
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    throw new Error(`OpenAI API Error: ${error.message}`);
  }
}

export function isOpenAIConfigured(): boolean {
  return Boolean(import.meta.env.VITE_OPENAI_API_KEY);
}