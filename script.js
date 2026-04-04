document.addEventListener("DOMContentLoaded", () => {
    const items = [...document.querySelectorAll(".work-item")];
    const grid = document.getElementById("worksGrid");

    // ON/OFF できるように「複数選択」対応の状態管理
    let active = {
        period: new Set(),
        client: new Set(),
        media: new Set(),
    };

    // ---------------------------
    //  抽出処理（AND 条件フィルタ）
    // ---------------------------
    function applyFilters() {
let filtered = items.filter((it) => {

    // 期間（単一なので従来どおり）
    const p =
        active.period.size === 0 ||
        active.period.has(it.dataset.period);

    // クライアント（複数対応・安全版）
    const clientValues = (it.dataset.client || "").split(" ");
    const c =
        active.client.size === 0 ||
        [...active.client].some(v => clientValues.includes(v));

    // 媒体（複数対応・安全版）
    const mediaValues = (it.dataset.media || "").split(" ");
    const m =
        active.media.size === 0 ||
        [...active.media].some(v => mediaValues.includes(v));

    return p && c && m;
});

        // 制作日ソート（YYYY/MM）
        filtered.sort((a, b) => b.dataset.date.localeCompare(a.dataset.date));

        // 表示反映
        items.forEach((it) => (it.style.display = "none"));
        filtered.forEach((it) => (it.style.display = "block"));
    }

    // ---------------------------
    //   タグ共通処理（ON/OFF切替）
    // ---------------------------
    function toggleTag(set, value, btn) {
        // ON だったら OFF（削除）
        if (set.has(value)) {
            set.delete(value);
            btn.classList.remove("active");
        } else {
            // OFF → ON
            set.add(value);
            btn.classList.add("active");
        }
        applyFilters();
    }

    // ---------------------------
    //   「全部」ボタンはリセット
    // ---------------------------
    document.querySelector("[data-filter-period='all']").onclick = () => {
        active.period.clear();
        active.client.clear();
        active.media.clear();

        // active クラスも全部消す
        document.querySelectorAll(".pill").forEach((p) => p.classList.remove("active"));

        applyFilters();
    };

    // ---------------------------
    //   期間
    // ---------------------------
    document.querySelectorAll("[data-filter-period]").forEach((btn) => {
        if (btn.dataset.filterPeriod === "all") return; // 全部は別処理
        btn.onclick = () => toggleTag(active.period, btn.dataset.filterPeriod, btn);
    });

    // ---------------------------
    //   依頼元
    // ---------------------------
    document.querySelectorAll("[data-filter-client]").forEach((btn) => {
        btn.onclick = () => toggleTag(active.client, btn.dataset.filterClient, btn);
    });

    // ---------------------------
    //   媒体
    // ---------------------------
    document.querySelectorAll("[data-filter-media]").forEach((btn) => {
        btn.onclick = () => toggleTag(active.media, btn.dataset.filterMedia, btn);
    });

    // 初期表示
    applyFilters();
});