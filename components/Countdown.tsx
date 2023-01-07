import Image from 'next/image';
import { useState, useEffect } from 'react';
import logo from '../public/logo.jpeg';

interface Props {
	releaseDate: string;
}

const Countdown = ({ releaseDate }: Props) => {
	const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

	useEffect(() => {
		const date = new Date(releaseDate);
		const interval = setInterval(() => {
			const currentTime = new Date();
			const timeDifference = date.getTime() - currentTime.getTime();
			setTimeRemaining(timeDifference);
		}, 1000);
		return () => clearInterval(interval);
	}, [releaseDate]);

	if (!timeRemaining) {
		return (
			<div className="flex justify-center items-center pt-32">
				<div
					className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
					role="status"
				>
					<span className="sr-only">Loading...</span>
				</div>
			</div>
		);
	}

	const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
	const hours = Math.floor(
		(timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
	);
	const minutes = Math.floor(
		(timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
	);
	const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

	return (
		<div className="flex flex-col items-center h-screen text-center">
			<Image src={logo} alt="logo" width={558} height={448} />

			<h1 className="bg-clip-text text-5xl text-transparent font-extrabold bg-gradient-to-r from-yellow-600 to-red-600">
				Coming soon
			</h1>
			<h1 className="bg-clip-text py-5 font-extrabold text-transparent text-8xl bg-gradient-to-r from-yellow-600 to-red-600">{`${days} days ${hours}:${minutes}:${seconds}`}</h1>
		</div>
	);
};

export default Countdown;
