(function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("block");
  toast.classList.remove("none");
  setTimeout(() => {
    toast.classList.remove("block");
    toast.classList.add("none");
  }, 2000);
})();
