# oop-teamgr8

This project, Charty.ai, takes the content of a provider's most recent outpatient notes (SOAP notes), and then uses an LLM (gpt-3.5-turbo) to summarize and prepares questions for a patient follow up based on action items from plan recommended in the SOAP note (i.e. Have you been taking your medications as prescribed?). The LLM will call the patient and ask about these past action items and will summarize the patient's answers to generate a report used for a provider's pre-charting documentation.

The backend is built with Node.js and we generate a viewable report using HTML. 

Run `node doctorChatAudio.js` to use Charty.ai. 
