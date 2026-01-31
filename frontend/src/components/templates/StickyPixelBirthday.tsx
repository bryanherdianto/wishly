import { motion } from "motion/react";
import { ReactNode } from "react";

const colors = [
	{ bg: "bg-blue-600", text: "text-blue-100" },
	{ bg: "bg-purple-600", text: "text-purple-100" },
	{ bg: "bg-amber-600", text: "text-amber-100" },
	{ bg: "bg-green-600", text: "text-green-100" },
	{ bg: "bg-rose-600", text: "text-rose-100" },
];

interface CardProps {
	card: any;
	index: number;
}

const Card = ({ card, index }: CardProps) => {
	const color = colors[index % colors.length];
	return (
		<div className="h-screen w-full snap-start snap-always relative">
			<div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
				<motion.div
					className={`relative w-full h-full flex flex-col items-center shadow-2xl justify-center ${color.bg}`}
				>
					<div className="text-center px-10 max-w-4xl z-10">
						<h2
							className={`text-6xl md:text-8xl font-bold font-pixelify-sans mb-8 ${color.text}`}
						>
							{card.title}
						</h2>
						<p
							className={`text-4xl md:text-6xl font-pixelify-sans opacity-90 leading-tight ${color.text}`}
						>
							{card.message}
						</p>
					</div>
					{card.component}
				</motion.div>
			</div>
		</div>
	);
};

export default function StickyPixel({ data }: { data: any }) {
	if (!data) return null;

	const allCards = [
		...data.cards,
		{
			title: `Happy Birthday ${data.firstname}!`,
			message: "Wishing you all the best.",
			component: (
				<div className="flex flex-col items-center mt-8">
					<div className="cake" id="cake"></div>
					<p className="text-4xl text-rose-100 font-pixelify-sans mt-4">
						Tap the cake!
					</p>
				</div>
			),
		},
	];

	return (
		<div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-black">
			{allCards.map((card, i) => {
				return <Card key={i} index={i} card={card} />;
			})}
		</div>
	);
}
