const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configure Cloudinary if environment variables are present
if (process.env.CLOUDINARY_URL) {
	// Uses the CLOUDINARY_URL from .env automatically
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});
}

/**
 * Generates a screenshot of a shared page and uploads it to Cloudinary.
 * @param {string} slug - The unique slug of the card.
 * @param {string} category - 'birthday' or 'valentine'.
 * @returns {Promise<string|null>} - The URL of the uploaded image.
 */
const generateScreenshot = async (slug, category) => {
	// Prevent running if no Cloudinary config exists
	if (!process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_CLOUD_NAME) {
		console.warn("Screenshot generation skipped: Cloudinary not configured.");
		return null;
	}

	let browser;
	try {
		browser = await puppeteer.launch({
			args: chromium.args,
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath(),
			headless: chromium.headless,
			ignoreHTTPSErrors: true,
		});

		const page = await browser.newPage();
		await page.setViewport({ width: 1200, height: 630 });

		// Use the frontend URL from environment or fallback to localhost
		const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
		const targetUrl = `${frontendBaseUrl}/${category}/${slug}`;

		console.log(`Taking screenshot of: ${targetUrl}`);

		// Navigate to the page
		// Use 'networkidle2' instead of 'networkidle0' for dev environments (Vite HMR can block networkidle0)
		try {
			await page.goto(targetUrl, {
				waitUntil: ["networkidle2", "domcontentloaded"],
				timeout: 20000,
			});
		} catch (err) {
			console.warn(
				`Navigation timeout for ${targetUrl}, attempting to screenshot anyway...`,
			);
		}

		// Wait an extra 3 seconds for animations (Framer Motion) and images to settle
		await new Promise((resolve) => setTimeout(resolve, 3000));

		const imageBuffer = await page.screenshot({
			type: "jpeg",
			quality: 80,
		});

		console.log(`Screenshot taken for ${slug}, uploading to Cloudinary...`);

		// Upload to Cloudinary using a stream
		const uploadResult = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder: "wishly_previews",
					public_id: `${category}_${slug}`,
					overwrite: true,
				},
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				},
			);
			uploadStream.end(imageBuffer);
		});

		console.log(`Screenshot uploaded successfully: ${uploadResult.secure_url}`);
		return uploadResult.secure_url;
	} catch (error) {
		console.error("Screenshot generation failed:", error);
		return null;
	} finally {
		if (browser) {
			await browser.close();
		}
	}
};

module.exports = generateScreenshot;
