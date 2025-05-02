import axios from "axios"

// Define the base URL for API requests
const API_URL = "http://localhost:5000/api"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export interface BirthdayCard {
  _id?: string
  name: string
  birthdate: string
  theme: string
  style: "balloons" | "confetti" | ""
  music: "yes" | "no"
  message: string
  photoUrl?: string
  showAge: boolean
  createdAt?: Date
}

// Birthday card service
export const birthdayCardService = {
  // Get all birthday cards
  getAll: async (): Promise<BirthdayCard[]> => {
    const response = await api.get("/birthday-cards")
    return response.data
  },

  // Get birthday card by ID
  getById: async (id: string): Promise<BirthdayCard> => {
    const response = await api.get(`/birthday-cards/${id}`)
    return response.data
  },

  // Create new birthday card
  create: async (card: FormData): Promise<BirthdayCard> => {
    const response = await axios.post(`${API_URL}/birthday-cards`, card, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  // Update birthday card
  update: async (id: string, card: FormData): Promise<BirthdayCard> => {
    const response = await axios.put(`${API_URL}/birthday-cards/${id}`, card, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  // Delete birthday card
  delete: async (id: string): Promise<void> => {
    await api.delete(`/birthday-cards/${id}`)
  },
}
