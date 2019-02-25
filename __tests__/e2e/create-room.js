const puppeteer = require('puppeteer');
const app = require('../../dist/app');

let browser;
let page;
let server;

beforeAll(async () => {
	process.env.BROWSER_WS_API_URL = 'ws://fluxxchat-palvelin.herokuapp.com/';

	browser = await puppeteer.launch({
		headless: false,
		slowMo: 10
	});
	page = await browser.newPage();

	server = app.listen(3002);
});

afterAll(() => {
	browser.close();
	server.close();
});

async function createRoom() {
	await page.goto('http://localhost:3002/');

	await page.waitForSelector('input[type=text]');
	await page.click('input[type=text]');
	await page.type('input[type=text]', 'test');
	await page.click('button[name=submit]');

	await page.waitForSelector('input[name=messageInput]');
}

describe('create room', () => {
	test('send and receive message', async () => {
		await createRoom();

		await page.click('input[name=messageInput]');
		await page.type('input[name=messageInput]', 'test message');
		await page.click('button[name=messageSend]');

		await page.waitFor(200);

		const nickname = await page.$eval('.messages div:nth-child(2) div:first-child div:nth-child(1)', html => html.innerHTML);
		const message = await page.$eval('.messages div:nth-child(2) div:first-child div:nth-child(2) div:first-child', html => html.innerHTML);
		expect(nickname).toBe('test');
		expect(message).toBe('test message');
	}, 16000);
});
