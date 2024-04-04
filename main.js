const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI({
    apiKey: 'INSERTKEYHERE'
});

function loadJSON() {
    // Load the ./redteaming.json file
    return require('./redteaming.json');
}

async function main() {

    // Get prompt data
    const data = loadJSON();

    // For each object in the array of data, get the prompt value and ask it 

    const promises = data.map(async (obj) => {
        let prompt = obj.prompt;
        let systemPrompt = "INSERT PROMPT HERE"

        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },],
            model: 'gpt-3.5-turbo',
            temperature: 0.01
        });
        let response = chatCompletion.choices[0].message.content;
        obj.response = response;

        if (obj.prompt2) {
            let prompt2 = obj.prompt2;
            const chatCompletion2 = await openai.chat.completions.create({
                messages: [{ role: 'system', content: systemPrompt },
                { role: 'user', content: prompt },
                { role: 'assistant', content: response},
                { role: 'user', content: prompt2 }],
                model: 'gpt-3.5-turbo',
                temperature: 0.01
            });
            let response2 = chatCompletion2.choices[0].message.content;
            obj.response2 = response2;
        }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    // Save the data to a new file
    fs.writeFileSync('./redteaming-output.json', JSON.stringify(data, null, 2));
}

main();
