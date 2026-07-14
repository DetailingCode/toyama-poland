(function () {
	var SEARCH_INDEX = [
		{ title: "Strona główna", url: "index.html", category: "Start", keywords: "toyama polska start" },
		{ title: "Akumulatory — przegląd serii", url: "akumulatory.html", category: "Akumulatory", keywords: "agm żelowe grafenowe lifepo4 npc npg npcg npm lc" },
		{ title: "Seria NPC — AGM Deep Cycle", url: "seria-npc.html", category: "Akumulatory", keywords: "npc7 npc9 agm deep cycle" },
		{ title: "Seria NPG — żelowe", url: "seria-npg.html", category: "Akumulatory", keywords: "gel żelowy" },
		{ title: "Seria NPCG — żelowe Deep Cycle", url: "seria-npcg.html", category: "Akumulatory", keywords: "gel deep cycle" },
		{ title: "Seria NPM — grafenowe", url: "seria-npm.html", category: "Akumulatory", keywords: "grafen graphene" },
		{ title: "Seria LC — węglowe", url: "seria-lc.html", category: "Akumulatory", keywords: "carbon węgiel" },
		{ title: "Seria LiFePO4 — Bluetooth", url: "seria-lfp.html", category: "Akumulatory", keywords: "lifepo4 lfp bluetooth litowy" },
		{ title: "Ładowarki TBC — przegląd", url: "ladowarki.html", category: "Ładowarki", keywords: "tbc ładowarka charger" },
		{ title: "TBC 4.5-6A/12V — GEL, AGM, LiFePO4", url: "tbc6a.html", category: "Ładowarki", keywords: "tbc6a" },
		{ title: "TBC 2-4-8A/12V — GEL", url: "tbc8a.html", category: "Ładowarki", keywords: "tbc8a" },
		{ title: "TBC 9A-10A/12V — GEL, AGM, LiFePO4", url: "tbc9a.html", category: "Ładowarki", keywords: "tbc9a" },
		{ title: "TBC 10A/12V — AGM, GEL, PB, EFB, LC", url: "tbc10la.html", category: "Ładowarki", keywords: "tbc10la" },
		{ title: "TBC 15A/12V — AGM, GEL, PB, EFB, LC", url: "tbc15a.html", category: "Ładowarki", keywords: "tbc15a" },
		{ title: "TBC 10A/12-24V — AGM, GEL, PB, EFB, LC", url: "tbc10a-24.html", category: "Ładowarki", keywords: "tbc10a24" },
		{ title: "TBC 4A/12V Li-ion 3S", url: "tbc4a3s.html", category: "Ładowarki", keywords: "tbc4a3s li-ion" },
		{ title: "TBC 10A/12V Li-ion 3S", url: "tbc10a3s.html", category: "Ładowarki", keywords: "tbc10a3s li-ion" },
		{ title: "TBC 20A/12V Li-ion 3S", url: "tbc20a3s.html", category: "Ładowarki", keywords: "tbc20a3s li-ion" },
		{ title: "TBC 10A/12V LiFePO4 4S", url: "tbc10a4s.html", category: "Ładowarki", keywords: "tbc10a4s lifepo4" },
		{ title: "TBC 20A/12V LiFePO4 4S", url: "tbc20a4s.html", category: "Ładowarki", keywords: "tbc20a4s lifepo4" },
		{ title: "Akcesoria — pokrowce na akumulatory", url: "akcesoria.html", category: "Akcesoria", keywords: "pokrowiec case" },
		{ title: "Gdzie kupić — dystrybutorzy", url: "gdziekupic.html", category: "Informacje", keywords: "dealer dystrybutor sklep mapa" },
		{ title: "Kontakt", url: "kontakt.html", category: "Informacje", keywords: "telefon email adres" },
		{ title: "Polityka prywatności", url: "private.html", category: "Informacje", keywords: "rodo prywatność" },
		{ title: "Regulamin strony", url: "warunki-strony.html", category: "Informacje", keywords: "regulamin warunki" }
	];

	function normalize(str) {
		return str
			.toLowerCase()
			.normalize("NFD")
			.replace(/[̀-ͯ]/g, "");
	}

	function search(query) {
		var q = normalize(query.trim());
		if (!q) return [];
		return SEARCH_INDEX
			.map(function (item) {
				var haystack = normalize(item.title + " " + item.category + " " + item.keywords);
				return { item: item, idx: haystack.indexOf(q) };
			})
			.filter(function (r) { return r.idx !== -1; })
			.sort(function (a, b) { return a.idx - b.idx; })
			.map(function (r) { return r.item; })
			.slice(0, 8);
	}

	document.addEventListener("DOMContentLoaded", function () {
		var overlay = document.getElementById("search-overlay");
		var input = document.getElementById("search-input");
		var results = document.getElementById("search-results");
		if (!overlay || !input || !results) return;

		var openBtns = document.querySelectorAll("[data-search-open]");
		var closeBtns = overlay.querySelectorAll("[data-search-close]");

		function render(items) {
			results.innerHTML = "";
			if (!items.length) {
				var empty = document.createElement("div");
				empty.className = "search-empty";
				empty.textContent = input.value.trim() ? "Brak wyników." : "Zacznij pisać, aby wyszukać.";
				results.appendChild(empty);
				return;
			}
			items.forEach(function (item) {
				var a = document.createElement("a");
				a.className = "search-result";
				a.href = item.url;
				var titleSpan = document.createElement("span");
				titleSpan.className = "result-title";
				titleSpan.textContent = item.title;
				var catSpan = document.createElement("span");
				catSpan.className = "result-category";
				catSpan.textContent = item.category;
				a.appendChild(titleSpan);
				a.appendChild(catSpan);
				results.appendChild(a);
			});
		}

		function openSearch() {
			overlay.classList.add("is-open");
			document.body.style.overflow = "hidden";
			render([]);
			setTimeout(function () { input.focus(); }, 10);
		}

		function closeSearch() {
			overlay.classList.remove("is-open");
			document.body.style.overflow = "";
			input.value = "";
		}

		openBtns.forEach(function (btn) {
			btn.addEventListener("click", openSearch);
		});
		closeBtns.forEach(function (btn) {
			btn.addEventListener("click", closeSearch);
		});

		overlay.addEventListener("click", function (e) {
			if (e.target === overlay) closeSearch();
		});

		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape" && overlay.classList.contains("is-open")) closeSearch();
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				if (overlay.classList.contains("is-open")) closeSearch();
				else openSearch();
			}
		});

		input.addEventListener("input", function () {
			render(search(input.value));
		});

		input.addEventListener("keydown", function (e) {
			if (e.key === "Enter") {
				var first = results.querySelector(".search-result");
				if (first) window.location.href = first.getAttribute("href");
			}
		});
	});
})();
