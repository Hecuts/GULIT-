import Layout from "../components/Layout";
// import React, { useEffect } from "react";
import "../styles/globals.css";
// import "bootstrap/dist/css/bootstrap.css";
import { DataProvider } from "../store/GlobalState";

const MyApp = ({ Component, pageProps }) => {
	// useEffect(() => {
	// 	import("bootstrap/dist/js/bootstrap");
	// }, []);

	return (
		<DataProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</DataProvider>
	);
};

export default MyApp;
