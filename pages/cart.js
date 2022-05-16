/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { DataContext } from "../store/GlobalState";
import React, { useContext, useState, useEffect } from "react";
import CartItem from "../components/CartItem";
import Link from "next/link";
import { getData } from "../utils/fetchData";

const Cart = () => {
	const { state, dispatch } = useContext(DataContext);
	const { cart, auth } = state;

	//Handle the total checkout
	const [total, setTotal] = useState(0);
	const [address, setAddress] = useState("");
	const [mobile, setMobile] = useState("");

	//get total price
	useEffect(() => {
		const getTotal = () => {
			const res = cart.reduce((prev, item) => {
				return prev + item.price * item.quantity;
			}, 0);

			setTotal(res);
		};
		getTotal();
	});

	useEffect(() => {
		const cartLocal = JSON.parse(localStorage.getItem("_next_cart01_gulit"));
		if (cartLocal && cartLocal.length > 0) {
			let newArr = [];
			//update cart
			const updateCart = async () => {
				for (const item of cartLocal) {
					const res = await getData(`product/${item._id}`);
					const { _id, title, images, price, inStock } = res.product;
					if (inStock > 0) {
						newArr.push({
							_id,
							title,
							images,
							price,
							inStock,
							quantity: item.quantity > inStock ? 1 : item.quantity,
						});
					}
				}
				dispatch({ type: "ADD_CART", payload: newArr });
			};
			updateCart();
		}
	}, []);

	if (cart.length === 0) {
		return (
			<img
				className="img-responsive w-100"
				src="/empty_cart.jpg"
				alt="Not empty"
			/>
		);
	}

	return (
		<div className="row mx-auto">
			<Head>
				<title>Cart page</title>
			</Head>
			<div className="col-md-8 text-secondary table-responsive my-3">
				<h2 className="text-uppercase ">Shopping Cart</h2>
				<table className="table my-3">
					<tbody>
						{cart.map((item) => (
							<CartItem
								key={item._id}
								item={item}
								dispatch={dispatch}
								cart={cart}
							/>
						))}
					</tbody>
				</table>
			</div>
			<div className="col-md-4 my-3 text-end text-uppercase text-secondary ">
				<form>
					<h2 className="align-center">Shipping</h2>
					<label htmlFor="address">Address</label>
					<input
						type="text"
						name="address"
						id="address"
						className="form-control mb-2"
						value={address}
						onChange={() => setAddress(e.target.value)}
					/>
					<label htmlFor="mobile">Mobile</label>
					<input
						type="text"
						name="mobile"
						id="mobile"
						className="form-control mb-2"
						value={mobile}
						onChange={() => setMobile(e.target.value)}
					/>
				</form>
				<h3>
					Total: <span className="text-danger">${total}</span>
				</h3>

				<Link href={auth.user ? "#" : "/signin"}>
					<a className="btn btn-dark">Proceed with payment</a>
				</Link>
				<Link href="/wallet">
					<a className="btn btn-dark my-2">Connect Wallet</a>
				</Link>
			</div>
		</div>
	);
};
export default Cart;
