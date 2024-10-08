// generate html view given summary, list of questions and conversation
export function generateHtml(summary, list_questions, conversation) {

    const output = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Charty.ai Patient Follow-up Summary</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                line-height: 1.6;
            }
            .container {
                max-width: 800px;
                margin: auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            h1 {
                text-align: center;
                color: #2c3e50;
            }
            .section {
                margin-bottom: 20px;
            }
            .section h2 {
                margin-bottom: 10px;
                color: #2980b9;
            }
            .section p, .section ul {
                margin: 10px 0;
            }
            .section ul {
                padding-left: 20px;
            }
            .section ul li {
                list-style-type: none;
                list-style: none;
            }
            button {
                padding: 10px 20px;
                font-size: 16px;
                cursor: pointer;
                background-color: #007BFF;
                color: white;
                border: none;
                text-align: center;
                text-decoration: none;
                margin: 10px 5px;
                border-radius: 5px;
                transition: background-color 0.3s ease;
            }
            button:hover {
                background-color: #0056b3;
            }
            .hidden {
                display: none;
            }
        </style>
    </head>
    <body>

        <div class="container">
            <h1>Charty.ai Patient Follow-up Summary</h1>

            <div class="section">
                <h2>Summary of Most Recent Phone Call</h2>
                <p>${summary}</p>
            </div>

            <div class="section">
                <h2>Questions Asked</h2>
                <ul>
                    ${formatList(list_questions)}
                </ul>
            </div>

            <div class="section">
                <button id="button1">View Call Transcription</button>
                
                <div id="text1" class="hidden">
                    <h2>Transcription</h2>
                    ${formatConversation(conversation)}
                </div>
            </div>

        </div>

        <script>
        document.addEventListener("DOMContentLoaded", () => {
        const button1 = document.getElementById("button1");
        const button2 = document.getElementById("button2");
        const text1 = document.getElementById("text1");
        const text2 = document.getElementById("text2");

        button1.addEventListener("click", () => {
            if (text1.classList.contains("hidden")) {
            text1.classList.remove("hidden");
            button1.textContent = "Hide Call Transcription";
            text2.classList.add("hidden");
            button2.textContent = "View Full SOAP";
            } else {
            text1.classList.add("hidden");
            button1.textContent = "View Call Transcription";
            }
        });

        button2.addEventListener("click", () => {
            if (text2.classList.contains("hidden")) {
            text2.classList.remove("hidden");
            button2.textContent = "Hide Full SOAP";
            text1.classList.add("hidden");
            button1.textContent = "View Call Transcription";
            } else {
            text2.classList.add("hidden");
            button2.textContent = "View Full SOAP";
            }
        });
        });
    </script>

    </body>
    </html>`;
    return output;
}

// format a list of strings as a list of html bullet points
function formatList(list) {
    list = list.split('\n')
    return list.map(item => `<li>${item}</li>`).join('');
}

function formatConversation(conversation) {
    const lines = conversation.split('so far:')[1].split(/(Helen:|Patient:)/).filter(line => line.trim() !== '');
    const formattedConversation = lines.map(line => {
      if (line.startsWith('Helen:') || line.startsWith('Patient:')) {
        return `<strong>${line.trim()}</strong>`;
      }
      return line.trim();
    }).join('<br>');
    return formattedConversation;
  }