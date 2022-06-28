/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useContext } from "react";
import { DataContext } from "../store/GlobalState";
import Link from "next/link";

const Users = () => {
	const { state, dispatch } = useContext(DataContext);
	const { users, auth, modal } = state;

	if (!auth.user) return null;
	return (
		<div className="table-responsive">
			<Head>
				<title>Users</title>
			</Head>

			<table className="table w-100">
				<thead>
					<tr>
						<th></th>
						<th>ID</th>
						<th>Avatar</th>
						<th>Name</th>
						<th>Email</th>
						<th>Admin</th>
						<th>Action</th>
					</tr>
				</thead>

				<tbody>
					{users.map((user, index) => (
						<tr key={user._id} style={{ cursor: "pointer" }}>
							<th>{index + 1}</th>
							<th>{user._id}</th>
							<th>
								{
									<img
										src={user.avatar}
										alt={user.avatar}
										style={{
											width: "30px",
											height: "30px",
											borderRadius: "100%",
											overflow: "hidden",
											objectFit: "cover",
										}}
									/>
								}
							</th>
							<th>{user.name}</th>
							<th>{user.email}</th>
							<th>
								{user.role === "admin" ? (
									user.root ? (
										<i className="fas fa-check text-success"> Admin</i>
									) : (
										<i className="fas fa-check text-success"></i>
									)
								) : (
									<i className="fas fa-times text-danger"></i>
								)}
							</th>
							<th>
								<Link
									href={
										(auth.user.root && auth.user.email) !== user.email
											? `/edit_user/${user._id}`
											: "#!"
									}
								>
									<a>
										<i
											className="fas fa-edit text-secondary  ms-2"
											title="Edit"
										></i>
									</a>
								</Link>

								{(auth.user.root && auth.user.email) !== user.email ? (
									<i
										className="fas fa-trash-alt text-danger ms-2"
										title="Remove"
										data-bs-toggle="modal"
										data-bs-target="#deleteModal"
										onClick={() =>
											dispatch({
												type: "MODAL",
												payload: [
													{
														data: users,
														id: user._id,
														title: user.name,
														type: "ADD_USERS",
													},
												],
											})
										}
									></i>
								) : (
									<i
										className="fas fa-trash-alt text-danger ms-2"
										title="Remove"
									></i>
								)}
							</th>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
export default Users;
