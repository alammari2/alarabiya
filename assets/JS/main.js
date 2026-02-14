/* main.js — سلوك عام: قائمة الجوال + ضمان الأرقام بالصيغة الإنجليزية + تحسينات بسيطة */
(function () {
  "use strict";

  const doc = document.documentElement;

  // Mobile nav toggle
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.getElementById("primary-nav");

  function setNav(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute(
      "aria-label",
      open ? "إغلاق القائمة" : "فتح القائمة",
    );
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("is-open");
      setNav(!isOpen);
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (!target) return;
      const clickedInside = nav.contains(target) || navToggle.contains(target);
      if (!clickedInside && nav.classList.contains("is-open")) setNav(false);
    });

    // Close on Esc
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open"))
        setNav(false);
    });

    // Close when a link is clicked (mobile)
    nav.addEventListener("click", (e) => {
      const a = e.target && e.target.closest ? e.target.closest("a") : null;
      if (a && nav.classList.contains("is-open")) setNav(false);
    });
  }

  // Enforce English digits 0-9 in elements marked with data-en-digits
  // (Safeguard in case the browser/locale renders Arabic-Indic digits)
  const arabicIndic = /[٠-٩]/g;
  const easternArabicIndic = /[۰-۹]/g;
  const mapArabicIndic = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };
  const mapEastern = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };

  function normalizeDigits(str) {
    if (!str) return str;
    return str
      .replace(arabicIndic, (d) => mapArabicIndic[d] || d)
      .replace(easternArabicIndic, (d) => mapEastern[d] || d);
  }

  function walkAndNormalize(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      const v = node.nodeValue;
      const nv = normalizeDigits(v);
      if (nv !== v) node.nodeValue = nv;
    }
  }

  function enforceDigits() {
    const blocks = document.querySelectorAll("[data-en-digits]");
    blocks.forEach((el) => walkAndNormalize(el));
  }

  // Run once on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enforceDigits);
  } else {
    enforceDigits();
  }

  // Re-run after any dynamic changes (rates calculator updates, etc.)
  const mo = new MutationObserver(() => enforceDigits());
  mo.observe(document.body, { childList: true, subtree: true });

  // Ensure RTL at root (defensive)
  doc.setAttribute("dir", "rtl");
  doc.setAttribute("lang", "ar");
})();
