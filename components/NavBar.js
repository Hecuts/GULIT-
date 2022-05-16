/* eslint-disable @next/next/no-img-element */
import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { DataContext } from "../store/GlobalState";
import Cookie from "js-cookie";

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
	};

	const loggedRouter = () => {
		return (
			<li className="nav-item dropdown">
				<a
					className="nav-link dropdown-toggle"
					href="#"
					id="navbarDropdownMenuLink"
					role="button"
					data-bs-toggle="dropdown"
					aria-expanded="false"
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

				<ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
					<li>
						<a className="dropdown-item" href="#">
							Profile
						</a>
					</li>
					<li>
						<button className="dropdown-item" onClick={handleLogout}>
							Log out
						</button>
					</li>
				</ul>
			</li>
		);
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<div className="container-fluid">
				<Link href="/">
					<a className="navbar-brand">GulIT</a>
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNavDropdown"
					aria-controls="navbarNavDropdown"
					aria-expanded="false"
					aria-label="Toggle navigation"
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
								>
									<i
										className="fas fa-shopping-cart position-relative me-2"
										aria-hidden="true"
									>
										<span
											className="position-absolute"
											style={{
												padding: "3x 6px",
												background: "#ed143dc2",
												borderRadius: "50%",
												top: "-10px",
												right: "-10px",
												color: "white",
												fontSize: "14px",
												fontStyle: "normal",
											}}
										>
											{cart.length}
										</span>
									</i>
									Cart
								</a>
							</Link>
						</li>

						{Object.keys(auth).length === 0 ? (
							<li className="nav-item">
								<Link href="/signin">
									<a
										className={"nav-link" + isActive("/signin")}
										aria-current="page"
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
