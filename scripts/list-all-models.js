const https = require('https');
const fs = require('fs');

const API_KEY = "AIzaSyCBsLrD67wkJd9yWapVthEcCdPse4eYHbA";
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(URL, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                fs.writeFileSync('models_error.txt', JSON.stringify(json.error, null, 2));
            } else {
                const models = json.models.map(m => `${m.name} [${m.supportedGenerationMethods.join(', ')}]`).join('\n');
                fs.writeFileSync('models_clean.txt', models);
                console.log("Models written to models_clean.txt");
            }
        } catch (e) {
            console.error("Parse Error:", e);
        }
    });
}).on('error', (e) => {
    console.error("Request Error:", e);
});
