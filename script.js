/* =======================================================================
   Divyanshu — portfolio script
   - Terminal typing intro
   - Scroll-triggered reveal animations (IntersectionObserver)
   - Lazy-loaded Skills + Education sections (markup built only once the
     section is about to enter the viewport, instead of on initial load)
   - Contact form (client-side only — wire handleSubmit to a real backend)
   ===================================================================== */

(function () {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------------
     Footer year
  --------------------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     Terminal typing intro
  --------------------------------------------------------------------- */
  const TYPED_LINES = [
    { type: "cmd", text: "whoami" },
    { type: "out", text: "divyanshu — ui designer / front-end dev" },
    { type: "cmd", text: "cat skills.json | grep react" },
    { type: "out", text: '{ "react": true, "figma": true, "coffee": "required" }' },
  ];

  function typeTerminal() {
    const body = document.getElementById("terminal-body");
    if (!body) return;

    if (prefersReducedMotion) {
      body.innerHTML = TYPED_LINES.map(renderLine).join("");
      return;
    }

    let lineIndex = 0;
    let charIndex = 0;
    const lineEls = [];

    function renderShell() {
      body.innerHTML = "";
      TYPED_LINES.forEach(() => {
        const div = document.createElement("div");
        div.className = "terminal-line";
        body.appendChild(div);
        lineEls.push(div);
      });
    }
    renderShell();

    function step() {
      if (lineIndex >= TYPED_LINES.length) return;
      const line = TYPED_LINES[lineIndex];
      const el = lineEls[lineIndex];
      const partial = line.text.slice(0, charIndex);
      el.innerHTML = renderLine({ type: line.type, text: partial }, true);

      if (charIndex < line.text.length) {
        charIndex++;
        setTimeout(step, 22 + Math.random() * 18);
      } else {
        lineIndex++;
        charIndex = 0;
        if (lineIndex < TYPED_LINES.length) {
          setTimeout(step, 380);
        }
      }
    }
    step();
  }

  function renderLine(line, withCursor) {
    if (line.type === "cmd") {
      return `<span class="terminal-prompt">$ </span><span class="terminal-cmd">${escapeHtml(line.text)}</span>${withCursor ? cursor() : ""}`;
    }
    return `<span class="terminal-out">${escapeHtml(line.text)}</span>${withCursor ? cursor() : ""}`;
  }

  function cursor() {
    return '<span class="cursor"></span>';
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /* ---------------------------------------------------------------------
     Scroll reveal — fades + lifts .reveal / .fade-up elements into place
     the first time they cross into the viewport.
  --------------------------------------------------------------------- */
  function initReveal() {
    const revealEls = document.querySelectorAll(".reveal");
    const fadeUpEls = document.querySelectorAll(".fade-up");

    // Hero fades in immediately on load, no need to wait for scroll.
    fadeUpEls.forEach((el) => el.classList.add("is-in"));

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el, i) => {
      // small built-in stagger for groups of cards within the same section
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------------------
     Lazy-loaded sections — Skills and Education markup is only built
     and inserted into the DOM once the section scrolls near the
     viewport, instead of shipping it in the initial HTML payload.
  --------------------------------------------------------------------- */
  const SKILLS_USING = [
    { label: "React", note: "component architecture, hooks" },
    { label: "JavaScript", note: "ES2023, DOM, async patterns" },
    { label: "CSS / Tailwind", note: "responsive, modern layouts" },
    { label: "Git", note: "version control, GitHub" },
  ];
  const SKILLS_LEARNING = [
    { label: "TypeScript", note: "type-safe React apps" },
    { label: "Figma", note: "UI design, prototyping" },
    { label: "Gemini & REST APIs", note: "integration, prompt design" },
  ];

  const TIMELINE = [
    {
      year: "2026",
      title: "BCA Hons. — Mobile Application &amp; Web Technology",
      place: "Quantum University, Roorkee, Uttarakhand",
      note: "Specializing in front-end development and UI design.",
    },
    {
      year: "2023",
      title: "Class XII",
      place: "Saharanpur Public School, Saharanpur",
      note: "Completed senior secondary education.",
    },
    {
      year: "2021",
      title: "Class X",
      place: "Saharanpur Public School, Saharanpur",
      note: "Completed secondary education.",
    },
  ];

  function buildSkillsMarkup() {
    const card = (s) => `
      <div class="skill-card reveal">
        <div class="label">${escapeHtml(s.label)}</div>
        <div class="note">${escapeHtml(s.note)}</div>
      </div>`;

    return `
      <p class="skills-group-label cyan">Using</p>
      <div class="skills-grid using">${SKILLS_USING.map(card).join("")}</div>
      <p class="skills-group-label magenta">Learning</p>
      <div class="skills-grid learning">${SKILLS_LEARNING.map(card).join("")}</div>
    `;
  }

  const GRAD_CAP_SVG =
    '<svg viewBox="0 0 24 24" class="icon-md"><path d="M22 10L12 5 2 10l10 5 10-5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function buildEducationMarkup() {
    return TIMELINE.map(
      (t, i) => `
      <div class="timeline-item reveal">
        <div class="timeline-marker">
          <div class="timeline-icon">${GRAD_CAP_SVG}</div>
          ${i < TIMELINE.length - 1 ? '<div class="timeline-line"></div>' : ""}
        </div>
        <div class="timeline-content">
          <div class="timeline-year">${escapeHtml(t.year)}</div>
          <div class="timeline-title">${t.title}</div>
          <div class="timeline-place">${escapeHtml(t.place)}</div>
          <div class="timeline-note">${escapeHtml(t.note)}</div>
        </div>
      </div>`
    ).join("");
  }

  function initLazySections() {
    const mounts = document.querySelectorAll("[data-lazy-section]");
    if (!mounts.length) return;

    const builders = {
      skills: buildSkillsMarkup,
      education: buildEducationMarkup,
    };

    function load(mount) {
      const key = mount.getAttribute("data-lazy-section");
      const build = builders[key];
      if (!build || mount.classList.contains("is-loaded")) return;

      mount.innerHTML = build();
      mount.classList.add("is-loaded");

      // Newly-inserted .reveal nodes need their own observer pass.
      const newReveals = mount.querySelectorAll(".reveal");
      if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        newReveals.forEach((el) => el.classList.add("in-view"));
        return;
      }
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      newReveals.forEach((el, i) => {
        el.style.transitionDelay = `${(i % 4) * 70}ms`;
        revealObserver.observe(el);
      });
    }

    if (!("IntersectionObserver" in window)) {
      mounts.forEach(load);
      return;
    }

    const lazyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            load(entry.target);
            lazyObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "200px 0px" } // start loading slightly before it's on screen
    );
    mounts.forEach((m) => lazyObserver.observe(m));
  }

  /* ---------------------------------------------------------------------
     Contact form — uses mailto to forward messages
  --------------------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById("contact-form");
    const confirm = document.getElementById("contact-confirm");
    if (!form || !confirm) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      
      if (!name || !email || !message) return;

      // Create mailto link with pre-filled subject and body
      const subject = encodeURIComponent(`New message from ${name}`);
      const body = encodeURIComponent(`${message}`);
      const mailtoLink = `mailto:divyanshudhiman51@gmail.com?subject=${subject}&body=${body}`;
      
      // Open mailto in new window and show confirmation
      window.location.href = mailtoLink;
      
      confirm.textContent = `Thanks, ${name.split(" ")[0]} — opening your email client now. Your message will be forwarded to me!`;
      confirm.hidden = false;
      form.hidden = true;
    });
  }

  /* ---------------------------------------------------------------------
     Init
  --------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    typeTerminal();
    initReveal();
    initLazySections();
    initContactForm();
  });
})();