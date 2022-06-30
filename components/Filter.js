import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import filterSearch from "../utils/filterSearch";

const Filter = ({ state }) => {
	const [search, setSearch] = useState("");
	const [sort, setSort] = useState("");
	const [category, setCategory] = useState("");

	const { categories } = state;
	const router = useRouter();

	const handleCategory = (e) => {
		setCategory(e.target.value);
		filterSearch({ router, category: e.target.value });
	};

	const handleSort = (e) => {
		setSort(e.target.value);
		filterSearch({ router, sort: e.target.value });
	};

	useEffect(() => {
		filterSearch({ router, search: search ? search.toLowerCase() : "all" });
	}, [search]);

	return (
		<div className="input-group center-block filter">
			<div className="col-md-2 px-0 my-2 me-1">
				<select
					className="form-select text-capitalize"
					value={category}
					onChange={handleCategory}
				>
					<option value="all">All</option>

					{categories.map((item) => (
						<option value={item._id} key={item._id}>
							{item.name}
						</option>
					))}
				</select>
			</div>

			<form autoComplete="off" className="my-2 col-md-6 px-0 me-1">
				<input
					type="text"
					className="form-control"
					list="title_product"
					placeholder="Search products"
					value={search.toLowerCase()}
					onChange={(e) => {
						setSearch(e.target.value);
					}}
				/>
			</form>

			<div className="col-md-2 px-0 my-2">
				<select
					className="form-select text-capitalize"
					value={sort}
					onChange={handleSort}
				>
					<option value="-createdAt">Newest</option>
					<option value="oldest">Oldest</option>
					<option value="-sold">Best Sales</option>
					<option value="-price">Price: High - Low</option>
					<option value="price">Price: Low - High</option>
				</select>
			</div>
		</div>
	);
};

export default Filter;
