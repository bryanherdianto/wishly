import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
	birthdayCardService,
	valentineCardService,
	BirthdayCard,
	ValentineCard,
} from "../services/api";
import CardStack from "./templates/CardStackBirthday";
import StickyPixel from "./templates/StickyPixelBirthday";
import SimpleValentine from "./templates/SimpleValentine";
import NotFound from "./NotFound";

function SharedPage() {
	const { slug } = useParams<{ slug: string }>();
	const location = useLocation();
	const [data, setData] = useState<BirthdayCard | ValentineCard | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const isBirthday = location.pathname.startsWith("/birthday/");

	useEffect(() => {
		const fetchData = async () => {
			if (!slug) return;
			try {
				setLoading(true);
				let result;
				if (isBirthday) {
					result = await birthdayCardService.getBySlug(slug);
				} else {
					result = await valentineCardService.getBySlug(slug);
				}
				setData(result);

				// Cleanup audio if exists
				if (audioRef.current) {
					audioRef.current.pause();
					audioRef.current = null;
				}

				// Prepare audio if music is set
				if (result.music && result.music !== "none") {
					const category = isBirthday ? "birthday" : "valentine";
					const audio = new Audio(`/${category}/${result.music}.mp3`);
					audio.loop = true;
					audioRef.current = audio;
				}
			} catch (err) {
				console.error("Error fetching shared page:", err);
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		fetchData();

		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
			}
		};
	}, [slug, isBirthday]);

	const handlePlayMusic = () => {
		if (audioRef.current) {
			audioRef.current
				.play()
				.then(() => setIsPlaying(true))
				.catch((err) => console.log("Audio playback error:", err));
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error || !data) {
		return <NotFound />;
	}

	// Dynamic Template Picker
	const renderTemplate = () => {
		if (isBirthday) {
			const bdayData = data as BirthdayCard;
			switch (bdayData.style) {
				case "card-stack":
					return <CardStack data={bdayData} />;
				case "sticky-pixel":
					return <StickyPixel data={bdayData} />;
				default:
					return <CardStack data={bdayData} />;
			}
		} else {
			const valData = data as ValentineCard;
			// For Valentine, we currently only have simple-valentine but we can expand
			return <SimpleValentine data={valData} />;
		}
	};

	return (
		<div className="relative min-h-screen">
			{!isPlaying && data.music && data.music !== "none" && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
					<button
						onClick={handlePlayMusic}
						className="px-8 py-4 bg-white text-black rounded-full font-bold text-xl shadow-2xl hover:scale-105 transition-transform animate-bounce"
					>
						Tap to open your surprise 🎁
					</button>
				</div>
			)}

			{renderTemplate()}

			{isPlaying && (
				<button
					onClick={() => {
						if (audioRef.current) {
							if (audioRef.current.paused) {
								audioRef.current.play();
							} else {
								audioRef.current.pause();
							}
						}
					}}
					className="fixed bottom-6 right-6 z-50 p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white/40 transition-colors"
				>
					🎵
				</button>
			)}
		</div>
	);
}

export default SharedPage;
