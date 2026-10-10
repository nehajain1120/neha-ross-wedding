// Sends visitors to the password page (welcome.html) until they've entered
// the password once on this device. This keeps out casual visitors and
// search engines; it is not strong security.
(function () {
  var KEY = 'nr-welcome', TOKEN = 'ok-27560a33075a';
  var ok = false;
  try { ok = localStorage.getItem(KEY) === TOKEN; } catch (e) {}
  if (!ok) { try { ok = sessionStorage.getItem(KEY) === TOKEN; } catch (e) {} }
  if (ok) return;
  document.documentElement.style.visibility = 'hidden';
  var page = location.pathname.split('/').pop() || 'index.html';
  location.replace('welcome.html?next=' + encodeURIComponent(page + location.hash));
})();
