import OpenAI from "openai";
import fs from "fs";

// Step 1 takes the note body as input
const question1 = `You will be given a set of doctor's notes. 
Summarize the actions the patient should be taking in no more than 4 sentences.
Here is the note: `;

// Step 2 takes the summary from step 1 as input
const question2 = `Given a summary of doctor's notes about the actions their patient 
should take before their next visit, come up with a list of questions to ask the patient 
to see how they have been doing. Only return the questions. Here is the summary: `;

// Step 3 takes the summary from step 2 as input
const question3 = `Given a list of questions to ask a doctor's patient 
to see how they have been doing since their last visit, order the questions by importance.
The most important questions are those that relate to medication changes, lab orders that 
should have been completed, and referrals. Pick the top three questions, then add a fourth question
askinf if there have been any significant health updates since the last visit: `;

const openAIClient = new OpenAI();

async function main() {

    const noteFile = "prompts/note1.text";

    // Ask question 1
    console.log("Question 1: ",question1)
    const notes_summary = await getAIResponse(noteFile,question1);
    console.log("Response: ", notes_summary, "\n");

    console.log("Question 2: ",question2)
    const questions_list = await getAIResponse(null,question2+notes_summary);
    console.log("Response: ", questions_list, "\n");

    console.log("Question 3: ",question3)
    const three_questions = await getAIResponse(null,question3+questions_list);
    console.log("Response: ", three_questions, "\n");
}

async function getAIResponse(noteFile,question) {
    var prompt = question;
    
    // if a file was provided, add to prompt
    if (noteFile!=null){
        const note = fs.readFileSync(noteFile, "utf8");
        prompt = question + note;
    }
    
    const response = await openAIClient.chat.completions.create({
        messages: [{ role: "system", content: "You are a hospital administrator" },
                { role: "user", content: prompt }
        ],
        model: "gpt-3.5-turbo",
    });

  return response.choices[0].message.content;
}

main();