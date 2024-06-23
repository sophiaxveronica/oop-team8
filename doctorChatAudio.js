import readlineSync from 'readline-sync';
import { exec } from 'child_process';
import keypress from 'keypress';

import { ElevenLabsClient, play } from "elevenlabs";
import { transcribeAudio } from './transcription.js';
import fs from 'fs';

import OpenAI from 'openai';
import { recordStuff } from './recordAudio.js';
import { get_questions } from './get_questions.js';
let stopRecording = false;

const openai = new OpenAI({
    apiKey: 'sk-proj-lSxo4kD4VJoPyFMyAxLTT3BlbkFJ1shOztaaX5XuLGjWJuJ1', // Replace with your actual OpenAI API key
  });

  const elevenlabs = new ElevenLabsClient({
    apiKey: 'sk_881d7f2babecd4aacf90a04333a3c87edd1db32205696394', // Replace with your actual Eleven Labs API key
  });
  
  const doctorSystemPrompt = {
    "role": "system",
    "content": "You are a friendly and warm hospital administrator, you ask questions quickly, you want this call to be short and stay focused."
  };

  const summarySystemPrompt = {
    "role": "system",
    "content": "You are summarizing the patient's answers in medical terms."
  };

// Function to get a response from OpenAI
async function getOpenAIResponse(prompt, systemPrompt) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Use the correct model name
        messages: [{ role: 'user', content: prompt }, systemPrompt],
        max_tokens: 150,
        temperature: 0.9,
      });
      return response.choices[0].message.content.trim().replace('Doctor:', '');
    } catch (error) {
      console.error('Error:', error);
      return "I'm sorry, I'm having trouble understanding. Can you please repeat that?";
    }
  }
  
  // Function to convert text to speech using Eleven Labs
  export async function textToSpeech(text) {
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

    const ringing = await elevenlabs.textToSoundEffects.convert({
        text: "Phone ringing sound",
        duration_seconds: 5,  
});
    play(ringing);

    const questions = await get_questions(false);


    let openConversation = `You are a cheerful doctor assistant calling a patient. Your name is Helen, you're calling from your primary care clinic. Start the conversation greeting them cheerfully and ask if it's a good time to talk. You're calling to follow up from a previous appointment.`;
    let continueConversation =  `You are a doctor assistant continuing a call with patient. Respond to their last response. 
    you have some questions to ask, these are the questions: ${questions}.\nYou want to ask these questions one by one over the course of the conversation. You will stick to these questions, unless the patient wants to end the call, and 
    not change the topic depending on patient answers. You are a doctor assistant, do not speak for the patient. You are not the patient. You are one side of a conversation. Don't repeat patient's answers to your questions. When the patient wants to end the conversation or all the questions have been asked, politely end the conversation and respond with "<!END>". This is the conversation so far:`;

    let userPrompt = "";
    while (!userPrompt.toLowerCase().includes("Thanks bye Helen!")) {
        let completePrompt =  (userPrompt == "") ? openConversation : continueConversation;

        const doctorResponse = await getOpenAIResponse(completePrompt, doctorSystemPrompt);
        await textToSpeech(doctorResponse);
        await recordStuff();

        userPrompt = await transcribeAudio('output.wav');
        if (doctorResponse.includes("<!END>")) {

            break;
        }
    
        // Convert AI response to speech and play it
    
        // Play the audio (for demonstration, use a suitable player on your system)
        console.log('Playing Doctor AI response...');
        continueConversation += `\nYou: ${doctorResponse}\nPatient: ${userPrompt}`;
        // You would typically play the audio file here using a player or stream it to the user
    }



    const finalSumm = await getOpenAIResponse(`Briefly summarize the following conversation: ${continueConversation} highlighting the patients answers.`, summarySystemPrompt);

    console.log(finalSumm)
    console.log("Conversation ended")

    const output = `
    <html>
        <body>
            <h1>Patient Summary</h1>
            <p>${finalSumm}</p>
        </body>
    </html>
    `

    // save the html as a file
    fs.writeFileSync('patientSummary.html', output);
    exec(`open patientSummary.html`);

    console.log("Patient summary saved to patientSummary.html")
  }


  chatWithDoctor();

  keypress(process.stdin);

process.stdin.on('keypress', function (ch, key) {
  if (key && key.name === 'space') {
    console.log('Space bar pressed, stopping recording.');
    stopRecording = true;
  }
  if (key && key.ctrl && key.name === 'c') {
    process.exit();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();