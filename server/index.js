const needle = require('needle');
const config = require('dotenv').config();
const TOKEN =  process.env.TWITTER_BEARER_TOKEN;

const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const streamURL = 'https://api.twitter.com/2/tweets/search/stream?tweet.field=public_metrics%expansions=author_id';

const rules = [{ value: 'giveaway' }]

// Get stream rules
async function getRules() {
    const response = await needle('get', rulesURL, {
        headers: {
            Authorization: `Bearer ${TOKEN}`
        }
    })

    console.log(response.body);
    return response.body;
}

// Set stream rules
async function setRules() {
    const data = {
        add: rules
    }

    const response = await needle('post', rulesURL, data, {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${TOKEN}`
        }
    })

    return response.body;
}

// Delete stream rules
async function deleteRules(rules) {
    if(!Array.isArray(rules.data)) {
        return null;
    }

    const ids = rules.data.map((rule) => rule.id)

    const data = {
        delete: {
            ids: ids
        }
    }

    const response = await needle('post', rulesURL, data, {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${TOKEN}`
        }
    })

    return response.body;
}

(async () => {
    let currentRules;

    try {
        //Get all stream rules
        currentRules = await getRules();
        //Delete all steram rules
        await deleteRules(currentRules);
        //Set rules based on array above
        await setRules();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})()