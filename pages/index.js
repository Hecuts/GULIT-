import { getData } from "../utils/fetchData";
import React, { useState, useContext, useEffect } from "react";
import Head from "next/head";
import ProductItem from "../components/products/productItem";
import { DataContext } from "../store/GlobalState";
import { useRouter } from "next/router";
import filterSearch from "../utils/filterSearch";
import Filter from "../components/Filter";

const Home = ({ products, result }) => {
	const { state, dispatch } = useContext(DataContext);
	const { auth } = state;
	const [product, setProduct] = useState(products);
	const [isChecked, setIsChecked] = useState(false);
	const [page, setPage] = useState(1);
	const router = useRouter();

	//Take effect immediately after <load more> button is clicked.
	useEffect(() => {
		setProduct(products);
	}, [products]);

	useEffect(() => {
		if (Object.keys(router.query).length === 0) {
			setPage(1);
		}
	}, [router.query]);

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

	const handleLoadmore = () => {
		setPage(page + 1);
		filterSearch({ router, page: page + 1 });
	};
	return (
		<div className="home_page">
			<Head>
				<title>Home page</title>
			</Head>

			<Filter state={state} />

			{auth.user && auth.user.role === "admin" && products.length !== 0 && (
				<div
					className="delete_all btn btn-danger mt-4 ms-2"
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
			{result < page * 6 ? (
				""
			) : (
				<button
					className="btn btn-outline-secondary d-block mx-auto mb-4"
					onClick={handleLoadmore}
				>
					Load More
				</button>
			)}
		</div>
	);
};
export default Home;

export const getServerSideProps = async ({ query }) => {
	const page = query.page || 1;
	const category = query.category || "all";
	const sort = query.sort || "";
	const search = query.search || "all";

	const res = await getData(
		`product?limit=${
			page * 6
		}&category=${category}&sort=${sort}&title=${search}`
	);

	// server side rendering
	return {
		props: {
			products: res.products,
			result: res.result,
		},
	};
};
