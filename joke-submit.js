/*
  VARAQ - Ghazni humor submissions
  Set WORKER_URL to the URL of your deployed Cloudflare Worker.
  Never put the Discord webhook URL in this public website file.
*/
const WORKER_URL = "https://varaq-joke-inbox.bayatt-info-1bd.workers.dev";

const jokeForm = document.getElementById("joke-submit-form");
if (jokeForm) {
  jokeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = document.getElementById("joke-form-status");
    const button = jokeForm.querySelector('button[type="submit"]');
    const name = document.getElementById("joke-name").value.trim() || "بدون نام";
    const joke = document.getElementById("joke-text").value.trim();

    status.className = "joke-form-status";

    if (!joke) {
      status.textContent = "لطفاً متن فکاهی را بنویسید.";
      status.classList.add("error");
      return;
    }

    if (WORKER_URL === "PASTE_YOUR_CLOUDFLARE_WORKER_URL_HERE") {
      status.textContent = "اتصال فرم هنوز تکمیل نشده است.";
      status.classList.add("error");
      return;
    }

    button.disabled = true;
    button.textContent = "در حال فرستادن...";

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, joke })
      });

      if (!response.ok) throw new Error("Submission failed");

      status.textContent = "تشکر! فکاهی شما فرستاده شد و پس از بررسی ممکن است در ورق نشر شود.";
      status.classList.add("success");
      jokeForm.reset();
    } catch (error) {
      status.textContent = "ارسال انجام نشد. لطفاً بعداً دوباره کوشش کنید.";
      status.classList.add("error");
    } finally {
      button.disabled = false;
      button.textContent = "فرستادن فکاهی";
    }
  });
}
