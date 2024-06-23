import OpenAI from 'openai';
import readlineSync from 'readline-sync';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: 'sk-proj-gEV3MhKwLgTDS0maBTwST3BlbkFJpOFcHCebRyixF2Q5IbFC', // Replace with your actual OpenAI API key
});

// Function to get a response from OpenAI
async function getOpenAIResponse(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use the correct model name
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.9,
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error:', error);
    return "I'm sorry, I'm having trouble understanding. Can you please repeat that?";
  }
}

// Main function to handle the chat flow
async function chatWithDoctor() {
  console.log("You are now chatting with Dr. AI. Describe your symptoms or ask your question.");

  let userPrompt = "";
  while (userPrompt.toLowerCase() !== "exit") {
    userPrompt = readlineSync.question("\nYou: ");
    if (userPrompt.toLowerCase() === "exit") {
      console.log("Dr. AI: Goodbye! Take care!");
      break;
    }

    const completePrompt = `You are a virtual doctor conducting a quick physical assessment. Patient: ${userPrompt}\nDoctor:`;
    const doctorResponse = await getOpenAIResponse(completePrompt);
    console.log(`Dr. AI: ${doctorResponse}`);
  }
}

// Start the chat
chatWithDoctor();