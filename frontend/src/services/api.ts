import axios from "axios";

const API_URL = import.meta.env.PROD
	? "https://wishly.onrender.com"
	: "http://localhost:5000";

const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export interface BirthdayCard {
	_id?: string;
	userId?: string;
	firstname: string;
	lastname: string;
	style: string;
	slug?: string;
	previewImage?: string;
	music: string;
	cards: {
		title: string;
		message: string;
	}[];
	createdAt?: string;
}

export interface ValentineCard {
	_id?: string;
	userId?: string;
	nickname: string;
	style: string;
	slug?: string;
	previewImage?: string;
	music: string;
	card: {
		title: string;
		message: string;
	};
	createdAt?: string;
}

export const setApiToken = (token: string | null) => {
	if (token) {
		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	} else {
		delete api.defaults.headers.common["Authorization"];
	}
};

export const birthdayCardService = {
	getAll: async (): Promise<BirthdayCard[]> => {
		const response = await api.get("/birthday/cards");
		return response.data;
	},
	getBySlug: async (slug: string): Promise<BirthdayCard> => {
		const response = await api.get(`/birthday/slug/${slug}`);
		return response.data;
	},
	create: async (card: Omit<BirthdayCard, "_id">): Promise<BirthdayCard> => {
		const response = await api.post("/birthday/cards", card);
		return response.data;
	},
	update: async (
		slug: string,
		card: Partial<BirthdayCard>,
	): Promise<BirthdayCard> => {
		const response = await api.put(`/birthday/cards/${slug}`, card);
		return response.data;
	},
	delete: async (slug: string): Promise<void> => {
		await api.delete(`/birthday/cards/${slug}`);
	},
};

export const valentineCardService = {
	getAll: async (): Promise<ValentineCard[]> => {
		const response = await api.get("/valentine/cards");
		return response.data;
	},
	getBySlug: async (slug: string): Promise<ValentineCard> => {
		const response = await api.get(`/valentine/slug/${slug}`);
		return response.data;
	},
	create: async (card: Omit<ValentineCard, "_id">): Promise<ValentineCard> => {
		const response = await api.post("/valentine/cards", card);
		return response.data;
	},
	update: async (
		slug: string,
		card: Partial<ValentineCard>,
	): Promise<ValentineCard> => {
		const response = await api.put(`/valentine/cards/${slug}`, card);
		return response.data;
	},
	delete: async (slug: string): Promise<void> => {
		await api.delete(`/valentine/cards/${slug}`);
	},
};

export const aiService = {
	generate: async (
		prompt: string,
		type: "title" | "message",
	): Promise<string> => {
		const response = await api.post("/ai/generate", { prompt, type });
		return response.data.text;
	},
};
