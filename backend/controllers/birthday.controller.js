const Birthday = require("../models/birthday.model");

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
		const updatedCard = await Birthday.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true },
		);
		if (!updatedCard)
			return res.status(404).json({ message: "Birthday card not found" });
		res.json(updatedCard);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.deleteBirthday = async (req, res) => {
	try {
		const deletedCard = await Birthday.findByIdAndDelete(req.params.id);
		if (!deletedCard)
			return res.status(404).json({ message: "Birthday card not found" });
		res.json({ message: "Birthday card deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
