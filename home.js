//loading screen


const loadingScreen = document.getElementById('loading-screen');
const loadingShown = sessionStorage.getItem('loadingShown');
if(!loadingShown)
{
    sessionStorage.setItem('loadingShown', 'true');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 5000); 
}
  else  
  {
    loadingScreen.style.display = 'none';
  }

//postari
var postData = [];
function createPostElement(post) {
  console.log(post);
  const postElement = document.createElement('div');
  let nr_likes = Math.floor(Math.random() * 100) + 1;
  postElement.className = 'post-container';
  postElement.innerHTML = `
    <div class="post">
      <div class="post-header">
        <img src="${post.profileImg}" alt="Username">
        <span>${post.username}</span>
      </div>
      <div class="post-content">
        <p>${post.content}</p>
        ${post.image ? `<img src="${post.image}" alt="Post image">` : ''}
      </div>
      <div class="post-footer">
        <div class="post-footer-left">
          <span class="like-count"> ${nr_likes} </span>
          <img src="images/like.png" alt="Like" onclick="like()">
          <img src="images/reply.png" alt="Reply" onclick="reply()">
          <img src="images/share.png" alt="Share" ">
        </div>
      </div>
      ${createCommentSection(post.comments)}
    </div>
    `;
  const shareButton = postElement.querySelector('img[alt="Share"]');
  shareButton.addEventListener(
      "click",
      function () {
        share(post);
      },
      false
    );
  postElement.addEventListener(
      "click",
      function () {
        if(sessionStorage.getItem("writting-comment") == "true") return;
        console.log(postElement);
        document.getElementById("focused-post").style.display = 'block';
        document.getElementById("focused-post-content").innerHTML=postElement.innerHTML;
      },
      false
    );
  return postElement;
}

  function createCommentSection(comments) {
    if (!comments || comments.length === 0) {
      return '';
    }

    const commentSection = `
      <div class="post-comments">
        ${comments.map(comment => `
          <div class="comment">
            <div class="comment-header">
              <img src="${comment.profileImg}" alt="Username">
              <span>${comment.username}</span>
            </div>
            <div class="comment-content">
              <p>${comment.content}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    return commentSection;
  }
  
 
  function renderPosts() {
    const postContainer = document.getElementsByClassName('post-container')[0];
    const randomIndex = Math.floor(Math.random() * postData.length);
    const post = postData[randomIndex];
    const postElement = createPostElement(post);
  
    const postButton = createPostButton(postElement);
    postContainer.insertBefore(postButton, postContainer.firstChild);
    var today = new Date();
    console.log(today.getSeconds());
    postData.splice(randomIndex, 1);
  
    if (postData.length) {
      setTimeout(renderPosts, 5000);
    }
  }
  
  function createPostButton(postElement) {
    const postButton = document.createElement('img');
    postButton.src = 'images/loading.jpg';
    postButton.alt = 'Load posts';
    postButton.className = 'post-button'
    //postButton.textContent = 'New Posts Available!';
    postButton.addEventListener('click', function () {
      const postContainer = document.getElementsByClassName('post-container')[0];
      console.log(postElement);
      postContainer.insertBefore(postElement, postContainer.firstChild);
      postContainer.removeChild(postButton);
      scrollToTop();
    });
  
    return postButton;
  }

  function scrollToTop() {
    const scrollDuration = 1000; 
    const scrollStep = -window.scrollY / (scrollDuration / 15);
    
    function scrollAnimation() {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
        setTimeout(scrollAnimation, 15);
      }
    }
  
    scrollAnimation();
  }
  
  window.onload=pageLoaded;

  function generateTrendingPost()
  {
    const postContainer = document.getElementsByClassName('post-container')[1];
    const randomIndex = Math.floor(Math.random() * postData.length);
    const post = postData[randomIndex];
    const postElement = createPostElement(post);
  
    postContainer.appendChild(postElement);
  
    postData.splice(randomIndex, 1);
  }

  function load_database()
  {
    console.log("b");
    fetch('posts.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      postData = data;
  
      console.log(postData);
      pageLoaded_v2();
    })
    .catch(function(error) {
      console.error('Error:', error);
    });
  }

  function pageLoaded()
  { 
    sessionStorage.setItem("clicksonmenu","0");
    document.body.style.backgroundColor="#c4dbe4";
    document.getElementsByClassName("p-menu1")[0].addEventListener('click',function()
    {
      sessionStorage.setItem("clicksonmenu",(Number(sessionStorage.getItem("clicksonmenu")) + 1).toString());
      
    });
    console.log("a");
    load_database();
    
  }
  
  function pageLoaded_v2()
  {
    console.log(localStorage);
    console.log("d");
    generateTrendingPost();
    setTimeout(renderPosts,5000);
    sessionStorage.setItem("writting-comment","false");
  }


    function openPostPopup() {
      const postPopup = document.getElementById('post-popup');
      postPopup.style.display = 'block';
    }
    
    function closePostPopup() {
      const postPopup = document.getElementById('post-popup');
      postPopup.style.display = 'none';
      document.getElementById('post-content').value="";
      document.getElementById('post-image').value="";
    }

    function closePostPopup2() {
      const focusedPost = document.getElementById('focused-post');
      sessionStorage.setItem("writting-comment","false");
      focusedPost.style.display = 'none';
    }

    function submitPost(event) {
      event.preventDefault();
      const postContent = document.getElementById('post-content').value;
      const postImage = document.getElementById('post-image').files[0];
    
      if(localStorage.getItem("loggedIn") == "true")
      {
      const newPost = {
        username: localStorage.getItem("name"),
        profileImg: localStorage.getItem("photo"), 
        content: postContent,
        image: null 
      };
    
      if (postImage) {
        const reader = new FileReader();
        reader.onload = function(event) {
          newPost.image = event.target.result;
          addNewPost(newPost);
        };
        reader.readAsDataURL(postImage);
      } else {
        addNewPost(newPost);
      }
      }
      else
      {
        alert("Please login first");
      }
    }
    
    function addNewPost(newPost) {
      const postContainer = document.getElementsByClassName('post-container')[0];
      //postData.unshift(newPost);
      postContainer.insertBefore(createPostElement(newPost), postContainer.firstChild);
      const sharedPosts = sessionStorage.getItem('sharedPosts');
      const sharedPostsArray = sharedPosts ? JSON.parse(sharedPosts) : [];
      sharedPostsArray.push(newPost);
      sessionStorage.setItem('sharedPosts', JSON.stringify(sharedPostsArray));
      closePostPopup();
    }
    
    const submitButton = document.getElementById('submit');
    const closeButton = document.getElementById('close-popup-button');
    const closeButton2 = document.getElementById('close-popup-button2');
    const openButton = document.getElementById('open-popup-button');
    
    submitButton.addEventListener('click', submitPost);
    closeButton.addEventListener('click', closePostPopup);
    closeButton2.addEventListener('click', closePostPopup2);
    openButton.addEventListener('click',openPostPopup);



    //Functionality (like, share, comments)
    function like() {
      event.stopPropagation();
      console.log('Like button clicked');
      const clickedPost = event.target.closest('.post');
      console.log(clickedPost);
      const likeCountSpan = clickedPost.querySelector('.like-count');
      let likes = likeCountSpan.textContent;
      likeCountSpan.textContent = (Number(likes) + 1).toString();
    }
    
    function reply() {
      console.log('Reply button clicked');
      event.stopPropagation();
      if(sessionStorage.getItem("writting-comment") == "true") return;
      sessionStorage.setItem("writting-comment","true");
    
      const commentFormHTML = `
        <form class="comment-form" onSubmit="return false;">
          <input type="text" placeholder="Write a comment..." class="comment-input">
          <button id="submit-reply" type="button">Reply</button>
          <button id="cancel-reply" type="button">Cancel</button>
        </form>
      `;
    
      const clickedPost = event.target.closest('.post');
      const commentSection = clickedPost.querySelector('.post-comments');
    
      const commentForm = document.createElement('div');
      commentForm.className = 'comment-form-container';
      commentForm.innerHTML = commentFormHTML;
    
      commentSection.appendChild(commentForm);
    
      const commentInput = commentForm.querySelector('.comment-input');
      const submitButton = commentForm.querySelector('#submit-reply');
      const cancelButton = commentForm.querySelector('#cancel-reply');
    
      submitButton.addEventListener('click', function (e) {
        event.stopPropagation();
        console.log("aaaaafsafafa");
    
        const commentContent = commentInput.value;
        if (commentContent.trim() !== '') {
          const commentElement = document.createElement('div');
          commentElement.className = 'comment';
          commentElement.innerHTML = `
            <div class="comment-header">
              <img src=${localStorage.getItem("photo")} alt="Username">
              <span>${localStorage.getItem("name")}</span>
            </div>
            <div class="comment-content">
              <p>${commentContent}</p>
            </div>
          `;
    
          if(localStorage.getItem("loggedIn")=="true") commentSection.insertBefore(commentElement, commentForm);
              else alert("Login first");
          commentForm.remove();
    
          // Reset the comment input field
          commentInput.value = '';
          sessionStorage.setItem("writting-comment","false");
        }
      });
    
      cancelButton.addEventListener('click', function () {
        commentForm.remove();
        sessionStorage.setItem("writting-comment","false");
      });
    }
    


    function share(post) {
      event.stopPropagation();
      const sharedPosts = sessionStorage.getItem('sharedPosts');
      const sharedPostsArray = sharedPosts ? JSON.parse(sharedPosts) : [];
      sharedPostsArray.push(post);
      console.log(sessionStorage);
      sessionStorage.setItem('sharedPosts', JSON.stringify(sharedPostsArray));
      console.log(sessionStorage);
      console.log('Post shared');
    }

    function rgb(r, g, b){
      return "rgb("+r+","+g+","+b+")";
    }

    function Mayhem()
    {
      if(Number(sessionStorage.getItem("clicksonmenu"))>50)
      {
        let color1 = Math.floor(Math.random() * 255) + 1;
        let color2 = Math.floor(Math.random() * 255) + 1;
        let color3 = Math.floor(Math.random() * 255) + 1;
        document.body.style.backgroundColor=rgb(color1,color2,color3);
      }
      console.log(Number(sessionStorage.getItem("clicksonmenu"))>50);
      setTimeout(Mayhem, 100);
    }
    

    Mayhem();