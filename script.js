document.addEventListener("DOMContentLoaded", () => {

  /* =====================================
     WORKS 一覧：フィルタ処理
  ===================================== */
  const items = [...document.querySelectorAll(".work-item")];
  const grid = document.getElementById("worksGrid");

  if (grid && items.length > 0) {

    let active = {
      period: new Set(),
      client: new Set(),
      media: new Set(),
    };

    function applyFilters() {
      let filtered = items.filter((it) => {

        const p =
          active.period.size === 0 ||
          active.period.has(it.dataset.period);

        const clientValues = (it.dataset.client || "").split(" ");
        const c =
          active.client.size === 0 ||
          [...active.client].some(v => clientValues.includes(v));

        const mediaValues = (it.dataset.media || "").split(" ");
        const m =
          active.media.size === 0 ||
          [...active.media].some(v => mediaValues.includes(v));

        return p && c && m;
      });

      filtered.sort((a, b) =>
        b.dataset.date.localeCompare(a.dataset.date)
      );

      items.forEach(it => it.style.display = "none");
      filtered.forEach(it => it.style.display = "block");
    }

    function toggleTag(set, value, btn) {
      if (set.has(value)) {
        set.delete(value);
        btn.classList.remove("active");
      } else {
        set.add(value);
        btn.classList.add("active");
      }
      applyFilters();
    }

    const resetBtn = document.querySelector("[data-filter-period='all']");
    if (resetBtn) {
      resetBtn.onclick = () => {
        active.period.clear();
        active.client.clear();
        active.media.clear();
        document.querySelectorAll(".pill").forEach(p =>
          p.classList.remove("active")
        );
        applyFilters();
      };
    }

    document.querySelectorAll("[data-filter-period]").forEach(btn => {
      if (btn.dataset.filterPeriod === "all") return;
      btn.onclick = () =>
        toggleTag(active.period, btn.dataset.filterPeriod, btn);
    });

    document.querySelectorAll("[data-filter-client]").forEach(btn => {
      btn.onclick = () =>
        toggleTag(active.client, btn.dataset.filterClient, btn);
    });

    document.querySelectorAll("[data-filter-media]").forEach(btn => {
      btn.onclick = () =>
        toggleTag(active.media, btn.dataset.filterMedia, btn);
    });

    applyFilters();
  }

  /* =====================================
     評価ページ：画像カルーセル
  ===================================== */
  const mainImg = document.querySelector(".carousel-main");
  const pdfBtn = document.querySelector(".carousel-pdf a");
  const thumbs = document.querySelectorAll(".carousel-thumbs .thumb");

  if (mainImg && thumbs.length > 0) {

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {

        thumbs.forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");

        const newSrc = thumb.dataset.large;
        if (newSrc) {
          mainImg.src = newSrc;
        }

        if (pdfBtn) {
          if (thumb.dataset.link) {
            pdfBtn.href = thumb.dataset.link;
            pdfBtn.style.display = "inline-block";
          } else {
            pdfBtn.style.display = "none";
          }
        }
      });
    });
  }

}); // ← ★これが無いと SyntaxError になる！


/* =====================================
   評価ページ：動画カルーセル（初期状態完全対応版）
===================================== */

const mainImg  = document.querySelector(".carousel-main");
const video    = document.querySelector(".carousel-video");
const playBtn  = document.querySelector(".video-play-btn");
const thumbs   = document.querySelectorAll(".carousel-thumbs .thumb");
const carousel = document.querySelector(".carousel-image");

/* --- 共通：表示を動画状態にする関数 --- */
function showVideo(videoSrc) {
  mainImg.style.display = "none";
  video.style.display   = "block";
  video.src             = videoSrc;
  video.pause();
  video.currentTime     = 0;
  carousel.classList.remove("video-playing"); // ▶表示状態
}

/* --- 共通：表示を画像状態にする関数 --- */
function showImage(imgSrc) {
  video.pause();
  video.style.display   = "none";
  mainImg.style.display = "block";
  mainImg.src           = imgSrc;
  carousel.classList.remove("video-playing");
}

/* --- 初期表示：active な thumb を強制適用 --- */
const firstThumb = document.querySelector(".carousel-thumbs .thumb.active");

if (firstThumb) {
  if (firstThumb.dataset.type === "video") {
    showVideo(firstThumb.dataset.video);
  } else {
    showImage(firstThumb.dataset.large);
  }
}

/* --- サムネクリック：表示切替のみ --- */
thumbs.forEach(thumb => {
  thumb.addEventListener("click", () => {

    thumbs.forEach(t => t.classList.remove("active"));
    thumb.classList.add("active");

    if (thumb.dataset.type === "video") {
      showVideo(thumb.dataset.video);
    } else {
      showImage(thumb.dataset.large);
    }
  });
});

/* --- ▶クリック：再生開始 --- */
playBtn.addEventListener("click", () => {
  video.play();
  carousel.classList.add("video-playing"); // ▶非表示
});

/* --- 動画クリック：再生 / 停止トグル --- */
video.addEventListener("click", () => {
  if (video.paused) {
    video.play();
    carousel.classList.add("video-playing");
  } else {
    video.pause();
    carousel.classList.remove("video-playing"); // ▶表示
  }
});

/* --- 再生終了時 --- */
video.addEventListener("ended", () => {
  carousel.classList.remove("video-playing"); // ▶表示
});

