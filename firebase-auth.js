// Nhúng thư viện Firebase + Thư viện Firestore (Kho dữ liệu đám mây)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Thông tin "chìa khóa" dự án mới của Nam
const firebaseConfig = {
  apiKey: "AIzaSyCipB052xHDreNlI7WuL5xFiGf-siB9_kY",
  authDomain: "newapp-stptit.firebaseapp.com",
  projectId: "newapp-stptit",
  storageBucket: "newapp-stptit.firebasestorage.app",
  messagingSenderId: "139068980762",
  appId: "1:139068980762:web:f86319a1774d5445bcdba3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Khởi động Kho dữ liệu
const provider = new GoogleAuthProvider();

let currentUser = null; // Biến lưu người dùng hiện tại

// Hàm Đăng nhập
window.loginWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
        alert("✅ Đăng nhập thành công! Xin chào " + result.user.displayName);
    }).catch((error) => {
        console.error("Lỗi đăng nhập:", error);
        alert("❌ Đăng nhập thất bại. Vui lòng mở F12 -> Console để xem mã lỗi!");
    });
};

// Hàm Đăng xuất
window.logout = () => {
    signOut(auth).then(() => {
        alert("👋 Đã đăng xuất!");
        window.location.reload(); 
    });
};

// ==========================================
// TÍNH NĂNG ĐỒNG BỘ ĐÁM MÂY (CLOUD SYNC)
// ==========================================

// 1. Đẩy dữ liệu lên mây
window.syncToCloud = async (vocabArray) => {
    if (!currentUser) return; 
    try {
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(userRef, { vocabulary: vocabArray });
        console.log("☁️ Đã đồng bộ lên Cloud!");
    } catch (error) {
        console.error("Lỗi đồng bộ:", error);
    }
};

// 2. Tải dữ liệu từ mây về máy
window.loadFromCloud = async () => {
    if (!currentUser) return;
    try {
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            const cloudVocab = docSnap.data().vocabulary || [];
            localStorage.setItem("vocabulary", JSON.stringify(cloudVocab));
            
            // Bắn tín hiệu để trang web cập nhật từ vựng
            window.dispatchEvent(new Event("cloudDataLoaded"));
            console.log("📥 Đã tải dữ liệu từ Cloud về máy!");
        }
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
    }
};

// ==========================================
// THEO DÕI TRẠNG THÁI ĐĂNG NHẬP
// ==========================================
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    const profileContainer = document.getElementById("user-profile");
    
    if (profileContainer) {
        if (user) {
            const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=ff9a00&color=fff`;
            profileContainer.innerHTML = `
                <img src="${avatarUrl}" alt="Avatar" class="user-avatar" title="${user.displayName}">
                <div class="auth-dropdown">
                    <p>👋 Hi, ${user.displayName.split(' ').pop()}</p>
                    <button class="logout-btn" onclick="window.logout()">Đăng xuất</button>
                </div>
            `;
            // Vừa đăng nhập xong tự động kéo dữ liệu về
            window.loadFromCloud();
        } else {
            profileContainer.innerHTML = `<button class="login-btn" onclick="window.loginWithGoogle()">🔑 Đăng nhập</button>`;
        }
    }
});