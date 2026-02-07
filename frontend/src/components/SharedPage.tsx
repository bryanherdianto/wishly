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
					const audio = new Audio(`/musics/${result.music}.mp3`);
					audio.loop = true;
					audioRef.current = audio;

					const attemptPlay = () => {
						if (audioRef.current && audioRef.current.paused) {
							audioRef.current.play().catch(() => {
								console.log("Music playback is not played automatically.");
							});
						}
					};

					attemptPlay();
					window.addEventListener("click", attemptPlay, { once: true });
					window.addEventListener("touchstart", attemptPlay, { once: true });
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
			window.removeEventListener("click", () => {});
			window.removeEventListener("touchstart", () => {});
		};
	}, [slug, isBirthday]);

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

	return <div className="relative min-h-screen">{renderTemplate()}</div>;
}

export default SharedPage;
