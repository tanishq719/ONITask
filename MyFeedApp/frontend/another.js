const { json } = require("express");

windows.addEventListener('DOMContentLoaded',event=>{
    var create_post = document.getElementById('create-post');
    var logout = document.getElementById('logout')
    var post_area = document.getElementById('post')
    var feed_list = document.getElementById('feed-list');
    var textarea = document.getElementsByTagName('textarea');
    var image_input = document.getElementById('insert_image');
    var vedio_input = document.getElementById('insert_vedio')
    var submit_post = document.getElementById('submit-post')
    var image_names = document.getElementById('image_names')
    var vedio_names = document.getElementById('vedio_names')


    post_area.style.display = none;

    fetch("http://locahost:5000/fetchposts",{
        headers:{
            "Authorization": 'Bearer '+localStorage['token']
        }
    })
    .then(res=>res.json())
    .then(data=>{
        for(var post of data['posts'])
        {
            var post_image,post_vedios;
            for(var name of post.post_images)
            {
                post_images += `<img src="uploads/`+name+`">`
            }
            for(var name of post.post_vedios)
            {
                post_images += `<video width="320" height="240" controls>
                <source src="uploads/`+name+` type="video/mp4"></vedio>`
            }

            feed_list.innerHTML += `<div class="card">
            <div class="card-header">
              `+post.email_id+`
            </div>
            <div class="card-body">
              <blockquote class="blockquote mb-0">
                <p>`+ post.post_body+`</p>
                `+post_images+post_vedios+`
              </blockquote>
            </div>
          </div>`
        }
    })

    create_post.addEventListener('click', event=>{
        post_area.style.display = 'flex';
        feed_list.style.display = 'none';
    })

    image_input.addEventListener('change', event=>{
        for(var file of image_input.files)
            image_input.innerText += file.filename
    })

    vedio_input.addEventListener('change', event=>{
        for(var file of vedio_input.files)
            vedio_input.innerText += file.filename
    })

    submit_post.addEventListener('click', event=>{
        const formData = new FormData();
        formData.append('post_body', textarea.value);
        for(var file of image_input.files)
        {
            formData.append('images',file);
        }
        for(var file of vedio_input.files){
            formData.append('vedios',file);
        }

        fetch("http://localhost:5000/createpost",{
            method: "POST",
            headers:{
                "Authorization": 'Bearer '+localStorage['token']
            },
            body:formData
        })
        .then(res=>{
            if(res.status == 201)
            {
                console.log("post created!!");
                windows.location.href = "/";
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })

    logout.addEventListener('click',event=>{
        localStorage['token'] = '';
    })
})