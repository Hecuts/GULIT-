import NavBar from "./NavBar";
import Notify from "./Notify";
import "bootstrap/dist/css/bootstrap.css";
import Modal from "./Modal";

const Layout = ({ children }) => {
	return (
		<div className="container">
			<NavBar />
			<Notify />
			<Modal />
			{children}
		</div>
	);
};
export default Layout;
