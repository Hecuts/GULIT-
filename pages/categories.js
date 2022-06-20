import Head from "next/head";
import { useContext, useState } from "react";
import { updateItem } from "../store/Actions";
import { DataContext } from "../store/GlobalState";
import { postData, putData } from "../utils/fetchData";

const Categories = () => {
	const { state, dispatch } = useContext(DataContext);
	const { categories, auth } = state;
	const [name, setName] = useState("");
	const [id, setId] = useState("");

	const createCategory = async () => {
		//check isAdmin?
		if (auth.user.role !== "admin")
			return dispatch({
				type: "NOTIFY",
				payload: { error: "Authentication is not valid." },
			});
		//check name field
		if (!name)
			return dispatch({
				type: "NOTIFY",
				payload: "Name can not be left blank.",
			});

		dispatch({ type: "NOTIFY", payload: { loading: true } });

		//Update when there is Id, otherwise create one.
		let res;
		if (id) {
			// the enclosed entity <name> is considered to be a modified version
			// of the resource stored on the origin server <previous name>, and the client is
			// requesting that the stored version be replace.
			res = await putData(`categories/${id}`, { name }, auth.token);
			if (res.err)
				return dispatch({ type: "NOTIFY", payload: { error: res.err } });

			// update imediately after create button is hit
			dispatch(updateItem(categories, id, res.category, "ADD_CATEGORIES"));
		} else {
			res = await postData("categories", { name }, auth.token);

			if (res.err)
				return dispatch({ type: "NOTIFY", payload: { error: res.err } });

			//update imediately after create button is hit
			dispatch({
				type: "ADD_CATEGORIES",
				payload: [...categories, res.newCategory],
			});
		}

		//empty the field after update/create
		setName("");
		setId("");

		return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
	};

	const editCategory = async (category) => {
		setId(category._id);
		setName(category.name);
	};

	return (
		<div className="col-md-6 mx-auto my-3">
			<Head>
				<title>Categories</title>
			</Head>

			<div className="input-group mb-3">
				<input
					type="text"
					className="from-control"
					placeholder="Add a new category"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<button
					className="input-group-text btn btn-secondary ms-1"
					onClick={createCategory}
				>
					{id ? "Update" : "Create"}
				</button>
			</div>
			{categories.map((category) => (
				<div key={category._id} className="card my-2 text-capitalize">
					<div className="card-body d-flex justify-content-between">
						{category.name}

						<div style={{ cursor: "pointer" }}>
							<i
								className="fas fa-edit ms-2 text-secondary"
								onClick={() => editCategory(category)}
							/>
							<i
								className="fas fa-trash-alt ms-2 text-danger"
								data-bs-toggle="modal"
								data-bs-target="#deleteModal"
								onClick={() =>
									dispatch({
										type: "MODAL",
										payload: {
											data: categories,
											id: category._id,
											title: category.name,
											type: "ADD_CATEGORIES",
										},
									})
								}
							/>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};
export default Categories;
