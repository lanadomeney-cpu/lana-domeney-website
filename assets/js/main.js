/* Lana Domeney - site interactions */
(function () {
  "use strict";

  /* Year */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* Nav: shrink on scroll */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var toggle = document.getElementById("navToggle");
  var links = document.querySelector(".nav__links");
  function closeMenu() {
    links.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(
    ".section__head, .about__photo, .about__text, .card, .reel__frame, .masonry__item, .contact__inner, .carousel, .cv__wrap, .pagehead"
  );
  revealEls.forEach(function (el) { el.classList.add("reveal"); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* Lightbox gallery */
  var items = Array.prototype.slice.call(document.querySelectorAll(".masonry__item"));
  var lb = document.getElementById("lightbox");
  if (lb && items.length) {
    var lbImg = document.getElementById("lbImg");
    var current = 0;

    var showAt = function (i) {
      current = (i + items.length) % items.length;
      var src = items[current].getAttribute("data-full");
      var alt = items[current].querySelector("img").getAttribute("alt") || "";
      lbImg.setAttribute("src", src);
      lbImg.setAttribute("alt", alt);
    };
    var openLB = function (i) {
      showAt(i);
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    var closeLB = function () {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    items.forEach(function (item, i) {
      item.addEventListener("click", function () { openLB(i); });
    });
    document.getElementById("lbClose").addEventListener("click", closeLB);
    document.getElementById("lbNext").addEventListener("click", function () { showAt(current + 1); });
    document.getElementById("lbPrev").addEventListener("click", function () { showAt(current - 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLB(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLB();
      if (e.key === "ArrowRight") showAt(current + 1);
      if (e.key === "ArrowLeft") showAt(current - 1);
    });
  }

  /* Headshot carousel */
  var carousel = document.getElementById("carousel");
  if (carousel) {
    var track = document.getElementById("carTrack");
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = document.getElementById("carDots");
    var idx = 0, maxIdx = 0, timer = null;

    var apply = function () {
      var sw = slides[0].getBoundingClientRect().width;
      track.style.transform = "translateX(" + (-idx * sw) + "px)";
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        d.classList.toggle("active", i === idx);
      });
    };
    var buildDots = function () {
      dotsWrap.innerHTML = "";
      for (var i = 0; i <= maxIdx; i++) {
        var b = document.createElement("button");
        b.setAttribute("aria-label", "Go to slide " + (i + 1));
        (function (n) {
          b.addEventListener("click", function () { idx = n; apply(); restart(); });
        })(i);
        dotsWrap.appendChild(b);
      }
    };
    var measure = function () {
      var w = track.getBoundingClientRect().width;
      var sw = slides[0].getBoundingClientRect().width || w;
      var perView = Math.max(1, Math.round(w / sw));
      maxIdx = Math.max(0, slides.length - perView);
      if (idx > maxIdx) idx = maxIdx;
      buildDots();
      apply();
    };
    var go = function (dir) {
      idx = (idx + dir < 0) ? maxIdx : (idx + dir > maxIdx ? 0 : idx + dir);
      apply();
    };
    var restart = function () {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { go(1); }, 5000);
    };

    document.getElementById("carNext").addEventListener("click", function () { go(1); restart(); });
    document.getElementById("carPrev").addEventListener("click", function () { go(-1); restart(); });
    window.addEventListener("resize", measure, { passive: true });
    carousel.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
    carousel.addEventListener("mouseleave", restart);

    measure();
    restart();
  }
})();
