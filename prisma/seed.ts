import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

interface Product {
	name: string;
	price: string;
	price_type: string;
	category: string;
	stock: number;
	image: string;
}

interface Location {
	name: string;
	shipping: string;
	county: string;
	town: string;
}

let products: Product[] = [];
let locations: Location[] = [];

for (let i = 0; i < 50; i++) {
	products.push({
		name: faker.commerce.productName(),
		price: faker.commerce.price(100, 1000, 0),
		price_type: faker.commerce.productMaterial(),
		category: faker.commerce.department(),
		stock: 50,
		image: faker.image.food(),
	});
}

for (let i = 0; i < 10; i++) {
	locations.push({
		name: faker.address.secondaryAddress(),
		shipping: faker.commerce.price(100, 200, 0),
		county: faker.address.county(),
		town: faker.address.cityName(),
	});
}

async function main() {
	await prisma.user.deleteMany();
	await prisma.product.deleteMany();
	await prisma.location.deleteMany();

	await prisma.user.create({
		data: {
			email: `christiantheeone@gmail.com`,
			role: 'ADMIN',
		},
	});
	await prisma.location.createMany({
		data: locations,
	});
	await prisma.product.createMany({
		data: products,
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
