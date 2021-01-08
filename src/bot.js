require('dotenv').config()

import { checkUrl } from './helpers/index';
import { chatIds } from './constants/chat-id';
import { urlsToCheck, Target } from './constants/urls';

const testDomain = 'gepur.com';
const minutesInterval = 2;

const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN_ID;
const startPin = process.env.START_PIN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const sendMessageToAllChats = (message) => {
  chatIds.forEach((chat) => {
    if (chat.id) {
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
      sendMessageToAllChats(`${targetUrl} ${err} ${agent}`);
    }
  });
};


const checkSite = async (url) => {
  console.log('check...');

  // desktop
  checkGivenUrls(testDomain, urlsToCheck, false);

  // mobile
  checkGivenUrls(testDomain, urlsToCheck, true);

  setTimeout(() => checkSite(url), 60000 * minutesInterval);
};

bot.onText(/\/start (.+)/, (msg, match) => {
  const resp = match[1]; // the captured "whatever"

  if (resp === startPin) {
    bot.sendMessage(msg.chat.id, `Начинаем следить за сайтом ${testDomain}`);
    bot.sendMessage(msg.chat.id, msg.chat.id);
    chatIds.push({ id: msg.chat.id });
  } else {
    bot.sendMessage(msg.chat.id, `Не могу найти сайт ${resp}`);
  }
});

bot.onText(/\/stop/, (msg, match) => {
  const resp = match[1]; // the captured "whatever"

  const chat = chatIds.find((element) => element.id === msg.chat.id);
  if (chat) {
    chat.id = 0;
  }

  bot.sendMessage(msg.chat.id, `Перестаем следить за сайтом ${testDomain}`);
});

checkSite(`http://${testDomain}`);
