require('dotenv').config();

import {checkUrl} from './helpers/index';
import {chatIds as chatIdsDefault} from './constants/chat-id';
import {urlsToCheck, Target} from './constants/urls';
import {saveDataJSON, getDataJSON} from './helpers/json-fs';

const chatIds = getDataJSON() || chatIdsDefault;

const testDomain = 'gepur.com';
const minutesInterval = 5;

const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN_ID;
const startPin = process.env.START_PIN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const sendMessageToAllChats = (message) => {
    chatIds.forEach((chat) => {
        if (chat.id && chat.pause !== true) {
            bot.sendMessage(chat.id, message);
        }
    });
};

const checkGivenUrls = async (host, urlsToCheck, mobile) => {
    const agent = mobile ? 'mobile' : 'desktop';

    const options = {
        headers: {
            'user-agent':
                agent === 'mobile' ? 'gepur-telegram-mobile' : 'gepur-telegram',
        },
    };

    urlsToCheck.forEach(async (url) => {
        const targetUrl = `https://${host}${url.link}`;

        if (agent === 'mobile' && !url.target.includes(Target.MOBILE)) {
            return;
        }

        if (agent === 'desktop' && !url.target.includes(Target.DESKTOP)) {
            return;
        }

        try {
            const response = await checkUrl(targetUrl, options);
            console.log(`[${agent}]`, targetUrl, response.status);

            if (response.status >= 400) {
                console.error('error:', response.status, targetUrl, agent);
                sendMessageToAllChats(`${targetUrl} : ${response.status} ${agent}`);
            }
        } catch (err) {
            console.error('error:', targetUrl, agent);
            // sendMessageToAllChats(`${targetUrl} ${err} ${agent}`);
        }
    });
};

const findChat = (id) => chatIds.find((element) => element.id === id);

const checkSite = async (testDomain) => {
    console.log('check...');
    console.log(chatIds);

    // desktop
    checkGivenUrls(testDomain, urlsToCheck, false);

    // mobile
    checkGivenUrls(testDomain, urlsToCheck, true);

    setTimeout(() => checkSite(testDomain), 60000 * minutesInterval);
};

bot.onText(/\/start (.+)/, (msg, match) => {
    const resp = match[1]; // the captured "whatever"
    const chatId = msg.chat.id;

    if (resp === startPin) {
        bot.sendMessage(msg.chat.id, `Начинаем следить за сайтом ${testDomain}`);
        bot.sendMessage(msg.chat.id, msg.chat.id);
        if (!findChat(chatId)) {
            const name = `${msg.from.first_name} ${msg.from.last_name}`;
            console.log(name);
            chatIds.push({id: chatId, name});
            saveDataJSON(chatIds);
        }
    }
});

bot.onText(/\/status/, (msg, match) => {
    bot.sendMessage(msg.chat.id, `Работаем ${testDomain}`);
});

bot.onText(/\/stop/, (msg, match) => {
    const chat = findChat(msg.chat.id);

    if (chat) {
        chat.id = 0;
        saveDataJSON(chatIds.filter(chat => chat.id));
    }

    bot.sendMessage(msg.chat.id, `Перестаем следить за сайтом ${testDomain}`);
});

bot.onText(/\/pause/, (msg, match) => {
    const chat = findChat(msg.chat.id);

    if (chat) {
        chat.pause = true;
    }

    bot.sendMessage(msg.chat.id, `Оповещение ${testDomain} поставлено на паузу`);
});

bot.onText(/\/play/, (msg, match) => {
    const chat = findChat(msg.chat.id);

    if (chat) {
        chat.pause = false;
    }

    bot.sendMessage(msg.chat.id, `Продолжаем следить за ${testDomain}`);
});

checkSite(testDomain);
