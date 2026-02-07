import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	birthdayCardService,
	valentineCardService,
	setApiToken,
	BirthdayCard,
	ValentineCard,
} from "../services/api";

function Pages() {
	const [birthdays, setBirthdays] = useState<BirthdayCard[]>([]);
	const [valentines, setValentines] = useState<ValentineCard[]>([]);
	const [loading, setLoading] = useState(true);
	const { getToken, isLoaded, isSignedIn } = useAuth();

	const fetchData = async () => {
		if (!isLoaded || !isSignedIn) return;

		try {
			const token = await getToken();
			if (!token) return;
			setApiToken(token);

			const [birthdayData, valentineData] = await Promise.all([
				birthdayCardService.getAll(),
				valentineCardService.getAll(),
			]);

			setBirthdays(Array.isArray(birthdayData) ? birthdayData : []);
			setValentines(Array.isArray(valentineData) ? valentineData : []);
		} catch (error) {
			console.error("Error fetching pages:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [getToken, isLoaded, isSignedIn]);

	// Auto-refresh if any card is still generating preview
	useEffect(() => {
		const hasIncomplete = [...birthdays, ...valentines].some(
			(card) => !card.previewImage,
		);

		if (hasIncomplete && !loading && birthdays.length + valentines.length > 0) {
			const timer = setTimeout(() => fetchData(), 5000);
			return () => clearTimeout(timer);
		}
	}, [birthdays, valentines, loading]);

	if (!isLoaded) {
		return (
			<>
				<section className="mb-12">
					<div className="flex justify-between items-center mb-2">
						<h2 className="text-3xl font-bold tracking-tight text-stone-900">
							Birthday
						</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{[1, 2].map((i) => (
							<div key={i} className="flex flex-col gap-1.5 w-full">
								<div className="aspect-video w-full bg-stone-100 animate-pulse rounded-2xl" />
								<div className="px-2">
									<div className="h-6 bg-stone-100 animate-pulse rounded-md" />
								</div>
							</div>
						))}
					</div>
				</section>
				<section className="mb-12">
					<div className="flex justify-between items-center mb-2">
						<h2 className="text-3xl font-bold tracking-tight text-stone-900">
							Valentine
						</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{[1].map((i) => (
							<div key={i} className="flex flex-col gap-1.5 w-full">
								<div className="aspect-video w-full bg-stone-100 animate-pulse rounded-2xl" />
								<div className="px-2">
									<div className="h-6 bg-stone-100 animate-pulse rounded-md" />
								</div>
							</div>
						))}
					</div>
				</section>
			</>
		);
	}

	return (
		<>
			<SignedIn>
				<section className="mb-12">
					<div className="flex justify-between items-center mb-2">
						<h2 className="text-3xl font-bold tracking-tight text-stone-900">
							Birthday
						</h2>
					</div>

					{loading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{[1, 2].map((i) => (
								<div key={i} className="flex flex-col gap-1.5 w-full">
									<div className="aspect-video w-full bg-stone-100 animate-pulse rounded-2xl" />
									<div className="px-2">
										<div className="h-6 bg-stone-100 animate-pulse rounded-md" />
									</div>
								</div>
							))}
						</div>
					) : birthdays.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{birthdays.map((card) => (
								<Link
									key={card._id}
									to={`/birthday/${card.slug}`}
									className="group flex flex-col gap-1 w-full"
								>
									<div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-stone-100 border border-stone-200 group-hover:border-blue-400 transition-all duration-300">
										{card.previewImage ? (
											<img
												src={card.previewImage}
												alt="Preview"
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center font-medium text-stone-600">
												Generating Preview...
											</div>
										)}
									</div>
									<div className="flex justify-between items-center w-full px-4">
										<span className="text-lg font-bold text-stone-900">
											{card.firstname} {card.lastname}
										</span>
										<span className="text-xs text-stone-400 text-end">
											{card.createdAt
												? new Date(card.createdAt).toLocaleDateString()
												: ""}
										</span>
									</div>
								</Link>
							))}
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Link to="/create" className="group flex flex-col gap-1 w-full">
								<div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 group-hover:border-blue-400 group-hover:bg-blue-50/50 transition-all duration-300 flex flex-col items-center justify-center gap-3">
									<div className="p-3 rounded-full bg-white border border-stone-200 group-hover:scale-110 group-hover:text-blue-600 transition-all duration-300">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M5 12h14" />
											<path d="M12 5v14" />
										</svg>
									</div>
									<p className="font-medium text-stone-500 group-hover:text-blue-600 transition-colors">
										Create Birthday Card
									</p>
								</div>
							</Link>
						</div>
					)}
				</section>

				<section className="mb-12">
					<div className="flex justify-between items-center mb-2">
						<h2 className="text-3xl font-bold tracking-tight text-stone-900">
							Valentine
						</h2>
					</div>

					{loading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{[1].map((i) => (
								<div key={i} className="flex flex-col gap-1.5 w-full">
									<div className="aspect-video w-full bg-stone-100 animate-pulse rounded-2xl" />
									<div className="px-2">
										<div className="h-6 bg-stone-100 animate-pulse rounded-md" />
									</div>
								</div>
							))}
						</div>
					) : valentines.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{valentines.map((card) => (
								<Link
									key={card._id}
									to={`/valentine/${card.slug}`}
									className="group flex flex-col gap-1 w-full"
								>
									<div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-stone-100 border border-stone-200 group-hover:border-blue-400 transition-all duration-300">
										{card.previewImage ? (
											<img
												src={card.previewImage}
												alt="Preview"
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center font-medium text-stone-600">
												Generating Preview...
											</div>
										)}
									</div>
									<div className="flex justify-between items-center w-full px-4">
										<span className="text-lg font-bold text-stone-900">
											{card.nickname}
										</span>
										<span className="text-xs text-stone-400 text-end">
											{card.createdAt
												? new Date(card.createdAt).toLocaleDateString()
												: ""}
										</span>
									</div>
								</Link>
							))}
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Link to="/create" className="group flex flex-col gap-1 w-full">
								<div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 group-hover:border-blue-400 group-hover:bg-blue-50/50 transition-all duration-300 flex flex-col items-center justify-center gap-3">
									<div className="p-3 rounded-full bg-white border border-stone-200 group-hover:scale-110 group-hover:text-blue-600 transition-all duration-300">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M5 12h14" />
											<path d="M12 5v14" />
										</svg>
									</div>
									<p className="font-medium text-stone-500 group-hover:text-blue-600 transition-colors">
										Create Valentine Card
									</p>
								</div>
							</Link>
						</div>
					)}
				</section>
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

export default Pages;
