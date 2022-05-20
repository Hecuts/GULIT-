/* eslint-disable @next/next/no-sync-scripts */
// In _document.js
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<script
						src={`https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID}&currency=USD`}
						strategy="beforeInteractive"
					></script>
					<script src="https://kit.fontawesome.com/a076d05399.js"></script>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
export default MyDocument;
