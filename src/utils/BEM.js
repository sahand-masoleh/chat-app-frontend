function BEM(block, element, ...modifiers) {
	const base = element ? `${block}__${element}` : block;
	const classNames = [base];

	if (modifiers) {
		modifiers.forEach((modifier) => {
			if (modifier) {
				classNames.push(`${base}--${modifier}`);
			}
		});
	}

	return classNames.join(" ");
}

export default BEM;
