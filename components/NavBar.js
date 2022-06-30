/* eslint-disable @next/next/no-img-element */
import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { DataContext } from "../store/GlobalState";
import Cookie from "js-cookie";
import Filter from "./Filter";

const NavBar = () => {
	const router = useRouter();

	const { state, dispatch } = useContext(DataContext);
	const { auth, cart } = state;

	const isActive = (r) => {
		if (r === router.pathname) {
			return " active";
		} else {
			return "";
		}
	};

	const handleLogout = () => {
		Cookie.remove("refreshtoken", { path: "api/auth/accessToken" });
		localStorage.removeItem("firstLogin");
		dispatch({ type: "AUTH", payload: {} });
		dispatch({
			type: "NOTIFY",
			payload: { success: "Logged out successful!" },
		});
		return router.push("/");
	};

	const adminRouter = () => {
		return (
			<>
				<Link href="/users">
					<a className="dropdown-item">Users</a>
				</Link>
				<Link href="/create">
					<a className="dropdown-item">Products</a>
				</Link>
				<Link href="/categories">
					<a className="dropdown-item">Categories</a>
				</Link>
			</>
		);
	};

	const loggedRouter = () => {
		return (
			<li className="nav-item dropdown me-2 ">
				<a
					className="nav-link dropdown-toggle"
					href="#"
					id="navbarDropdownMenuLink"
					role="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
					style={{ color: "white" }}
				>
					<img
						src={auth.user.avatar}
						alt={auth.user.name}
						style={{
							borderRadius: "50%",
							width: "30px",
							height: "30px",
							transform: "translateY(-3px)",
							marginRight: "3px",
						}}
					/>
					{auth.user.name}
				</a>

				<div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
					<Link href="/profile">
						<a className="dropdown-item">Profile</a>
					</Link>
					{auth.user.role === "admin" && adminRouter()}
					<div className="dropdown-divider border-success"></div>
					<button className="dropdown-item" onClick={handleLogout}>
						Log out
					</button>
				</div>
			</li>
		);
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<div className="container-fluid">
				<Link href="/">
					<a style={{ color: "#1ed760" }} className="navbar-brand">
						GulIT
					</a>
				</Link>
				{/* <Filter state={state} /> */}
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNavDropdown"
					aria-controls="navbarNavDropdown"
					aria-expanded="false"
					aria-label="Toggle navigation"
					style={{ borderColor: "#1ed760" }}
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div
					className="collapse navbar-collapse justify-content-end"
					id="navbarNavDropdown"
				>
					<ul className="navbar-nav">
						<li className="nav-item">
							<Link href="/cart">
								<a
									className={"nav-link" + isActive("/cart")}
									aria-current="page"
									style={{ color: "white" }}
								>
									<i
										className="fas fa-shopping-cart position-relative me-2"
										aria-hidden="true"
										style={{ color: "white" }}
									>
										<span
											className="position-absolute"
											style={{
												padding: "3x 6px",
												background: "green",
												borderRadius: "50%",
												top: "-13px",
												right: "5px",
												color: "white",
												fontSize: "14px",
											}}
										>
											{cart.length}
										</span>
									</i>
									Cart
								</a>
							</Link>
						</li>
						<hr className="mx-0 my-0" style={{ color: "#1ed760" }} />

						{Object.keys(auth).length === 0 ? (
							<li className="nav-item">
								<Link href="/signin">
									<a
										className={"nav-link" + isActive("/signin")}
										aria-current="page"
										style={{ color: "white" }}
									>
										Signin
									</a>
								</Link>
							</li>
						) : (
							loggedRouter()
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};
export default NavBar;
