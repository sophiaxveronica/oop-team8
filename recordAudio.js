import record from 'node-record-lpcm16';
import wav from 'wav';
import keypress from 'keypress';

const CHANNELS = 1;
const RATE = 16000;
const CHUNK = 1024;
const SILENCE_LIMIT = .5; // in seconds

let silentChunks = 0;
let frames = [];
let stopRecording = false;


function isSilent(buffer) {
  let silenceThreshold = 2500; // Adjust as needed
  let silent = true;
  for (let i = 0; i < buffer.length; i += 2) {
    let sample = buffer.readInt16LE(i);
    if (Math.abs(sample) > silenceThreshold) {
      silent = false;
      break;
    }
  }
  return silent;
}


export async function recordStuff(){

    return new Promise((resolve, reject) => {
    console.log("Recording...");

const fileWriter = new wav.FileWriter('output.wav', {
  channels: CHANNELS,
  sampleRate: RATE,
  bitDepth: 16
});

const mic = record
  .record({
    sampleRate: RATE,
    threshold: 0,
    silence: '.5',
    device: null,
    recordProgram: 'rec', // or 'arecord'
    endOnSilence: false
  })
  .stream()
  .on('data', (data) => {
    frames.push(data);
    if (isSilent(data)) {
      silentChunks += 1;
    } else {
      silentChunks = 0;
    }

    if (silentChunks > (RATE / CHUNK * SILENCE_LIMIT)) {
      console.log("Silence detected, stopping recording.");
      mic.end();
    }
  })
  .pipe(fileWriter)
  .on('error', (error) => {
    reject(error);
  })
  .on('finish', () => {
    resolve('File successfully written');
  });
})};

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
  
