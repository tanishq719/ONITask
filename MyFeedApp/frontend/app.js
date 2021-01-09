window.addEventListener('DOMContentLoaded', event=>{

    var login_section = document.getElementById("login-section")
    var signup_section = document.getElementById("signup-section")
    var signup = document.getElementById("signup")
    var login = document.getElementById("login")
    var first_name = document.querySelector('#first_name')
    var last_name = document.querySelector('#last_name')
    var email_id = document.querySelector('#email_id')
    var password = document.querySelector('#password')
    var confirm_password = document.querySelector('#confirm_password')
    var signup_button = document.getElementById("signup_button"); 
    var login_button = document.getElementById("login_button");

    login.style.display = "none";

    //opening signup section
    signup_section.addEventListener('click',event=>{
        signup.style.display = "flex";
        login.style.display = "none";
    });

    //signing the user in
    signup_button.addEventListener('click',event=>{
        fetch("http://localhost:5000/signup",{
            method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "first_name": first_name.value,
                    "last_name": last_name.value,
                    "email_id": email_id.value,
                    "password": password.value,
                    "confirm_password": confirm_password.value
                })
        })
        .then(res=>{
            console.log("inside then");
            if(res.status == 201){
                console.log("inside if");
                res.json().then(body=>{
                    localStorage['token'] = body.token;
                }).then(()=>{
                    console.log("inside if then");
                    console.log(localStorage['token']);
                    fetch("http://localhost:5000/viewpost",{
                        headers:{
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": 'Bearer '+localStorage['token']
                        }
                    })
                    .then(body=>{
                        // if signed in
                        window.location.href="./feed.html"
                    })
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }).catch(err=>{
            console.log(err)
        })
    });
    
    // opening the login section
    login_section.addEventListener('click',event=>{
        signup.style.display = "none";
        login.style.display = "flex";
    });

    // logging in the user
    login_button.addEventListener('click',event=>{
        fetch("http://localhost:5000/login",{
            method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body:JSON.stringify({
                    "email_id": document.getElementById('login_email_id').value,
                    "password": document.getElementById('login_password').value
                })
        })
        .then(res=>{
            console.log("inside then");
            if(res.status == 201){
                console.log("inside if");
                res.json().then(body=>{
                    
                    //storing the token in localstorage
                    localStorage['token'] = body.token;
                }).then(()=>{
                    console.log("inside if then");
                    console.log(localStorage['token']);
                    
                    // fetching for posts
                    fetch("http://localhost:5000/viewpost",{
                        headers:{
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": 'Bearer '+localStorage['token']
                        }
                    })
                    .then(body=>{
                        window.location.href="./feed.html"
                    })
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }).catch(err=>{
            console.log(err)
        })
    });

});