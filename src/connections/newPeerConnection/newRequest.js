function newRequest() {
	let accept;
	let refuse;

	const request = new Promise((resolve, reject) => {
		accept = resolve;
		refuse = reject;
	});

	function waitForClient() {
		return request;
	}

	return { accept, refuse, waitForClient };
}

export default newRequest;
