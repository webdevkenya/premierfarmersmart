import Modal from './Modal';
import { useModal } from '../contexts/ModalContext';

interface props {
	id: string;
	title: string;
	children: React.ReactNode;
}

const ModalWrapper = ({ id, title, children }: props) => {
	const { openModal } = useModal();

	return (
		<div>
			<button
				className="font-semibold text-blue-600 hover:text-blue-700"
				onClick={() => openModal(id)}
			>
				{title}
			</button>
			<Modal id={id}>
				<div className="px-4 py-3 sm:px-6 sm:py-4">
					<div className="sm:mx-auto sm:w-full sm:max-w-md">
						<h3 className="mt-2 text-center text-3xl leading-9 font-extrabold text-gray-900">
							{title}
						</h3>
						<div className="mt-4">
							{children}
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default ModalWrapper;
