/* ============================================================
   Yusei Stay — Homepage project preview dialog (index.html only)
   Both the poster and the text CTA are plain links to the poster
   image, so without JS (or without <dialog> support) they still
   work. With JS they open #project-preview-dialog instead.
   Copy is translated by YuseiI18n via data-i18n attributes, so no
   re-render is needed on "yusei:langchange".
   ============================================================ */

(function () {
  "use strict";

  var dialog = document.getElementById("project-preview-dialog");
  var openers = document.querySelectorAll("[data-project-preview-open]");

  if (!dialog || typeof dialog.showModal !== "function" || !openers.length) {
    return;
  }

  var closeButton = dialog.querySelector("[data-project-preview-close]");
  var lastOpener = null;

  function openDialog(event) {
    // Let modified / middle clicks open the image in a new tab as usual.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    if (dialog.open) {
      return;
    }
    lastOpener = event.currentTarget;
    dialog.showModal();
  }

  openers.forEach(function (opener) {
    opener.addEventListener("click", openDialog);
  });

  if (closeButton) {
    closeButton.addEventListener("click", function () {
      dialog.close();
    });
  }

  dialog.addEventListener("click", function (event) {
    if (event.target !== dialog) {
      return;
    }
    var rect = dialog.getBoundingClientRect();
    var isOutside =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;
    if (isOutside) {
      dialog.close();
    }
  });

  // Fires for the close button, Escape and backdrop clicks alike.
  dialog.addEventListener("close", function () {
    if (lastOpener && document.contains(lastOpener)) {
      lastOpener.focus();
    }
    lastOpener = null;
  });
})();
