/* ==========================================================================
   MAISON ANILA — animations
   GSAP + ScrollTrigger + Lenis (smooth scroll)
   ========================================================================== */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  /* ---------- Hero video: landscape / portrait source ---------- */
  const heroVideo = $('.hero__video');
  const setHeroSource = () => {
    if (!heroVideo) return;
    const portrait = window.innerWidth / window.innerHeight < 0.85;
    const src = portrait ? heroVideo.dataset.portrait : heroVideo.dataset.landscape;
    if (heroVideo.dataset.current === src) return;
    heroVideo.dataset.current = src;
    if (portrait) heroVideo.poster = heroVideo.dataset.posterPortrait;
    heroVideo.src = src;
    heroVideo.play().catch(() => {});
  };
  setHeroSource();
  window.addEventListener('resize', setHeroSource);

  /* ---------- Lazy videos: load + play only when visible ---------- */
  const lazyVideos = $$('video[data-lazy]');
  const vio = new IntersectionObserver((entries) => {
    entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        if (!v.src) { v.src = v.dataset.lazy; v.load(); }
        if (!reduced) v.play().catch(() => {});
      } else if (v.src) {
        v.pause();
      }
    });
  }, { rootMargin: '200px 0px' });
  lazyVideos.forEach((v) => vio.observe(v));

  /* ---------- Langue FR / EN ---------- */
  const DICT = (window.MA_I18N && window.MA_I18N.en) || {};
  const JS_T = (window.MA_I18N && window.MA_I18N.js) || {};
  const metaDesc = $('meta[name="description"]');
  // Le français est lu dans la page telle qu'elle est écrite (avant toute modification)
  const FR = { 'meta.title': document.title, 'meta.description': metaDesc ? metaDesc.content : '' };
  $$('[data-i18n]').forEach((el) => { if (!(el.dataset.i18n in FR)) FR[el.dataset.i18n] = el.innerHTML; });
  const FR_ATTR = new Map();
  $$('[data-i18n-attr]').forEach((el) => {
    const o = {};
    el.dataset.i18nAttr.split(',').forEach((p) => { const a = p.split(':')[0]; o[a] = el.getAttribute(a); });
    FR_ATTR.set(el, o);
  });
  const storeLang = {
    get() { try { return localStorage.getItem('ma-lang'); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem('ma-lang', v); } catch (e) { /* stockage indisponible */ } },
  };
  const urlLang = new URLSearchParams(location.search).get('lang');
  let lang = urlLang === 'en' || urlLang === 'fr' ? urlLang : (storeLang.get() === 'en' ? 'en' : 'fr');
  const t = (k) => ((JS_T[lang] || JS_T.fr || {})[k]) || k;

  function applyLang(l) {
    lang = l;
    const pick = (key) => (l === 'en' && key in DICT ? DICT[key] : FR[key]);
    document.documentElement.lang = l;
    document.title = pick('meta.title');
    if (metaDesc) metaDesc.content = pick('meta.description');
    $$('[data-i18n]').forEach((el) => {
      const html = pick(el.dataset.i18n);
      if (html == null) return;
      if (el.dataset.splitDone) {
        el.innerHTML = html;
        splitWords(el);
        if (window.gsap) gsap.set($$('.w > span', el), { yPercent: 0, rotate: 0 });
      } else if (el.innerHTML !== html) {
        el.innerHTML = html;
      }
    });
    $$('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(',').forEach((p) => {
        const [a, k] = p.split(':');
        const fr = (FR_ATTR.get(el) || {})[a];
        const v = l === 'en' && k in DICT ? DICT[k].replace(/&amp;/g, '&') : fr;
        if (v != null) el.setAttribute(a, v);
      });
    });
    $$('.lang').forEach((g) => {
      g.dataset.active = l;
      $$('.lang__opt', g).forEach((b) => {
        const on = b.dataset.lang === l;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
    });
  }
  applyLang(lang);

  /* Découpe un titre en mots (pour l'animation d'apparition) */
  function splitWords(el) {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const i = document.createElement('span'); i.textContent = part;
            w.appendChild(i); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') {
          walk(n);
        }
      });
    };
    walk(el);
    el.dataset.splitDone = '1';
  }

  /* ---------- Fallback without GSAP ---------- */
  if (!hasGsap) {
    document.documentElement.classList.remove('js');
    const l = $('.loader'); if (l) l.remove();
    initCommon(null);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* Always start at the top (pins are measured from there), then honour a #hash */
  const initialHash = /^#[\w-]+$/.test(location.hash) ? location.hash : '';
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!reduced) {
    ScrollTrigger.clearScrollMemory('manual');
    window.scrollTo(0, 0);
    if (initialHash) history.replaceState(null, '', location.pathname + location.search);
  }

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (!reduced && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  initCommon(lenis);

  /* ---------- Split text into words ---------- */
  $$('[data-split]').forEach(splitWords);

  if (reduced) {
    $('.loader')?.remove();
    lenis?.start();
    return;
  }

  /* ---------- Preloader → hero intro ---------- */
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  const counter = { v: 0 };
  const countEl = $('.loader__count');
  gsap.set('.hero__title .line > span', { yPercent: 110 });
  gsap.set('.hero__sub span', { yPercent: 110 });
  gsap.set(['.hero__eyebrow', '.hero__card', '.hero__film'], { autoAlpha: 0, y: 20 });
  gsap.set(['.nav', '.side-label', '.hero__scroll'], { autoAlpha: 0 });
  gsap.set('.hero__video', { scale: 1.25 });

  intro
    .to('.loader__logo img', { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power3.inOut' }, 0)
    .to('.loader__bar i', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
    .to(counter, { v: 100, duration: 1.5, ease: 'power2.inOut', onUpdate: () => { countEl.textContent = String(Math.round(counter.v)).padStart(3, '0'); } }, 0)
    .to('.loader__inner', { autoAlpha: 0, y: -30, duration: .6, ease: 'power2.in' }, 1.6)
    .to('.loader', { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, 1.9)
    .set('.loader', { display: 'none' })
    .to('.hero__video', { scale: 1, duration: 2.2 }, 2.0)
    .to('.hero__title .line > span', { yPercent: 0, duration: 1.4, stagger: .12 }, 2.3)
    .to('.hero__sub span', { yPercent: 0, duration: 1.2 }, 2.6)
    .to(['.nav', '.side-label'], { autoAlpha: 1, duration: 1.2 }, 2.4)
    .to('.hero__eyebrow', { autoAlpha: 1, y: 0, duration: 1.2 }, 2.4)
    .to(['.hero__card', '.hero__film'], { autoAlpha: 1, y: 0, duration: 1.2, stagger: .1, clearProps: 'transform' }, 2.7)
    .to('.hero__scroll', { autoAlpha: 1, duration: 1.2 }, 3)
    .add(() => {
      lenis?.start();
      const h = initialHash && document.querySelector(initialHash);
      if (h) { ScrollTrigger.refresh(); lenis ? lenis.scrollTo(h, { duration: 1.6 }) : h.scrollIntoView(); }
    }, 2.4);

  /* ---------- Hero scroll parallax ---------- */
  gsap.to('.hero__video', { yPercent: 18, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__content', { yPercent: -30, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: '80% top', scrub: true } });

  /* ---------- Progress bar ---------- */
  gsap.to('.progress i', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });

  /* ---------- Split headings reveal ---------- */
  $$('[data-split]').forEach((el) => {
    gsap.from($$('.w > span', el), {
      yPercent: 110, rotate: 4, duration: 1.2, ease: 'expo.out', stagger: .045,
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  /* ---------- Generic reveal ---------- */
  $$('[data-reveal]').forEach((el) => {
    gsap.to(el, { autoAlpha: 1, y: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  $$('.eyebrow').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.from(el, { autoAlpha: 0, x: -20, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  /* ---------- Marquee (velocity-reactive) ---------- */
  const track = $('.marquee__track');
  const group = $('.marquee__group');
  if (track && group) {
    for (let i = 0; i < 3; i++) track.appendChild(group.cloneNode(true));
    let x = 0, dir = -1, boost = 0;
    const w = () => group.offsetWidth;
    gsap.ticker.add(() => {
      const v = lenis ? lenis.velocity : 0;
      if (Math.abs(v) > .1) dir = v > 0 ? -1 : 1;
      boost += (Math.min(Math.abs(v) * .35, 14) - boost) * .08;
      x += dir * (0.6 + boost);
      const gw = w();
      if (x <= -gw) x += gw;
      if (x > 0) x -= gw;
      track.style.transform = `translate3d(${x}px,0,0)`;
    });
  }

  const mm = gsap.matchMedia();

  /* ---------- Void reveal: pinned plate ---------- */
  mm.add('(min-width: 1081px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.reveal', start: 'top top', end: '+=120%', scrub: 1, pin: '.reveal__stage', anticipatePin: 1 },
    });
    tl.fromTo('.reveal__object', { scale: .45, rotate: -25 }, { scale: 1, rotate: 0, ease: 'power2.out', duration: 1 }, 0)
      .fromTo('.reveal__left', { x: -80, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .6 }, .25)
      .fromTo('.reveal__right', { x: 80, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .6 }, .35)
      .fromTo('.reveal__bgword', { xPercent: -40 }, { xPercent: -60, ease: 'none', duration: 1 }, 0);
  });
  mm.add('(max-width: 1080px)', () => {
    gsap.fromTo('.reveal__object', { scale: .6, rotate: -20 }, { scale: 1, rotate: 0, ease: 'none', scrollTrigger: { trigger: '.reveal__object', start: 'top bottom', end: 'center center', scrub: 1 } });
  });

  /* ---------- Pillars video parallax ---------- */
  gsap.fromTo('.pillars__frame video', { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.pillars', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.pillars__frame', { clipPath: 'inset(20% 10% 20% 10% round 12px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.pillars__frame', start: 'top 85%' } });

  /* ---------- Count up ---------- */
  $$('[data-count]').forEach((el) => {
    const o = { v: 0 };
    gsap.to(o, { v: +el.dataset.count, duration: 2, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); }, scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  /* ---------- Parallax images ---------- */
  $$('[data-parallax]').forEach((el) => {
    const img = el.querySelector('img');
    gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.from('.portrait__img img', { scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.portrait', start: 'top bottom', end: 'center center', scrub: true } });

  /* ---------- Stacked service cards ---------- */
  mm.add('(min-width: 1081px)', () => {
    const cards = $$('.card');
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      gsap.to(card, {
        scale: .92 + i * .02, filter: 'brightness(.55)', ease: 'none',
        scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top 20%', scrub: true },
      });
    });
  });
  $$('.card').forEach((card) => {
    gsap.from(card.querySelectorAll('.card__body > *'), { autoAlpha: 0, y: 30, duration: 1, stagger: .07, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 70%' } });
  });

  /* ---------- Horizontal reel ---------- */
  mm.add('(min-width: 721px)', () => {
    const trackEl = $('.reel__track');
    const dist = () => trackEl.scrollWidth - window.innerWidth;
    gsap.to(trackEl, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '.reel', start: 'top top', end: () => '+=' + dist(), pin: '.reel__pin', scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 },
    });
    gsap.to('.reel__bg', { xPercent: -35, ease: 'none', scrollTrigger: { trigger: '.reel', start: 'top bottom', end: () => '+=' + (dist() + window.innerHeight * 2), scrub: true } });
  });

  /* ---------- Gallery entrance ---------- */
  $$('.dish').forEach((d) => {
    gsap.from(d.querySelector('.dish__img'), { clipPath: 'inset(100% 0 0 0 round 12px)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: d, start: 'top 88%' } });
    gsap.from(d.querySelectorAll('.dish__meta, .h-sm, .body-s'), { autoAlpha: 0, y: 20, duration: 1, stagger: .08, delay: .4, ease: 'expo.out', scrollTrigger: { trigger: d, start: 'top 88%' } });
  });

  /* ---------- Booking image ---------- */
  gsap.from('.booking__img', { clipPath: 'inset(0 0 100% 0 round 12px)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.booking__img', start: 'top 85%' } });

  /* ---------- Footer logo ---------- */
  gsap.from('.footer__logo img', { yPercent: 60, scale: .85, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  /* ---------- Refresh after media load ---------- */
  window.addEventListener('load', () => ScrollTrigger.refresh());

  /* ==========================================================================
     Shared UI (works with or without GSAP)
     ========================================================================== */
  function initCommon(lenis) {
    const scrollTo = (target) => {
      const el = typeof target === 'string' ? $(target) : target;
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6 });
      else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    };

    /* Anchor links */
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2 || !$(id)) return;
        e.preventDefault();
        closeMenu();
        if (a.dataset.service) {
          const r = $$('input[name="type"]').find((i) => i.value === a.dataset.service);
          if (r) r.checked = true;
        }
        scrollTo(id);
      });
    });

    /* Mobile menu */
    const burger = $('.nav__burger');
    const menu = $('.menu');
    function closeMenu() {
      document.body.classList.remove('menu-open');
      burger?.setAttribute('aria-expanded', 'false');
      menu?.setAttribute('aria-hidden', 'true');
      lenis?.start();
    }
    burger?.addEventListener('click', () => {
      const open = !document.body.classList.contains('menu-open');
      if (!open) { closeMenu(); return; }
      document.body.classList.add('menu-open');
      burger.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      lenis?.stop();
    });

    /* Nav: hide on scroll down, active section */
    const nav = $('.nav');
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 40);
      if (!document.body.classList.contains('menu-open')) nav.classList.toggle('is-hidden', y > lastY && y > 400);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const navLinks = $$('[data-nav]');
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['experience', 'manifesto', 'services', 'gallery', 'reservation'].forEach((id) => { const s = document.getElementById(id); if (s) sio.observe(s); });

    /* Gallery filters */
    const pills = $$('.pill[data-filter]');
    pills.forEach((p) => p.addEventListener('click', () => {
      pills.forEach((x) => { x.classList.toggle('is-active', x === p); x.setAttribute('aria-selected', x === p); });
      const f = p.dataset.filter;
      $$('.dish').forEach((d) => d.classList.toggle('is-dim', f !== 'all' && d.dataset.cat !== f));
    }));

    /* Lightbox */
    const lb = $('.lightbox');
    const lbc = $('.lightbox__content');
    const openLb = (html) => {
      lbc.innerHTML = html;
      lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false');
      lenis?.stop();
      const v = lbc.querySelector('video'); if (v) v.play().catch(() => {});
      $('.lightbox__close').focus();
    };
    const closeLb = () => {
      lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true');
      const v = lbc.querySelector('video'); if (v) v.pause();
      setTimeout(() => { lbc.innerHTML = ''; }, 500);
      lenis?.start();
    };
    $('.lightbox__close').addEventListener('click', closeLb);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeLb(); closeMenu(); } });

    $$('[data-film]').forEach((b) => b.addEventListener('click', () => openLb(
      '<video src="assets/video/film-maison-anila.mp4" poster="assets/video/film-maison-anila.jpg" controls playsinline autoplay></video>'
    )));
    $$('.dish').forEach((d) => d.addEventListener('click', () => {
      const img = d.querySelector('img');
      openLb(`<img src="${img.getAttribute('src')}" alt="${img.alt}" />
        <div class="lb-text"><span class="label">${d.querySelector('.dish__meta').textContent}</span>
        <h3 class="h-lg">${d.querySelector('.h-sm').innerHTML}</h3>
        <p class="body">${d.querySelector('.body-s').textContent}</p></div>`);
    }));

    /* Form → mailto (comme le site actuel) */
    const form = $('.form');
    const msg = $('.form__msg');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      $$('input[required]', form).forEach((i) => {
        const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value));
        i.closest('.field').classList.toggle('is-error', bad);
        if (bad) ok = false;
      });
      if (!ok) { msg.textContent = t('error'); return; }
      const d = Object.fromEntries(new FormData(form));
      const typeLabel = form.querySelector('input[name="type"]:checked + span')?.textContent || d.type;
      const sep = lang === 'fr' ? ' : ' : ': ';
      const subject = `${t('subject')} — ${d.name}`;
      const body = [
        `${t('name')}${sep}${d.name}`,
        `${t('email')}${sep}${d.email}`,
        `${t('phone')}${sep}${d.phone || '—'}`,
        `${t('type')}${sep}${typeLabel}`,
        `${t('place')}${sep}${d.place}`,
        `${t('dates')}${sep}${d.dates}`,
        `${t('guests')}${sep}${d.guests || '—'}`,
        `${t('notes')}${sep}${d.notes || '—'}`,
      ].join('\n');
      window.location.href = `mailto:scott.anila.chef@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      msg.textContent = t('sent');
    });

    /* Bascule FR / EN */
    $$('.lang__opt').forEach((b) => b.addEventListener('click', () => {
      const l = b.dataset.lang;
      if (l === lang) return;
      storeLang.set(l);
      if (new URLSearchParams(location.search).has('lang')) {
        const u = new URL(location.href); u.searchParams.set('lang', l);
        history.replaceState(null, '', u);
      }
      msg && (msg.textContent = '');
      document.body.classList.add('is-switching');
      setTimeout(() => {
        applyLang(l);
        if (window.ScrollTrigger) ScrollTrigger.refresh();
        requestAnimationFrame(() => document.body.classList.remove('is-switching'));
      }, reduced ? 0 : 320);
    }));
    $$('input', form).forEach((i) => i.addEventListener('input', () => i.closest('.field')?.classList.remove('is-error')));

    /* Custom cursor + magnetic buttons */
    if (finePointer && !reduced) {
      const cur = $('.cursor');
      const label = $('.cursor__label');
      let mx = -100, my = -100, cx = -100, cy = -100;
      window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; cur.classList.add('is-visible'); }, { passive: true });
      document.addEventListener('mouseleave', () => cur.classList.remove('is-visible'));
      const loop = () => {
        cx += (mx - cx) * .2; cy += (my - cy) * .2;
        cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
        requestAnimationFrame(loop);
      };
      loop();
      document.addEventListener('mouseover', (e) => {
        const lab = e.target.closest('[data-cursor]');
        const link = e.target.closest('a, button, .choice, input, textarea');
        cur.classList.toggle('is-label', !!lab);
        label.textContent = lab ? lab.dataset.cursor : '';
        cur.classList.toggle('is-link', !lab && !!link);
      });

      $$('[data-magnetic]').forEach((b) => {
        b.addEventListener('mousemove', (e) => {
          const r = b.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * .25;
          const y = (e.clientY - r.top - r.height / 2) * .35;
          b.style.transform = `translate(${x}px, ${y}px)`;
        });
        b.addEventListener('mouseleave', () => {
          b.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1), color .5s';
          b.style.transform = '';
          setTimeout(() => { b.style.transition = ''; }, 600);
        });
      });
    }
  }
})();
