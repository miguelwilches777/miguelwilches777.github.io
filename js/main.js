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

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

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

function creerFiche(video) {
  const format = lireFormat(video.formato);
  const enBoucle = video.modo === "bucle";

  const article = document.createElement("article");
  article.className = "work";
  article.dataset.orientation = format.orientation;
  article.style.setProperty("--ratio", format.ratio);

  // Le cadre + la vidéo
  const figure = document.createElement("figure");
  figure.className = "frame";

  const el = document.createElement("video");
  el.src = video.archivo;
  el.poster = video.miniatura;
  el.preload = "none";
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

  // Les boucles de plus de 5 s doivent pouvoir être mises en pause
  if (enBoucle && !reduceMotion) figure.append(creerBoutonPause(el));

  // Le texte : titre, description, crédits
  const texte = document.createElement("div");
  texte.className = "work-text";
  texte.innerHTML = `
    <h3 class="work-title"></h3>
    <p class="work-desc"></p>
    <dl class="credits">
      <dt>Type</dt><dd class="c-type"></dd>
      <dt>${video.software.length > 1 ? "Logiciels" : "Logiciel"}</dt><dd class="c-soft" translate="no"></dd>
      <dt>Format</dt><dd class="c-format"></dd>
    </dl>`;
  // textContent (et pas innerHTML) pour les données : plus sûr
  texte.querySelector(".work-title").textContent = video.titulo;
  texte.querySelector(".work-desc").textContent = video.descripcion;
  texte.querySelector(".c-type").textContent = video.tipo;
  texte.querySelector(".c-soft").textContent = video.software.join(" · ");
  texte.querySelector(".c-format").textContent = format.label;

  article.append(figure, texte);

  brancherVideo(el, article);
  revealObserver.observe(texte);
  return article;
}

function creerBoutonPause(el) {
  const bouton = document.createElement("button");
  bouton.type = "button";
  bouton.className = "loop-toggle";
  bouton.setAttribute("aria-pressed", "false");
  bouton.setAttribute("aria-label", "Mettre la boucle en pause");
  bouton.textContent = "Pause";

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
    bouton.textContent = enPause ? "Pause" : "Lecture";
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
