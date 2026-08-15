// Nhúng thư viện Firebase trực tiếp từ máy chủ Google
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Thông tin "chìa khóa" dự án của Nam
const firebaseConfig = {
  apiKey: "AIzaSyCipB052xHDreNLI7WuL5xFiGf-siB9_kY",
  authDomain: "newapp-stptit.firebaseapp.com",
  projectId: "newapp-stptit",
  storageBucket: "newapp-stptit.firebasestorage.app",
  messagingSenderId: "139068980762",
  appId: "1:139068980762:web:f86319a1774d5445bcdba3"
};

// Khởi động Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Hàm Đăng nhập
window.loginWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
        alert("✅ Đăng nhập thành công! Xin chào " + result.user.displayName);
    }).catch((error) => {
        console.error("Lỗi đăng nhập:", error);
        alert("❌ Đăng nhập thất bại. Vui lòng thử lại!");
    });
};

// Hàm Đăng xuất
window.logout = () => {
    signOut(auth).then(() => {
        alert("👋 Đã đăng xuất!");
    });
};

// Theo dõi trạng thái (Xem ai đang đăng nhập) để đổi tên nút
// Theo dõi trạng thái để hiển thị Avatar + Dropdown
onAuthStateChanged(auth, (user) => {
    const profileContainer = document.getElementById("user-profile");
    if (profileContainer) {
        if (user) {
            // Lấy ảnh Google, nếu lỗi/không có thì dùng ảnh mặc định tự tạo chữ cái đầu
            const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=ff9a00&color=fff`;
            
            // Vẽ Avatar và Dropdown
            profileContainer.innerHTML = `
                <img src="${avatarUrl}" alt="Avatar" class="user-avatar" title="${user.displayName}">
                <div class="auth-dropdown">
                    <p>👋 Hi, ${user.displayName.split(' ').pop()}</p>
                    <button class="logout-btn" onclick="window.logout()">Đăng xuất</button>
                </div>
            `;
        } else {
            // Nếu chưa đăng nhập -> Hiện nút Đăng nhập
            profileContainer.innerHTML = `<button class="login-btn" onclick="window.loginWithGoogle()">🔑 Đăng nhập</button>`;
        }
    }
});
