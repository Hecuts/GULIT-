import { DataContext } from "../store/GlobalState";
import { useContext } from "react";
import { deleteItem } from "../store/Actions";

const Modal = () => {
	const { state, dispatch } = useContext(DataContext);
	const { modal } = state;

	const handleSubmit = () => {
		dispatch(deleteItem(modal.data, modal.id, "ADD_CART"));
		dispatch({ type: "MODAL", payload: [] });
	};

	return (
		<div
			className="modal fade"
			id="deleteModal"
			tabIndex="-1"
			aria-labelledby="deleteModalLabel"
			aria-hidden="true"
		>
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title text-capitalize" id="deleteModalLabel">
							{modal.title}
						</h5>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div className="modal-body">Do you want to delete this item?</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-secondary"
							data-bs-dismiss="modal"
							onClick={handleSubmit}
						>
							Yes
						</button>
						<button
							type="button"
							className="btn btn-primary"
							data-bs-dismiss="modal"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Modal;
