// import fs from 'fs';


// const output = `
// <html>
//     <head>
//         <title>Patient Summary</title>
//         <style>
//             body {
//                 font-family: Arial, sans-serif;
//             }
//         </style>
//     </head>
//     <body>
//         <h1>Patient Summary</h1>
//         <p>${finalSumm}</p>
//         ${
//             finalSumm.split('\n').map(line => `<p>${line}</p>`).join('')
//         }
//     </body>
// </html>
// `

// // save the html as a file
// fs.writeFileSync('patientSummary.html', output);

// console.log("Patient summary saved to patientSummary.html")

// // use node exec to run the command to open the file in the browser
// import { exec } from 'child_process';
// exec(`open patientSummary.html`);

import { exec } from 'child_process';
exec(`open patientSummary.html`);