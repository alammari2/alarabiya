/* rates.js — حاسبة تحويل (SAR/USD) مع أوضاع شراء/بيع + منع الإدخال السلبي/الفارغ */
(function () {
  "use strict";

  const rates = {
    SAR: { buy: 410, sell: 413 },
    USD: { buy: 1558, sell: 1569 },
  };

  const currencySelect = document.getElementById("currencySelect");
  const modeBuy = document.getElementById("modeBuy");
  const modeSell = document.getElementById("modeSell");
  const amountInput = document.getElementById("amountInput");
  const calcBtn = document.getElementById("calcBtn");
  const calcReset = document.getElementById("calcReset");

  const resultValue = document.getElementById("resultValue");
  const rateLabel = document.getElementById("rateLabel");

  const miniBuy = document.getElementById("miniBuy");
  const miniSell = document.getElementById("miniSell");
  const miniCode = document.getElementById("miniCode");

  const help = document.getElementById("calcHelp");

  if (
    !currencySelect ||
    !modeBuy ||
    !modeSell ||
    !amountInput ||
    !calcBtn ||
    !calcReset ||
    !resultValue
  )
    return;

  function getMode() {
    return modeSell.checked ? "sell" : "buy";
  }

  function setHelper(msg, isError) {
    if (!help) return;
    help.textContent = msg;
    help.style.color = isError ? "#b91c1c" : "";
  }

  function formatNumber(n) {
    // Keep English digits and avoid locale Arabic-Indic rendering
    const v = Number.isFinite(n) ? n : 0;
    const s = v.toFixed(2);
    // Trim trailing .00
    return s.replace(/\.00$/, "");
  }

  function updateMini() {
    const code = currencySelect.value;
    const r = rates[code];
    if (!r) return;

    if (miniBuy) miniBuy.textContent = String(r.buy);
    if (miniSell) miniSell.textContent = String(r.sell);
    if (miniCode) miniCode.textContent = code;

    const mode = getMode();
    if (rateLabel) rateLabel.textContent = mode === "sell" ? "البيع" : "الشراء";

    // Update suffix display (optional)
    const suffix = document.querySelector(".suffix");
    if (suffix) suffix.textContent = code;

    // Normalize any Arabic-Indic digits in output
    if (window && window.document) {
      const blocks = document.querySelectorAll("[data-en-digits]");
      blocks.forEach((el) => {
        el.style.fontVariantNumeric = "tabular-nums lining-nums";
      });
    }
  }

  function validateAmount() {
    const raw = String(amountInput.value || "").trim();
    if (!raw) {
      setHelper("الرجاء إدخال مبلغ موجب (بدون ترك الحقل فارغًا).", true);
      return null;
    }
    const val = Number(raw);
    if (!Number.isFinite(val) || val <= 0) {
      setHelper("الرجاء إدخال مبلغ موجب أكبر من 0.", true);
      return null;
    }
    setHelper(
      "جاهز للحساب. يمكنك تعديل العملة أو نوع السعر حسب الحاجة.",
      false,
    );
    return val;
  }

  function calculate() {
    const code = currencySelect.value;
    const r = rates[code];
    if (!r) return;

    const amount = validateAmount();
    if (amount === null) {
      resultValue.textContent = "0";
      return;
    }

    const mode = getMode();
    const rate = mode === "sell" ? r.sell : r.buy;

    const total = amount * rate;
    resultValue.textContent = formatNumber(total);
  }

  function resetCalc() {
    currencySelect.value = "SAR";
    modeBuy.checked = true;
    modeSell.checked = false;
    amountInput.value = "";
    resultValue.textContent = "0";
    setHelper("الرجاء إدخال مبلغ موجب (بدون إشارة سالبة) لعرض الناتج.", false);
    updateMini();
  }

  // Prevent negative typing
  amountInput.addEventListener("input", () => {
    const v = String(amountInput.value || "");
    if (v.includes("-")) amountInput.value = v.replace(/-/g, "");
  });

  currencySelect.addEventListener("change", () => {
    updateMini();
    // Recalculate if there is a valid value
    const raw = String(amountInput.value || "").trim();
    if (raw) calculate();
  });

  modeBuy.addEventListener("change", () => {
    updateMini();
    const raw = String(amountInput.value || "").trim();
    if (raw) calculate();
  });
  modeSell.addEventListener("change", () => {
    updateMini();
    const raw = String(amountInput.value || "").trim();
    if (raw) calculate();
  });

  calcBtn.addEventListener("click", calculate);
  calcReset.addEventListener("click", resetCalc);

  // Init
  updateMini();
})();
