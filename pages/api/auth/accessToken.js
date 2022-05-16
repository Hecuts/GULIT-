import connectDB from "../../../utils/connectDB";
import Users from "../../../models/userModel";
import {
	createAccessToken,
	createRefreshToken,
} from "../../../utils/generateToken";
import jwt from "jsonwebtoken";

connectDB();

const accessToken = async (req, res) => {
	try {
		const rf_token = req.cookies.refreshToken;
		if (!rf_token) return res.status(400).json({ err: "Please login now!" });
		const result = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET);
		if (!result)
			return res.status(400).json({ err: "Invalid Token or Token expired" });

		const user = await Users.findById(result.id);
		if (!user) return res.status(400).json({ err: "User does not exist!" });

		const access_token = createAccessToken({ id: user._id });

		res.json({
			access_token,
			user: {
				name: user.name,
				email: user.email,
				role: user.role,
				avatar: user.avatar,
				root: user.root,
			},
		});
	} catch (error) {
		return res.status(500).json({ err: error.message });
	}
};

export default accessToken;
