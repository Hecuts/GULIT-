/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { increase, decrease } from "../store/Actions";

const CartItem = ({ item, dispatch, cart }) => {
	return (
		<tr>
			<td style={{ minWidth: "180px", overflow: "hidden" }}>
				<img
					className="img-thumbnail w-100"
					src={item.images[0].url}
					style={{ minWidth: "80px", height: "100px" }}
					alt={item.images[0].url}
				/>
			</td>

			<td style={{ minWidth: "200px" }} className=" w-50 align-middle">
				<h5>
					<Link href={`/product/${item._id}`}>
						<a className="text-capitalize text-secondary">{item.title}</a>
					</Link>
				</h5>

				<h6 className="text-danger">${item.quantity * item.price}</h6>
				{item.inStock > 0 ? (
					<p className="mb-1 text-danger">In Stock: {item.inStock}</p>
				) : (
					<p className="mb-1 text-danger">Out of Stock</p>
				)}
			</td>

			<td className="align-middle" style={{ minWidth: "150px" }}>
				<button
					className="btn btn-outline-secondary"
					disabled={item.quantity === 1 ? true : false}
					onClick={() => dispatch(decrease(cart, item._id))}
				>
					-
				</button>
				<span className="px-3">{item.quantity}</span>
				<button
					className="btn btn-outline-secondary"
					disabled={item.quantity === item.inStock ? true : false}
					onClick={() => dispatch(increase(cart, item._id))}
				>
					+
				</button>
			</td>

			<td
				className="align-middle"
				style={{ minWidth: "50px", cursor: "pointer" }}
			>
				<i
					className="far fa-trash-alt text-danger"
					aria-hidden="true"
					data-bs-toggle="modal"
					data-bs-target="#deleteModal"
					onClick={() =>
						dispatch({
							type: "MODAL",
							payload: [
								{
									data: cart,
									id: item._id,
									title: item.title,
									type: "ADD_CART",
								},
							],
						})
					}
					style={{ fontSize: "18px" }}
				></i>
			</td>
		</tr>
	);
};
export default CartItem;
