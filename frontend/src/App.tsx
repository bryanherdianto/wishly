import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Create from "./components/Create";
import Pages from "./components/Pages";
import { SignIn, SignUp } from "@clerk/clerk-react";
import SharedPage from "./components/SharedPage";
import CardStack from "./components/templates/CardStackBirthday";
import StickyPixel from "./components/templates/StickyPixelBirthday";
import SimpleValentine from "./components/templates/SimpleValentine";
import NotFound from "./components/NotFound";

function App() {
	const location = useLocation();
	const isImmersive =
		location.pathname.startsWith("/birthday/") ||
		location.pathname.startsWith("/valentine/") ||
		location.pathname.startsWith("/templates/");

	const mockBirthdayData = {
		firstname: "John",
		lastname: "Doe",
		music: "none",
		style: "card-stack",
		cards: [
			{
				title: "Happy Birthday!",
				message: "Have an amazing day filled with joy.",
			},
			{
				title: "Special Day",
				message: "Wishing you all the best on your birthday.",
			},
		],
	};

	const mockValentineData = {
		nickname: "Valentine",
		music: "none",
		style: "simple-valentine",
		card: { title: "To my Valentine", message: "You make every day special." },
	};

	return (
		<div className="app-container min-h-screen flex flex-col">
			{!isImmersive && (
				<header className="sticky top-0 z-50 p-4 glassy">
					<div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
						<h1 className="text-2xl md:text-3xl font-medium mb-4 md:mb-0 tracking-tighter">
							<Link to="/" className="flex items-center">
								wishly<span className="text-[#0084FF]">.</span>
							</Link>
						</h1>
						<nav>
							<ul className="flex items-center gap-3">
								<li>
									<Link
										to="/"
										className="px-6 py-2 rounded-full border border-stone-900 text-stone-900 uppercase font-extrabold text-sm tracking-tight hover:bg-stone-900 hover:text-white transition-all duration-300"
									>
										Home
									</Link>
								</li>
								<li>
									<Link
										to="/pages"
										className="px-6 py-2 rounded-full border border-stone-900 text-stone-900 uppercase font-extrabold text-sm tracking-tight hover:bg-stone-900 hover:text-white transition-all duration-300"
									>
										Pages
									</Link>
								</li>
								<li>
									<Link
										to="/create"
										className="px-6 py-2 rounded-full border border-stone-900 text-stone-900 uppercase font-extrabold text-sm tracking-tight hover:bg-stone-900 hover:text-white transition-all duration-300"
									>
										Create
									</Link>
								</li>
								<li>
									<Link
										to="/sign-up"
										className="px-6 py-2 rounded-full border border-stone-900 text-stone-900 uppercase font-extrabold text-sm tracking-tight hover:bg-stone-900 hover:text-white transition-all duration-300"
									>
										Start
									</Link>
								</li>
							</ul>
						</nav>
					</div>
				</header>
			)}

			<main
				className={
					isImmersive
						? "flex-grow w-full h-full"
						: "flex-grow container mx-auto py-8 px-4"
				}
			>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/create" element={<Create />} />
					<Route path="/pages" element={<Pages />} />
					<Route path="/birthday/:slug" element={<SharedPage />} />
					<Route path="/valentine/:slug" element={<SharedPage />} />
					<Route
						path="/templates/card-stack"
						element={<CardStack data={mockBirthdayData} />}
					/>
					<Route
						path="/templates/sticky-pixel"
						element={<StickyPixel data={mockBirthdayData} />}
					/>
					<Route
						path="/templates/simple-valentine"
						element={<SimpleValentine data={mockValentineData} />}
					/>
					<Route
						path="/sign-in/*"
						element={
							<div className="flex justify-center">
								<SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
							</div>
						}
					/>
					<Route
						path="/sign-up/*"
						element={
							<div className="flex justify-center">
								<SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
							</div>
						}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</main>

			{!isImmersive && (
				<footer className="bg-black text-white py-10">
					<div className="container mx-auto px-4 text-center">
						<p className="font-medium">© {new Date().getFullYear()} Wishly</p>
						<p className="text-sm text-gray-400 mt-1">
							Create and share pages for life's special moments
						</p>
						<p className="text-xs text-gray-500 mt-2">
							Made with 💙 for celebrations
						</p>
					</div>
				</footer>
			)}
		</div>
	);
}

export default App;
