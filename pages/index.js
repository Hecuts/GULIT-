import { getData } from "../utils/fetchData";
import React, { useState } from "react";
import Head from "next/head";
import ProductItem from "../components/products/productItem";

const Home = ({ products }) => {
	const [product, setProduct] = useState(products);

	return (
		<div className="products my-5">
			<Head>
				<title>Home page</title>
			</Head>
			{product.length === 0 ? (
				<h2>No products yet.</h2>
			) : (
				product.map((product) => (
					<ProductItem key={product._id} product={product} />
				))
			)}
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
