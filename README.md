# UHRS Bot

This repository contains a Tampermonkey userscript that automates the monitoring of UHRS hits and provides notifications. The script can be configured to send notifications through system alerts or a Telegram bot. You can run this script on your local system or self-host it on a server.

## Features

- Automates Microsoft login process.
- Monitors UHRS tasks for new hits.
- Sends notifications via system alerts or a Telegram bot.
- Configurable to suit different usage scenarios.

## Prerequisites

- [Tampermonkey](https://www.tampermonkey.net/) browser extension installed.
- A Microsoft account.
- A Telegram bot (optional, for Telegram notifications).

## Installation

1. **Install Tampermonkey Extension:**
   - Add the Tampermonkey extension to your browser from [here](https://www.tampermonkey.net/).

2. **Log into Microsoft:**
   - Ensure you are logged into your Microsoft account.

3. **Load the Script:**
   - Create a new script in Tampermonkey and copy the provided code into the script editor.
   - Save the script.

## Configuration

Update the configuration section of the script with your details:

```javascript
const configuration = {
    email: "", // Replace with your Microsoft login email
    telegram: {
        botToken: "", // Replace with your Telegram bot token
        chatId: "", // Replace with your Telegram chat ID
        logId: "",
    },
    enableNotifications: false, // Set to true to enable notifications
    enableAPICalls: true, // Set to true to enable API calls
    enableLogs: true,
    taskCheckInterval: 100000, // Interval in milliseconds for checking tasks
};
```

## Configuration Parameters

- **email**: Your Microsoft login email.
- **telegram.botToken**: Your Telegram bot token (obtained from [BotFather](https://core.telegram.org/bots#6-botfather)).
- **telegram.chatId**: The chat ID where notifications will be sent.
- **telegram.logId**: The chat ID where logs will be sent (optional).
- **enableNotifications**: Set to `true` to enable browser notifications.
- **enableAPICalls**: Set to `true` to enable API calls to Telegram.
- **enableLogs**: Set to `true` to enable logging of bot running status.
- **taskCheckInterval**: Time interval (in milliseconds) for checking tasks on UHRS.

## Usage

1. **Run the Script:**
   - Navigate to `https://www.uhrs.ai/marketplace/tasks/all` to start the script.
   - The script will automatically run when you are on the UHRS tasks page.

2. **Receive Notifications:**
   - If notifications are enabled, you will receive updates about new UHRS hits via system notifications or Telegram messages.

## Running on a Server

To run the script on a server, follow these steps:

1. **Install Necessary Tools:**
   - Ensure you have Xvfb and a browser installed on your server.

2. **Run the Browser with Tampermonkey:**
   - Set up Tampermonkey in your browser before running the script.
   - Use the following commands to start the browser with the required display settings:

     ```bash
     sudo nohup Xvfb :10 -ac -screen 0 1024x768x24 &
     DISPLAY=:10 nohup BROWSER-COMMAND "https://www.uhrs.ai/marketplace/tasks/all" &
     ```

   - Replace `BROWSER-COMMAND` with the command to start your browser (e.g., `google-chrome` or `firefox`).

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Author

Shone Binu

Feel free to customize the script and contribute to the repository. Happy task monitoring!

---

This README provides a comprehensive guide for installing, configuring, and using the UHRS Bot script. Ensure to update the configuration section in the script with your specific details before running it.

