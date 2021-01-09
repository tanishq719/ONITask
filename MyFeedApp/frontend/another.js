window.addEventListener('DOMContentLoaded',event=>{
    var create_post = document.getElementById('create-post');
    var logout = document.getElementById('logout')
    var post_area = document.getElementById('post')
    var feed_list = document.getElementById('feed-list');
    var textarea = document.getElementsByTagName('textarea');
    var image_input = document.getElementById('insert_image');
    var vedio_input = document.getElementById('insert_vedios')
    var submit_post = document.getElementById('submit-post')
    var image_names = document.getElementById('image_names')
    var vedio_names = document.getElementById('vedio_names')
    var search_bar = document.getElementById('search-bar')
    var search_button = document.getElementById('search-button')
    var cancel_post = document.getElementById('cancle-post')

    post_area.style.display = 'none';

    initialize();
    function initialize(){

        //fetching posts
        fetch("http://localhost:5000/fetchposts",{
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": 'Bearer '+localStorage['token']
        }
    })
    .then(res=>res.json())
    .then(data=>{

        // inserting the post with its HTML

        feed_list.innerHTML = ""
        for(var post of data['posts'])
        {
            var post_images="",post_vedios="";
            // iterating over images of a post
            for(var name of post.post_images)
            {
                post_images += `<img src="uploads/`+name+`">`
            }
            // iterating over vedios of a post
            for(var name of post.post_vedios)
            {
                post_vedios += `<video controls>
                <source src="uploads/`+name+`" type="video/mp4"></vedio>`
            }

            feed_list.innerHTML += `<div class="card">
            <div class="card-header">
              `+post.email_id+`
            </div>
            <div class="card-body">
              <blockquote class="blockquote mb-0">
                <p>`+ post.post_body+`</p><div class="multimedia">
                `+post_images+post_vedios+`</div>
              </blockquote>
            </div>
          </div>`
        }
    })
}

    // opening create post section
    create_post.addEventListener('click', event=>{
        post_area.style.display = 'flex';
        feed_list.style.display = 'none';
    })

    // for inserting images while creating post
    image_input.addEventListener('change', event=>{
        for(var file of image_input.files)
            image_names.innerText += file.name
    })

    // for inserting vedios while creating post
    vedio_input.addEventListener('change', event=>{
        for(var file of vedio_input.files)
            vedio_names.innerText += file.name
    })

    // submitting the post to the server
    submit_post.addEventListener('click', event=>{

        // creating the form data as we cant use form for sending Authorization token
        const formData = new FormData();
        formData.append('post_body', textarea[0].value);
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
                post_area.style.display = 'none'
                feed_list.style.display = 'flex'
                initialize();
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })

    // for getting the post containg the searched tag
    search_button.addEventListener('click',event=>{
        event.preventDefault();
        fetch('http://localhost:5000/searchposts/'+ new URLSearchParams({
            tag:search_bar.value
        }),{
            headers:{
                'Authorization':'Bearer '+localStorage['token']
            }
        })
        .then(res=>res.json())
        .then(data=>{
            feed_list.innerHTML = ""
            for(var post of data['posts'])
            {
                var post_images="",post_vedios="";
                for(var name of post.post_images)
                {
                    post_images += `<img src="uploads/`+name+`">`
                }
                for(var name of post.post_vedios)
                {
                    post_vedios += `<video controls>
                    <source src="uploads/`+name+`" type="video/mp4"></vedio>`
                }

                    feed_list.innerHTML += `<div class="card">
                    <div class="card-header">
                    `+post.email_id+`
                    </div>
                    <div class="card-body">
                    <blockquote class="blockquote mb-0">
                        <p>`+ post.post_body+`</p><div class="multimedia">
                        `+post_images+post_vedios+`</div>
                    </blockquote>
                    </div>
                </div>`
                }
    })
    })

    // for canceling the create post section
    cancel_post.addEventListener('click',event=>{
        post_area.style.display = 'none';
        feed_list.style.display = 'flex';
    })

    // for logging out by clearing the token from the local storage
    logout.addEventListener('click',event=>{
        localStorage['token'] = '';
        window.location.href = '/';
    })
})