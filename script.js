/* =========================
   MOBILE MENU
   ========================= */

const menuButton = document.querySelector(".mobile-menu-button");
const mobileMenu = document.querySelector(".mobile-menu");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
    menuButton.classList.toggle("open");
  });
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
