/**
 * LUCHNOS - Home Page JavaScript
 * Hero carousel and testimonials
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initHeroCarousel();
  await initTestimonials();
});

// ========== HERO CAROUSEL ==========
async function initHeroCarousel() {
  const data = await Luchnos.loadData();
  if (!data) return;

  const slidesContainer = document.getElementById('hero-slides');
  if (!slidesContainer) return;

  // Combine versets and create slides
  const slides = [];

  // Add welcome slide
  slides.push({
    type: 'welcome',
    title: 'Bienvenue',
    subtitle: 'CENTRE MISSIONNAIRE LAMPE ALLUMÉE (LUCHNOS)',
    text: data.site?.tagline || 'Présenter Yéhoshoua car IL revient',
    cta: { label: 'Découvrir', href: 'presentation.html' }
  });

  // Add versets
  if (data.versets && data.versets.length > 0) {
    data.versets.forEach(verset => {
      slides.push({
        type: 'verset',
        text: verset.texte,
        reference: verset.reference,
        image: verset.image
      });
    });
  }

  // Add featured events
  if (data.evenements && data.evenements.length > 0) {
    const upcomingEvent = data.evenements.find(e => Luchnos.getEventStatus(e.date) === 'a_venir');
    if (upcomingEvent) {
      slides.push({
        type: 'event',
        title: upcomingEvent.titre,
        text: upcomingEvent.description,
        date: Luchnos.formatDateShort(upcomingEvent.date),
        lieu: upcomingEvent.lieu,
        cta: { label: 'Voir les événements', href: 'evenements.html' }
      });
    }
  }

  // Render slides
  slidesContainer.innerHTML = slides.map(slide => renderSlide(slide)).join('');

  // Initialize Swiper
  new Swiper('.hero-swiper', {
    loop: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    autoplay: {
      delay: 6000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  });
}

function renderSlide(slide) {
  let content = '';

  switch (slide.type) {
    case 'welcome':
      content = `
        <div class="hero-content animate-fade-in-up">
          <h1 style="font-size: 3rem; font-weight: 700; margin-bottom: 1rem;">
            <span style="color: white;">${slide.title}</span>
          </h1>
          <h2 style="font-size: 1.75rem; color: var(--gold); margin-bottom: 1.5rem; font-weight: 600;">
            ${slide.subtitle}
          </h2>
          <p style="font-size: 1.5rem; color: var(--slate-200); max-width: 700px; margin: 0 auto 2rem;">
            ${slide.text}
          </p>
          ${slide.cta ? `<a href="${slide.cta.href}" class="btn btn-primary btn-lg btn-round">${slide.cta.label}</a>` : ''}
        </div>
      `;
      break;

    case 'verset':
      content = `
        <div class="hero-content animate-fade-in-up">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 4rem; height: 4rem; background: rgba(255, 193, 0, 0.2); border-radius: 50%; margin-bottom: 1.5rem;">
            <svg width="28" height="28" fill="var(--gold)" viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>
          </div>
          <blockquote style="font-size: 1.5rem; color: white; font-style: italic; max-width: 800px; margin: 0 auto 1.5rem; line-height: 1.6;">
            "${slide.text}"
          </blockquote>
          <p style="color: var(--gold); font-size: 1.25rem; font-weight: 600;">
            - ${slide.reference}
          </p>
        </div>
      `;
      break;

    case 'event':
      content = `
        <div class="hero-content animate-fade-in-up">
          <span class="badge badge-green" style="margin-bottom: 1rem;">Événement à venir</span>
          <h2 style="font-size: 2.5rem; color: var(--gold); margin-bottom: 1rem; font-weight: 700;">
            ${slide.title}
          </h2>
          <p style="color: white; font-size: 1.125rem; max-width: 600px; margin: 0 auto 1rem;">
            ${Luchnos.truncateText(slide.text, 150)}
          </p>
          <div style="display: flex; gap: 2rem; justify-content: center; margin-bottom: 1.5rem; color: var(--slate-200);">
            <span style="display: flex; align-items: center; gap: 0.5rem;">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>
              ${slide.date}
            </span>
            <span style="display: flex; align-items: center; gap: 0.5rem;">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              ${slide.lieu}
            </span>
          </div>
          ${slide.cta ? `<a href="${slide.cta.href}" class="btn btn-primary btn-lg btn-round">${slide.cta.label}</a>` : ''}
        </div>
      `;
      break;
  }

  return `
    <div class="swiper-slide" style="background: var(--gradient-primary);">
      ${content}
    </div>
  `;
}

// ========== TESTIMONIALS ==========
async function initTestimonials() {
  const data = await Luchnos.loadData();
  if (!data || !data.temoignages) return;

  const container = document.getElementById('testimonials-container');
  if (!container) return;

  container.innerHTML = data.temoignages.map(testimonial => `
    <div class="testimonial-card">
      <p class="testimonial-text">${testimonial.temoignage}</p>
      <p class="testimonial-author">${testimonial.nom}</p>
    </div>
  `).join('');
}
