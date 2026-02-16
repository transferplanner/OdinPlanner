let isFullVersion = localStorage.getItem("isFullVersion") === "true";

// [trial.js]
// 인덱스에서 버튼 누를 때 호출될 함수 (또는 이벤트 리스너)
function selectTheme(themeName) {
    // 1. 창고(localStorage)에 저장하기 (다른 페이지 가도 유지되게!)
    localStorage.setItem("selectedTheme", themeName);
    
    // 2. 현재 페이지의 스타일 바로 바꾸기 (새로고침 없이!)
    const themeLink = document.getElementById("themeLink");
    if (themeLink) {
        // index.html과 같은 층에 폴더들이 있으니까 경로 확인!
        themeLink.href = `${themeName}/index.css`; 
    }
    
    console.log("실시간 테마 변경:", themeName);
}
// 현재 저장된 테마 가져오기 (기본값 핑크)
function getSavedTheme() {
    return localStorage.getItem("selectedTheme") || "pink";
}

// --- 기존 트라이얼 로직 유지 ---
const TRIAL_KEY = "trial-start-date";
const TRIAL_MS = 3 * 24 * 60 * 60 * 1000;


function ensureTrialStart(){
  if (!localStorage.getItem(TRIAL_KEY)){
    localStorage.setItem(TRIAL_KEY, String(Date.now()));
  }
}

function isTrialExpired(){
  ensureTrialStart();
  const start = Number(localStorage.getItem(TRIAL_KEY));
  return (Date.now() - start) > TRIAL_MS;
}

const fourDaysAgo = Date.now() - (4 * 24 * 60 * 60 * 1000); 
localStorage.setItem("trial-start-date", String(fourDaysAgo));

// 파일이 열리자마자 실행되는 코드

window.forceExpireTrialForTest = () => localStorage.setItem(TRIAL_KEY, String(Date.now() - 4*24*60*60*1000));

// --- 기간제 및 풀버전 로직 ---
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const PLANS = {
  "transferplanner_monthly_purchase": 30 * MS_PER_DAY,
  "transferplanner_three_month_purchase": 90 * MS_PER_DAY,
  "transferplanner_six_month_purchase": 180 * MS_PER_DAY
  // 평생권은 여기서 빼고 아래 switch문에서 처리!
};

const EXPIRY_KEY = "planner-expiry-date";

// 서연이가 살리고 싶어한 변수 (현재 구독 상태 확인용)
let isFull = localStorage.getItem("isFullVersion") === "true";
let expiry = Number(localStorage.getItem(EXPIRY_KEY) || 0);
let isSubscriptionActive = expiry > Date.now();
let isPaidUser = isFull || isSubscriptionActive;

// 3. 상태가 변했을 때(결제 등) 호출해서 전역 변수들을 갱신해주는 함수
function refreshAccessStatus() {
  isFull = localStorage.getItem("isFullVersion") === "true";
  expiry = Number(localStorage.getItem(EXPIRY_KEY) || 0);
  isSubscriptionActive = expiry > Date.now();
  isPaidUser = isFull || isSubscriptionActive;
  
  console.log("권한 상태 갱신 완료:", isPaidUser);
}


// 결제 핸들러
async function handleAllPayments(productId) { console.log("결제 시도 상품 ID:", productId);

if (window.AndroidBridge) { window.AndroidBridge.postMessage(productId); } else { alert("앱에서 결제해 주세요! 🌸"); } }