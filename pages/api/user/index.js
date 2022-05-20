import connectDB from "../../../utils/connectDB";
import Users from "../../../models/userModel";
import auth from "../../../middleware/auth";

connectDB();

const Index = async (req, res) => {
	switch (req.method) {
		case "PATCH":
			await uploadInfo(req, res);
			break;
	}
};

const uploadInfo = async (req, res) => {
	try {
		const result = await auth(req, res);
		const { name, avatar } = req.body;

		const newUser = Users.findOneAndUpdate(
			{ _id: result.id },
			{ name, avatar }
		);

		res.json({
			msg: "Update Success!",
			user: {
				name,
				email: newUser.email,
				avatar,
				role: newUser.role,
			},
		});
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

export default Index;
