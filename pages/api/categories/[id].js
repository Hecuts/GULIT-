import connectDB from "../../../utils/connectDB";
import Categories from "../../../models/categoriesModel";
import auth from "../../../middleware/auth";

connectDB();

const Index = async (req, res) => {
	switch (req.method) {
		case "PUT":
			await updateCategory(req, res);
			break;
		case "DELETE":
			await deleteCategories(req, res);
			break;
	}
};

const updateCategory = async (req, res) => {
	try {
		const result = await auth(req, res);
		if (result.role !== "admin")
			return res.status(400).json({ err: "Authentication is not valid." });

		const { id } = req.query;
		const { name } = req.body;

		const newCategory = await Categories.findOneAndUpdate(
			{ _id: id },
			{ name }
		);
		res.json({
			msg: "Success! Category updated.",
			category: { ...newCategory._id, name },
		});
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

const deleteCategories = async (req, res) => {
	try {
		const result = await auth(req, res);
		if (result.role !== "admin")
			return res.status(400).json({ err: "Authentication is not valid." });

		const { id } = req.query;
		await Categories.findByIdAndDelete(id);
		res.json({ msg: "Success! Category deleted." });
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

export default Index;
