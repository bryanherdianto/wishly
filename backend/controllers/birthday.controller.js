const Birthday = require("../models/birthday.model");
const generateScreenshot = require("../utils/screenshot");

exports.getBirthdays = async (req, res) => {
	try {
		const cards = await Birthday.find({ userId: req.auth().userId }).sort({
			createdAt: -1,
		});
		res.json(cards);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.getBirthdayBySlug = async (req, res) => {
	try {
		const card = await Birthday.findOne({ slug: req.params.slug });
		if (!card)
			return res.status(404).json({ message: "Birthday card not found" });
		res.json(card);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.createBirthday = async (req, res) => {
	try {
		const newCard = new Birthday({ ...req.body, userId: req.auth().userId });
		const savedCard = await newCard.save();

		// We must await the screenshot on Vercel, otherwise it may not complete.
		console.log(`Generating screenshot for card: ${savedCard.slug}`);
		try {
			const url = await generateScreenshot(savedCard.slug, "birthday");
			if (url) {
				console.log(
					`Updating card ${savedCard.slug} with preview image: ${url}`,
				);
				await Birthday.findByIdAndUpdate(savedCard._id, { previewImage: url });
				// Update the object to return to user
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

exports.getBirthdayById = async (req, res) => {
	try {
		const card = await Birthday.findById(req.params.id);
		if (!card)
			return res.status(404).json({ message: "Birthday card not found" });
		res.json(card);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.updateBirthday = async (req, res) => {
	try {
		// Secure: Ensure only the owner can update the card
		const updatedCard = await Birthday.findOneAndUpdate(
			{ _id: req.params.id, userId: req.auth().userId },
			req.body,
			{ new: true },
		);
		if (!updatedCard)
			return res
				.status(404)
				.json({ message: "Birthday card not found or unauthorized" });
		res.json(updatedCard);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.deleteBirthday = async (req, res) => {
	try {
		// Secure: Ensure only the owner can delete the card
		const deletedCard = await Birthday.findOneAndDelete({
			_id: req.params.id,
			userId: req.auth().userId,
		});
		if (!deletedCard)
			return res
				.status(404)
				.json({ message: "Birthday card not found or unauthorized" });
		res.json({ message: "Birthday card deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
