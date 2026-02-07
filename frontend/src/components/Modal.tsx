import { useState, useEffect } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (value: string) => void;
	title: string;
	description: string;
	placeholder?: string;
}

function Modal({
	isOpen,
	onClose,
	onSubmit,
	title,
	description,
	placeholder,
}: ModalProps) {
	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		if (isOpen) {
			setInputValue("");
		}
	}, [isOpen]);

	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputValue.trim()) {
			onSubmit(inputValue);
		}
	};

	return (
		<div
			id="crud-modal"
			tabIndex={-1}
			aria-hidden="true"
			className="overflow-y-auto overflow-x-hidden fixed inset-0 z-[100] flex justify-center items-center w-full h-full bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200"
		>
			<div className="relative p-4 w-full max-w-md max-h-full animate-in zoom-in duration-200">
				<div className="relative bg-white border border-stone-200 rounded-3xl shadow-2xl p-4 md:p-6">
					<div className="flex items-center justify-between border-b border-stone-100 pb-4 md:pb-5">
						<h3 className="text-xl font-bold text-stone-900">{title}</h3>
						<button
							type="button"
							onClick={onClose}
							className="text-stone-400 bg-transparent hover:bg-stone-50 hover:text-stone-900 rounded-full text-sm w-9 h-9 ms-auto inline-flex justify-center items-center transition-colors"
						>
							<svg
								className="w-5 h-5"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18 17.94 6M18 18 6.06 6"
								/>
							</svg>
							<span className="sr-only">Close modal</span>
						</button>
					</div>
					<form onSubmit={handleSubmit}>
						<div className="py-4 md:py-6">
							<div className="col-span-2">
								<label
									htmlFor="name"
									className="block mb-2.5 text-sm font-medium text-stone-600"
								>
									{description}
								</label>
								<textarea
									autoFocus
									name="name"
									id="name"
									className="bg-stone-50 border border-stone-200 text-stone-900 text-sm rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3 placeholder:text-stone-400 min-h-[100px] transition-all resize-none"
									placeholder={placeholder || "Type here..."}
									required
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value)}
								/>
							</div>
						</div>
						<div className="flex items-center space-x-4 border-t border-stone-100 pt-4 md:pt-6">
							<button
								type="submit"
								className="flex-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-full text-sm px-5 py-3 text-center transition-all"
							>
								Generate
							</button>
							<button
								onClick={onClose}
								type="button"
								className="flex-1 text-stone-500 bg-white border border-stone-200 hover:bg-stone-50 focus:ring-4 focus:outline-none focus:ring-stone-200 font-bold rounded-full text-sm px-5 py-3 transition-all"
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Modal;
