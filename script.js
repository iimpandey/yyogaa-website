/* =========================
   MOBILE MENU
   ========================= */

const menuButton = document.querySelector(".mobile-menu-button");
const mobileMenu = document.querySelector(".mobile-menu");

// Must match the breakpoint in style.css where the mobile menu button appears.
const MOBILE_MENU_BREAKPOINT = "(max-width: 950px)";

if (menuButton && mobileMenu) {
  const isMenuOpen = () => mobileMenu.classList.contains("open");

  // Single place that sets the open/closed state, so classes and ARIA stay in sync.
  const setMenuOpen = (open) => {
    mobileMenu.classList.toggle("open", open);
    menuButton.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", open ? "true" : "false");
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  // Start from a known closed state.
  setMenuOpen(false);

  menuButton.addEventListener("click", () => {
    setMenuOpen(!isMenuOpen());
  });

  // Escape closes the menu and returns focus to the button.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMenuOpen()) {
      setMenuOpen(false);
      menuButton.focus();
    }
  });

  // Choosing a link closes the menu (matters for same-page links like #anchors).
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  // Reset the menu when the viewport widens past the mobile breakpoint.
  if (window.matchMedia) {
    const mobileQuery = window.matchMedia(MOBILE_MENU_BREAKPOINT);
    const handleBreakpointChange = (event) => {
      if (!event.matches && isMenuOpen()) {
        setMenuOpen(false);
      }
    };

    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", handleBreakpointChange);
    } else if (mobileQuery.addListener) {
      mobileQuery.addListener(handleBreakpointChange); // older Safari
    }
  }
}


/* =========================
   CONTACT FORM
   ========================= */

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        window.location.href =
          "https://yyogaa-website.vercel.app/thank-you.html";
      } else {
        alert("There was a problem sending your message. Please try again.");

        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Send Message";
        }
      }

    } catch (error) {
      alert("There was a problem sending your message. Please try again.");

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
      }
    }
  });
}
