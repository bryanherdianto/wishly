const mongoose = require("mongoose");
const crypto = require("crypto");

const BirthdaySchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
		index: true,
	},
	style: {
		type: String,
		enum: ["card-stack", "sticky-pixel"],
	},
	firstname: {
		type: String,
		required: true,
		trim: true,
	},
	lastname: {
		type: String,
		required: true,
		trim: true,
	},
	slug: {
		type: String,
		unique: true,
		index: true,
	},
	music: {
		type: String,
		enum: [
			"none",
			"emotional-uplifting",
			"melancholic-nostalgic",
			"piano-background",
			"piano-moment",
			"sentimental-leger",
			"sentimental-mellow",
		],
		default: "none",
	},
	cards: [
		{
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
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

BirthdaySchema.pre("save", async function (next) {
	if (
		this.isModified("firstname") ||
		this.isModified("lastname") ||
		!this.slug
	) {
		const baseSlug = `${this.firstname}-${this.lastname}`
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

module.exports = mongoose.model("Birthday", BirthdaySchema);
