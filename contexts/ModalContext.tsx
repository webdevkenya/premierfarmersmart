import { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextValue {
	close: () => void;
	open: () => void;
	isOpen: boolean;
}

const ModalContext = createContext<ModalContextValue>({
	close: () => {},
	open: () => {},
	isOpen: false,
});

const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const open = () => {
		setIsOpen(true);
	};
	const close = () => {
		setIsOpen(false);
	};

	return (
		<ModalContext.Provider
			value={{
				open,
				close,
				isOpen,
			}}
		>
			{children}
		</ModalContext.Provider>
	);
};

const useModal = () => useContext(ModalContext);

export { ModalProvider, useModal };
