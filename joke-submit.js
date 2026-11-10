/*
  VARAQ - Ghazni humor submissions
  Configure DISCORD_WEBHOOK_URL below.
  Note: a webhook URL in browser JavaScript is public. For production, use a
  serverless proxy (for example Cloudflare Worker) to protect it from spam.
*/
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1569797972336578632/q6klvA8cV_R8rrnPYyEy7S7YxmRinHQG3HY_xt0msYFd5cuZ_Rq0glfoMIvzSmThiLGE";

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
    if (DISCORD_WEBHOOK_URL === "PASTE_YOUR_DISCORD_WEBHOOK_URL_HERE") {
      status.textContent = "هنوز آدرس Discord Webhook در فایل joke-submit.js تنظیم نشده است.";
      status.classList.add("error");
      return;
    }

    button.disabled = true;
    button.textContent = "در حال فرستادن...";
    const payload = {
      username: "VARAQ - Joke Inbox",
      embeds: [{
        title: "فکاهی تازه از وب‌سایت ورق",
        color: 15151298,
        fields: [
          { name: "فرستنده", value: name.slice(0, 60), inline: true },
          { name: "متن فکاهی", value: joke.slice(0, 1800), inline: false }
        ],
        footer: { text: "برای نشر، این فکاهی باید بررسی شود." },
        timestamp: new Date().toISOString()
      }]
    };

    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Discord webhook request failed");
      status.textContent = "تشکر! فکاهی شما با موفقیت فرستاده شد. پس از بررسی، در صورت مناسب بودن نشر می‌شود.";
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
