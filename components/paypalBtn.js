import React, { useEffect, useRef, useContext } from "react";
import { patchData } from "../utils/fetchData";
import { DataContext } from "../store/GlobalState";
import { updateItem } from "../store/Actions";

const PaypalBtn = ({ order }) => {
	const { state, dispatch } = useContext(DataContext);
	const refPaypalBtn = useRef();
	const { auth, orders } = state;

	useEffect(() => {
		paypal
			.Buttons({
				// Sets up the transaction when a payment button is clicked
				createOrder: (data, actions) => {
					return actions.order.create({
						purchase_units: [
							{
								amount: {
									value: order.total, // Can also reference a variable or function
								},
							},
						],
					});
				},
				// Finalize the transaction after payer approval
				onApprove: (data, actions) => {
					dispatch({ type: "NOTIFY", payload: { loading: true } });

					return actions.order.capture().then(function (orderData) {
						// Successful capture! For dev/demo purposes:
						patchData(
							`order/payment/${order._id}`,
							{
								paymentId: orderData.payer.payer_id,
							},
							auth.token
						).then((res) => {
							if (res.err)
								return dispatch({
									type: "NOTIFY",
									payload: { error: res.err },
								});

							dispatch(
								updateItem(
									orders,
									order._id,
									{
										...order,
										paid: true,
										dateOfPayment: orderData.create_time,
										paymentId: orderData.payer.payer_id,
										method: "Paypal",
									},
									"ADD_ORDERS"
								)
							);
							return dispatch({
								type: "NOTIFY",
								payload: { success: res.msg },
							});
						});
					});
				},
			})
			.render(refPaypalBtn.current);
	}, []);

	return <div ref={refPaypalBtn}></div>;
};

export default PaypalBtn;
