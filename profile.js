function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn === "true") {
      document.getElementById("profile-section").style.marginTop = "5em";
      showProfileSection();
    } else {
      document.getElementById("profile-section").style.marginTop = "25em";
      showLoginForm();
    }
  }

  function showLoginForm() {
    document.getElementById("profile-section").style.marginTop = "25em";
    document.getElementById("login-form").style.display = "block";
    document.getElementById("profile-container").style.display = "none";
  }
  

  function createPostElement(post) {
    const postElement = document.createElement('div');
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
        ${createCommentSection(post.comments)}
      </div>
    `;
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

  function showProfileSection() {
    document.getElementById("profile-section").style.marginTop = "5em";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("profile-container").style.display = "block";
  
    const photoUrl = localStorage.getItem("photo");
    const name = localStorage.getItem("name");
    document.getElementById("profile-photo").src = photoUrl;
    document.getElementById("profile-name").textContent = name;

    const sharedPosts = sessionStorage.getItem('sharedPosts');
    console.log(sharedPosts);
    const sharedPostsArray = sharedPosts ? JSON.parse(sharedPosts) : [];

    const sharedPostsContainer = document.getElementById('shared-posts');
    sharedPostsContainer.innerHTML = ''; // Clear previous content

    sharedPostsArray.forEach((post) => {
    console.log(sessionStorage);
    const postElement = createPostElement(post);
    sharedPostsContainer.appendChild(postElement);
    });
  }
  
  
  function login() {
    const photoInput = document.getElementById("photo");
    const photo = photoInput.files[0];
    const name = document.getElementById("name").value;
    const isValid = document.getElementById("name").checkValidity();
    if (photo && name && isValid) {
      //ImgBB :D
      const formData = new FormData();
      formData.append("image", photo);
      formData.append("key", "fb3d8ac46a7007f1194837f0332c2b09"); 
  
      fetch("https://api.imgbb.com/1/upload", {
        method: "POST", 
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const photoUrl = data.data.url;
  
          localStorage.setItem("loggedIn", "true");
          localStorage.setItem("photo", photoUrl);
          localStorage.setItem("name", name);
  
          showProfileSection();
        })
        .catch((error) => {
          console.error("Error uploading photo:", error);
        });
    } else {
      if(!photo)  alert("Please select a photo.");
      if(!name) alert("Please select a name.");
      if(!isValid) alert("Please select a valid name");
    }
  }
  
  function logout() {
    sessionStorage.setItem('sharedPosts', []);
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("photo");
    localStorage.removeItem("name");

    showLoginForm();
  }
  
  checkLoginStatus();