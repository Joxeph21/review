export const toast = (() => {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  function createToast(message, type = "success", duration = 3000) {
    const toastEl = document.createElement("div");
    toastEl.classList.add("toast");
    if (type) {
      toastEl.classList.add(type);
    }
    toastEl.textContent = message;
    container.appendChild(toastEl);

    setTimeout(() => {
      toastEl.classList.add("hide");
      toastEl.addEventListener("animationend", () => {
        toastEl.remove();
        
        // container.remove()
      }, {once: true});
    }, duration);
  }

  return {
    success: (msg, duration) => createToast(msg, "success", duration),
    error: (msg, duration) => createToast(msg, "error", duration),
  };
})();
