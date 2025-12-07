class Wrapper {
	constructor(config = {}) {
		this.config = {
			defaultClass: "pinglet-wigdet-wrapper",
			autoCloseDelay: 5000,
			brandingText: "Powered by Enjoys",
			brandingPosition: "right",
			maxStack: 3,
			...config,
		};

		// Create containers
		this.containerRight = this._createContainer("right");
		this.containerLeft = this._createContainer("left");

		// Queues per side
		this.queues = { left: [], right: [] };
	}

	/**
	 * Creates a container element for the given side (left or right).
	 * If the container already exists, it is simply returned.
	 * Otherwise, a new container element is created and appended to the document body.
	 * The container element is positioned at the bottom of the viewport with a gap of 20px
	 * and is set to display as a flex container with a column-reverse direction and a gap of 10px.
	 * The container element has a z-index of 9999 to ensure that it is always on top.
	 * @param {string} side - The side of the container to create (left or right).
	 * @returns {HTMLDivElement} The created or retrieved container element.
	 */
	_createContainer(side) {
		const id = `container-${side}`;
		let container = document.getElementById(id);
		if (!container) {
			container = document.createElement("div");
			container.id = id;
			container.style.position = "fixed";
			container.style.bottom = "20px";
			container.style[side] = "20px";
			container.style.display = "flex";
			container.style.flexDirection = "column-reverse";
			container.style.gap = "10px";
			container.style.zIndex = 9999;
			container.classList.add(this.config.defaultClass);
			document.body.appendChild(container);
		}
		return container;
	}

	// Push dynamic elements as wrapper
	createWrapper(dynamicElements = [], options = {}) {
		const side = options.side || "right";
		const finalConfig = { ...this.config, ...options };
		const container =
			side === "left" ? this.containerLeft : this.containerRight;

		const wrapper = document.createElement("div");
		wrapper.style.position = "relative";
		wrapper.style.width = "300px";
		wrapper.style.padding = "20px";
		wrapper.style.borderRadius = "10px";
		wrapper.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
		wrapper.style.backgroundColor = "#fff";
		wrapper.style.transition = "transform 0.3s ease, opacity 0.3s ease";
		wrapper.style.opacity = "0";
		wrapper.style.transform = "translateY(40px)";
		wrapper.classList.add(this.config.defaultClass);

		// Animate in
		requestAnimationFrame(() => {
			wrapper.style.transition = "transform 0.4s ease, opacity 0.4s ease";
			wrapper.style.opacity = "1";
			wrapper.style.transform = "translateY(0)";
		});

		// Dynamic content
		wrapper.insideElements = dynamicElements;
		dynamicElements.forEach((el) => {
			console.log(el);
			if (el instanceof HTMLElement) {
				el.style.margin = "5px 0";
				wrapper.appendChild(el);
			}
		});

		// Close button (dynamic side)
		const closeBtn = document.createElement("button");
		closeBtn.innerText = "×";
		closeBtn.style.position = "absolute";
		closeBtn.style.top = "-10px";
		// Dynamic position: right for left-side wrapper, left for right-side wrapper
		if (side === "left") {
			closeBtn.style.right = "-10px";
		} else {
			closeBtn.style.left = "-10px";
		}
		closeBtn.style.width = "25px";
		closeBtn.style.height = "25px";
		closeBtn.style.borderRadius = "50%";
		closeBtn.style.border = "none";
		closeBtn.style.backgroundColor = "#f00";
		closeBtn.style.color = "#fff";
		closeBtn.style.fontWeight = "bold";
		closeBtn.style.cursor = "pointer";
		closeBtn.addEventListener("click", () =>
			this._removeWrapper(wrapper, side),
		);

		wrapper.appendChild(closeBtn);

		// Branding
		const branding = document.createElement("div");
		branding.innerText = finalConfig.brandingText;
		branding.style.position = "absolute";
		branding.style.bottom = "5px";
		branding.style[finalConfig.brandingPosition] = "10px";
		branding.style.fontSize = "12px";
		branding.style.color = "#666";
		branding.classList.add("pinglet-branding");
		wrapper.appendChild(branding);

		// Auto-close
		let closeTimeout;
		const startCloseTimer = () => {
			closeTimeout = setTimeout(
				() => this._removeWrapper(wrapper, side),
				finalConfig.autoCloseDelay,
			);
		};
		const stopCloseTimer = () => clearTimeout(closeTimeout);
		wrapper.addEventListener("mouseenter", stopCloseTimer);
		wrapper.addEventListener("mouseleave", startCloseTimer);
		startCloseTimer();

		// Show or queue
		if (container.children.length < this.config.maxStack) {
			container.appendChild(wrapper);
		} else {
			this.queues[side].push(wrapper);
		}

		return wrapper;
	}

	_removeWrapper(wrapper, side) {
		wrapper.style.opacity = "0";
		wrapper.classList.remove("wrapper-animate-in");

		wrapper.style.transform = "translateY(40px)";
		wrapper.classList.add("wrapper-animate-out");
		wrapper.addEventListener(
			"transitionend",
			() => {
				wrapper.remove();
				this._processQueue(side);
			},
			{ once: true },
		);
	}

	_processQueue(side) {
		const container =
			side === "left" ? this.containerLeft : this.containerRight;
		if (this.queues[side].length === 0) return;
		if (container.children.length < this.config.maxStack) {
			const nextWrapper = this.queues[side].shift();
			container.appendChild(nextWrapper);
		}
	}
}
export default Wrapper;
