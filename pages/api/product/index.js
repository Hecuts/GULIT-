import connectDB from "../../../utils/connectDB";
import Products from "../../../models/productModel";
import auth from "../../../middleware/auth";

connectDB();

const Index = async (req, res) => {
	switch (req.method) {
		case "GET":
			await getProducts(req, res);
			break;

		case "POST":
			await createProduct(req, res);
			break;
	}
};

class APIfeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}
	//filtering
	filtering() {
		const queryObj = { ...this.queryString };

		const excludeFields = ["page", "sort", "limit"];
		excludeFields.forEach((el) => delete queryObj[el]);

		if (queryObj.category !== "all")
			this.query.find({ category: queryObj.category });

		if (queryObj.title !== "all")
			this.query.find({ tittle: { $regex: queryObj.title } });

		this.query.find();
		return this;
	}

	//sorting
	sorting() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(",").join("");
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort("-createdAt");
		}
		return this;
	}

	//pagination
	paginating() {
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 6;
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);
		return this;
	}
}

const getProducts = async (req, res) => {
	try {
		const features = new APIfeatures(Products.find(), req.query)
			.filtering()
			.sorting()
			.paginating();

		console.log("What I want: ", req.query);
		const products = await features.query;
		res.json({
			status: "success",
			result: products.length,
			products,
		});
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

const createProduct = async (req, res) => {
	try {
		//authenticate
		const result = await auth(req, res);
		//Check user role
		if (result.role !== "admin")
			return res.status(400).json({ err: "Authentication is not valid." });

		//Destructure the body
		const { title, price, inStock, description, content, category, images } =
			req.body;

		//Fields validation
		if (
			!title ||
			!price ||
			!inStock ||
			!description ||
			!content ||
			!category === "all" ||
			images.length === 0
		)
			return res.status(400).json({ err: "Please add all the fields." });

		//Create new product with <products schema>
		const newProduct = new Products({
			title: title.toLowerCase(),
			price,
			inStock,
			description,
			content,
			category,
			images,
		});

		await newProduct.save();

		res.json({ msg: "Success! Product Created." });
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

export default Index;
