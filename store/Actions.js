export const ACTIONS = {
	NOTIFY: "NOTIFY",
	AUTH: "AUTH",
	ADD_CART: "ADD_CART",
	MODAL: "MODAL",
};

export const addToCart = (product, cart) => {
	if (product.inStock === 0) {
		return {
			type: "NOTIFY",
			payload: { error: "This product is out of stock." },
		};
	}
	//Check if the item is already added or not
	const check = cart.every((item) => {
		return item._id !== product._id;
	});

	//If not added, notify
	if (!check) {
		return {
			type: "NOTIFY",
			payload: { error: "product has been added to cart" },
		};
	}

	/* Add to cart
	 * Keep previously added items in the cart
	 * Keep previous product state
	 * add a quantity of 1
	 */
	return { type: "ADD_CART", payload: [...cart, { ...product, quantity: 1 }] };
};

export const increase = (data, id) => {
	const newData = [...data];
	newData.forEach((item) => {
		if (item._id === id) item.quantity += 1;
	});

	return { type: "ADD_CART", payload: newData };
};

export const decrease = (data, id) => {
	const newData = [...data];
	newData.forEach((item) => {
		if (item._id === id) item.quantity -= 1;
	});

	return { type: "ADD_CART", payload: newData };
};

export const deleteItem = (data, id, type) => {
	const newData = data.filter((item) => item._id !== id);
	return { type, payload: newData };
};
