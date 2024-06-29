# oop-teamgr8

Charty.ai, takes the content of a provider's most recent outpatient notes (SOAP notes), and then uses an LLM (gpt-3.5-turbo) to summarize and prepare questions for a patient follow up based on action items from plan recommended in the SOAP note (i.e. Have you been taking 10mg of Metformin daily as prescribed?). The LLM will "call" and speak to the patient to ask about their plan and will summarize the patient's answers to generate a report for a PCP's pre-charting documentation.

The backend is built with Node.js and we generate a viewable report using HTML. 

Run `node doctorChatAudio.js` to use Charty.ai. 
