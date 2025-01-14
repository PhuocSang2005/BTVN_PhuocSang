const API_URL = "http://localhost:3000/student";

const createStudent = async (student) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student),
        });
        if (!response.ok) throw new Error("Lỗi khi thêm sinh viên.");
        return await response.json();
    } catch (err) {
        console.error("Lỗi:", err);
    }
};

// Hàm cập nhật sinh viên
const updateStudent = async (id, newData) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newData),
        });
        if (!response.ok) throw new Error("Lỗi khi cập nhật sinh viên.");
        return await response.json();
    } catch (err) {
        console.error("Lỗi:", err);
    }
};

// Hàm xóa sinh viên
const deleteStudent = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Lỗi khi xóa sinh viên.");
        return await response.json();
    } catch (err) {
        console.error("Lỗi:", err);
    }
};

// Hàm lấy danh sách sinh viên
const fetchStudents = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Lỗi khi lấy danh sách sinh viên.");
        return await response.json();
    } catch (err) {
        console.error("Lỗi:", err);
    }
};

// Hàm lấy thông tin chi tiết của sinh viên
const getStudentById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Lỗi khi lấy thông tin sinh viên.");
        return await response.json();
    } catch (err) {
        console.error("Lỗi:", err);
    }
};

// Hàm hiển thị danh sách sinh viên lên giao diện
const renderStudentList = async () => {
    const tableBody = document.querySelector("tbody");
    try {
        const students = await fetchStudents();
        tableBody.innerHTML = "";
        students.forEach((student) => {
            const row = `
                <tr>
                    <td class="p-3 border border-gray-300">${student.name}</td>
                    <td class="p-3 border border-gray-300">${student.yearOfBirth}</td>
                    <td class="p-3 border border-gray-300">${student.class}</td>
                    <td class="p-3 border border-gray-300"><img src="${student.image}" alt="Student Image" class="w-10 h-10 rounded-full"></td>
                    <td class="p-3 border border-gray-300">${student.title}</td>
                    <td class="p-3 border border-gray-300">
                        <button class="bg-yellow-500 text-white px-3 py-1 rounded edit-btn" data-id="${student.id}">Sửa</button>
                        <button class="bg-red-500 text-white px-3 py-1 rounded delete-btn" data-id="${student.id}">Xóa</button>
                    </td>
                </tr>`;
            tableBody.insertAdjacentHTML("beforeend", row);
        });


        document.querySelectorAll(".edit-btn").forEach((btn) =>
            btn.addEventListener("click", async (event) => {
                const id = event.target.dataset.id;
                const student = await getStudentById(id);
                populateForm(student, id);
            })
        );

        document.querySelectorAll(".delete-btn").forEach((btn) =>
            btn.addEventListener("click", async (event) => {
                const id = event.target.dataset.id;
                await deleteStudent(id);
                renderStudentList();
            })
        );
    } catch (err) {
        console.error("Lỗi khi hiển thị danh sách sinh viên:", err);
    }
};

// Hàm điền thông tin vào form khi chỉnh sửa
const populateForm = (student, id) => {
    document.getElementById("js-name-student").value = student.name;
    document.getElementById("js-age-student").value = student.age;
    document.getElementById("js-gender-student").value = student.gender;
    document.getElementById("js-year-of-birth-student").value = student.yearOfBirth;
    document.getElementById("js-title-student").value = student.title;
    document.getElementById("js-class-student").value = student.class;
    document.getElementById("js-img-student").src = student.image;
    document.getElementById("js-img-student").dataset.imageLink = student.image;

    document.getElementById("js-update-student").dataset.id = id;

    document.getElementById("js-add-student").classList.add("hidden");
    document.getElementById("js-update-student").classList.remove("hidden");
};

document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("js-add-student");
    const updateBtn = document.getElementById("js-update-student");
    const imageInput = document.getElementById("js-upload-student");
    const imagePreview = document.getElementById("js-img-student");

    
    imageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result; 
                imagePreview.dataset.imageLink = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Thêm sinh viên
    addBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const student = getStudentFormData();
        if (!student) return;
        await createStudent(student);
        renderStudentList();
        resetForm();
    });

    // Cập nhật sinh viên
    updateBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const student = getStudentFormData();
        const editingStudentId = updateBtn.dataset.id;
        if (!student || !editingStudentId) return;
        await updateStudent(editingStudentId, student);
        renderStudentList();
        resetForm();
    });

    renderStudentList();
});

const getStudentFormData = () => {
    const name = document.getElementById("js-name-student").value.trim();
    const age = document.getElementById("js-age-student").value.trim();
    const gender = document.getElementById("js-gender-student").value.trim();
    const yearOfBirth = document.getElementById("js-year-of-birth-student").value.trim();
    const title = document.getElementById("js-title-student").value.trim();
    const studentClass = document.getElementById("js-class-student").value.trim();
    const image = document.getElementById("js-img-student").dataset.imageLink; 

    if (!name || !age || !gender || !yearOfBirth || !title || !studentClass || !image) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return null;
    }

    return { name, age, gender, yearOfBirth, title, class: studentClass, image };
};

const resetForm = () => {
    document.getElementById("js-name-student").value = "";
    document.getElementById("js-age-student").value = "";
    document.getElementById("js-gender-student").value = "";
    document.getElementById("js-year-of-birth-student").value = "";
    document.getElementById("js-title-student").value = "";
    document.getElementById("js-class-student").value = "";
    const imagePreview = document.getElementById("js-img-student");
    imagePreview.src = "";
    imagePreview.dataset.imageLink = ""; 
    document.getElementById("js-add-student").classList.remove("hidden");
    document.getElementById("js-update-student").classList.add("hidden");
};


