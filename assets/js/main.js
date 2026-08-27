(() => {
  'use strict';

  /* Header shadow on scroll */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const scrolled = window.scrollY > 12;
    header.classList.toggle('scrolled', scrolled);
    backToTop.classList.toggle('visible', window.scrollY > 480);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* Mobile nav toggle */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');

  const closeNav = () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !navToggle.contains(e.target)) {
      closeNav();
    }
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      observer.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* FAQ accordion */
  document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const panel = trigger.nextElementSibling;
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      document.querySelectorAll('.accordion-trigger').forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
        t.nextElementSibling.style.maxHeight = null;
      });

      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });

  /* Contact form (client-side only — connect to a backend/email service to go live) */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  const setFieldState = (field, valid) => {
    field.closest('.form-row').classList.toggle('invalid', !valid);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements.name;
    const email = form.elements.email;
    const message = form.elements.message;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const nameValid = name.value.trim().length > 1;
    const emailValid = emailPattern.test(email.value.trim());
    const messageValid = message.value.trim().length > 4;

    setFieldState(name, nameValid);
    setFieldState(email, emailValid);
    setFieldState(message, messageValid);

    if (!nameValid || !emailValid || !messageValid) {
      status.textContent = 'Por favor, revise os campos destacados.';
      status.className = 'form-status error';
      return;
    }

    status.textContent = 'Enviando...';
    status.className = 'form-status';

    setTimeout(() => {
      status.textContent = `Obrigado, ${name.value.trim().split(' ')[0]}! Recebemos sua mensagem e responderemos em breve.`;
      status.className = 'form-status success';
      form.reset();
    }, 600);
  });

  /* Footer year */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
