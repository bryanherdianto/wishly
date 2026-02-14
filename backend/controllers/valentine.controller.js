const Valentine = require("../models/valentine.model");
const generateScreenshot = require("../utils/screenshot");

exports.getValentines = async (req, res) => {
	try {
		const cards = await Valentine.find({ userId: req.auth().userId }).sort({
			createdAt: -1,
		});
		res.json(cards);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.createValentine = async (req, res) => {
	try {
		const newCard = new Valentine({
			...req.body,
			userId: req.auth().userId,
		});
		const savedCard = await newCard.save();

		// We must await the screenshot on Vercel, otherwise it may not complete.
		console.log(`Generating screenshot for valentine: ${savedCard.slug}`);
		try {
			const url = await generateScreenshot(savedCard.slug, "valentine");
			if (url) {
				console.log(
					`Updating valentine ${savedCard.slug} with preview image: ${url}`,
				);
				await Valentine.findByIdAndUpdate(savedCard._id, { previewImage: url });
				// Update object to return to user
				savedCard.previewImage = url;
			}
		} catch (err) {
			console.error(`Screenshot error for ${savedCard.slug}:`, err);
		}

		res.status(201).json(savedCard);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getValentineBySlug = async (req, res) => {
	try {
		const card = await Valentine.findOne({ slug: req.params.slug });
		if (!card)
			return res.status(404).json({ message: "Valentine card not found" });
		res.json(card);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.getValentineById = async (req, res) => {
	try {
		const card = await Valentine.findById(req.params.id);
		if (!card)
			return res.status(404).json({ message: "Valentine card not found" });
		res.json(card);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.updateValentine = async (req, res) => {
	try {
		// Secure: Ensure only the owner can update the card
		const updatedCard = await Valentine.findOneAndUpdate(
			{ _id: req.params.id, userId: req.auth().userId },
			req.body,
			{ new: true },
		);
		if (!updatedCard)
			return res
				.status(404)
				.json({ message: "Valentine card not found or unauthorized" });
		res.json(updatedCard);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.deleteValentine = async (req, res) => {
	try {
		// Secure: Ensure only the owner can delete the card
		const deletedCard = await Valentine.findOneAndDelete({
			_id: req.params.id,
			userId: req.auth().userId,
		});
		if (!deletedCard)
			return res
				.status(404)
				.json({ message: "Valentine card not found or unauthorized" });
		res.json({ message: "Valentine card deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
