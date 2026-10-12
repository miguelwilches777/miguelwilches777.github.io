/* =========================================================
   Portfolio Miguel Moreno — main.js
   1. Lit videos.json et crée une "fiche" par vidéo
   2. Une seule vidéo avec son à la fois + "lumières éteintes"
   3. Les vidéos en boucle ne jouent que lorsqu'elles sont visibles
   4. Apparition douce des textes
   5. Bouton "Copier l'adresse"
   ========================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const liste = document.getElementById("liste-travaux");

// Observateur pour faire apparaître les textes une seule fois
const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  }
}, { threshold: 0.15, rootMargin: "0px 0px -5% 0px" });

// Le lien "Contact" du haut disparaît quand la section Contact est à l'écran
const contact = document.getElementById("contact");
new IntersectionObserver(([entry]) => {
  document.body.classList.toggle("contact-visible", entry.isIntersecting);
}, { threshold: 0.2 }).observe(contact);

// ---------- 1. Charger la liste des vidéos ----------
async function chargerVideos() {
  try {
    const reponse = await fetch("videos.json", { cache: "no-cache" });
    if (!reponse.ok) throw new Error(reponse.status);
    const videos = await reponse.json();
    if (videos.length === 0) {
      liste.innerHTML = '<p class="notice">Les vidéos arrivent bientôt.</p>';
      return;
    }
    liste.replaceChildren(...videos.map(creerFiche));
    creerEventail(videos);
    creerPistes(videos);
  } catch (erreur) {
    console.error("videos.json :", erreur);
    liste.innerHTML =
      '<p class="notice">Les vidéos n’ont pas pu être chargées. Rechargez la page.</p>';
  }
}

// "9:16" -> { ratio: 0.5625, orientation: "vertical", label: "Vertical 9:16" }
function lireFormat(formato) {
  const [w, h] = formato.split(":").map(Number);
  const ratio = w / h;
  let orientation = "carre";
  let mot = "Carré";
  if (ratio < 0.9) { orientation = "vertical"; mot = "Vertical"; }
  if (ratio > 1.1) { orientation = "horizontal"; mot = "Horizontal"; }
  // On n'affiche le ratio que s'il est "lisible" (9:16, 16:9, 1:1...)
  const label = w <= 21 && h <= 21 ? `${mot} ${formato}` : mot;
  return { ratio, orientation, label };
}

// L'éventail de la page d'accueil : les vidéos verticales en cartes "story".
// Chaque carte est un lien vers la vidéo correspondante plus bas.
function creerEventail(videos) {
  const eventail = document.getElementById("eventail");
  if (!eventail) return;
  const cartes = videos
    .map((video, i) => ({ video, i }))
    .filter(({ video }) => lireFormat(video.formato).orientation === "vertical")
    .slice(0, 4)
    .map(({ video, i }, n, tout) => {
      const lien = document.createElement("a");
      lien.className = "fan-card";
      lien.href = `#travail-${i + 1}`;
      lien.setAttribute("aria-label", `Voir : ${video.titulo}`);
      // Position dans l'éventail : de -1 (gauche) à 1 (droite)
      const pos = tout.length > 1 ? (n / (tout.length - 1)) * 2 - 1 : 0;
      lien.style.setProperty("--pos", pos.toFixed(2));
      lien.style.setProperty("--n", n);
      const img = document.createElement("img");
      img.src = video.miniatura;
      img.alt = "";
      img.width = 180;
      img.height = 320;
      img.decoding = "async";
      lien.append(img);
      return lien;
    });
  eventail.replaceChildren(...cartes);
  requestAnimationFrame(() => eventail.classList.add("is-dealt"));
}

// ---------- Les côtés : la page comme une timeline ----------
const COULEURS = ["var(--rose)", "var(--ciel)", "var(--vert)", "var(--ambre)"];
const DUREE_TOTALE = 180; // secondes affichées par le timecode sur toute la page
const IMAGES_PAR_SECONDE = 25;

// Piste de droite : un clip coloré par vidéo, placé comme la vidéo dans la page
function creerPistes(videos) {
  const piste = document.getElementById("pistes");
  if (!piste) return;
  const clips = videos.map((video, i) => {
    const clip = document.createElement("a");
    clip.className = "clip";
    clip.href = `#travail-${i + 1}`;
    clip.dataset.nom = video.titulo;
    clip.setAttribute("aria-label", `Aller à : ${video.titulo}`);
    clip.style.setProperty("--couleur", COULEURS[i % COULEURS.length]);
    return clip;
  });
  piste.replaceChildren(...clips);
  placerClips();
  suivreDefilement();
}

// Position de chaque clip = position de sa vidéo dans la hauteur de la page
function placerClips() {
  const hauteur = document.documentElement.scrollHeight;
  document.querySelectorAll(".clip").forEach((clip, i) => {
    const travail = document.getElementById(`travail-${i + 1}`);
    if (!travail) return;
    const haut = travail.offsetTop;
    clip.style.setProperty("--debut", (haut / hauteur).toFixed(4));
    clip.style.setProperty("--duree", (travail.offsetHeight / hauteur).toFixed(4));
  });
}

// Tête de lecture + timecode + clip actif, mis à jour au défilement
let enAttente = false;
function suivreDefilement() {
  if (enAttente) return;
  enAttente = true;
  requestAnimationFrame(() => {
    enAttente = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const progres = max > 0 ? Math.min(1, scrollY / max) : 0;
    document.querySelector(".playhead")?.style.setProperty("--progress", progres.toFixed(4));

    // Timecode HH:MM:SS:II (25 images par seconde)
    const images = Math.round(progres * DUREE_TOTALE * IMAGES_PAR_SECONDE);
    const s = Math.floor(images / IMAGES_PAR_SECONDE);
    const deux = (n) => String(n).padStart(2, "0");
    const tc = document.getElementById("timecode");
    if (tc) tc.textContent = `00:${deux(Math.floor(s / 60))}:${deux(s % 60)}:${deux(images % IMAGES_PAR_SECONDE)}`;

    // Le clip de la vidéo au centre de l'écran s'allume
    const centre = scrollY + innerHeight / 2;
    document.querySelectorAll(".work").forEach((travail, i) => {
      const actif = centre >= travail.offsetTop && centre < travail.offsetTop + travail.offsetHeight;
      document.querySelectorAll(".clip")[i]?.classList.toggle("is-active", actif);
    });
  });
}
addEventListener("scroll", suivreDefilement, { passive: true });
addEventListener("resize", () => { placerClips(); suivreDefilement(); });
addEventListener("load", placerClips);
document.fonts?.ready.then(placerClips);

// Le bandeau défilant : on duplique son contenu pour une boucle sans coupure
const piste = document.querySelector(".ticker-track");
if (piste) piste.append(...[...piste.children].map((n) => n.cloneNode(true)));

function creerFiche(video, index) {
  const format = lireFormat(video.formato);
  const enBoucle = video.modo === "bucle";

  const article = document.createElement("article");
  article.className = "work";
  article.id = `travail-${index + 1}`;
  // Vidéo sur fond noir (ex. incrustation) : le noir devient transparent
  if (video.transparente) article.dataset.transparente = "oui";
  // Image utilisée pour le halo de couleur derrière la vidéo (adresse complète)
  article.style.setProperty("--poster", `url("${new URL(video.miniatura, location.href).href}")`);
  article.dataset.orientation = format.orientation;
  article.dataset.modo = video.modo;
  article.style.setProperty("--ratio", format.ratio);

  // Le cadre + la vidéo
  const figure = document.createElement("figure");
  figure.className = "frame";

  const el = document.createElement("video");
  el.src = video.archivo;
  el.poster = video.miniatura;
  // Vidéos avec son : on charge juste les infos (durée) ; boucles : rien avant d'être visibles
  el.preload = enBoucle ? "none" : "metadata";
  el.playsInline = true;
  el.setAttribute("aria-label", `Vidéo : ${video.titulo}`);

  if (enBoucle) {
    el.muted = true;
    el.loop = true;
    el.dataset.mode = "boucle";
    // Si l'utilisateur préfère moins d'animations : pas de lecture auto, il choisit
    if (reduceMotion) el.controls = true;
  } else {
    el.controls = true;
    el.dataset.mode = "son";
  }

  figure.append(el);

  // Le texte : titre, description, crédits
  const texte = document.createElement("div");
  texte.className = "work-text";
  texte.innerHTML = `
    <h3 class="work-title"></h3>
    <p class="work-desc"></p>
    <dl class="credits">
      <dt>Type</dt><dd class="c-type"></dd>
      <dt>Format</dt><dd class="c-format"></dd>
    </dl>`;
  // textContent (et pas innerHTML) pour les données : plus sûr
  texte.querySelector(".work-title").textContent = video.titulo;
  texte.querySelector(".work-desc").textContent = video.descripcion;
  texte.querySelector(".c-type").textContent = video.tipo;
  texte.querySelector(".c-format").textContent = format.label;

  // Les boucles de plus de 5 s doivent pouvoir être mises en pause :
  // le bouton est une ligne de plus dans les crédits ("Boucle | Pause")
  if (enBoucle && !reduceMotion) {
    const dt = document.createElement("dt");
    dt.textContent = "Boucle";
    const dd = document.createElement("dd");
    dd.append(creerBoutonPause(el));
    texte.querySelector(".credits").append(dt, dd);
  }

  article.append(figure, texte);

  brancherVideo(el, article);
  revealObserver.observe(texte);
  return article;
}

function creerBoutonPause(el) {
  const bouton = document.createElement("button");
  bouton.type = "button";
  bouton.className = "loop-toggle text-action";
  bouton.setAttribute("aria-pressed", "false");
  bouton.setAttribute("aria-label", "Mettre la boucle en pause");
  bouton.textContent = "Mettre en pause";

  bouton.addEventListener("click", () => {
    const enPause = el.dataset.pauseUtilisateur === "oui";
    if (enPause) {
      delete el.dataset.pauseUtilisateur;
      el.play().catch(() => {});
    } else {
      el.dataset.pauseUtilisateur = "oui";
      el.pause();
    }
    bouton.setAttribute("aria-pressed", String(!enPause));
    bouton.setAttribute("aria-label", enPause ? "Mettre la boucle en pause" : "Relancer la boucle");
    bouton.textContent = enPause ? "Mettre en pause" : "Relancer";
  });
  return bouton;
}

// ---------- 2 & 3. Comportement des vidéos ----------
function videosAvecSon() {
  return document.querySelectorAll('video[data-mode="son"]');
}

function mettreAJourLumieres() {
  const enLecture = [...videosAvecSon()].find((v) => !v.paused && !v.ended);
  document.body.classList.toggle("lights-down", Boolean(enLecture));
  document.querySelectorAll(".work").forEach((w) => {
    w.classList.toggle("is-playing", enLecture ? w.contains(enLecture) : false);
  });
}

const boucleObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const v = entry.target;
    if (entry.isIntersecting) {
      // On ne relance pas une boucle que le visiteur a mise en pause
      if (v.dataset.pauseUtilisateur === "oui") continue;
      v.play().catch(() => {}); // le navigateur peut refuser : on ignore
    } else {
      v.pause();
    }
  }
}, { threshold: 0.25 });

const sonObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    // Si la vidéo sort presque entièrement de l'écran, on la met en pause
    if (!entry.isIntersecting && !entry.target.paused) entry.target.pause();
  }
}, { threshold: 0.2 });

function brancherVideo(el, article) {
  if (el.dataset.mode === "boucle") {
    if (!reduceMotion) boucleObserver.observe(el);
    return;
  }

  el.addEventListener("play", () => {
    // Une seule vidéo avec son à la fois
    videosAvecSon().forEach((autre) => { if (autre !== el) autre.pause(); });
    mettreAJourLumieres();
  });
  el.addEventListener("pause", mettreAJourLumieres);
  el.addEventListener("ended", mettreAJourLumieres);
  sonObserver.observe(el);
}

// ---------- 5. Copier l'adresse e-mail ----------
const boutonCopier = document.querySelector(".copy");
if (boutonCopier) {
  const label = boutonCopier.querySelector(".copy-label");
  const texteInitial = label.textContent;
  let minuterie;

  const changerTexte = (nouveau) => {
    boutonCopier.classList.add("is-switching");
    setTimeout(() => {
      label.textContent = nouveau;
      boutonCopier.classList.remove("is-switching");
    }, 120);
  };

  boutonCopier.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(boutonCopier.dataset.copy);
      changerTexte("Adresse copiée");
    } catch {
      changerTexte("Sélectionnez l’adresse ci-dessus");
    }
    clearTimeout(minuterie);
    minuterie = setTimeout(() => changerTexte(texteInitial), 2200);
  });
}

document.getElementById("annee").textContent = new Date().getFullYear();

chargerVideos();
