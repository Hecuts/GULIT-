/* eslint-disable @next/next/no-sync-scripts */
// In _document.js
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					<link
						href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
						rel="stylesheet"
						integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
						crossOrigin="anonymous"
					></link>
					<script
						src={`https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID}&currency=USD`}
						strategy="beforeInteractive"
					></script>
					<script src="https://kit.fontawesome.com/a076d05399.js"></script>
					<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
					<script
						src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
						integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
						crossOrigin="anonymous"
					></script>
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
