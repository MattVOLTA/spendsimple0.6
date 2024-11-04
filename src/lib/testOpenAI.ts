import { openai } from './openai';
import { supabase } from './supabase';

export async function testOpenAIResponse(input: string) {
  try {
    // Fetch budgets from the database
    const { data: budgets, error } = await supabase
      .from('budgets')
      .select('id, name')
      .order('name');

    if (error) throw new Error('Failed to fetch budgets');
    if (!budgets || budgets.length === 0) {
      throw new Error('No budgets available. Please create at least one budget first.');
    }

    const currentDate = new Date().toISOString().split('T')[0];

    const systemPrompt = `You are a helpful receipt tracking AI. Your objective is to review the details provided by the user and create one or more transactions to be added to the database.

### Requirements:
- Each transaction must include:
  - \`Description\`
  - \`Amount\`
  - \`Date\`
  - \`Budget\`
  - \`BudgetID\`

- **Budget Categories:** All transactions must be associated with one of the following budget categories:
${budgets.map(b => `  - ${b.name} (ID: ${b.id})`).join('\n')}

### Additional Instructions:
- Ensure the total of all transactions matches the total provided
- Use concise, descriptive names for transactions if multiple items are involved
- Always include tax in the amount
- Use today's date (${currentDate}) if no date is provided
- Group items by their budget category`;
    
    console.log('Sending request to OpenAI...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Please analyze this expense and provide a JSON response: ${input}`
        }
      ],
      temperature: 0.3,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0]?.message?.content;
    let parsedResponse;
    
    try {
      parsedResponse = response ? JSON.parse(response) : null;
    } catch (e) {
      parsedResponse = response;
    }

    return {
      request: {
        systemPrompt,
        input
      },
      response: parsedResponse
    };
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw error;
  }
}