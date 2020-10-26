(function(apiUrl) {
  function getMe() {
    return fetch(apiUrl + "/me")
      .then(function(response) {
        return response.json();
      })
      .then(function(user) {
        const $username = document.getElementById("current-user-username");
        const $avatar = document.getElementById("current-user-avatar");

        $username.innerHTML = user.username;

        if (user.avatar) {
          $avatar.style.backgroundImage = "url('" + user.avatar + "')";
        }
      });
  }

  function initialize() {
    getMe();
  }

  initialize();
})("https://taggram.herokuapp.com");

(function(apiUrl) {
  function getPost() {
    return fetch(apiUrl + "/post")
      .then(function(response) {
        return response.json();
      })
      .then(function(usuario) {
        const $username = document.getElementById("nameAuthor");
        const $cidade = document.getElementById("cityAuthor")
        const $avatar = document.getElementById("authorAvatar");
        const $photo = document.getElementById("photo");

        $username.innerHTML = usuario.user.username;
        $cidade.innerHTML = usuario.location.city + "," + usuario.location.country;

        if (usuario.user.avatar) {
          $avatar.style.backgroundImage = "url('" + usuario.user.avatar + "')";
        }
        if (usuario.photo) {
          $photo.style.backgroundImage = "url('" + usuario.photo + "')";
        }
        /*Comment list*/ 
        var comentarios = usuario['comments'];
        const $numeroDeComentarios = document.getElementById("estatisticas1");
        $numeroDeComentarios.innerHTML = comentarios.length + " comentarios";

        const $dia = document.getElementById("estatisticas2");
        $dia.innerHTML = usuario.created_at.substring(0,10);

        for(var i = 0; i < comentarios.length; i++){
          const $nomeComentario = document.getElementById("nameComment" + i);
          const $horarioComentario = document.getElementById("hourComment"   + i);
          const $avatarComentario = document.getElementById("authorComment" + i);
          
          $nomeComentario.innerHTML = comentarios[i].user.username.bold() + " " + comentarios[i].message;
          
          $horarioComentario.innerHTML =  comentarios[i].created_at.substring(11,13) + "h";

          if (comentarios[i].user.avatar) {
            $avatarComentario.style.backgroundImage = "url('" + comentarios[i].user.avatar + "')";
          }
          else{
            $avatarComentario.style.background = "#DBDBDB";
          }
        }
      })
  }

  function initializePost() {
    getPost();
  }

  initializePost();
})("https://taggram.herokuapp.com");

(function(apiUrl) {
  function postMe() {
    return fetch(apiUrl +"/post")
      .then(function(response) {
        return response.json();
      })
      .then(function(postagem) {
        if(postagem.uuid == null)
            alert("Erro");
        else
        {
          const $mensagem = document.getElementById("comentario");
          const $enviar = document.getElementById("enviar");

          $enviar.addEventListener("click", 
            function (){
              if($mensagem.value == "")
                alert("Comentário em branco");
              else
              {
                fetch(apiUrl +"/me")
                .then(function(response) {
                  return response.json();
                }).then(function (myUser){
                  return fetch(apiUrl + "/posts/" + postagem.uuid + "/comments?stable=true", {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(myUser)
                  }).then(function(resp) {
                    return resp.json();
                  }).then(function(myComment){ 
                    myComment.user = myUser.username;
                    myComment.avatar = myUser.avatar;
                    myComment.message = $mensagem.value;
                    myComment.created_at = new Date().toISOString();
                    var comentarios = postagem['comments'];
                    comentarios.push(myComment);

                    const $nomeNovoComentario = document.getElementById("nameNewComment");
                    const $horarioNovoComentario = document.getElementById("hourNewComment");
                    const $avatarNovoComentario = document.getElementById("authorNewComment");
                    
                    $nomeNovoComentario.innerHTML += myComment.user.bold() + " " + myComment.message + "\n";
                    $horarioNovoComentario.innerHTML =  myComment.created_at.substring(11,13) + "h";

                    if (myComment.avatar) {
                      $avatarNovoComentario.style.backgroundImage = "url('" + myComment.avatar + "')";
                    }
                    else{
                      $avatarNovoComentario.style.background = "#DBDBDB";
                    }
                    $mensagem.value = "";

                    const $numeroDeComentarios = document.getElementById("estatisticas1");
                    $numeroDeComentarios.innerHTML = comentarios.length + " comentarios";
                  }).catch(function (error) {
                    alert("Comentário não foi enviado, tente novamente");
                  })
                })
              }
            }
          )
        }
      });
  }

  function initializeComment() {
    postMe();
  }

  initializeComment();
})("https://taggram.herokuapp.com");
