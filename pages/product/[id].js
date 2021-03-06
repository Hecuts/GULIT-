/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { getData } from "../../utils/fetchData";
import React, { useState, useRef, useContext } from "react";
import { DataContext } from "../../store/GlobalState";
import { addToCart } from "../../store/Actions";

const DetailProduct = (props) => {
	const [product] = useState(props.product);
	const [tab, setTab] = useState(0);
	const imgRef = useRef();

	const { state, dispatch } = useContext(DataContext);
	const { cart } = state;

	const isActive = (index) => {
		if (tab === index) return " active";
		return "";
	};

	return (
		<div className="row detail_page">
			<Head>
				<title>Detail Page</title>
			</Head>

			<div className="col-md-6">
				<img
					src={product.images[tab].url}
					alt={product.images[tab].url}
					className="d-block img-thumbnail rounded mt-4 w-100"
					style={{ height: "350px" }}
				/>

				<div className="row mx-0" style={{ curser: "pointer" }} ref={imgRef}>
					{product.images.map((img, index) => (
						<img
							key={index}
							src={img.url}
							alt={img.url}
							className={`col img-thumbnail rounded ${isActive(index)}`}
							style={{ height: "80px", width: "20%" }}
							onClick={() => setTab(index)}
						/>
					))}
				</div>
			</div>
			<div className="mx-2 col-md-6 mt-3">
				<h2 className="text-uppercase">{product.title}</h2>
				<h5 className="text-danger">${product.price}</h5>

				<div className="row mx-0 d-flex justify-content-between">
					{product.inStock > 0 ? (
						<h6 className="col text-danger">In Stock: {product.inStock}</h6>
					) : (
						<h6 className="col text-danger">Out of Stock</h6>
					)}
					<h6 className="col text-danger">Sold: {product.sold}</h6>
				</div>

				<div className="my-2">{product.description}</div>
				<div className="my-2">{product.content}</div>

				<button
					className="btn btn_sec d-block my-3 px-5"
					type="button"
					onClick={() => dispatch(addToCart(product, cart))}
				>
					Buy
				</button>
			</div>
		</div>
	);
};
export default DetailProduct;

export const getServerSideProps = async ({ params: { id } }) => {
	const res = await getData(`product/${id}`);
	console.log("detail product: ", res);

	return {
		props: { product: res.product },
	};
};
