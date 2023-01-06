import {
	createContext,
	useState,
	useContext,
	ReactNode,
	useEffect,
} from 'react';

interface ShoppingCartContextValue {
	items: CartItem[];
	addItem: (item: CartItem) => Promise<void>;
	removeItem: (item: String) => void;
	getTotal: () => number;
	increaseQuantity: (id: string) => void;
	decreaseQuantity: (id: string) => void;
	isEmpty: boolean;
	count: number;
	shipping: number;
	updateShipping: (amount: number) => void;
	amountPayable: () => number;
}

interface CartItem {
	id: string;
	name: string;
	price: number;
	price_type: string;
	image: string;
	quantity?: number;
	productTotal?: number;
}

const getProductTotal = (quantity, price) => {
	return quantity * price;
};

const ShoppingCartContext = createContext<ShoppingCartContextValue>({
	items: [],
	addItem: () => Promise.resolve(),
	removeItem: () => {},
	getTotal: () => 0,
	increaseQuantity: () => {},
	decreaseQuantity: () => {},
	isEmpty: true,
	count: 0,
	shipping: 0,
	updateShipping: () => {},
	amountPayable: () => 0,
});

const ShoppingCartProvider = ({ children }: { children: ReactNode }) => {
	const [items, setItems] = useState<CartItem[]>([]);
	const [count, setCount] = useState<number>(0);
	const [shipping, setShipping] = useState<number>(0);
	const [isEmpty, setIsEmpty] = useState<boolean>(true);

	useEffect(() => {
		setIsEmpty(items.length === 0);
	}, [items]);

	useEffect(() => {
		setCount(items.length);
	}, [items]);

	const updateShipping = (amount: number) => {
		setShipping(amount);
	};

	const addItem = (item: CartItem) => {
		return new Promise<void>((resolve, reject) => {
			if (items.find((i) => i.id === item.id)) {
				reject(new Error('Item already exists in cart'));
			} else {
				setItems([
					...items,
					{
						...item,
						quantity: 1,
						productTotal: item.price,
					},
				]);
				resolve();
			}
		});
	};
	const increaseQuantity = (id: string) => {
		const res = items.map((item) =>
			item.id === id
				? {
						...item,
						quantity: item.quantity + 1,
						productTotal: getProductTotal(
							item.quantity + 1,
							item.price
						),
				  }
				: item
		);
		setItems(res);
	};
	const decreaseQuantity = (id: string) => {
		const res = items.map((item) =>
			item.id === id && item.quantity > 1
				? {
						...item,
						quantity: item.quantity - 1,
						productTotal: getProductTotal(
							item.quantity - 1,
							item.price
						),
				  }
				: item
		);
		setItems(res);
	};
	const removeItem = (id: String) => {
		setItems(items.filter((i) => i.id !== id));
	};

	const getTotal = () => {
		return items.reduce((total, item) => total + item.productTotal, 0);
	};

	const amountPayable = () => {
		const total = getTotal();
		return shipping + total;
	};

	return (
		<ShoppingCartContext.Provider
			value={{
				items,
				addItem,
				removeItem,
				getTotal,
				increaseQuantity,
				decreaseQuantity,
				isEmpty,
				count,
				shipping,
				updateShipping,
				amountPayable,
			}}
		>
			{children}
		</ShoppingCartContext.Provider>
	);
};

const useShoppingCart = () => useContext(ShoppingCartContext);

export { ShoppingCartProvider, useShoppingCart };
