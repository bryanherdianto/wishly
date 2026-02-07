const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.generateContent = async (req, res) => {
	const { prompt, type } = req.body;

	if (!process.env.GEMINI_API_KEY) {
		return res.status(500).json({ message: "Gemini API key not configured." });
	}

	try {
		const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
		const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

		let systemPrompt = "";
		if (type === "title") {
			systemPrompt = "You are a creative writer. Generate ONE short, catchy greeting card title (max 5 words). Output ONLY the title text itself. Do not include any intro, outro, options, or quotes. Theme: ";
		} else {
			systemPrompt = "You are a creative writer. Generate ONE heartfelt greeting card message (max 30 words). Output ONLY the message text itself. Do not include any intro, outro, options, or quotes. Theme: ";
		}

		const result = await model.generateContent(systemPrompt + prompt);
		const response = await result.response;
		// Clean up any potential quotes or trailing whitespace the AI might include
		const text = response.text().trim().replace(/^["']|["']$/g, '');

		res.json({ text });
	} catch (error) {
		console.error("Gemini Error:", error);
		res.status(500).json({ message: "Failed to generate AI content." });
	}
};
