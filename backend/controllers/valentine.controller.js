const Valentine = require("../models/valentine.model");

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
		const updatedCard = await Valentine.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true },
		);
		if (!updatedCard)
			return res.status(404).json({ message: "Valentine card not found" });
		res.json(updatedCard);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.deleteValentine = async (req, res) => {
	try {
		const deletedCard = await Valentine.findByIdAndDelete(req.params.id);
		if (!deletedCard)
			return res.status(404).json({ message: "Valentine card not found" });
		res.json({ message: "Valentine card deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
