import { useState } from "react";

const message = "Meet me at our favorite spot this weekend! 🥰";

function SimpleValentine({ data }: { data: any }) {
	const [isAccepted, setIsAccepted] = useState(false);
	const [noButtonPosition, setNoButtonPosition] = useState<{
		x: number;
		y: number;
	} | null>(null);
	const [currentImg, setCurrentImg] = useState("/heart-love.gif");

	const handleNoClick = () => {
		const x = Math.random() * (window.innerWidth - 140);
		const y = Math.random() * (window.innerHeight - 90);
		setNoButtonPosition({ x, y });
		setCurrentImg((prev) =>
			prev === "/heart-love.gif" ? "/cry-cute.gif" : "/heart-love.gif",
		);
	};

	if (!data) return null;

	if (isAccepted) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-rose-50 font-pacifico gap-8 p-4 text-center">
				<h1 className="text-4xl md:text-6xl text-rose-600 mb-5 text-balance">
					{data.cards[1]?.title || "Yey, thank you! ❤️"}
				</h1>
				<div className="text-rose-500 font-lato font-semibold text-lg md:text-xl max-w-md">
					{data.cards[1]?.message || "I'm so happy!"}
				</div>
				<img
					src="/kitty-heart.gif"
					alt="Happy Kitty"
					className="w-64 md:w-80"
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-rose-50 font-pacifico gap-8 p-4 text-center">
			<h1 className="text-4xl md:text-6xl text-rose-600 text-balance">
				{data.cards[0]?.title || "Will you be my Valentine?"}
			</h1>

			<div className="text-rose-500 font-lato font-semibold text-lg md:text-xl max-w-md">
				{data.cards[0]?.message}
			</div>

			<div className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center text-balance px-4 text-center py-4">
				<img
					src={currentImg}
					alt="Valentine Heart"
					className="max-w-full max-h-full object-contain"
				/>
			</div>

			<div className="flex flex-row items-center justify-center relative min-h-[100px] font-lato font-semibold">
				<div className="w-[120px] h-[60px] flex items-center justify-center">
					<button
						className="button-simplevalentine"
						onClick={() => setIsAccepted(true)}
					>
						<span className="shadow"></span>
						<span className="edge"></span>
						<span className="front text"> Yes </span>
					</button>
				</div>

				<div className="w-[120px] h-[60px] flex items-center justify-center">
					<button
						className="button-simplevalentine"
						onClick={handleNoClick}
						style={
							noButtonPosition
								? {
										position: "fixed",
										left: `${noButtonPosition.x}px`,
										top: `${noButtonPosition.y}px`,
										zIndex: 50,
										transition: "all 0.1s ease",
									}
								: {
										position: "relative",
									}
						}
					>
						<span className="shadow"></span>
						<span className="edge"></span>
						<span className="front text"> No </span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default SimpleValentine;
