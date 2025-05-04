"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { faBirthdayCake } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { birthdayCardService, type BirthdayCard } from "../services/api"
import { FaArrowLeft, FaShare } from "react-icons/fa"

interface BirthdayProps {
  name?: string
  age?: number
  photoUrl?: string
  musicUrl?: string
  theme?: string
  style?: string
  message?: string
}

const Birthday: React.FC<BirthdayProps> = ({
  name: propName,
  age: propAge,
  photoUrl: propPhotoUrl,
  musicUrl: propMusicUrl,
  theme: propTheme,
  style: propStyle,
  message: propMessage
}) => {
  const birthdayPageRef = useRef<HTMLDivElement>(null)
  const { id } = useParams<{ id: string }>()
  const [card, setCard] = useState<BirthdayCard | null>(null)
  const [loading, setLoading] = useState(!!id)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCard = async () => {
      if (!id) return
      try {
        setLoading(true)
        const data = await birthdayCardService.getById(id)
        setCard(data)
      } catch (err) {
        console.error("Error fetching birthday card:", err)
        setError("Failed to load the birthday page. It may have been deleted or doesn't exist.")
      } finally {
        setLoading(false)
      }
    }

    fetchCard()
  }, [id])

  const calculateAge = (birthdate: string) => {
    const birth = new Date(birthdate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert("Link copied to clipboard!")
  }

  const name = card?.name || propName
  const age = card ? (card.showAge ? calculateAge(card.birthdate) : undefined) : propAge
  const photoUrl = card?.photoUrl || propPhotoUrl
  const musicUrl = card ? (card.music === "yes" ? "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" : undefined) : propMusicUrl
  const theme = card?.theme || propTheme
  const style = card?.style || propStyle
  const message = card?.message || propMessage

  const themeColors = {
    pink: {
      primary: "from-pink-300 to-pink-500",
      secondary: "text-pink-800",
      accent: "text-yellow-300",
    },
    blue: {
      primary: "from-blue-300 to-blue-500",
      secondary: "text-blue-800",
      accent: "text-yellow-300",
    },
    purple: {
      primary: "from-purple-300 to-purple-500",
      secondary: "text-purple-800",
      accent: "text-yellow-300",
    },
    gold: {
      primary: "from-yellow-300 to-yellow-500",
      secondary: "text-yellow-800",
      accent: "text-white",
    },
    rainbow: {
      primary: "from-red-300 via-yellow-300 to-blue-300",
      secondary: "text-gray-800",
      accent: "text-purple-500",
    },
  }

  const currentTheme = themeColors[theme as keyof typeof themeColors] || themeColors.pink

  useEffect(() => {
    if (!birthdayPageRef.current) return

    const existingBalloons = birthdayPageRef.current.querySelectorAll(".balloon")
    const existingConfetti = birthdayPageRef.current.querySelectorAll(".confetti-piece")

    existingBalloons.forEach((balloon) => balloon.remove())
    existingConfetti.forEach((confetti) => confetti.remove())

    if (style === "balloons") {
      const balloonColors = ["bg-red-500", "bg-yellow-400", "bg-blue-400", "bg-green-400", "bg-purple-400"]
      for (let i = 0; i < 20; i++) {
        const balloon = document.createElement("div")
        balloon.className = `balloon ${balloonColors[i % balloonColors.length]}`

        const left = Math.random() * 100
        const delay = Math.random() * 6
        const duration = 5 + Math.random() * 4
        const topStart = 70 + Math.random() * 30

        balloon.style.left = `${left}%`
        balloon.style.animationDelay = `${delay}s`
        balloon.style.animationDuration = `${duration}s`
        balloon.style.top = `${topStart}%`

        birthdayPageRef.current.appendChild(balloon)
      }
    } else if (style === "confetti") {
      const confettiColors = [
        "bg-red-500",
        "bg-yellow-400",
        "bg-blue-400",
        "bg-green-400",
        "bg-purple-400",
        "bg-pink-400",
      ]
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div")
        confetti.className = `confetti-piece ${confettiColors[i % confettiColors.length]}`

        const left = Math.random() * 100
        const delay = Math.random() * 5
        const duration = 3 + Math.random() * 4
        const size = 8 + Math.random() * 8
        const shape = Math.random() > 0.5 ? "rounded-full" : ""

        confetti.className += `${shape}`
        confetti.style.left = `${left}%`
        confetti.style.width = `${size}px`
        confetti.style.height = `${size}px`
        confetti.style.animationDelay = `${delay}s`
        confetti.style.animationDuration = `${duration}s`

        birthdayPageRef.current.appendChild(confetti)
      }
    }

    const candles = document.querySelectorAll(".cake-candle")
    const interval = setInterval(() => {
      candles.forEach((candle) => {
        const flicker = Math.random() * 0.5 + 0.5
          ; (candle as HTMLElement).style.opacity = flicker.toString()
      })
    }, 300)

    return () => clearInterval(interval)
  }, [style])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading birthday page...</p>
        </div>
      </div>
    )
  }

  if (id && (error || !card)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Oops!</h2>
          <p className="text-gray-700 mb-6">{error || "Birthday page not found"}</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {id && (
        <div className="z-50 flex space-x-2 mb-2">
          <Link
            to="/manage"
            className="bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
          >
            <FaArrowLeft className="text-gray-700" />
          </Link>
          <button
            onClick={handleShare}
            className="bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all"
          >
            <FaShare className="text-gray-700" />
          </button>
        </div>
      )}

      <div
        ref={birthdayPageRef}
        className={`birthday-page min-h-screen flex flex-col items-center justify-center rounded-lg p-8 bg-gradient-to-br ${currentTheme.primary} relative overflow-hidden`}
      >
        <div className="relative z-10 text-center max-w-4xl mx-auto mt-9">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-bounce">
            Happy Birthday <br /><span className={currentTheme.accent}>{name}</span>!
            <FontAwesomeIcon icon={faBirthdayCake} className="ml-4" />
          </h1>

          {age && (
            <h2 className="text-3xl md:text-5xl font-semibold text-white mb-8">
              You're now <span className={currentTheme.accent}>{age}</span> years old!
            </h2>
          )}

          <div className="mx-auto mb-10 w-48 h-48 md:w-64 md:h-64 photo-frame rounded-full overflow-hidden bg-white p-1">
            <img
              src={photoUrl || "https://i.pravatar.cc/300"}
              alt={`${name}'s Photo`}
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div className="bg-white bg-opacity-90 rounded-xl p-6 mb-8">
            <p className={`text-xl md:text-2xl ${currentTheme.secondary} font-medium`}>{message}</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="flex justify-center space-x-4">
                <div className="cake-candle"></div>
                <div className="cake-candle"></div>
                <div className="cake-candle"></div>
              </div>
              <div className="w-48 h-20 bg-gradient-to-b from-amber-300 to-amber-600 rounded-t-full"></div>
              <div className="w-48 h-10 bg-gradient-to-b from-amber-200 to-amber-500 rounded-lg"></div>
            </div>
          </div>

          {musicUrl && (
            <div className="bg-white bg-opacity-90 rounded-xl p-4 inline-block">
              <audio controls autoPlay loop className="mx-auto">
                <source src={musicUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <p className={currentTheme.secondary + " mt-2"}>Enjoy this festive birthday song!</p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes confetti {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .balloon {
          position: absolute;
          width: 50px;
          height: 70px;
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
        .balloon:before {
          content: "";
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 15px;
          background: rgba(0,0,0,0.2);
        }
        .confetti-piece {
          position: absolute;
          width: 12px;
          height: 12px;
          opacity: 0;
          animation: confetti 5s ease-in-out infinite;
        }
        .photo-frame {
          border: 10px solid white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }
        .photo-frame:hover {
          transform: scale(1.05) rotate(2deg);
        }
        .cake-candle {
          position: relative;
          width: 6px;
          height: 30px;
          background: linear-gradient(to bottom, #f5d742, #f5a742);
          border-radius: 3px;
        }
        .cake-candle:after {
          content: "";
          position: absolute;
          top: -5px;
          left: -1px;
          width: 8px;
          height: 10px;
          background: #ff5722;
          border-radius: 50% 50% 20% 20%;
          box-shadow: 0 0 10px #ff5722, 0 0 20px #ff5722;
        }
      `}</style>
    </div>
  )
}

export default Birthday
