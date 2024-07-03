// ==UserScript==
s; // @name         Find New Hits and Automation Scripts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automate tasks and monitor UHRS hits for updates
// @author       Shone Binu
// @match        https://www.uhrs.ai/*
// @match        https://login.microsoftonline.com/common/oauth2/v2.0/*
// @run-at       document-end
// ==/UserScript==

// Configuration
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
	taskCheckInterval: 10000, // Interval in milliseconds for checking tasks
};

async function sendTelegramMessage(botToken, chatId, messageText) {
	const response = await fetch(
		`https://api.telegram.org/bot${botToken}/sendMessage`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				chat_id: chatId,
				text: messageText,
				parse_mode: "HTML",
			}),
		},
	);

	return response.json(); // Assuming Telegram API responds with JSON
}

function showNotification(messageText) {
	if (Notification.permission === "granted") {
		new Notification("New UHRS Task", {
			body: messageText,
		});
	}
}

async function main() {
	const oldHits = JSON.parse(localStorage.getItem("hitsState")) || [];
	const currHits = getHits() || [];
	console.log(oldHits, currHits);

	for (const hit of currHits) {
		const isNewHit = !oldHits.find((oldhit) => oldhit.title === hit.title);

		// Skip, if less than 30 hits
		if (isNewHit) {
			if (!(hit.hits.includes(".") || hit.hits.includes("k"))) {
				const stringPay = hit.hits.match(/\d/g).join("");
				if (Number(stringPay) < 30) {
					continue;
				}
			}
		}

		if (isNewHit) {
			const messageText = `<b>${hit.title}</b>\n\nHits: ${hit.hits}\nPay: ${hit.pay}`;

			if (configuration.enableAPICalls) {
				await sendTelegramMessage(
					configuration.telegram.botToken,
					configuration.telegram.chatId,
					messageText,
				);
			}

			if (configuration.enableNotifications) {
				showNotification(messageText);
			}
		}
	}

	// Send curr hits and old hits in logs
	await sendTelegramMessage(
		configuration.telegram.botToken,
		configuration.telegram.logId,
		`Old Hits: ${JSON.stringify(oldHits)}\nNew Hits: ${JSON.stringify(
			currHits,
		)}`,
	);

	localStorage.setItem("hitsState", JSON.stringify(currHits));

	setTimeout(() => {
		location.reload();
	}, 1000);
}

function getHits() {
	const currHits = [];
	const cards = document.querySelectorAll(".tasks-as-grid-grid > div");

	if (!cards || cards.length === 0) {
		location.reload();
	}

	for (const card of cards) {
		const titleElement = card.querySelector(".task-card__title__caption");

		if (!titleElement || !titleElement.innerText) {
			location.reload();
		}

		const title = titleElement.innerText;
		let pay;
		let hits;

		const badges = card.querySelectorAll(
			".task-card__body .task-card__body__badges-row__badge",
		);

		for (const badge of badges) {
			if (badge.textContent.includes("$")) pay = badge.innerText;
			if (badge.textContent.includes("HITs")) hits = badge.innerText;
		}

		currHits.push({ title, hits, pay });
	}
	return currHits;
}

(async () => {
	try {
		// Send Bot running confirmation
		if (configuration.enableLogs) {
			sendTelegramMessage(
				configuration.telegram.botToken,
				configuration.telegram.logId,
				"Browser is up and running",
			);
		}

		// Microsoft Login Automation
		if (
			window.location.href.startsWith(
				"https://login.microsoftonline.com/common/oauth2/v2.0/",
			)
		) {
			window.addEventListener("load", () => {
				setTimeout(() => {
					const emailInput = document.querySelector("#i0116");

					if (emailInput) {
						emailInput.value = configuration.email;
						emailInput.dispatchEvent(new Event("input", { bubbles: true }));

						setTimeout(() => {
							const nextButton = document.querySelector("#idSIButton9");
							if (nextButton) {
								nextButton.click();
								console.log("Clicked Next button.");
							}
						}, 1000);
					}
				}, 3000);
			});
		}

		// Login if UHRS is logged out
		if (
			window.location.href ===
			"https://www.uhrs.ai/uhrs/?returnUrl=/marketplace/tasks/all"
		) {
			window.addEventListener("load", () => {
				setTimeout(() => {
					document
						.querySelector(
							"#root > div > div.home__hero > div.home__hero__content > div > main > button",
						)
						.click();
				}, 1000);
			});
		}

		// Find new Hits
		if (window.location.href === "https://www.uhrs.ai/marketplace/tasks/all") {
			if (
				configuration.enableNotifications &&
				Notification.permission !== "granted"
			) {
				await Notification.requestPermission();
			}
			window.addEventListener("load", () => {
				setTimeout(main, configuration.taskCheckInterval);
			});
		}
	} catch (error) {
		console.error("An error occured: ", error);
		const errorMessage = `An error occured: ${error.message}\n${error.stack}`;
		await sendTelegramMessage(
			configuration.telegram.botToken,
			configuration.telegram.logId,
			errorMessage,
		);
		location.reload();
	}
})();
