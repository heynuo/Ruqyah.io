(() => {
  const heading = document.getElementById("allah-tribute-heading");
  if (!heading) return;

  if (!("IntersectionObserver" in window)) {
    heading.classList.add("is-visible");
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      heading.classList.toggle("is-visible", entry.isIntersecting);
    },
    { threshold: 0.35 },
  );

  observer.observe(heading);
})();
