/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { DataContext } from "../../store/GlobalState";
import { useContext } from "react";
import { addToCart } from "../../store/Actions";

const ProductItem = ({ product }) => {
	const { state, dispatch } = useContext(DataContext);
	const { cart, auth } = state;

	const userLink = () => {
		return (
			<>
				<Link href={`product/${product._id}`}>
					<a className="btn btn-info" style={{ marginRight: "5px", flex: 1 }}>
						View
					</a>
				</Link>
				<button
					className="btn btn-success"
					disabled={product.inStock === 0 ? true : false}
					style={{ marginLeft: "5px", flex: 1 }}
					onClick={() => dispatch(addToCart(product, cart))}
				>
					BUY
				</button>
			</>
		);
	};

	const adminLink = () => {
		return (
			<>
				<Link href={`create/${product._id}`}>
					<a
						className="btn btn-secondary"
						style={{ marginRight: "5px", flex: 1 }}
					>
						Edit
					</a>
				</Link>
				<button
					className="btn btn-danger"
					style={{ marginLeft: "5px", flex: 1 }}
				>
					Delete
				</button>
			</>
		);
	};

	if (!auth.user) return null;
	return (
		<div>
			<div className="card" style={{ width: "18rem" }}>
				<img
					src={product.images[0].url}
					className="card-img-top"
					alt={product.images[0].url}
				/>
				<div className="card-body">
					<h5 className="card-title text-capitalize" title={product.title}>
						{product.title}
					</h5>
					<div className="row justify-content-between mx-0">
						<h6 className="text-danger col">${product.price}</h6>
						{product.inStock > 0 ? (
							<h6 className="text-danger col">In Stock: {product.inStock}</h6>
						) : (
							<h6 className="text-danger col">Out of stock</h6>
						)}
					</div>
					<p className="card-text" title={product.description}>
						{product.description}
					</p>
					<div className="row justify-content-between mx-0">
						{!auth.user || auth.user.role === "admin"
							? adminLink()
							: userLink()}
					</div>
				</div>
			</div>
		</div>
	);
};
export default ProductItem;
