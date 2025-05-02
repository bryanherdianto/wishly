"use client"

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react"
import { Link } from "react-router-dom"
import { FaBirthdayCake, FaTrash, FaMusic, FaCamera, FaEye, FaEdit, FaShare } from "react-icons/fa"
import { GiBalloons } from "react-icons/gi"
import { IoSparkles } from "react-icons/io5"
import { birthdayCardService, type BirthdayCard } from "../services/api"

interface FormData {
    name: string
    birthdate: string
    theme: string
    style: "balloons" | "confetti" | ""
    music: "yes" | "no"
    message: string
    photo?: File | null
    showAge: boolean
}

const themeStyles: Record<string, { bg: string; text: string; main: string }> = {
    pink: { bg: "bg-pink-100", text: "text-pink-800", main: "text-pink-700" },
    blue: { bg: "bg-blue-100", text: "text-blue-800", main: "text-blue-700" },
    purple: { bg: "bg-purple-100", text: "text-purple-800", main: "text-purple-700" },
    gold: { bg: "bg-yellow-100", text: "text-yellow-800", main: "text-yellow-700" },
    rainbow: {
        bg: "bg-gradient-to-r from-red-100 via-yellow-100 to-blue-100",
        text: "text-gray-800",
        main: "text-gray-700",
    },
}

