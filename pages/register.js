import Head from "next/head";
import Link from "next/link";
import React, { useState, useContext, useEffect } from "react";
import valid from "../utils/valid";
import { DataContext } from "../store/GlobalState";
import { postData } from "../utils/fetchData";

const Register = () => {
	const initialState = { name: "", email: "", password: "", cf_password: "" };
	const [userData, setUserData] = useState(initialState);
	const { name, email, password, cf_password } = userData;

	const { state, dispatch } = useContext(DataContext);

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setUserData({ ...userData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const errMsg = valid(name, email, password, cf_password);
		if (errMsg) return dispatch({ type: "NOTIFY", payload: { error: errMsg } });

		dispatch({ type: "NOTIFY", payload: { loading: true } });

		const res = await postData("auth/register", userData);
		if (res.err)
			return dispatch({ type: "NOTIFY", payload: { error: res.err } });

		return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
	};

	return (
		<div>
			<Head>
				<title>Register Page</title>
			</Head>
			<form
				className="mx-auto my-4"
				style={{ maxWidth: "500px" }}
				onSubmit={handleSubmit}
			>
				<div className="mb-3">
					<label htmlFor="name" className="form-label">
						Name
					</label>
					<input
						type="text"
						className="form-control"
						id="name"
						name="name"
						value={name}
						onChange={handleChangeInput}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="exampleInputEmail1" className="form-label">
						Email address
					</label>
					<input
						type="email"
						className="form-control"
						id="exampleInputEmail1"
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
					<label htmlFor="exampleInputPassword1" className="form-label">
						Password
					</label>
					<input
						type="password"
						className="form-control"
						id="exampleInputPassword1"
						value={password}
						name="password"
						onChange={handleChangeInput}
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="exampleInputPassword2" className="form-label">
						Confirm Password
					</label>
					<input
						type="password"
						className="form-control"
						id="exampleInputPassword2"
						value={cf_password}
						name="cf_password"
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
					Register
				</button>
				<p>
					You already have an account?
					<Link href="/signin" style={{ color: "crimson" }}>
						Login
					</Link>
				</p>
			</form>
		</div>
	);
};
export default Register;
