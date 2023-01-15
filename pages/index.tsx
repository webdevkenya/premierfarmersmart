import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {

	return (
		<>
			<Head>
				<title>PREMIER FARMERS MART</title>
				<meta
					name="description"
					content="Generated by create next app"
				/>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className='mx-auto max-w-[95%]'>
				<div className='flex rounded-lg px-8 pt-4 justify-between bg-green-900 my-8 '>
					<div className='w-1/3 flex flex-col items-center justify-center space-y-8'>

						<h1 className='text-3xl font-bold tracking-tight sm:text-center lg:text-5xl xl:text-6xl text-white'>Fresh Online Grocery Shopping</h1>
						<Link href="#" className="inline-block rounded-lg bg-orange-300 px-4 py-1.5 text-base font-semibold leading-7 text-green-900 shadow-sm ring-1 ring-orange-400 hover:bg-sky-700 hover:text-white hover:ring-sky-800">
							Get started
						</Link>
					</div>
					<Image
						className="hidden h-auto w-2/3 md:block "
						src="/landing.svg"
						alt="illustration"
						width={1793}
						height={912}
					/>

				</div>
				<div className='flex justify-around items-center py-4'>
					<div className='flex flex-col items-center font-bold space-y-4'>
						<span className='text-4xl'>100%</span>
						<span className='text-gray-400'>Fresh</span>
					</div>
					<div className='flex flex-col items-center font-bold space-y-4'>
						<span className='text-4xl'>24/7</span>
						<span className='text-gray-400'>Delivery</span>
					</div>
					<div className='flex flex-col items-center font-bold space-y-4'>
						<span className='text-4xl'>100%</span>
						<span className='text-gray-400'>Reliable</span>
					</div>

				</div>
				{/* <div>
					<h2>Shop by Category</h2>
				</div> */}
			</main>
		</>
	);
}
