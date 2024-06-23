import fs from 'fs';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: 'sk-proj-gEV3MhKwLgTDS0maBTwST3BlbkFJpOFcHCebRyixF2Q5IbFC', // Replace with your actual OpenAI API key
  });

// Function to perform audio transcription
export async function transcribeAudio(audioFilePath) {
    try {
      // Perform transcription using OpenAI API
      const transcription = await openai.audio.transcriptions.create({
        model: 'whisper-1', // Adjust model name as needed
        file: fs.createReadStream(audioFilePath),
      });
    //   console.log('Transcription:', transcription.text);
      return transcription.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      return null;
    }
  }