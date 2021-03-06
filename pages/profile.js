/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { DataContext } from "../store/GlobalState";
import { useContext, useState, useEffect } from "react";
import valid from "../utils/valid";
import { patchData } from "../utils/fetchData";
import { imageUpload } from "../utils/imageUpload";
import Link from "next/link";

const Profile = () => {
	const initialState = {
		avatar: "",
		name: "",
		password: "",
		cf_password: "",
	};
	const [data, setData] = useState(initialState);
	const { avatar, name, password, cf_password } = data;

	const { state, dispatch } = useContext(DataContext);
	const { auth, notify, orders } = state;

	useEffect(() => {
		if (auth.user) setData({ ...data, name: auth.user.name });
	}, [auth.user]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setData({ ...data, [name]: value });
		dispatch({ type: "NOTIFY", payload: {} });
	};

	const handleUpdateProfile = (e) => {
		e.preventDefault();
		if (password) {
			const errMsg = valid(name, auth.user.email, password, cf_password);
			if (errMsg)
				return dispatch({ type: "NOTIFY", payload: { error: errMsg } });
			updatePassword();
		}
		if (name !== auth.user.name || avatar) updateInfo();
	};

	//Update Password
	const updatePassword = () => {
		dispatch({ type: "NOTIFY", payload: { loading: true } });
		patchData("user/resetPassword", { password }, auth.token).then((res) => {
			if (res.err)
				return dispatch({ type: "NOTIFY", payload: { error: res.err } });
			return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
		});
	};

	//Change avatar
	const changeAvatar = (e) => {
		const file = e.target.files[0];
		//File validation
		if (!file)
			return dispatch({
				type: "NOTIFY",
				payload: { error: "File does not exist!" },
			});

		if (file.size > 1024 * 1024 * 5)
			return dispatch({
				type: "NOTIFY",
				payload: { error: "File size greater than 5mb!" },
			});

		if (file.type !== "image/jpeg" && file.type !== "image/png")
			return dispatch({
				type: "NOTIFY",
				payload: { error: "Incorrect image format!" },
			});
		setData({ ...data, avatar: file });
	};

	const updateInfo = async () => {
		let media;
		dispatch({ type: "NOTIFY", payload: { loading: true } });

		if (avatar) media = await imageUpload([avatar]);

		patchData(
			"user",
			{
				name,
				avatar: avatar ? media[0].url : auth.user.avatar,
			},
			auth.token
		).then((res) => {
			if (res.err) {
				return dispatch({ type: "NOTIFY", payload: { error: res.err } });
			}
			dispatch({
				type: "AUTH",
				payload: {
					token: auth.token,
					user: res.user,
				},
			});
			return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
		});
	};

	if (!auth.user) return null;

	return (
		<div className="profile_page">
			<Head>
				<title>Profile Page</title>
			</Head>
			<section className="row text-dark my-3 mx-2">
				<div className="col-md-4">
					<h3 className="text-center text-uppercase">
						{auth.user.role == "user" ? "User Profile" : "Admin Profile"}
					</h3>
					<hr className="mx-0 my-0" style={{ color: "#1ed760" }} />
					<div className="avatar">
						<img
							src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
							alt={avatar}
						/>
						<span>
							<i className="fas fa-camera"></i>
							<p>Change</p>
							<input
								accept="image/*"
								type="file"
								name="file"
								id="file_up"
								onChange={changeAvatar}
							/>
						</span>
					</div>

					<div className="form-group">
						<label htmlFor="name">Name</label>
						<input
							type="text"
							name="name"
							value={name}
							className="form-control"
							placeholder="Your name"
							onChange={handleChange}
						/>
					</div>

					<div className="form-group my-1">
						<label htmlFor="email">Email</label>
						<input
							type="text"
							name="email"
							defaultValue={auth.user.email}
							className="form-control"
							disabled={true}
						/>
					</div>

					<div className="form-group my-1">
						<label htmlFor="password">New Password</label>
						<input
							type="password"
							name="password"
							value={password}
							className="form-control"
							placeholder="Your New Password"
							onChange={handleChange}
						/>
					</div>

					<div className="form-group my-1">
						<label htmlFor="cf_password">Confirm Password</label>
						<input
							type="password"
							name="cf_password"
							value={cf_password}
							className="form-control"
							onChange={handleChange}
						/>
					</div>

					<button
						className="btn btn_sec my-2"
						disabled={notify.loading}
						onClick={handleUpdateProfile}
					>
						Update
					</button>
				</div>
				<div className="col-md-8 table-responsive">
					<h3 className="text-uppercase text-center ">Orders</h3>
					<hr className="mx-0 my-0" style={{ color: "#1ed760" }} />
					<div className="my-3">
						<table
							className="table-bordered table-hover w-100 text-uppercase"
							style={{ minWidth: "600px", cursor: "pointer" }}
						>
							<thead className="bg-light fw-bold ">
								<tr>
									<td className="p-2">id</td>
									<td className="p-2">data</td>
									<td className="p-2">total</td>
									<td className="p-2">delivered</td>
									<td className="p-2">paid</td>
								</tr>
							</thead>
							<tbody>
								{orders.map((order) => (
									<tr key={order._id}>
										<td className="p-2">
											<Link href={`/order/${order._id}`}>
												<a>{order._id}</a>
											</Link>
										</td>
										<td className="p-2">
											{new Date(order.createdAt).toLocaleDateString()}
										</td>
										<td className="p-2">${order.total}</td>
										<td className="p-2">
											{order.delivered ? (
												<i className="fas fa-check text-success"></i>
											) : (
												<i className="fas fa-times text-danger"></i>
											)}
										</td>
										<td className="p-2">
											{order.paid ? (
												<i className="fas fa-check text-success"></i>
											) : (
												<i className="fas fa-times text-danger"></i>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</section>
		</div>
	);
};
export default Profile;
