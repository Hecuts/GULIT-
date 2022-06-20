/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useState, useContext } from "react";
import { DataContext } from "../../store/GlobalState";

const CreateProduct = () => {
	const initialState = {
		product_id: "",
		title: "",
		price: 0,
		inStock: 0,
		description: "",
		content: "",
		category: "",
	};
	const [product, setProduct] = useState(initialState);
	const { product_id, title, price, inStock, description, content, category } =
		product;

	const [images, setImages] = useState([]);

	const { state, dispatch } = useContext(DataContext);
	const { categories } = state;

	const handleChangeInput = (e) => {
		const { name, value } = e.target;
		setProduct({ ...product, [name]: value });
		dispatch({ type: "NOTIFY", payload: {} });
	};

	const handleUploadInput = (e) => {
		dispatch({ type: "NOTIFY", payload: {} });
		let newImages = [];
		let num = 0;
		let err = "";
		const files = [...e.target.files];

		if (files.length === 0)
			return dispatch({
				type: "NOTIFY",
				payload: { error: "File does not exist." },
			});

		files.forEach((file) => {
			if (file.size > 1024 * 1024 * 5)
				return (err = "Maximum file size is 5mb.");

			if (file.type !== "image/jpeg" && file.type !== "image/png")
				return (err = "File type is incorrect.");

			num += 1;
			if (num <= 5) newImages.push(file);
			return newImages;
		});

		if (err) dispatch({ type: "NOTIFY", payload: { error: err } });

		const imgCount = images.length;
		if (imgCount + newImages.length > 5)
			return dispatch({
				type: "NOTIFY",
				payload: { error: "Select up to 5 images" },
			});
		setImages([...images, ...newImages]);
	};

	const deleteImage = (index) => {
		const newArr = [...images];
		newArr.splice(index, 1);
		setImages(newArr);
	};
	return (
		<div className="products_manager">
			<Head>
				<title>Products Manager</title>
			</Head>

			<form className="row">
				<div className="col-md-6">
					<input
						type="text"
						name="product_id"
						value={product_id}
						placeholder="Product ID"
						className="d-block my-4 w-100 p-2"
						onChange={handleChangeInput}
					/>
					<input
						type="text"
						name="title"
						value={title}
						placeholder="Title"
						className="d-block my-4 w-100 p-2"
						onChange={handleChangeInput}
					/>

					<div className="row">
						<div className="col-sm-6">
							<input
								type="number"
								name="price"
								value={price}
								placeholder="Price"
								className="d-block my-4 w-100 p-2"
								onChange={handleChangeInput}
							/>
						</div>
						<div className="col-sm-6">
							<input
								type="number"
								name="inStock"
								value={inStock}
								placeholder="In Stock"
								className="d-block my-4 w-100 p-2"
								onChange={handleChangeInput}
							/>
						</div>
					</div>
					<textarea
						name="description"
						id="description"
						cols="30"
						rows="4"
						placeholder="Description"
						onChange={handleChangeInput}
						className="d-block my-4 w-100 p-2"
					/>
					<textarea
						name="content"
						id="content"
						cols="30"
						rows="6"
						placeholder="Content"
						onChange={handleChangeInput}
						className="d-block my-4 w-100 p-2"
					/>

					<div className="input-group px-0 my-2">
						<select
							name="category"
							id="category"
							value={category}
							onChange={handleChangeInput}
							className="form-select text-capitalize"
						>
							<option value="all">All Products</option>
							{categories.map((category) => (
								<option key={category._id} value={category._id}>
									{category.name}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="col-md-6 my-4">
					<div className="input-group mb-3">
						<div className="row">
							<div className="col">
								<div className="mb-3">
									<input
										className="form-control"
										type="file"
										id="formFile"
										onChange={handleUploadInput}
										multiple
										accept="image/*"
									/>
								</div>
							</div>
						</div>
						<div className="row img-up">
							{images.map((img, index) => (
								<div key={index} className="file_img my-2 px-0">
									<img
										src={img.url ? img.url : URL.createObjectURL(img)}
										alt=""
										className=" img-thumbnail rounded"
									/>
									<span onClick={() => deleteImage(index)}>X</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</form>
			<button type="submit" className="btn btn-info my-2 px-4">
				Create
			</button>
		</div>
	);
};

export default CreateProduct;
