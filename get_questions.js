import OpenAI from "openai";
import fs from "fs";

const step_1 = `You will be given a set of doctor's notes. 
Summarize the specific actions the patient should be taking in no more than 4 sentences. Include medication names.
Here is the note: `;

const step_2 = `Given a summary of doctor's notes about the actions their patient 
should take before their next visit, come up with a list of specific questions to ask the patient 
to see how they have been doing. Only return the questions. Here is the summary: `;

const step_3 = `Given a list of questions to ask a doctor's patient 
to see how they have been doing since their last visit, order the questions by importance.
The most important questions are those that relate to medication changes, lab orders that 
should have been completed, and referrals. Return the 3 most important questions. Add one
more question asking if there have been any significant health updates since the last visit. 
Return only the 4 questions as a list of strings, do not use the numbers: `;

const openai = new OpenAI({
    apiKey: 'sk-proj-lSxo4kD4VJoPyFMyAxLTT3BlbkFJ1shOztaaX5XuLGjWJuJ1', // Replace with your actual OpenAI API key
  });

export async function get_questions(verbose=false) {
    const doctors_note_file = "doc_notes/doc_note_1.text";
    const doctors_note = fs.readFileSync(doctors_note_file, "utf8");
    const notes_summary = await getAIResponse(step_1+doctors_note);
    const questions_list = await getAIResponse(step_2+notes_summary);
    const questions_top = await getAIResponse(step_3+questions_list);


    return questions_top;
}

async function getAIResponse(prompt) {
    const response = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a hospital administrator" },
                { role: "user", content: prompt }
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.3,
    });
    return response.choices[0].message.content;
}

async function main() {
    await get_questions(true);
}

main();