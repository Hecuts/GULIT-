import { useEffect, createContext, useReducer } from "react";
import { getData } from "../utils/fetchData";
import reducers from "./Reducers";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
	const initialState = {
		notify: {},
		auth: {},
		cart: [],
		modal: {},
		orders: [],
		users: [],
	};
	const [state, dispatch] = useReducer(reducers, initialState);
	const { cart, auth } = state;

	//handle authentication and deauthenticate
	useEffect(() => {
		const firstLogin = localStorage.getItem("firstLogin");

		if (firstLogin) {
			getData("auth/accessToken").then((res) => {
				if (res.err) return localStorage.removeItem("firstLogin");

				dispatch({
					type: "AUTH",
					payload: {
						token: res.access_token,
						user: res.user,
					},
				});
			});
		}
	}, []);

	//Store products added to cart using local storage
	useEffect(() => {
		const _next_cart01_gulit = JSON.parse(
			localStorage.getItem("_next_cart01_gulit")
		);

		//Get what is stored form local storage and set the payload with it.
		if (_next_cart01_gulit) {
			dispatch({ type: "ADD_CART", payload: _next_cart01_gulit });
		}
	}, []);

	//set what was on localstorage to _next_cart01_gulit
	useEffect(() => {
		localStorage.setItem("_next_cart01_gulit", JSON.stringify(cart));
	}, [cart]);

	useEffect(() => {
		if (auth.token) {
			getData("order", auth.token).then((res) => {
				if (res.err)
					return dispatch({ type: "NOTIFY", payload: { error: res.err } });

				dispatch({ type: "ADD_ORDERS", payload: res.orders });

				if (auth.user.role === "admin") {
					getData("user", auth.token).then((res) => {
						if (res.err)
							return dispatch({
								type: "NOTIFY",
								payload: { error: res.err },
							});
						dispatch({ type: "ADD_USERS", payload: res.users });
					});
				}
			});
		} else {
			dispatch({ type: "ADD_ORDERS", payload: [] });
			dispatch({ type: "ADD_USERS", payload: [] });
		}
	}, [auth.token]);

	return (
		<DataContext.Provider value={{ state, dispatch }}>
			{children}
		</DataContext.Provider>
	);
};
