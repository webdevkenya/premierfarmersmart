import { useState } from 'react';
import AddressForm from './AddressForm';
import Modal from './Modal';
import { useModal } from '../contexts/ModalContext';

const AddressModal = () => {
	const { isOpen, open } = useModal();

	return (
		<div>
			<button
				className="font-semibold text-blue-600 hover:text-blue-700"
				onClick={open}
			>
				Add Address
			</button>
			<Modal>
				<div className="px-4 py-3 sm:px-6 sm:py-4">
					<div className="sm:mx-auto sm:w-full sm:max-w-md">
						<h3 className="mt-2 text-center text-3xl leading-9 font-extrabold text-gray-900">
							Create Address
						</h3>
						<div className="mt-4">
							<AddressForm />
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default AddressModal;
