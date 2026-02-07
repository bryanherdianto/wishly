const mongoose = require("mongoose");
const crypto = require("crypto");

const ValentineSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
		index: true,
	},
	nickname: {
		type: String,
		required: true,
		trim: true,
	},
	style: {
		type: String,
		enum: ["card-stack", "sticky-pixel", "simple-valentine"],
	},
	slug: {
		type: String,
		unique: true,
		index: true,
	},
	previewImage: {
		type: String,
		default: "",
	},
	music: {
		type: String,
		enum: [
			"none",
			"field-grass",
			"romantic-hopeful",
			"romantic-love",
			"romantic-wedding",
		],
		default: "none",
	},
	card: {
		title: {
			type: String,
			required: true,
			trim: true,
		},
		message: {
			type: String,
			required: true,
			trim: true,
		},
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

ValentineSchema.pre("save", async function (next) {
	if (this.isModified("nickname") || !this.slug) {
		const baseSlug = `${this.nickname}`
			.toLowerCase()
			.replace(/[^a-z0-9]/g, "-")
			.replace(/-+/g, "-")
			.replace(/^-|-$/g, "");

		// Add a short random suffix to ensure uniqueness across different users
		const suffix = crypto.randomBytes(3).toString("hex");
		this.slug = `${baseSlug}-${suffix}`;
	}
	next();
});

module.exports = mongoose.model("Valentine", ValentineSchema);
