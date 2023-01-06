import React from 'react';
import { useModal } from '../contexts/ModalContext';

const Modal = ({ children }) => {
	const { isOpen, close } = useModal();

	if (!isOpen) return null;

	return (
		<div className="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
			<div className="fixed inset-0 transition-opacity">
				<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
			</div>
			<div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
				<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
					<span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
						<button
							type="button"
							onClick={close}
							className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-800"
						>
							Close
						</button>
					</span>
				</div>
				{children}
			</div>
		</div>
	);
};

export default Modal;
