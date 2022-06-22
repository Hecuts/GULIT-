import { DataContext } from "../store/GlobalState";
import { useContext } from "react";
import { deleteItem } from "../store/Actions";
import { deleteData } from "../utils/fetchData";

const Modal = () => {
	const { state, dispatch } = useContext(DataContext);
	const { modal, auth } = state;

	const deleteUser = (item) => {
		dispatch(deleteItem(item.data, item.id, item.type));
		deleteData(`user/${item.id}`, auth.token).then((res) => {
			if (res.err)
				return dispatch({ type: "NOTIFY", payload: { error: res.err } });
			return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
		});
	};

	const deleteCategories = (item) => {
		dispatch(deleteItem(item.data, item.id, item.type));
		deleteData(`categories/${item.id}`, auth.token).then((res) => {
			if (res.err)
				return dispatch({ type: "NOTIFY", payload: { error: res.err } });
			return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
		});
	};

	const deleteProducts = (item) => {
		dispatch({ type: "NOTIFY", payload: { loading: true } });

		deleteData(`product/${item.id}`, auth.token).then((res) => {
			if (res.err)
				return dispatch({ type: "NOTIFY", payload: { error: res.err } });
			return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
		});
	};

	//Delete user, and Delete item, depending on the modal type.
	const handleSubmit = () => {
		if (modal.length !== 0) {
			for (const item of modal) {
				//delete users
				if (item.type === "ADD_USERS") deleteUser(item);

				//delete categories
				if (item.type === "ADD_CATEGORIES") deleteCategories(item);

				//delete products
				if (item.type === "DELETE_PRODUCTS") deleteProducts(item);

				// dispatch(deleteItem(modal.data, modal.id, modal.type));
				dispatch({ type: "MODAL", payload: [] });
			}
		}
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
							{modal.length !== 0 && modal[0].title}
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
