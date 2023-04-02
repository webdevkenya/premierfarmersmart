import { createContext, useState, useContext, ReactNode } from 'react';

interface ModalContextValue {
	openModal: (id: string) => void;
	closeModal: () => void;
	openModalId: string | null;
}

const ModalContext = createContext<ModalContextValue>({
	openModal: () => { },
	closeModal: () => { },
	openModalId: null,
});

const ModalProvider = ({ children }: { children: ReactNode }) => {
	// const [isOpen, setIsOpen] = useState<boolean>(false);
	const [openModalId, setOpenModalId] = useState<string | null>(null);

	const openModal = (id: string) => {
		setOpenModalId(id);
	};

	const closeModal = () => {
		setOpenModalId(null);
	};

	// const open = () => {
	// 	setIsOpen(true);
	// };
	// const close = () => {
	// 	setIsOpen(false);
	// };

	return (
		<ModalContext.Provider
			value={{
				openModal,
				closeModal,
				openModalId,
			}}
		>
			{children}
		</ModalContext.Provider>
	);
};

const useModal = () => useContext(ModalContext);

export { ModalProvider, useModal };
