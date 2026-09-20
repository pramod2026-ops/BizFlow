(function () {
  const chatLog = document.getElementById("chat-log");
  const quickReplies = document.getElementById("quick-replies");
  const leadForm = document.getElementById("lead-form");
  const leadName = document.getElementById("lead-name");
  const leadPhone = document.getElementById("lead-phone");
  const leadSubmit = document.getElementById("lead-submit");

  document.getElementById("scroll-to-chat").addEventListener("click", () => {
    document
      .getElementById("chat-card")
      .scrollIntoView({ behavior: "smooth", block: "center" });
  });
  document.getElementById("scroll-to-how").addEventListener("click", () => {
    document.getElementById("how").scrollIntoView({ behavior: "smooth" });
  });

  function addBubble(text, kind) {
    const b = document.createElement("div");
    b.className = "bubble " + kind;
    const p = document.createElement("p");
    p.style.margin = "0";
    p.textContent = text;
    b.appendChild(p);
    chatLog.appendChild(b);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function showTyping(cb) {
    const t = document.createElement("div");
    t.className = "typing";
    t.id = "typing-now";
    t.innerHTML = "<span></span><span></span><span></span>";
    chatLog.appendChild(t);
    chatLog.scrollTop = chatLog.scrollHeight;
    setTimeout(
      () => {
        const el = document.getElementById("typing-now");
        if (el) el.remove();
        cb();
      },
      550 + Math.random() * 350,
    );
  }

  function setQuickReplies(options) {
    quickReplies.innerHTML = "";
    if (!options || options.length === 0) {
      quickReplies.classList.add("hidden");
      return;
    }
    quickReplies.classList.remove("hidden");
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.className = "qr-btn";
      btn.textContent = opt.label;
      btn.addEventListener("click", () => {
        addBubble(opt.label, "user");
        setQuickReplies([]);
        opt.next();
      });
      quickReplies.appendChild(btn);
    });
  }

  function botSay(text, next) {
    showTyping(() => {
      addBubble(text, "bot");
      if (next) next();
    });
  }

  // --- The lead-generation conversation flow ---
  function stepIntro() {
    botSay(
      "Namaste! 👋 I'm the Bizflow assistant. Want to see how instant replies could work for your business?",
      () => {
        setQuickReplies([
          { label: "Yes, show me", next: stepBusinessType },
          { label: "What is Bizflow?", next: stepExplain },
        ]);
      },
    );
  }

  function stepExplain() {
    botSay(
      "We help shops and small businesses reply to customers instantly on Facebook/WhatsApp, and flag who's ready to buy — so you never lose a sale to a slow reply.",
      () => {
        setQuickReplies([
          { label: "Sounds useful, tell me more", next: stepBusinessType },
        ]);
      },
    );
  }

  function stepBusinessType() {
    botSay("What kind of business do you run?", () => {
      setQuickReplies([
        { label: "Retail / shop", next: stepPain },
        { label: "Restaurant / cafe", next: stepPain },
        { label: "Service business", next: stepPain },
        { label: "Something else", next: stepPain },
      ]);
    });
  }

  function stepPain() {
    botSay(
      "Got it. And right now — who replies to your customer messages?",
      () => {
        setQuickReplies([
          { label: "I do, myself", next: stepClose },
          { label: "A staff member", next: stepClose },
          { label: "Honestly, often no one", next: stepClose },
        ]);
      },
    );
  }

  function stepClose() {
    botSay(
      "That's exactly what Bizflow fixes. Leave your name and number — we'll set up a free live demo for your business, no cost, no obligation.",
      () => {
        leadForm.classList.remove("hidden");
        leadName.focus();
      },
    );
  }

  leadSubmit.addEventListener("click", () => {
    const name = leadName.value.trim();
    const phone = leadPhone.value.trim();
    if (!name || !phone) return;
    addBubble(name + " — " + phone, "user");
    leadForm.classList.add("hidden");
    botSay(
      "Thank you, " +
        name.split(" ")[0] +
        "! We'll reach out on " +
        phone +
        " to show you Bizflow in action. 🎉",
    );
  });

  stepIntro();
})();
