// Smooth Scroll Implementation
document.addEventListener("DOMContentLoaded", function () {
  const scrollLinks = document.querySelectorAll('a[href^="#"]');

  scrollLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        return;
      }
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 60;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        history.pushState(null, null, targetId);
      }
    });
  });
});

// Lazy Load Implementation
document.addEventListener("DOMContentLoaded", function () {
  const lazyImages = document.querySelectorAll(".photo-item img");

  const isInViewport = function (element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  const lazyLoad = function () {
    lazyImages.forEach(function (img) {
      if (isInViewport(img) && img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        img.classList.remove("lazy");
        img.classList.add("loaded");
      }
    });
  };

  lazyImages.forEach(function (img) {
    if (!img.dataset.src) {
      img.dataset.src = img.src;
      img.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
      img.classList.add("lazy");
    }
  });

  window.addEventListener("scroll", lazyLoad);
  window.addEventListener("resize", lazyLoad);
  window.addEventListener("orientationchange", lazyLoad);
  lazyLoad();
});

// Interactive Map Implementation
document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.getElementById("interactive-map");
  if (!mapContainer) return;

  const map = L.map("interactive-map").setView([-50.942, -73.287], 8);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

  const points = [
    {
      name: "Torres del Paine",
      lat: -50.942,
      lng: -73.287,
      description: "Iconic granite towers and breathtaking hiking trails.",
      day: 1,
    },
    {
      name: "Perito Moreno Glacier",
      lat: -50.4967,
      lng: -73.0378,
      description: "One of the few advancing glaciers in the world.",
      day: 2,
    },
    {
      name: "El Calafate",
      lat: -50.3397,
      lng: -72.2728,
      description: "Gateway city to Los Glaciares National Park.",
      day: 2,
    },
    {
      name: "Hotel Las Torres",
      lat: -50.9776,
      lng: -72.856,
      description: "Starting point for the hike to Base Torres.",
      day: 1,
    },
    {
      name: "Lake Argentino",
      lat: -50.2,
      lng: -72.6333,
      description: "Argentina's largest freshwater lake.",
      day: 2,
    },
  ];

  points.forEach((point) => {
    const dayIcon = L.divIcon({
      className: `map-marker day${point.day}`,
      html: `<div class="marker-content">${point.day}</div>`,
      iconSize: [30, 30],
    });

    const marker = L.marker([point.lat, point.lng], { icon: dayIcon }).addTo(
      map
    );
    marker.bindPopup(`
      <strong>${point.name}</strong><br>
      ${point.description}<br>
      <em>Day ${point.day}</em>
    `);
  });

  const day1Points = points
    .filter((point) => point.day === 1)
    .map((point) => [point.lat, point.lng]);
  if (day1Points.length > 1) {
    L.polyline(day1Points, { color: "#3388ff", weight: 4, opacity: 0.7 }).addTo(
      map
    );
  }

  const day2Points = points
    .filter((point) => point.day === 2)
    .map((point) => [point.lat, point.lng]);
  if (day2Points.length > 1) {
    L.polyline(day2Points, { color: "#ff6347", weight: 4, opacity: 0.7 }).addTo(
      map
    );
  }

  const group = new L.featureGroup(
    points.map((point) => L.marker([point.lat, point.lng]))
  );
  map.fitBounds(group.getBounds().pad(0.1));

  window.addEventListener("resize", () => {
    map.invalidateSize();
  });
});

// Accessibility Enhancements
document.addEventListener("DOMContentLoaded", () => {
  if (typeof applyFocusVisiblePolyfill === "function") {
    applyFocusVisiblePolyfill(document);
  }

  document.querySelectorAll("img:not([alt])").forEach((img) => {
    img.setAttribute("alt", "");
    img.setAttribute("aria-hidden", "true");
  });

  document.querySelectorAll("[data-pswp-width]").forEach((item) => {
    item.setAttribute("role", "button");
    item.setAttribute(
      "aria-label",
      `View larger image: ${item.querySelector("img").alt}`
    );
    item.setAttribute("tabindex", "0");

    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.click();
      }
    });
  });

  const dialogs = document.querySelectorAll("[data-a11y-dialog]");
  if (dialogs.length && typeof A11yDialog === "function") {
    dialogs.forEach((dialogEl) => {
      const dialog = new A11yDialog(dialogEl);
      window.dialogs = window.dialogs || {};
      window.dialogs[dialogEl.id] = dialog;
    });
  }

  document
    .querySelectorAll("button:not([aria-label]):not([aria-labelledby])")
    .forEach((button) => {
      if (!button.textContent.trim()) {
        button.setAttribute("aria-label", "Button");
      }
    });

  document.querySelectorAll(".decorative").forEach((el) => {
    el.setAttribute("role", "presentation");
    el.setAttribute("aria-hidden", "true");
  });

  document.addEventListener("keydown", function (e) {
    const openModal = document.querySelector('.modal[aria-hidden="false"]');
    if (!openModal) return;
    if (e.key === "Escape") {
      e.preventDefault();
      const dialogId = openModal.id;
      if (window.dialogs && window.dialogs[dialogId]) {
        window.dialogs[dialogId].hide();
      }
    }
  });
});

// Add play indicator to audio players
document.addEventListener("DOMContentLoaded", function () {
  const audioPlayers = document.querySelectorAll(".audio-player audio");

  audioPlayers.forEach((player) => {
    player.addEventListener("play", function () {
      this.closest(".audio-player").classList.add("playing");
    });

    player.addEventListener("pause", function () {
      this.closest(".audio-player").classList.remove("playing");
    });
  });
});

// Lightbox Initialization
document.addEventListener("DOMContentLoaded", function () {
  lightbox.option({
    resizeDuration: 200,
    wrapAround: true,
    albumLabel: "Image %1 of %2",
    fadeDuration: 300,
  });
});
