import Head from "next/head";
import Link from "next/link";
import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import { postData } from "../utils/fetchData";
import Cookie from "js-cookie";
import { useRouter } from "next/router";

const Signin = () => {
	const initialState = { email: "", password: "" };
	const [userData, setUserData] = useState(initialState);
	const { email, password } = userData;

	const { state, dispatch } = useContext(DataContext);
	const { auth } = state;

	const router = useRouter();

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		//Loading
		dispatch({ type: "NOTIFY", payload: { loading: true } });

		//send post request
		const res = await postData("auth/login", userData);
		if (res.err)
			return dispatch({ type: "NOTIFY", payload: { error: res.err } });

		dispatch({ type: "NOTIFY", payload: { success: res.msg } });
		//authenticate
		dispatch({
			type: "AUTH",
			payload: {
				token: res.access_token,
				user: res.user,
			},
		});

		//set cookie and refresh token
		Cookie.set("refreshtoken", res.refresh_token, {
			path: "api/auth/accessToken",
			expires: 7,
		});
		localStorage.setItem("firstLogin", true);
	};

	useEffect(() => {
		if (Object.keys(auth).length !== 0) router.push("/");
	}, [auth]);

	return (
		<div>
			<Head>
				<title>Signin Page</title>
			</Head>
			<form
				className="mx-auto my-4"
				style={{ maxWidth: "500px" }}
				onSubmit={handleSubmit}
			>
				<div className="mb-3">
					<label htmlFor="email" className="form-label">
						Email address
					</label>
					<input
						type="email"
						className="form-control"
						id="email"
						aria-describedby="emailHelp"
						name="email"
						value={email}
						onChange={handleChangeInput}
					/>
					<div id="emailHelp" className="form-text">
						We will never share your email with anyone else.
					</div>
				</div>
				<div className="mb-3">
					<label htmlFor="password" className="form-label">
						Password
					</label>
					<input
						type="password"
						className="form-control"
						id="password"
						name="password"
						value={password}
						onChange={handleChangeInput}
					/>
				</div>
				<div className="mb-3 form-check">
					<input
						type="checkbox"
						className="form-check-input"
						id="exampleCheck1"
					/>
					<label className="form-check-label" htmlFor="exampleCheck1">
						Check me out
					</label>
				</div>
				<button type="submit" className="btn btn-dark w-100">
					Login
				</button>
				<p>
					You do not have an account?
					<Link href="/register" style={{ color: "crimson" }}>
						Register Now
					</Link>
				</p>
			</form>
		</div>
	);
};
export default Signin;
