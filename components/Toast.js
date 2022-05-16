const Toast = ({ msg, handleShow, bgColor }) => {
	return (
		<div
			className={`toast show position-fixed text-light ${bgColor}`}
			style={{ top: "5px", right: "5px", xIndex: 9, minWidth: "280px" }}
			// role="alert"
			// aria-live="assertive"
			// aria-atomic="true"
		>
			<div className={`toast-header ${bgColor} text-light`}>
				{/* <img src="..." className="rounded me-2" alt="..."> */}
				<strong className="me-auto text-light">{msg.title}</strong>
				{/* <small className="text-muted">11 mins ago</small> */}
				<button
					type="button"
					className="m1-2 mb-1 close text-light"
					data-bs-dismiss="toast"
					style={{ outline: "none", border: "none", background: "none" }}
					onClick={handleShow}
				>
					x
				</button>
			</div>
			<div className="toast-body">{msg.msg}</div>
		</div>
	);
};
export default Toast;
