windows.addEventListener('DOMContentLoaded',event=>{
    var create_post = document.getElementById('create-post');
    var logout = document.getElementById('logout')
    var post_area = document.getElementById('post')
    var feed_list = document.getElementById('feed-list');
    var textarea = document.getElementsByTagName('textarea');
    var image_input = document.getElementById('insert_image');
    var vedio_input = document.getElementById('insert_vedio')
    var submit_post = document.getElementById('submit-post')

    post_area.style.display = none;

    create_post.addEventListener('click', event=>{
        post_area.style.display = 'flex';
        feed_list.style.display = 'none';
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

        fetch("http://localhost:5000/")
    })

    logout.addEventListener('click',event=>{
        localStorage['token'] = '';
    })
})