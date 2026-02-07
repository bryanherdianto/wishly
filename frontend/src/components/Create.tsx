import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	birthdayCardService,
	valentineCardService,
	aiService,
	setApiToken,
} from "../services/api";
import Modal from "./Modal";

const ImageSlider = ({
	images,
	link,
	isActive,
	title,
}: {
	images: { src: string; alt: string }[];
	link: string;
	isActive: boolean;
	title?: string;
}) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	return (
		<div className="flex flex-col items-center gap-1 w-full max-w-2xl mx-auto">
			{/* Image Container */}
			<div className="relative w-full aspect-video overflow-hidden rounded-2xl bg-white">
				<div
					className="flex transition-transform duration-500 ease-out h-full"
					style={{ transform: `translateX(-${currentIndex * 100}%)` }}
				>
					{images.map((img, idx) => (
						<div key={idx} className="min-w-full h-full">
							<img
								src={img.src}
								alt={img.alt}
								className="w-full h-full object-cover"
							/>
						</div>
					))}
				</div>

				{/* Selection Border Overlay */}
				<div
					className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ${
						isActive ? "ring-4 ring-inset ring-blue-500" : ""
					}`}
				/>

				{/* Preview Button */}
				<Link
					to={link}
					className="absolute top-3 right-3 p-1 bg-white rounded-full transition-all border border-stone-200"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="text-stone-700 hover:scale-110 duration-200"
					>
						<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
						<circle cx="12" cy="12" r="3" />
					</svg>
				</Link>
			</div>

			<div className="flex justify-between items-center w-full px-4">
				{/* Title */}
				<div className="bg-white text-center font-bold">{title}</div>
				{/* Dot Indicators */}
				<div className="flex gap-1">
					{images.map((_, idx) => (
						<button
							key={idx}
							onClick={() => setCurrentIndex(idx)}
							className={`h-2 w-2 rounded-full duration-500 transition-all ${
								currentIndex === idx
									? "bg-blue-600 w-6"
									: "bg-stone-300 hover:bg-stone-400"
							}`}
							aria-label={`Go to slide ${idx + 1}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

function Create() {
	const [selectedSection, setSelectedSection] = useState<number>(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const { getToken } = useAuth();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		cards: [{ title: "", message: "" }],
		music: "none",
		style: "card-stack", // Default style
	});

	const [aiLoading, setAiLoading] = useState<{
		index: number;
		field: "title" | "message";
	} | null>(null);

	const [modalConfig, setModalConfig] = useState<{
		isOpen: boolean;
		index: number;
		field: "title" | "message";
	}>({ isOpen: false, index: 0, field: "title" });

	const birthdayMusics = [
		{
			id: "none",
			title: "No Music",
			icon: "🔇",
			description: "Silence is golden",
		},
		{
			id: "emotional-uplifting",
			title: "Emotional Uplifting",
			icon: "✨",
			description: "Uplifting tunes to touch the heart",
		},
		{
			id: "melancholic-nostalgic",
			title: "Melancholic Nostalgic",
			icon: "🍂",
			description: "Soft and nostalgic melodies",
		},
		{
			id: "piano-background",
			title: "Piano Background",
			icon: "🎹",
			description: "Relaxing piano tracks",
		},
		{
			id: "piano-moment",
			title: "Piano Moment",
			icon: "🎵",
			description: "Elegant piano music",
		},
		{
			id: "sentimental-leger",
			title: "Sentimental Leger",
			icon: "🎻",
			description: "Light sentimental piano",
		},
		{
			id: "sentimental-mellow",
			title: "Sentimental Mellow",
			icon: "🎷",
			description: "Smooth and mellow tunes",
		},
	];

	const valentineMusics = [
		{
			id: "none",
			title: "No Music",
			icon: "🔇",
			description: "Silence is golden",
		},
		{
			id: "field-grass",
			title: "Field Grass",
			icon: "🌿",
			description: "Calm and peaceful outdoor vibes",
		},
		{
			id: "romantic-hopeful",
			title: "Romantic Hopeful",
			icon: "✨",
			description: "Sweet and optimistic melodies",
		},
		{
			id: "romantic-love",
			title: "Romantic Love",
			icon: "❤️",
			description: "Deeply romantic and passionate",
		},
		{
			id: "romantic-wedding",
			title: "Romantic Wedding",
			icon: "💍",
			description: "Classic and elegant love theme",
		},
	];

	const playMusic = (musicId: string) => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current = null;
		}

		if (musicId !== "none") {
			const audio = new Audio(`/musics/${musicId}.mp3`);
			audio
				.play()
				.catch((err) => console.log("Audio playback prevented:", err));
			audioRef.current = audio;
		}
	};

	useEffect(() => {
		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
			}
		};
	}, []);

	const addCard = () => {
		setFormData({
			...formData,
			cards: [...formData.cards, { title: "", message: "" }],
		});
	};

	const updateCard = (
		index: number,
		field: "title" | "message",
		value: string,
	) => {
		const newCards = [...formData.cards];
		newCards[index] = { ...newCards[index], [field]: value };
		setFormData({
			...formData,
			cards: newCards,
		});
	};

	const removeCard = (index: number) => {
		if (formData.cards.length > 1) {
			const newCards = formData.cards.filter((_, i) => i !== index);
			setFormData({
				...formData,
				cards: newCards,
			});
		}
	};

	const handleAIGenerate = (index: number, field: "title" | "message") => {
		setModalConfig({ isOpen: true, index, field });
	};

	const handleModalSubmit = async (prompt: string) => {
		const { index, field } = modalConfig;
		setModalConfig({ ...modalConfig, isOpen: false });

		try {
			setAiLoading({ index, field });
			const token = await getToken();
			setApiToken(token);

			// Provide context from recipient name
			const contextPrompt = `Recipient: ${formData.firstName} ${formData.lastName}. User context: ${prompt}`;
			const generatedText = await aiService.generate(contextPrompt, field);

			updateCard(index, field, generatedText);
		} catch (error) {
			console.error("AI Generation error:", error);
			alert("AI generation failed. Make sure the API key is set.");
		} finally {
			setAiLoading(null);
		}
	};

	const handleSubmit = async () => {
		try {
			setIsSubmitting(true);
			const token = await getToken();
			setApiToken(token);

			let response;
			if (formData.style === "simple-valentine") {
				const payload = {
					nickname: formData.firstName, // Using firstName as nickname for Valentine
					music: formData.music,
					style: formData.style,
					card: formData.cards[0], // Only one card for Valentine
				};
				response = await valentineCardService.create(payload);
				navigate(`/valentine/${response.slug}`);
			} else {
				const payload = {
					firstname: formData.firstName,
					lastname: formData.lastName,
					music: formData.music,
					style: formData.style,
					cards: formData.cards,
				};
				response = await birthdayCardService.create(payload);
				navigate(`/birthday/${response.slug}`);
			}
		} catch (error) {
			console.error("Error creating card:", error);
			alert("Failed to create the surprise. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const cardStackImages = [
		{ src: "/card-stack-1.png", alt: "Card Stack 1" },
		{ src: "/card-stack-2.png", alt: "Card Stack 2" },
	];

	const stickyPixelImages = [
		{ src: "/sticky-pixel-1.png", alt: "Sticky Pixel 1" },
		{ src: "/sticky-pixel-2.png", alt: "Sticky Pixel 2" },
	];

	const simpleValentineImages = [
		{ src: "/simple-valentine-1.png", alt: "Simple Valentine 1" },
		{ src: "/simple-valentine-2.png", alt: "Simple Valentine 2" },
	];

	return (
		<>
			<SignedIn>
				<Modal
					isOpen={modalConfig.isOpen}
					onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
					onSubmit={handleModalSubmit}
					title="Generate with AI"
					description={`What theme or vibe should the AI use for this ${modalConfig.field}?`}
					placeholder="e.g. funny, emotional, inside joke about pizza..."
				/>
				<div className="max-w-7xl mx-auto">
					<div className="relative w-full py-12 text-center mb-8 overflow-hidden rounded-3xl">
						<img
							src="/blue-rect.svg"
							alt="Background"
							className="absolute inset-0 w-full h-full object-cover -z-10"
						/>
						{selectedSection == 1 && (
							<h1 className="text-4xl font-bold tracking-tight">
								Choose your favorite design
							</h1>
						)}
						{selectedSection == 2 && (
							<h1 className="text-4xl font-bold tracking-tight">
								Personalize your message
							</h1>
						)}
						{selectedSection == 3 && (
							<h1 className="text-4xl font-bold tracking-tight">
								The finishing touches
							</h1>
						)}
					</div>
					{selectedSection == 1 && (
						<>
							<h2 className="text-3xl font-semibold tracking-tight mb-2">
								Birthday
							</h2>
							<div className="mb-12 grid grid-cols-2 gap-4">
								<button
									onClick={() =>
										setFormData({ ...formData, style: "card-stack" })
									}
								>
									<ImageSlider
										images={cardStackImages}
										link="/templates/card-stack"
										isActive={formData.style === "card-stack"}
										title="Card Stack"
									/>
								</button>
								<button
									onClick={() =>
										setFormData({ ...formData, style: "sticky-pixel" })
									}
								>
									<ImageSlider
										images={stickyPixelImages}
										link="/templates/sticky-pixel"
										isActive={formData.style === "sticky-pixel"}
										title="Sticky Pixel"
									/>
								</button>
							</div>

							<h2 className="text-3xl font-semibold tracking-tight mb-2">
								Valentine
							</h2>
							<div className="mb-12 grid grid-cols-2 gap-4">
								<button
									onClick={() =>
										setFormData({ ...formData, style: "simple-valentine" })
									}
								>
									<ImageSlider
										images={simpleValentineImages}
										link="/templates/simple-valentine"
										isActive={formData.style === "simple-valentine"}
										title="Simple Valentine"
									/>
								</button>
							</div>
						</>
					)}
					{selectedSection == 2 && (
						<div className="flex flex-col gap-6 max-w-2xl mx-auto mb-12 px-4">
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="flex-1">
									<div className="flex justify-between items-center mb-2">
										<label className="text-lg font-semibold text-stone-900">
											{formData.style === "simple-valentine"
												? "Nickname"
												: "First name"}
										</label>
									</div>
									<input
										type="text"
										placeholder={
											formData.style === "simple-valentine"
												? "Enter nickname"
												: "Enter first name"
										}
										className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-stone-600 placeholder:text-stone-400 bg-white"
										value={formData.firstName}
										onChange={(e) =>
											setFormData({ ...formData, firstName: e.target.value })
										}
									/>
								</div>
								{formData.style !== "simple-valentine" && (
									<div className="flex-1">
										<div className="flex justify-between items-center mb-2">
											<label className="text-lg font-semibold text-stone-900">
												Last name
											</label>
										</div>
										<input
											type="text"
											placeholder="Enter last name"
											className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-stone-600 placeholder:text-stone-400 bg-white"
											value={formData.lastName}
											onChange={(e) =>
												setFormData({ ...formData, lastName: e.target.value })
											}
										/>
									</div>
								)}
							</div>
							{formData.cards.map((card, index) => (
								<div key={index} className="w-full flex flex-col gap-3">
									<div className="flex justify-between items-end mb-1">
										<label className="text-lg font-semibold text-stone-900">
											{formData.style === "simple-valentine"
												? "Accepted Message"
												: `Card ${index + 1}`}
										</label>
										{formData.cards.length > 1 && (
											<button
												onClick={() => removeCard(index)}
												className="text-xs text-stone-400 hover:text-blue-600 font-medium transition-colors cursor-pointer"
											>
												Remove
											</button>
										)}
									</div>
									<div className="relative group/field">
										<input
											type="text"
											placeholder={
												formData.style === "simple-valentine"
													? "Title"
													: "Card Title (e.g. Happy Birthday!)"
											}
											className="w-full px-4 py-2 pr-10 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-stone-600 placeholder:text-stone-400 bg-white"
											value={card.title}
											onChange={(e) =>
												updateCard(index, "title", e.target.value)
											}
										/>
										<button
											onClick={() => handleAIGenerate(index, "title")}
											disabled={aiLoading !== null}
											className="absolute right-3 top-2 text-stone-400 hover:text-blue-500 transition-colors p-1"
											title="Generate with AI"
										>
											{aiLoading?.index === index &&
											aiLoading?.field === "title" ? (
												<div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
											) : (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="18"
													height="18"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
												</svg>
											)}
										</button>
									</div>
									<div className="relative group/field">
										<textarea
											placeholder={
												formData.style === "simple-valentine"
													? "Message shown after they say yes..."
													: `Enter message for card ${index + 1}`
											}
											className="w-full px-4 py-3 pr-10 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-stone-600 placeholder:text-stone-400 bg-white min-h-[100px] resize-y"
											value={card.message}
											onChange={(e) =>
												updateCard(index, "message", e.target.value)
											}
										/>
										<button
											onClick={() => handleAIGenerate(index, "message")}
											disabled={aiLoading !== null}
											className="absolute right-3 top-2 text-stone-400 hover:text-blue-500 transition-colors p-1"
											title="Generate with AI"
										>
											{aiLoading?.index === index &&
											aiLoading?.field === "message" ? (
												<div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
											) : (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="18"
													height="18"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
												</svg>
											)}
										</button>
									</div>
								</div>
							))}
							{formData.style !== "simple-valentine" && (
								<div className="flex justify-center">
									<button
										onClick={addCard}
										className="flex items-center gap-2 px-6 py-2 rounded-full border-2 border-stone-300 text-stone-500 hover:border-blue-500 hover:text-blue-500 transition-all font-medium group"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="group-hover:rotate-90 duration-500"
										>
											<line x1="12" y1="5" x2="12" y2="19"></line>
											<line x1="5" y1="12" x2="19" y2="12"></line>
										</svg>
										Add Card
									</button>
								</div>
							)}
						</div>
					)}
					{selectedSection == 3 && (
						<div className="max-w-2xl mx-auto mb-12 px-4">
							<h3 className="text-lg font-semibold text-stone-900 mb-4">
								Background Music
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{(formData.style === "simple-valentine"
									? valentineMusics
									: birthdayMusics
								).map((option) => (
									<button
										key={option.id}
										onClick={() => {
											setFormData({ ...formData, music: option.id });
											playMusic(option.id);
										}}
										className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
											formData.music === option.id
												? "border-blue-500 bg-blue-50"
												: "border-stone-100 bg-white hover:border-stone-200"
										}`}
									>
										<span className="text-2xl">{option.icon}</span>
										<div className="flex-1">
											<p
												className={`font-bold ${formData.music === option.id ? "text-blue-700" : "text-stone-700"}`}
											>
												{option.title}
											</p>
											<p className="text-xs text-stone-400">
												{option.description}
											</p>
										</div>
									</button>
								))}
							</div>
						</div>
					)}
					<div className="flex justify-center gap-5">
						{selectedSection > 1 && (
							<button
								onClick={() => setSelectedSection(selectedSection - 1)}
								className="button-container rounded-full font-bold"
							>
								<span className="circle1"></span>
								<span className="circle2"></span>
								<span className="circle3"></span>
								<span className="circle4"></span>
								<span className="circle5"></span>
								<span className="text">Back</span>
							</button>
						)}
						{selectedSection < 3 && (
							<button
								onClick={() => setSelectedSection(selectedSection + 1)}
								className="button-container rounded-full font-bold"
							>
								<span className="circle1"></span>
								<span className="circle2"></span>
								<span className="circle3"></span>
								<span className="circle4"></span>
								<span className="circle5"></span>
								<span className="text">Next</span>
							</button>
						)}
						{selectedSection == 3 && (
							<button
								onClick={handleSubmit}
								disabled={isSubmitting}
								className={`button-container rounded-full font-bold ${
									isSubmitting ? "opacity-50 cursor-not-allowed" : ""
								}`}
							>
								<span className="circle1"></span>
								<span className="circle2"></span>
								<span className="circle3"></span>
								<span className="circle4"></span>
								<span className="circle5"></span>
								<span className="text">
									{isSubmitting ? "Saving" : "Create"}
								</span>
							</button>
						)}
					</div>
				</div>
			</SignedIn>
			<SignedOut>
				<section className="relative max-w-7xl mx-auto w-full py-20 text-center overflow-hidden rounded-3xl">
					<img
						src="/blue-rect.svg"
						alt="Background"
						className="absolute inset-0 w-full h-full object-cover -z-10"
					/>
					<h2 className="text-3xl font-bold mb-8 tracking-tight">
						Sign in to manage your content
					</h2>
					<Link to="/sign-up" className="inline-block">
						<button className="button-container rounded-full font-bold">
							<span className="circle1"></span>
							<span className="circle2"></span>
							<span className="circle3"></span>
							<span className="circle4"></span>
							<span className="circle5"></span>
							<span className="text">Join Us</span>
						</button>
					</Link>
				</section>
			</SignedOut>
		</>
	);
}

export default Create;
