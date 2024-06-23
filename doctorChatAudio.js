import readlineSync from 'readline-sync';
import { ElevenLabsClient, play } from "elevenlabs";
import { transcribeAudio } from './transcription.js';

import OpenAI from 'openai';
import { recordStuff } from './recordAudio.js';

const openai = new OpenAI({
    apiKey: 'sk-proj-gEV3MhKwLgTDS0maBTwST3BlbkFJpOFcHCebRyixF2Q5IbFC', // Replace with your actual OpenAI API key
  });

  const elevenlabs = new ElevenLabsClient({
    apiKey: 'sk_f9bfef4c9166d212c24743d8d8d37d0fa20c4a5f8b66ea81', // Replace with your actual Eleven Labs API key
  });
  
  

// Function to get a response from OpenAI
async function getOpenAIResponse(prompt) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Use the correct model name
        messages: [{ role: 'user', content: prompt }, {
            "role": "system",
            "content": "You are a friendly call agent, helping a patient check in for an appointment."
          }],
        max_tokens: 150,
        temperature: 0.9,
      });
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error:', error);
      return "I'm sorry, I'm having trouble understanding. Can you please repeat that?";
    }
  }
  
  // Function to convert text to speech using Eleven Labs
  async function textToSpeech(text) {
    try {

      const audio = await elevenlabs.generate({
        voice: "Rachel",
        text: text,
        model_id: "eleven_multilingual_v2"
      });

      await play(audio);
      
    } catch (error) {
      console.error('Error with text-to-speech:', error);
    }
  }
  
  // Main function to handle the chat flow
  async function chatWithDoctor() {
    console.log("You are now chatting with Dr. AI. Describe your symptoms or ask your question.");
  
    let userPrompt = "";
    while (userPrompt.toLowerCase() !== "exit") {
    //   userPrompt = readlineSync.question("\nYou: ");
    await recordStuff();

    userPrompt = await transcribeAudio('output.wav');
      if (userPrompt.toLowerCase() === "exit") {
        console.log("Dr. AI: Goodbye! Take care!");
        break;
      }
  
      const completePrompt = `You are a virtual doctor conducting a quick physical assessment. Patient: ${userPrompt}\nDoctor:`;
      const doctorResponse = await getOpenAIResponse(completePrompt);
      console.log(`Dr. AI: ${doctorResponse}`);
  
      // Convert AI response to speech and play it
    //   const outputFile = 'doctor_response.wav'; // Adjust file name as needed
      await textToSpeech(doctorResponse);
  
      // Play the audio (for demonstration, use a suitable player on your system)
      console.log('Playing Doctor AI response...');
      // You would typically play the audio file here using a player or stream it to the user
    }
  }
  
  // Start the chat
  chatWithDoctor();