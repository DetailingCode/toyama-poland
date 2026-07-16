document.addEventListener("DOMContentLoaded", function () {
	/* ---------- Theme toggle ---------- */
	if (localStorage.getItem("tp-theme") === "light") {
		document.documentElement.setAttribute("data-theme", "light");
	}
	document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
		btn.addEventListener("click", function () {
			var isLight = document.documentElement.getAttribute("data-theme") === "light";
			if (isLight) {
				document.documentElement.removeAttribute("data-theme");
				localStorage.setItem("tp-theme", "dark");
			} else {
				document.documentElement.setAttribute("data-theme", "light");
				localStorage.setItem("tp-theme", "light");
			}
		});
	});

	/* ---------- Charging time calculator ---------- */
	(function () {
		var calcCurrent = document.getElementById("calc-current");
		var calcCapacity = document.getElementById("calc-capacity");
		var calcSoc = document.getElementById("calc-soc");
		var calcResult = document.getElementById("calc-result");
		if (!calcCurrent || !calcCapacity || !calcSoc || !calcResult) return;

		var LANG = document.documentElement.lang === "en" ? "en" : "pl";
		var calcCurrentValue = document.getElementById("calc-current-value");
		var calcCapacityValue = document.getElementById("calc-capacity-value");
		var calcSocValue = document.getElementById("calc-soc-value");

		function fillSlider(el) {
			var min = parseFloat(el.min);
			var max = parseFloat(el.max);
			var val = parseFloat(el.value);
			var pct = ((val - min) / (max - min)) * 100;
			el.style.background = "linear-gradient(to right, var(--accent) " + pct + "%, var(--abyss-700) " + pct + "%)";
		}

		function formatTime(hours) {
			var totalMinutes = Math.round(hours * 60);
			var h = Math.floor(totalMinutes / 60);
			var m = totalMinutes % 60;
			var hLabel = LANG === "en" ? "h" : "godz.";
			var mLabel = "min";
			if (h === 0 && m === 0) return "0 " + mLabel;
			var parts = [];
			if (h > 0) parts.push(h + " " + hLabel);
			if (m > 0) parts.push(m + " " + mLabel);
			return parts.join(" ");
		}

		function updateCalc() {
			var current = parseFloat(calcCurrent.value);
			var capacity = parseFloat(calcCapacity.value);
			var soc = parseFloat(calcSoc.value);

			calcCurrentValue.textContent = current + "A";
			calcCapacityValue.textContent = capacity + "Ah";
			calcSocValue.textContent = soc + "%";

			fillSlider(calcCurrent);
			fillSlider(calcCapacity);
			fillSlider(calcSoc);

			var remaining = capacity * (1 - soc / 100);
			var hours = remaining / (current * 0.8);
			calcResult.textContent = formatTime(hours);
		}

		[calcCurrent, calcCapacity, calcSoc].forEach(function (el) {
			el.addEventListener("input", updateCalc);
		});

		updateCalc();
	})();

	/* ---------- Loader ---------- */
	var loader = document.querySelector(".tp-loader");
	if (loader) {
		window.addEventListener("load", function () {
			setTimeout(function () {
				loader.classList.add("is-hidden");
			}, 350);
		});
	}

	/* ---------- Scroll progress + Ah counter ---------- */
	var progress = document.querySelector(".scroll-progress");
	var ahCounter = document.querySelector(".scroll-ah-counter");
	var ahValue = document.getElementById("scroll-ah-value");
	var AH_MAX = 240;
	function updateProgress() {
		var h = document.documentElement;
		var scrolled = h.scrollTop;
		var height = h.scrollHeight - h.clientHeight;
		var pct = height > 0 ? scrolled / height : 0;
		if (progress) progress.style.width = (pct * 100) + "%";
		if (ahCounter && ahValue) {
			ahValue.textContent = Math.round(pct * AH_MAX);
			ahCounter.classList.toggle("is-visible", scrolled > 40);
		}
	}
	document.addEventListener("scroll", updateProgress, { passive: true });
	updateProgress();

	/* ---------- Nav: dropdowns (desktop hover, click toggles) ---------- */
	var navItems = document.querySelectorAll("[data-has-dropdown]");
	var isTouch = window.matchMedia("(hover: none)").matches;

	navItems.forEach(function (item) {
		var link = item.querySelector(".nav-link");

		function open() { item.classList.add("is-open"); link && link.classList.add("is-open"); }
		function close() { item.classList.remove("is-open"); link && link.classList.remove("is-open"); }
		function toggle(e) {
			e.preventDefault();
			e.stopPropagation();
			var willOpen = !item.classList.contains("is-open");
			navItems.forEach(close);
			if (willOpen) open();
		}

		var isMobilePanelItem = item.closest(".mobile-panel");

		if (!isTouch && !isMobilePanelItem) {
			item.addEventListener("mouseenter", open);
			item.addEventListener("mouseleave", close);
		}
		/* Touch/mobile-panel has no hover: first tap opens the dropdown instead of navigating. Desktop links navigate normally on click since hover already reveals the dropdown. */
		if (link && (isTouch || isMobilePanelItem)) link.addEventListener("click", toggle);
	});

	document.addEventListener("click", function (e) {
		if (!e.target.closest("[data-has-dropdown]")) {
			navItems.forEach(function (item) { item.classList.remove("is-open"); });
		}
	});

	/* ---------- Mobile menu toggle ---------- */
	var navToggle = document.querySelector(".nav-toggle");
	var mobilePanel = document.querySelector(".mobile-panel");
	if (navToggle && mobilePanel) {
		navToggle.addEventListener("click", function () {
			mobilePanel.classList.toggle("is-open");
			document.body.style.overflow = mobilePanel.classList.contains("is-open") ? "hidden" : "";
		});
		mobilePanel.querySelectorAll("a:not([data-has-dropdown] > .nav-link)").forEach(function (a) {
			a.addEventListener("click", function () {
				mobilePanel.classList.remove("is-open");
				document.body.style.overflow = "";
			});
		});
	}

	/* ---------- Clickable category cards ---------- */
	document.querySelectorAll(".product-card[data-href]").forEach(function (card) {
		card.addEventListener("click", function (e) {
			if (e.target.closest("a")) return;
			window.location.href = card.getAttribute("data-href");
		});
	});

	/* ---------- Scroll reveal ---------- */
	var revealEls = document.querySelectorAll(".reveal");
	if ("IntersectionObserver" in window && revealEls.length) {
		var io = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible");
						io.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
		);
		revealEls.forEach(function (el) { io.observe(el); });
	} else {
		revealEls.forEach(function (el) { el.classList.add("is-visible"); });
	}

	/* ---------- Animated counters ---------- */
	var counters = document.querySelectorAll("[data-count]");
	if ("IntersectionObserver" in window && counters.length) {
		var counterIo = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					counterIo.unobserve(entry.target);
					var el = entry.target;
					var target = parseFloat(el.getAttribute("data-count"));
					var decimals = target % 1 !== 0 ? 1 : 0;
					var suffix = el.getAttribute("data-suffix") || "";
					var duration = 1400;
					var start = null;
					function step(ts) {
						if (!start) start = ts;
						var progressRatio = Math.min((ts - start) / duration, 1);
						var eased = 1 - Math.pow(1 - progressRatio, 3);
						var value = target * eased;
						el.textContent = value.toFixed(decimals) + suffix;
						if (progressRatio < 1) requestAnimationFrame(step);
					}
					requestAnimationFrame(step);
				});
			},
			{ threshold: 0.4 }
		);
		counters.forEach(function (el) { counterIo.observe(el); });
	}

	/* ---------- Product gallery ---------- */
	document.querySelectorAll("[data-gallery]").forEach(function (gallery) {
		var images;
		try {
			images = JSON.parse(gallery.getAttribute("data-images") || "[]");
		} catch (e) {
			images = [];
		}
		var prevBtn = gallery.querySelector("[data-gallery-prev]");
		var nextBtn = gallery.querySelector("[data-gallery-next]");
		var dotsWrap = gallery.querySelector("[data-gallery-dots]");
		if (images.length < 2) {
			if (prevBtn) prevBtn.style.display = "none";
			if (nextBtn) nextBtn.style.display = "none";
			if (dotsWrap) dotsWrap.style.display = "none";
			return;
		}
		var current = 0;
		var imgEl = gallery.querySelector("[data-gallery-img]");
		var dots = gallery.querySelectorAll("[data-gallery-dot]");
		function show(index) {
			current = (index + images.length) % images.length;
			imgEl.style.opacity = "0";
			setTimeout(function () {
				imgEl.src = images[current];
				imgEl.style.opacity = "1";
			}, 150);
			dots.forEach(function (d, i) { d.classList.toggle("is-active", i === current); });
		}
		if (prevBtn) prevBtn.addEventListener("click", function () { show(current - 1); });
		if (nextBtn) nextBtn.addEventListener("click", function () { show(current + 1); });
		dots.forEach(function (d, i) {
			d.addEventListener("click", function () { show(i); });
		});
	});

	/* ---------- Cookie banner ---------- */
	var cookieBox = document.querySelector(".cookie-box");
	if (cookieBox) {
		if (!localStorage.getItem("tp-cookies-accepted")) {
			setTimeout(function () { cookieBox.classList.add("is-visible"); }, 1200);
		}
		var acceptBtn = cookieBox.querySelector(".cookie-accept");
		if (acceptBtn) {
			acceptBtn.addEventListener("click", function () {
				localStorage.setItem("tp-cookies-accepted", "1");
				cookieBox.classList.remove("is-visible");
			});
		}
	}

	/* ---------- Dealer search + voivodeship filter (gdziekupic.html) ---------- */
	var dealerInput = document.querySelector("[data-dealer-search]");
	var dealerWoj = document.querySelector("[data-woj-select]");
	var dealerCards = document.querySelectorAll("[data-dealer-name]");
	var dealerEmpty = document.querySelector(".dealer-empty");

	function applyDealerFilters() {
		var q = dealerInput ? dealerInput.value.trim().toLowerCase() : "";
		var woj = dealerWoj ? dealerWoj.value : "";
		var visibleCount = 0;
		dealerCards.forEach(function (card) {
			var haystack = (
				card.getAttribute("data-dealer-name") + " " + card.getAttribute("data-dealer-addr")
			).toLowerCase();
			var matchesQuery = q === "" || haystack.indexOf(q) !== -1;
			var matchesWoj = woj === "" || card.getAttribute("data-woj") === woj;
			var match = matchesQuery && matchesWoj;
			card.style.display = match ? "" : "none";
			if (match) visibleCount++;
		});
		if (dealerEmpty) dealerEmpty.style.display = visibleCount === 0 ? "block" : "none";
	}

	if (dealerInput && dealerCards.length) dealerInput.addEventListener("input", applyDealerFilters);
	if (dealerWoj && dealerCards.length) dealerWoj.addEventListener("change", applyDealerFilters);

	/* ---------- Dealer map (gdziekupic.html, Leaflet + OpenStreetMap) ---------- */
	var mapEl = document.getElementById("dealer-map");
	if (mapEl && typeof L !== "undefined" && typeof TOYAMA_DEALERS !== "undefined") {
		var map = L.map(mapEl, { scrollWheelZoom: false }).setView([52.05, 19.4], 6);
		L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
			maxZoom: 18
		}).addTo(map);

		TOYAMA_DEALERS.forEach(function (d) {
			var marker = L.circleMarker([d.lat, d.lon], {
				radius: 7,
				weight: 2,
				color: "#e31e2a",
				fillColor: "#e31e2a",
				fillOpacity: 0.55
			}).addTo(map);
			var html = "<b>" + d.n + "</b><br>" + d.a + "<br>" + d.p;
			if (d.w) html += '<br><a href="' + d.w + '" target="_blank" rel="noopener">' + d.w + "</a>";
			marker.bindPopup(html);
		});
	}

	/* ---------- Spec tabs (product pages, optional) ---------- */
	var tabButtons = document.querySelectorAll("[data-tab-target]");
	tabButtons.forEach(function (btn) {
		btn.addEventListener("click", function () {
			var group = btn.closest("[data-tab-group]");
			if (!group) return;
			group.querySelectorAll("[data-tab-target]").forEach(function (b) { b.classList.remove("is-active"); });
			group.querySelectorAll("[data-tab-panel]").forEach(function (p) { p.classList.remove("is-active"); });
			btn.classList.add("is-active");
			var panel = group.querySelector('[data-tab-panel="' + btn.getAttribute("data-tab-target") + '"]');
			if (panel) panel.classList.add("is-active");
		});
	});
});
