const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
    if (mutation.type === 'childList') {
        replacement();
    }
    });
});


document.addEventListener("DOMContentLoaded", (event) => {
    if (redirectShorts(new URL(window.location).pathname)) return;
    // 配置 observer 觀察目標節點及其子節點
    var config = { childList: true, subtree: true };

    // 監聽整個文檔的 DOM 變化
    observer.observe(document.body, config);
});

document.addEventListener("yt-navigate-start", (e) => {
    redirectShorts(e?.detail?.url);
});

function redirectShorts(pathname) {
    if (!pathname) return false;
    if (!pathname.startsWith("/shorts")) return false;
    const v = pathname.replace("shorts/", "").replace('/', '');
    window.location = `https://www.youtube.com/watch?v=${v}`;

    return true;
}

let i = -1;
function replacement() {
    
    // 取得 url
    const newURL = new URL(window.location);
    const v = newURL.searchParams.get("v");

    if (v === null) return;

    const playerId = 'ytd-player';

    const movie_player = document.getElementById('movie_player');

    const oldElement = document.getElementById(playerId);

    if (!oldElement || !movie_player) {
        return;
    }
    
    // 創建一個新的元素
    const newElement = document.createElement('iframe');
    newElement.id = playerId;
    newElement.width = '100%';
    newElement.height = '100%';
    newElement.src = `https://www.youtube.com/embed/${v}`;
    // newElement.frameBorder = "0";
    newElement.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    newElement.referrerpolicy = "strict-origin-when-cross-origin";
    newElement.allowFullscreen = true;
    newElement.autoplay = true;

    i += 1;
    // 替換舊元素
    if (movie_player && i > 600) {
        movie_player.remove();
        oldElement.childNodes.forEach((node) => {
            oldElement.removeChild(node);
        });
        
        oldElement.parentNode.appendChild(newElement);
        oldElement.remove();
        // alert('replaced');
        observer.disconnect();
    }

}