const catNames = [
  "Whiskers",
  "Mittens",
  "Shadow",
  "Luna",
  "Oreo",
  "Simba",
  "Charlie",
  "Lucy",
  "Oliver",
  "Chloe",
  "Max",
  "Sophie",
  "Tiger",
  "Milo",
  "Lily",
  "Leo",
  "Coco",
  "Gizmo",
  "Misty",
  "Rocky",
  "Nala",
  "Felix",
  "Zoe",
  "Jasper",
  "Daisy",
  "Smokey",
  "Bella",
  "Buddy",
  "Molly",
  "Tigger",
  "Cleo",
  "Garfield",
  "Kitty",
  "Maximus",
  "Sadie",
  "Whiskey",
  "Gracie",
  "Sammy",
  "Princess",
  "Oscar",
  "Callie",
  "Salem",
  "Pumpkin",
  "Muffin",
  "Boots",
  "Ruby",
  "Midnight",
  "Lucky",
  "Mittens",
  "Spike",
  "Ziggy"
];

const notificationsList = document.getElementById('notifications-list');

function createNotification(notification) {
  const notificationItem = document.createElement('li');
  notificationItem.className = 'notification';

  const notificationHeader = document.createElement('div');
  notificationHeader.className = 'notification-header';
  notificationHeader.innerHTML = `
    <img src="${notification.profileImg}" alt="User profile picture">
    <span class="username">${notification.username}</span> ${notification.action}
  `;

  const notificationContent = document.createElement('div');
  notificationContent.className = 'notification-content';
  notificationContent.textContent = notification.content;

  const notificationButtons = document.createElement('div');
  notificationButtons.className = 'notification-buttons';

  if (notification.buttons) {
    for (const button of notification.buttons) {
      const buttonElement = document.createElement('button');
      buttonElement.textContent = button.label;
      if(button.label=="Accept") buttonElement.addEventListener(
        "click",
        function () {
          accept_fr(notification);
        },
        false
      );
        else buttonElement.addEventListener('click',decline_fr);
      notificationButtons.appendChild(buttonElement);
    }
  }

  notificationItem.appendChild(notificationHeader);
  notificationItem.appendChild(notificationContent);
  notificationItem.appendChild(notificationButtons);
  notificationsList.appendChild(notificationItem);
}

function accept_fr(notification)
{
  console.log("aaa");
  const fwiends = sessionStorage.getItem('notifications');
  const Fwiend =  fwiends ? JSON.parse(fwiends) : [];
  for(let i = Fwiend.length - 1 ; i>=0 ;i--)
  {
    console.log(notification);
    console.log(Fwiend[i]);
      if(notification.action == Fwiend[i].action  && notification.username == Fwiend[i].username) 
      {
        console.log("COAIE");
        Fwiend.splice(i,1);
        const Fwiendos = sessionStorage.getItem("friends");
        const FwiendosFr = Fwiendos ? JSON.parse(Fwiendos) : [];
        FwiendosFr.push({username: notification.username,
                         username_photo: notification.profileImg
        });
        sessionStorage.setItem("friends", JSON.stringify(FwiendosFr));
        break;
      }
  }
  sessionStorage.setItem('notifications', JSON.stringify(Fwiend));
  render();
  renderFriends();
}
function decline_fr()
{
  console.log("s-a dus");
  const fwiends = sessionStorage.getItem('notifications');
  const Fwiend =  fwiends ? JSON.parse(fwiends) : [];
  for(let i = Fwiend.length - 1 ; i>=0 ;i--)
  {
    console.log(notification);
    console.log(Fwiend[i]);
      if(notification.action == Fwiend[i].action  && notification.username == Fwiend[i].username) 
      {
        Fwiend.splice(i,1);
        break;
      }
  }
  sessionStorage.setItem('notifications', JSON.stringify(Fwiend));
  render();
}
function generateRandomIndex(max) {
  return Math.floor(Math.random() * max) + 1;
}

function generateRandomAction() {
  const actions = ['liked your post', 'wants to be your furriend', 'shared your post'];
  const randomIndex = Math.floor(Math.random() * actions.length);
  return actions[randomIndex];
}
function addNotification(notification)
{
  const fwiends = sessionStorage.getItem('notifications');
  const Fwiend =  fwiends ? JSON.parse(fwiends) : [];
  Fwiend.push(notification);
  sessionStorage.setItem('notifications', JSON.stringify(Fwiend));
}
function generateRandomNotifications(posts) {
  const numPosts = posts.length, randoo = Math.floor(Math.random() * numPosts) + 1;
  for (let i = 0; i < randoo; i++) {
    const post = posts[i];
    const interactingProfilePicIndex = generateRandomIndex(49);
    const randomAction = generateRandomAction();

    const notification = {
      profileImg: `USERS/user_pfp(${interactingProfilePicIndex}).jpg`,
      username: catNames[interactingProfilePicIndex],
      action: randomAction,
      content: post.content,
      buttons: []
    };

    if (randomAction === 'wants to be your furriend') {
      notification.buttons.push({
        label: 'Accept',
      });

      notification.buttons.push({
        label: 'Decline',
        action: function() {
          // Decline button action
        }
      });
      notification.content = "";
    } 
    addNotification(notification);
    
  }
}

/*{
          
        }
        */
// Call the function to generate random notifications
const sharedPosts = sessionStorage.getItem('sharedPosts');
const sharedPostsArray = sharedPosts ? JSON.parse(sharedPosts) : [];
console.log(sharedPostsArray);

function render()
{
  notificationsList.textContent='';
  const fwiends = sessionStorage.getItem('notifications');
  const Fwiend =  fwiends ? JSON.parse(fwiends) : [];
  console.log(fwiends);
  for(let i = Fwiend.length - 1 ; i>=0 ;i--)
  {
    createNotification(Fwiend[i]);
  }
}
generateRandomNotifications(sharedPostsArray);
console.log(sessionStorage);
render();




const rightMenu = document.getElementById('right-menu');

function addFriendToMenu(friendName, profilePicture) {
  const friendContainer = document.createElement('div');
  friendContainer.className = 'friend-container';

  const profilePic = document.createElement('img');
  profilePic.src = profilePicture;
  profilePic.alt = 'Profile picture';

  const friendNameElement = document.createElement('p');
  friendNameElement.textContent = friendName;

  friendContainer.appendChild(profilePic);
  friendContainer.appendChild(friendNameElement);
  rightMenu.appendChild(friendContainer);
}

function renderFriends()
{
  rightMenu.innerHTML='';
  const hul = document.createElement("h3");
  hul.innerHTML='Fwiendies <3:';
  rightMenu.appendChild(hul);
  const Fwiendos = sessionStorage.getItem("friends");
  const FwiendosFr = Fwiendos ? JSON.parse(Fwiendos) : [];
  for(let i = 0 ;i< FwiendosFr.length ; i++)
  {
    console.log(FwiendosFr[i].username,FwiendosFr[i].username_photo);
    addFriendToMenu(FwiendosFr[i].username,FwiendosFr[i].username_photo);
  }
  }

renderFriends();