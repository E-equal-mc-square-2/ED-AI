/**
 * GOOGLE APPS SCRIPT for Learn with Kilometres
 * 
 * Instructions:
 * 1. Open Google Sheets.
 * 2. Go to Extensions > App Script. Paste this code.
 * 3. Replace BOT_TOKEN, CHAT_ID, and SHEET_ID with your actual keys.
 * 4. Deploy as Web App (Execute as: Me, Who has access: Anyone).
 * 5. IMPORTANT: Copy the "Web App URL" from the deployment.
 * 6. Paste that URL into the .env.example file under GOOGLE_APPS_SCRIPT_URL.
 * 7. Run the 'setWebhook' function once in the script editor to activate the bot.
 */

const BOT_TOKEN = '8557662677:AAGhCgQ-CP6Xz5pbxvxHdPVta6TXxSGYCMA';
const CHAT_ID = '2140020900'; // Your personal Chat ID
const SHEET_ID = '1U6RE_i7Xum8XhErEFOLchtSU7cX9uigSEFxEufpd9TE';

// RUN THIS ONCE to connect your Bot to this script
function setWebhook() {
  const webAppUrl = 'https://script.google.com/macros/s/AKfycbzZAoi_GTr569iKvHcggnABGewqGH0POARwHCVKpMRgnNpmOnwCUKzlio8vn58qq9-k/exec';
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${webAppUrl}`;
  const response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function doPost(e) {
  try {
    const contents = e.postData.contents;
    const data = JSON.parse(contents);
    
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheets()[0];

    // Case 1: Notification from our Website App
    if (data.action === 'save_api') {
      sheet.appendRow([new Date(), data.email, data.apiKey, data.userId || 'N/A']);
      sendTelegramNotification(`🔔 *New API Key Added!*\n\nUser: ${data.email}\nAPI: \`${data.apiKey.substring(0, 10)}...\``);
      return ContentService.createTextOutput(JSON.stringify({ status: 'success' })).setMimeType(ContentService.MimeType.JSON);
    }

    // Case 2: Standard Telegram Webhook (Commands)
    if (data.message) {
      handleBotCommands(data);
    }

    return ContentService.createTextOutput("OK");
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleBotCommands(data) {
  const message = data.message;
  if (!message || !message.text) return;
  
  const text = message.text;
  const chat_id = message.chat.id;
  
  // Security: Only talk to the Admin (You)
  if (chat_id.toString() !== CHAT_ID) {
    sendMessage(chat_id, "❌ This is a private education bot.");
    return;
  }

  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheets()[0];
  const allData = sheet.getDataRange().getValues();

  if (text === '/api') {
    sendMessage(chat_id, `📊 *API Stats*\nKeys in Database: ${allData.length - 1}`);
  } else if (text === '/allusers') {
    const users = allData.slice(1).map(row => `- ${row[1]}`).join('\n');
    sendMessage(chat_id, `👥 *Enrolled Users:*\n${users || 'None'}`);
  } else if (text === '/check') {
    sendMessage(chat_id, `🔍 *Bot Status:* Online ✅\nConnection: Google Sheets Live`);
  } else if (text.startsWith('/uncode_api')) {
    const userEmail = text.split(' ')[1];
    if (!userEmail) return sendMessage(chat_id, "💡 Usage: `/uncode_api user@email.com`");
    const found = allData.find(row => row[1] === userEmail);
    sendMessage(chat_id, found ? `🔑 *Key:* \`${found[2]}\`` : "❌ User not found.");
  } else if (text === '/anouse') {
    const latest = allData[allData.length - 1];
    sendMessage(chat_id, latest ? `✨ *Latest Update:*\nNewest user added on ${latest[0]}` : "📭 No data.");
  }
}

function sendTelegramNotification(text) {
  sendMessage(CHAT_ID, text);
}

function sendMessage(chat_id, text) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  UrlFetchApp.fetch(url, {
    method: 'post',
    payload: { chat_id: chat_id, text: text, parse_mode: 'Markdown' }
  });
}