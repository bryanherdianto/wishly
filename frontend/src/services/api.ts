import axios from "axios"

const API_URL = "https://hbdgen.onrender.com/api"

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

export const birthdayCardService = {
  getAll: async (): Promise<BirthdayCard[]> => {
    const response = await api.get("/birthday-cards")
    return response.data
  },
  getById: async (id: string): Promise<BirthdayCard> => {
    const response = await api.get(`/birthday-cards/${id}`)
    return response.data
  },
  create: async (card: FormData): Promise<BirthdayCard> => {
    const response = await axios.post(`${API_URL}/birthday-cards`, card, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
  update: async (id: string, card: FormData): Promise<BirthdayCard> => {
    const response = await axios.put(`${API_URL}/birthday-cards/${id}`, card, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/birthday-cards/${id}`)
  },
}
