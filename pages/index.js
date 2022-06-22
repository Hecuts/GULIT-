import { getData } from "../utils/fetchData";
import React, { useState, useContext } from "react";
import Head from "next/head";
import ProductItem from "../components/products/productItem";
import { DataContext } from "../store/GlobalState";

const Home = ({ products }) => {
	const { state, dispatch } = useContext(DataContext);
	const { auth } = state;
	const [product, setProduct] = useState(products);
	const [isChecked, setIsChecked] = useState(false);

	const handleChecked = (id) => {
		products.forEach((product) => {
			if (product._id === id) product.checked = !product.checked;
		});
		setProduct([...products]);
	};

	const handleCheckAll = () => {
		products.forEach((product) => {
			product.checked = !isChecked;
		});
		setProduct([...products]);
		setIsChecked(!isChecked);
	};

	const handleDeleteAll = () => {
		let deleteArray = [];
		products.forEach((product) => {
			if (product.checked) {
				deleteArray.push({
					data: "",
					id: product._id,
					title: "Delete all selected products?",
					type: "DELETE_PRODUCTS",
				});
			}
		});

		dispatch({ type: "MODAL", payload: deleteArray });
	};

	return (
		<div>
			<Head>
				<title>Home page</title>
			</Head>
			{auth.user && auth.user.role === "admin" && products.length !== 0 && (
				<div
					className="delete_all btn btn-danger mt-4"
					style={{ marginBottom: "-10px" }}
				>
					<input
						type="checkbox"
						checked={isChecked}
						onChange={handleCheckAll}
						style={{
							width: "20px",
							height: "20px",
							transform: "translateY(8px)",
						}}
					/>
					<button
						className="btn btn-danger ms-2"
						data-bs-toggle="modal"
						data-bs-target="#deleteModal"
						onClick={handleDeleteAll}
					>
						DELETE ALL
					</button>
				</div>
			)}

			<div className="products my-4">
				{product.length === 0 ? (
					<h2>No products yet.</h2>
				) : (
					product.map((product) => (
						<ProductItem
							key={product._id}
							product={product}
							handleChecked={handleChecked}
						/>
					))
				)}
			</div>
		</div>
	);
};
export default Home;

export const getServerSideProps = async () => {
	const res = await getData("product");
	return {
		props: {
			products: res.products,
			result: res.result,
		},
	};
};
