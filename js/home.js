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
    cta: { label: 'En Savoir Plus', href: 'presentation.html' }
  });

  // Les versets ne sont plus affichés dans le carousel

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
          <p style="font-size: 1rem; font-weight: 700; color: var(--gold); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 1rem;">
            ${slide.title}
          </p>
          <h1 style="font-size: clamp(2rem, 5vw, 4rem); font-weight: 700; margin-bottom: 1.5rem; color: white; line-height: 1.2;">
            Lampe Allumée (Luchnos)
          </h1>
          <p style="font-size: clamp(1rem, 2vw, 1.25rem); color: white; max-width: 700px; margin: 0 auto 2.5rem; font-weight: 400; line-height: 1.6;">
            ${slide.text}
          </p>
          ${slide.cta ? `<a href="${slide.cta.href}" class="btn btn-primary btn-lg btn-round" style="background: var(--gold); color: var(--primary); font-weight: 700; padding: 1rem 2.5rem; font-size: 1rem; box-shadow: 0 4px 14px rgba(255, 193, 0, 0.4); border: none;">${slide.cta.label}</a>` : ''}
        </div>
      `;
      break;

    case 'event':
      content = `
        <div class="hero-content animate-fade-in-up">
          <span class="badge badge-green" style="margin-bottom: 1rem; padding: 0.5rem 1rem; background: rgba(34, 197, 94, 0.2); color: #22c55e; border-radius: 2rem; font-weight: 600; font-size: 0.875rem;">Événement à venir</span>
          <h2 style="font-size: clamp(1.75rem, 4vw, 3rem); color: var(--gold); margin-bottom: 1.5rem; font-weight: 700; line-height: 1.2;">
            ${slide.title}
          </h2>
          <p style="color: white; font-size: clamp(1rem, 2vw, 1.25rem); max-width: 700px; margin: 0 auto 1.5rem; line-height: 1.6;">
            ${Luchnos.truncateText(slide.text, 150)}
          </p>
          <div style="display: flex; gap: 2rem; justify-content: center; margin-bottom: 2rem; color: white; flex-wrap: wrap;">
            <span style="display: flex; align-items: center; gap: 0.5rem;">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>
              ${slide.date}
            </span>
            <span style="display: flex; align-items: center; gap: 0.5rem;">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              ${slide.lieu}
            </span>
          </div>
          ${slide.cta ? `<a href="${slide.cta.href}" class="btn btn-primary btn-lg btn-round" style="background: var(--gold); color: var(--primary); font-weight: 700; padding: 1rem 2.5rem; font-size: 1rem; box-shadow: 0 4px 14px rgba(255, 193, 0, 0.4); border: none;">${slide.cta.label}</a>` : ''}
        </div>
      `;
      break;

    case 'pensee':
      content = `
        <div class="hero-content animate-fade-in-up">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 5rem; height: 5rem; background: linear-gradient(135deg, #FACC15 0%, #FDE68A 100%); border-radius: 50%; margin-bottom: 2rem; box-shadow: 0 8px 20px rgba(250, 204, 21, 0.3);">
            <svg width="32" height="32" fill="#92400E" viewBox="0 0 384 512"><path d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2l0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4l0 0c19.8 27.1 39.7 54.4 49.2 86.2H272zM192 512c44.2 0 80-35.8 80-80V416H112v16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z"/></svg>
          </div>
          <blockquote style="font-size: clamp(1.25rem, 3vw, 1.75rem); color: #92400E; font-style: italic; max-width: 900px; margin: 0 auto 2rem; line-height: 1.8;">
            "${slide.text}"
          </blockquote>
          ${slide.auteur ? `<p style="color: #F59E42; font-size: clamp(1rem, 2vw, 1.25rem); font-weight: 700;">— ${slide.auteur}</p>` : ''}
          ${slide.categorie ? `<span class="badge badge-secondary" style="margin-top: 0.5rem; background: #FDE68A; color: #92400E;">${slide.categorie}</span>` : ''}
        </div>
      `;
      break;

    case 'livre':
      content = `
        <div class="hero-content animate-fade-in-up">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 5rem; height: 5rem; background: linear-gradient(135deg, #22C55E 0%, #BBF7D0 100%); border-radius: 50%; margin-bottom: 2rem; box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);">
            <svg width="32" height="32" fill="#22C55E" viewBox="0 0 448 512"><path d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>
          </div>
          <h2 style="font-size: clamp(1.5rem, 3vw, 2.5rem); color: #22C55E; margin-bottom: 1rem; font-weight: 700; line-height: 1.2;">
            ${slide.titre}
          </h2>
          <p style="color: #166534; font-size: clamp(1rem, 2vw, 1.25rem); font-weight: 500; margin-bottom: 1rem;">${slide.auteur ? `par ${slide.auteur}` : ''}</p>
          <p style="color: #166534; font-size: clamp(1rem, 2vw, 1.1rem); max-width: 700px; margin: 0 auto 1.5rem; line-height: 1.6;">
            ${slide.description ? Luchnos.truncateText(slide.description, 120) : ''}
          </p>
          ${slide.pdfUrl ? `<a href="${slide.pdfUrl}" class="btn btn-primary btn-lg btn-round" style="background: #22C55E; color: white; font-weight: 700; padding: 1rem 2.5rem; font-size: 1rem; box-shadow: 0 4px 14px rgba(34, 197, 94, 0.2); border: none;" target="_blank">Lire le livre</a>` : ''}
        </div>
      `;
      break;
  }

  // Different backgrounds for different slide types
  let slideStyle = '';

  if (slide.type === 'welcome') {
    // Welcome slide: Bible image with overlay (opacité réduite pour plus de visibilité)
    slideStyle = "background: linear-gradient(rgba(25, 31, 52, 0.4), rgba(25, 31, 52, 0.4)), url('assets/images/bible-default.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat;";
  } else if (slide.type === 'pensee') {
    // Pensée slide: Utilise l'image personnalisée ou l'image par défaut
    const image = slide.image && slide.image.trim() !== '' ? slide.image : 'assets/images/bible-default.jpg';
    slideStyle = `background: linear-gradient(rgba(250, 204, 21, 0.10), rgba(250, 204, 21, 0.10)), url('${image}'); background-size: cover; background-position: center; background-repeat: no-repeat;`;
  } else {
    // Event/livre slide: Gradient background
    slideStyle = "background: var(--gradient-primary);";
  }

  return `
    <div class="swiper-slide" style="${slideStyle}">
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
