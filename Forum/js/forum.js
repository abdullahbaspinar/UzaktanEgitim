const firebaseConfig = {
    apiKey: "AIzaSyBLXLtI9N3iT94bpDXGcxqgNk67xEWU6nU",
    authDomain: "uzaktanegitim-forum.firebaseapp.com",
    databaseURL: "https://uzaktanegitim-forum-default-rtdb.firebaseio.com",
    projectId: "uzaktanegitim-forum",
    storageBucket: "uzaktanegitim-forum.appspot.com",
    messagingSenderId: "157485126536",
    appId: "1:157485126536:web:985d13c464f8373151e03d"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  }
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
  
  const postsContainer = document.getElementById("postsContainer");
  const newPostForm = document.getElementById("newPostForm");
  const postContent = document.getElementById("postContent");
  const sortSelect = document.getElementById("sortSelect");
  const postsRef = firebase.database().ref("posts");
  const isAdmin = () => new URLSearchParams(location.search).get("admin") === "1234";
  
  newPostForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = postContent.value.trim();
    if (!content) return;
    const newPost = {
      content,
      likes: 0,
      dislikes: 0,
      replies: [],
      timestamp: Date.now()
    };
    postsRef.push(newPost);
    postContent.value = "";
  });
  
  function renderPosts(postsObj) {
    postsContainer.innerHTML = "";
    let entries = Object.entries(postsObj);
  
    if (sortSelect.value === "newest") entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
    else if (sortSelect.value === "oldest") entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    else if (sortSelect.value === "mostLiked") entries.sort((a, b) => (b[1].likes || 0) - (a[1].likes || 0));
  
    const userVotes = JSON.parse(localStorage.getItem("forumUserVotes") || "{}");
  
    entries.forEach(([id, post]) => {
      const date = new Date(post.timestamp).toLocaleString();
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <div class="timestamp">🕒 ${date}</div>
        <p>${post.content}</p>
        <div class="replies">${(post.replies || []).map(r => `<p>↳ ${r}</p>`).join('')}</div>
        <div class="reaction-buttons">
          <button class="${userVotes[id] === 'like' ? 'active' : ''}" onclick="handleReaction('${id}', 'like')">👍 ${post.likes || 0}</button>
          <button class="${userVotes[id] === 'dislike' ? 'active' : ''}" onclick="handleReaction('${id}', 'dislike')">👎 ${post.dislikes || 0}</button>
        </div>
        <form onsubmit="return replyToPost(event, '${id}')">
          <textarea placeholder="Yanıtla..." required></textarea>
          <button type="submit">Gönder</button>
        </form>
        ${isAdmin() ? `
        <div class="admin-buttons">
          <button onclick="deletePost('${id}')">🗑 Sil</button>
          <button onclick="editPost('${id}', '${post.content.replace(/'/g, "\\'")}')">✏️ Düzenle</button>
        </div>` : ''}
      `;
      postsContainer.appendChild(div);
    });
  }
  
  postsRef.on("value", (snapshot) => {
    const posts = snapshot.val() || {};
    renderPosts(posts);
  });
  
  sortSelect.addEventListener("change", () => {
    postsRef.once("value", (snapshot) => {
      const posts = snapshot.val() || {};
      renderPosts(posts);
    });
  });
  
  function handleReaction(id, type) {
    const postRef = firebase.database().ref("posts/" + id);
    const userVotes = JSON.parse(localStorage.getItem("forumUserVotes") || "{}");
    const vote = userVotes[id];
  
    postRef.once("value").then(snapshot => {
      const post = snapshot.val();
      if (!post) return;
  
      if (vote === type) {
        if (type === "like") post.likes--;
        else if (type === "dislike") post.dislikes--;
        delete userVotes[id];
      } else {
        if (vote === "like") post.likes--;
        if (vote === "dislike") post.dislikes--;
  
        if (type === "like") post.likes = (post.likes || 0) + 1;
        if (type === "dislike") post.dislikes = (post.dislikes || 0) + 1;
  
        userVotes[id] = type;
      }
  
      localStorage.setItem("forumUserVotes", JSON.stringify(userVotes));
      postRef.update({ likes: post.likes, dislikes: post.dislikes });
    });
  }
  
  function replyToPost(e, id) {
    e.preventDefault();
    const textarea = e.target.querySelector("textarea");
    const reply = textarea.value.trim();
    if (!reply) return false;
  
    const postRef = firebase.database().ref("posts/" + id + "/replies");
    postRef.once("value").then(snapshot => {
      const replies = snapshot.val() || [];
      replies.push(reply);
      postRef.set(replies);
    });
    textarea.value = "";
    return false;
  }
  
  function deletePost(id) {
    if (confirm("Bu gönderiyi silmek istiyor musunuz?")) {
      firebase.database().ref("posts/" + id).remove();
    }
  }
  
  function editPost(id, currentContent) {
    const newContent = prompt("Yeni içerik:", currentContent);
    if (newContent && newContent.trim()) {
      firebase.database().ref("posts/" + id).update({ content: newContent.trim() });
    }
  }
  (function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="fmGhmZopdiKau9QTCrAFx";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();

  