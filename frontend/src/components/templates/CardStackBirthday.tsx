import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import BirthdayCake from "../BirthdayCake";

const colors = [
	"bg-blue-500",
	"bg-purple-500",
	"bg-red-500",
	"bg-green-500",
	"bg-pink-500",
	"bg-orange-500",
];

const Card = ({ card, index, targetScale }: any) => {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ["start end", "start start"],
	});

	const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

	const topOffset = index * 25; // 25px offset per card

	return (
		<div
			ref={container}
			className="h-[100vh] flex items-center justify-center sticky"
			style={{ top: `calc(5vh + ${topOffset}px)` }}
		>
			<motion.div
				style={{
					scale,
					rotate: index % 2 === 0 ? -5 : 5,
				}}
				className={`relative w-[80vw] max-w-lg h-[500px] rounded-3xl p-10 origin-top border border-white/20 shadow-2xl ${
					colors[index % colors.length]
				}`}
			>
				<h2 className="text-4xl font-bold text-white font-caveat">
					{card.title}
				</h2>
				<div className="text-5xl mt-4 text-white/80 font-caveat">
					{card.message}
				</div>
			</motion.div>
		</div>
	);
};

export default function CardStack({ data }: { data: any }) {
	if (!data) return null;

	return (
		<>
			<div className="min-h-screen pb-40">
				{data.cards.map((card: any, i: number) => {
					const targetScale = 1 - (data.cards.length - i) * 0.05;
					return (
						<Card key={i} index={i} card={card} targetScale={targetScale} />
					);
				})}
			</div>
			<div className="text-7xl font-bold font-caveat text-center pb-40">
				Happy Birthday {data.firstname}!
			</div>
			<BirthdayCake />
		</>
	);
}
