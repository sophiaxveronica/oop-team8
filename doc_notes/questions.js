
// Step 1 takes the note body as input
export const question1 = ```You will be given a set of doctor's notes. 
Summarize the actions the patient should be taking in no more than 4 sentences.
Here is the note: ```;

// Step 2 takes the summary from step 1 as input
export const question2 = ```Given a summary of doctor's notes about the actions their patient 
should take before their next visit, come up with a list of questions to ask the patient 
to see how they have been doing. Only return the questions. Here is the summary: ```;

// Step 3 takes the summary from step 2 as input
export const question3 = ```Given a list of questions to ask a doctor's patient 
to see how they have been doing since their last visit, order the questions by importance.
The most important questions are those that relate to medication changes, lab orders that 
should have been completed, and referrals. Return the top three questions: ```;