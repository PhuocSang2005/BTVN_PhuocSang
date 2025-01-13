const API_URL = "http://localhost:3000/student";

document.addEventListener("DOMContentLoaded", () => {
    const form = {
        name: document.getElementById("js-name-student"),
        age: document.getElementById("js-age-student"),
        gender: document.getElementById("js-gender-student"),
        yearOfBirth: document.getElementById("js-year-of-birth-student"),
        title: document.getElementById("js-title-student"),
        studentClass: document.getElementById("js-class-student"),
        image: document.getElementById("js-upload-student"),
        imagePreview: document.getElementById("js-img-student"),
    };
    const addBtn = document.getElementById("js-add-student");
    const updateBtn = document.getElementById("js-update-student");
    const tableBody = document.querySelector("tbody");
    let editingStudentId = null;

    //\\\ Xử lý chọn ảnh
    form.image.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                form.imagePreview.src = e.target.result;
                form.imagePreview.dataset.imageLink = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    async function fetchStudents() {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            renderStudentList(data);
        } catch (err) {
            console.error("Đã xảy ra lỗi khi lấy sinh viên:", err);
        }
    }

    // Hiển thị danh sách sinh viên
    function renderStudentList(students) {
        tableBody.innerHTML = "";
        students.forEach((student) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="p-3 border border-gray-300">${student.name}</td>
                <td class="p-3 border border-gray-300">${student.yearOfBirth}</td>
                <td class="p-3 border border-gray-300">${student.class}</td>
                <td class="p-3 border border-gray-300"><img src="${student.image}" alt="Student Image" class="w-10 h-10 rounded-full"></td>
                <td class="p-3 border border-gray-300">${student.title}</td>
                <td class="p-3 border border-gray-300">
                    <button class="bg-yellow-500 text-white px-3 py-1 rounded edit-btn" data-id="${student.id}">Sửa</button>
                    <button class="bg-red-500 text-white px-3 py-1 rounded delete-btn" data-id="${student.id}">Xóa</button>
                </td>
            `;
            tableBody.appendChild(row);
        });


        document.querySelectorAll(".edit-btn").forEach((btn) => btn.addEventListener("click", handleEditStudent));
        document.querySelectorAll(".delete-btn").forEach((btn) => btn.addEventListener("click", handleDeleteStudent));
    }
    
    function resetForm() {
        form.name.value = "";
        form.age.value = "";
        form.gender.value = "";
        form.yearOfBirth.value = "";
        form.title.value = "";
        form.studentClass.value = "";
        form.imagePreview.src = "";
        form.imagePreview.dataset.imageLink = "";
        editingStudentId = null;
    }

    fetchStudents();
    //\\ Thêm sinh viên mới//\\
    addBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const newStudent = getStudentFormData();
        if (!newStudent) return;
        try {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newStudent),
            });
            await fetchStudents();
            resetForm();
        } catch (err) {
            console.error("Đã xảy ra lỗi thêm sinh viên:", err);
        }
    });


    updateBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const updatedStudent = getStudentFormData();
        if (!updatedStudent) return;

        try {
            await fetch(`${API_URL}/${editingStudentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedStudent),
            });
            await fetchStudents();
            resetForm();
            toggleAddUpdateButtons();
        } catch (err) {
            console.error("Đã xảy ra lỗi update sinh viên:", err);
        }
    });


    async function handleDeleteStudent(event) {
        const id = event.target.dataset.id;
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            await fetchStudents();
        } catch (err) {
            console.error("Đã xảy ra lỗi xóa sinh viên:", err);
        }
    }

    //\\ Lấy thông tin sinh viên từ form
    function getStudentFormData() {
        const name = form.name.value.trim();
        const age = form.age.value.trim();
        const gender = form.gender.value.trim();
        const yearOfBirth = form.yearOfBirth.value.trim();
        const title = form.title.value.trim();
        const studentClass = form.studentClass.value.trim();
        const image = form.imagePreview.dataset.imageLink;

        if (!name || !age || !gender || !yearOfBirth || !title || !studentClass || !image) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return null;
        }

        return { name, age, gender, yearOfBirth, title, class: studentClass, image };
    }

    //\\ Sửa sinh viên
    async function handleEditStudent(event) {
        const id = event.target.dataset.id;

        try {
            const res = await fetch(`${API_URL}/${id}`);
            const student = await res.json();
            form.name.value = student.name;
            form.age.value = student.age;
            form.gender.value = student.gender;
            form.yearOfBirth.value = student.yearOfBirth;
            form.title.value = student.title;
            form.studentClass.value = student.class;
            form.imagePreview.src = student.image;
            form.imagePreview.dataset.imageLink = student.image;

            editingStudentId = id;
            toggleAddUpdateButtons();
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu học sinh:", err);
        }
    }

    function toggleAddUpdateButtons() {
        addBtn.classList.toggle("hidden");
        updateBtn.classList.toggle("hidden");
    }

});