const Manage = () => {
    const [cards, setCards] = useState<BirthdayCard[]>([])
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState<FormData>({
        name: "",
        birthdate: "",
        theme: "pink",
        style: "",
        music: "no",
        message: "",
        photo: null,
        showAge: false,
    })
    const [editingId, setEditingId] = useState<string | null>(null)

    useEffect(() => {
        fetchCards()
    }, [])

    const fetchCards = async () => {
        try {
            setLoading(true)
            const data = await birthdayCardService.getAll()
            setCards(data)
        } catch (error) {
            console.error("Error fetching cards:", error)
            alert("Failed to load birthday cards")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target

        if (target.type === "checkbox") {
            setForm((prev) => ({ ...prev, [target.name]: (target as HTMLInputElement).checked }))
        } else if (target.type === "file") {
            setForm((prev) => ({ ...prev, photo: (target as HTMLInputElement).files?.[0] || null }))
        } else {
            setForm((prev) => ({ ...prev, [target.name]: target.value }))
        }
    }

    const calculateAge = (birthdate: string) => {
        const birth = new Date(birthdate)
        const today = new Date()
        let age = today.getFullYear() - birth.getFullYear()
        const m = today.getMonth() - birth.getMonth()
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
        return age
    }

    const resetForm = () => {
        setForm({
            name: "",
            birthdate: "",
            theme: "pink",
            style: "",
            music: "no",
            message: "",
            photo: null,
            showAge: false,
        })
        setEditingId(null)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const formData = new FormData()
            formData.append("name", form.name)
            formData.append("birthdate", form.birthdate)
            formData.append("theme", form.theme)
            formData.append("style", form.style)
            formData.append("music", form.music)
            formData.append("message", form.message)
            formData.append("showAge", form.showAge.toString())

            if (form.photo) {
                formData.append("photo", form.photo)
            }

            if (editingId) {
                await birthdayCardService.update(editingId, formData)
                alert("Birthday card updated successfully!")
            } else {
                await birthdayCardService.create(formData)
                alert("Birthday card created successfully!")
            }

            resetForm()
            fetchCards()
        } catch (error) {
            console.error("Error saving card:", error)
            alert(editingId ? "Failed to update card" : "Failed to create card")
        }
    }

    const handleEdit = (card: BirthdayCard) => {
        setForm({
            name: card.name,
            birthdate: new Date(card.birthdate).toISOString().split("T")[0],
            theme: card.theme,
            style: card.style,
            music: card.music,
            message: card.message || "",
            photo: null,
            showAge: card.showAge,
        })
        setEditingId(card._id || null)
    }

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this birthday card?")) {
            try {
                await birthdayCardService.delete(id)
                alert("Birthday card deleted successfully!")
                fetchCards()
            } catch (error) {
                console.error("Error deleting card:", error)
                alert("Failed to delete card")
            }
        }
    }

    const handleCopyLink = (id: string) => {
        const url = `${window.location.origin}/birthday/${id}`
        navigator.clipboard.writeText(url)
        alert("Link copied to clipboard!")
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl h-auto p-2 font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                Birthday Page Creator
            </h1>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Form Section */}
                <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold mb-6 text-pink-600">
                        {editingId ? "Edit Birthday Page" : "Create New Birthday Page"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Birthday Person's Name"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
                                Birthdate
                            </label>
                            <input
                                type="date"
                                id="birthdate"
                                name="birthdate"
                                value={form.birthdate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                                Theme
                            </label>
                            <select
                                id="theme"
                                name="theme"
                                value={form.theme}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            >
                                <option value="pink">Pink</option>
                                <option value="blue">Blue</option>
                                <option value="purple">Purple</option>
                                <option value="gold">Gold</option>
                                <option value="rainbow">Rainbow</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                            <div className="flex gap-4">
                                {["balloons", "confetti"].map((style) => (
                                    <div
                                        key={style}
                                        className={`style-option border-2 p-3 rounded-lg cursor-pointer flex-1 ${form.style === style ? "border-pink-500 shadow-md" : "border-gray-200"
                                            }`}
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                style: style as "" | "balloons" | "confetti",
                                            }))
                                        }
                                    >
                                        <div className="text-center flex flex-col items-center justify-center w-full">
                                            {style === "balloons" ? (
                                                <GiBalloons className="text-xl text-pink-500 mb-1" />
                                            ) : (
                                                <IoSparkles className="text-xl text-yellow-500 mb-1" />
                                            )}
                                            <span className="text-sm capitalize">{style}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Include Music</label>
                            <div className="flex gap-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="music"
                                        value="yes"
                                        checked={form.music === "yes"}
                                        onChange={handleChange}
                                        className="text-pink-500 focus:ring-pink-500"
                                    />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="music"
                                        value="no"
                                        checked={form.music === "no"}
                                        onChange={handleChange}
                                        className="text-pink-500 focus:ring-pink-500"
                                    />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                Personal Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={3}
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Write a personal birthday message..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                                Photo (Optional)
                            </label>
                            <input
                                type="file"
                                id="photo"
                                name="photo"
                                accept="image/*"
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="showAge"
                                name="showAge"
                                checked={form.showAge}
                                onChange={handleChange}
                                className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                            />
                            <label htmlFor="showAge" className="ml-2 block text-sm text-gray-700">
                                Show age on birthday page
                            </label>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg flex justify-center items-center hover:opacity-90 transition-opacity"
                            >
                                <FaBirthdayCake className="mr-2" />
                                {editingId ? "Update Birthday Page" : "Create Birthday Page"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Cards Section */}
                <div className="w-full lg:w-1/2">
                    <h2 className="text-2xl font-semibold mb-6 text-blue-600">Your Birthday Pages</h2>

                    {loading ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading birthday pages...</p>
                        </div>
                    ) : cards.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow">
                            <FaBirthdayCake className="text-4xl text-gray-300 mb-4 mx-auto" />
                            <h3 className="text-lg font-medium text-gray-700">No birthday pages yet</h3>
                            <p className="text-gray-500 mt-1 p-2">Create your first birthday page using the form</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cards.map((card) => {
                                const theme = themeStyles[card.theme]
                                const formattedDate = new Date(card.birthdate).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })
                                const age = calculateAge(card.birthdate)

                                return (
                                    <div
                                        key={card._id}
                                        className={`birthday-card p-6 rounded-xl relative group mb-4 shadow-md bg-white border-l-4 ${card.theme === "pink"
                                                ? "border-pink-500"
                                                : card.theme === "blue"
                                                    ? "border-blue-500"
                                                    : card.theme === "purple"
                                                        ? "border-purple-500"
                                                        : card.theme === "gold"
                                                            ? "border-yellow-500"
                                                            : "border-gradient-to-r from-red-500 via-yellow-500 to-blue-500"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className={`text-xl font-bold ${theme.main}`}>{card.name}'s Birthday</h3>
                                                <p className="text-gray-600">{formattedDate}</p>
                                                <p className="mt-2 text-gray-800 line-clamp-2">
                                                    {card.message || "Wishing you a wonderful birthday!"}
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(card)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(card._id!)}
                                                    className="text-red-500 hover:text-red-700"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>

                                        {card.photoUrl && (
                                            <div className="mt-4 flex items-center">
                                                <div className={`w-10 h-10 rounded-full ${theme.bg} flex items-center justify-center mr-2`}>
                                                    <FaCamera className={theme.main} />
                                                </div>
                                                <span className="text-sm text-gray-500">Photo uploaded</span>
                                            </div>
                                        )}

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${theme.bg} ${theme.text}`}
                                            >
                                                {card.theme} Theme
                                            </span>
                                            {card.style && (
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                                                    {card.style === "balloons" ? (
                                                        <GiBalloons className="inline mr-1" />
                                                    ) : (
                                                        <IoSparkles className="inline mr-1" />
                                                    )}
                                                    {card.style}
                                                </span>
                                            )}
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                {card.music === "yes" ? (
                                                    <>
                                                        <FaMusic className="inline mr-1" /> Music
                                                    </>
                                                ) : (
                                                    "No Music"
                                                )}
                                            </span>
                                            {card.showAge && (
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                                    Age: {age}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-4 flex justify-end space-x-2">
                                            <Link
                                                to={`/birthday/${card._id}`}
                                                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                                                title="View"
                                            >
                                                <FaEye className="mr-1" /> View
                                            </Link>
                                            <button
                                                onClick={() => handleCopyLink(card._id!)}
                                                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                                                title="Share"
                                            >
                                                <FaShare className="mr-1" /> Share
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Manage
