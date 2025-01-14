const ApiUrl = "http://localhost:3000/users";

const getAPIUder = async () => {
    try {
        const response = await fetch(ApiUrl);
        if (!response.ok) {
            throw new Error("Lỗi khi lấy danh sách người dùng");
        }
        return await response.json();
    } catch (error) {
        console.error("Error: ", error);
    }
};

const createUser = async (user) => {
    try {
        const response = await fetch(ApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
        if (!response.ok) {
            throw new Error("Lỗi khi tạo người dùng");
        }
        return await response.json();
    } catch (error) {
        console.error("Error: ", error);
    }
};

function xtName(name) {
    const xtName = /^[a-zA-Z]{4,}$/;
    return xtName.test(name);
}

function xtEmail(email) {
    const xtEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return xtEmail.test(email);
}

function xtPassword(password) {
    const xtPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
    return xtPassword.test(password);
}

async function registerUser(event) {
    event.preventDefault();

    try {
        const name = document.querySelector("input[name='name']").value.trim();
        const email = document.querySelector("input[name='email']").value.trim();
        const password = document.querySelector("input[name='password']").value.trim();
        const confirmPassword = document.querySelector("input[name='re-enter password']").value.trim();

        if (!xtName(name)) {
            alert("Tên phải dài hơn 4 kí tự và không chứa số, dấu, kí tự đặc biệt hoặc khoảng trắng! Vui lòng nhập đúng yêu cầu.");
            return;
        }
        if (!xtEmail(email)) {
            alert("Email không hợp lệ! Vui lòng nhập lại.");
            return;
        }
        if (!xtPassword(password)) {
            alert("Mật khẩu phải dài hơn 4 kí tự, chứa ít nhất một chữ cái in hoa, một số và một kí tự đặc biệt.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Mật khẩu nhập lại không khớp! Vui lòng nhập lại.");
            return;
        }

        const users = await getAPIUder();
        const emailExists = users.some((user) => user.email === email);

        if (emailExists) {
            alert("Email đã được đăng ký! Vui lòng nhập email khác.");
            return;
        }

        await createUser({ name, email, password });
        
        alert("Đăng ký thành công!");
        window.location.href = "login.html";
    } catch (error) {
        alert("Đã xảy ra lỗi: " + error.message);
        console.error("Error:", error);
    }
}


//////////////////////////////////
async function loginUser(event) {
    event.preventDefault();

    try {
        let email = document.querySelector("input[name='email']").value.trim();
        let password = document.querySelector("input[name='password']").value.trim();

        if (!email || !password) {
            throw new Error("Vui lòng nhập đầy đủ thông tin!");
        }

        let response = await fetch(ApiUrl);
        let users = await response.json();

        
        const user = users.find((u) => u.email === email && u.password === password);
        
        if (user) {
            alert("Đăng nhập thành công!");
            window.location.href = "register.html";
        } else {
            alert("Email hoặc mật khẩu không đúng!");
            return;
        }
    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
    }
}

if (document.querySelector("form")) {
    const formType = document.querySelector("form").getAttribute("action");
    if (formType === "register") {
        document.querySelector("form").addEventListener("submit", registerUser);
    } else if (formType === "login") {
        document.querySelector("form").addEventListener("submit", loginUser);
    }
}


function togglePasswordVisibility(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);

    toggle.addEventListener("click", () => {
        const isPassword = input.getAttribute("type") === "password";
        input.setAttribute("type", isPassword ? "text" : "password");
        toggle.classList.toggle("text-gray-500");
        toggle.classList.toggle("text-blue-500");
    });
}

togglePasswordVisibility("password", "togglePassword");
togglePasswordVisibility("confirmPassword", "toggleConfirmPassword");


