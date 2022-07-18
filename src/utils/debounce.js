function debounce(callback, delay = 100) {
	let timeoutId;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			callback(args);
		}, delay);
	};
}

export default debounce;
