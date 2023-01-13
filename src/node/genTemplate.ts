// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const path = require('path');

// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const fs = require('fs');
// const errorLog = (error) => console.error(`${error}`);

// // 生成文件
// function generateFile(path, data) {
//   try {
//     fs.writeFileSync(path, data, 'utf8');
//   } catch (err) {
//     errorLog(err.message);
//   }
// }
// const needAddedScripts = `
//   <scrpit></scrpit>
//   <scrpit></scrpit>
//   <scrpit></scrpit>
//   <scrpit></scrpit>
//   <scrpit></scrpit>
// `;
// const templatePath = path.resolve(__dirname, '../template.html');
// const htmlTemplate = `
// <!DOCTYPE html>
// <html lang="en">

// <head>
//   <meta charset="UTF-8">
//   <meta http-equiv="X-UA-Compatible" content="IE=edge">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>213</title>
// </head>

// <body>
//   <div id="root">321</div>
// </body>

// </html>
// `;

// // generateFile(htmlTemplate, templatePath);

// export const generateHtmlFn = () => {
//   generateFile(htmlTemplate, templatePath);
// };
