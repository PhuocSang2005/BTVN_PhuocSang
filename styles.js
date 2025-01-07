const ApiUrl = 'http://localhost:3000/users';

function xtName(name){
   const xtName = /^[a-zA-Z]{4,}$/;
   return xtName.test(name);
}
function xtEmail(email){
   const xtEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return xtEmail.test(email);
}
function xtPassword(password){
   const xtPassword =  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
   return xtPassword.test(password);
}


       async function registerUser(event) {
           event.preventDefault();

           let name = document.querySelector("input[name='name']").value.trim();
           let email = document.querySelector("input[name='email']").value.trim();
           let password = document.querySelector("input[name='password']").value.trim();
           let confirmPassword = document.querySelector("input[name='re-enter password']").value.trim();

           if(!xtName(name)){
               alert("Tên phải dài hơn 4 kí tự  và không chứa số , dấu , kí tự đặc biệt hoặc khoảng trắng! Vui lòng nhập theo yêu cầu .");
               return;
           }
           if(!xtEmail(email)){
               alert("Email không hợp lệ ! Vui lòng nhập lại");
               return;
           }
           if(!xtPassword(password)){
               alert("Mật khẩu phải dài hơn 4 kí tự , chứa ít nhất một chữ cái in hoa , một số và một kí tự đặc biệt ");
               return;
           }
           if(password !== confirmPassword){
               alert("Mật khẩu nhập lại không khớp!!! Vui lòng nhập lại");
               return;
           }

           let user = {name,email,password};

           try{
           //     let response = await fetch(ApiUrl,{
           //         method:"POST",
           //         headers: {"Content-Type":"application/json"},
           //         body:JSON.stringify(user),
           //     });
           //     if(response.ok){
           //         alert("Đăng kí thành công");
           //         window.location.href ="login.html";
           //     }else{
           //         alert("Đăng kí thất bại");
           //     }
           // }catch(error){
           //     console.error("Error:",error);
           //     alert("Có lỗi xảy ra !");
           let response = await fetch(ApiUrl);
           let users = await response.json();

           let ktEmail = users.some((user)=>user.email === email);
           if(ktEmail){
               alert("Email đã được đăng kí !!! Vui lòng nhập Email khác !!!");
               return;
           }
           let user={ name,email,password};
           let registerResponse = await fetch(ApiUrl,{
               method:"POST",
                       headers: {"Content-Type":"application/json"},
                       body:JSON.stringify(user),
           });
           if(registerResponse.ok){
               alert("Đăng kí thành công");
               window.location.href="login.html";
           }else {
               alert("Đăng kí thất bại !!!!");
           }

           } catch(error){
               console.log("Error",error);
               alert("Có lỗi xảy ra!");
           }
       }

//////////////////////////////////
       async function loginUser(event) {
           event.preventDefault();

           let email = document.querySelector("input[name='email']").value.trim();
           let password = document.querySelector("input[name='password']").value.trim();


           if( !email || !password){
               alert("Vui lòng nhập đầy đủ thông tin!!!");
               return;
           }
           try{
               let response = await fetch(ApiUrl);
               let users = await response.json();

               const user = users.find((u) => u.email === email && u.password === password);
               if(user){
                   alert("Đăng nhập thành công!");
                    window.location.href = "index.html"; /// Đường dẫn trang chủ chưa có để chưng
            } else {
           alert("Email hoặc mật khẩu không đúng!");
       }
           } catch (error) {
           console.error("Error:", error);
           alert("Có lỗi xảy ra!");
       }
}

if(document.querySelector("form")){
   const formType = document.querySelector("form").getAttribute("action");
       if(formType === "register"){
           document.querySelector("form").addEventListener("submit",registerUser);
       }else if (formType === "login") {
           document.querySelector("form").addEventListener("submit", loginUser);
       }
   }