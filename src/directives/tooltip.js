export const tooltip = {
   mounted(el, binding) {
      // Create the tooltip element
      const tooltipText = document.createElement("span");
      tooltipText.className = "tooltip"; // Apply the tooltip class
      tooltipText.textContent = binding.value;

      // Add the tooltip element to the DOM
      document.body.appendChild(tooltipText);

      // Show the tooltip on hover and position it dynamically
      el.addEventListener("mouseenter", () => {
         const rect = el.getBoundingClientRect();
         tooltipText.style.top = `${rect.top - tooltipText.offsetHeight - 8}px`;
         tooltipText.style.left = `${
            rect.left + rect.width / 2 - tooltipText.offsetWidth / 2
         }px`;
         tooltipText.style.visibility = "visible";
         tooltipText.style.opacity = "1";
      });

      // Hide the tooltip when hover ends
      el.addEventListener("mouseleave", () => {
         tooltipText.style.visibility = "hidden";
         tooltipText.style.opacity = "0";
      });

      // Clean up tooltip element on unmount
      el._tooltipText = tooltipText; // Save for later removal
   },
   unmounted(el) {
      document.body.removeChild(el._tooltipText);
   },
};
