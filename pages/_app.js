import Layout from "../components/Layout";
import React, { useEffect } from "react";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import { DataProvider } from "../store/GlobalState";
import Script from "next/script";

const MyApp = ({ Component, pageProps }) => {
	useEffect(() => {
		import("bootstrap/dist/js/bootstrap");
	}, []);

	return (
		<DataProvider>
			<Layout>
				<Script src="https://www.paypal.com/sdk/js?client-id=test&currency=USD" />
				<Component {...pageProps} />
			</Layout>
		</DataProvider>
	);
};

export default MyApp;
