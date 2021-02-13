var videoView = document.getElementsByClassName("sizing-wrapper")[0];
var commentArea;
var commentForm;
var content;
if(!videoView.classList.contains("with-comments"))
{
    buildCommentArea();
}else{
    refreshComments();
}
function buildCommentArea(){
    videoView.classList.add("with-comments");
    eval(document.body.getElementsByTagName('script')[2].innerHTML);
    var container = document.getElementsByClassName("nf-kb-nav-wrapper")[0];
    commentArea = document.createElement('div');
    commentArea.className = 'comment-area';
    container.appendChild(commentArea);
    commentForm = document.createElement("form");
    commentForm.addEventListener("submit", onSumbit);
    
    content = document.createElement("input"); //input element, text
    content.classList.add('comment-input');
    content.setAttribute('type',"text");
    content.setAttribute('name',"Content");
    content.setAttribute('id', 'comment-value-input')
    content.setAttribute('placeholder', 'Comment...')
    
    var submit = document.createElement("input"); //input element, text
    submit.classList.add('comment-submit');
    submit.setAttribute('type',"submit");
    
    commentForm.appendChild(content);
    commentForm.appendChild(submit);
    refreshComments();
}
function onSumbit(e){
    e.preventDefault();
    var netflixVideoId = location.pathname.split('/')[2];
    var user = Object.values(videoView.ownerDocument.defaultView.netflix.falcorCache.profiles).find(profile => profile.summary.value.isActive).summary.value.profileName;
    $.postJSON = function(url, data, callback, callbackSuccess) {
        return jQuery.ajax({
        headers: { 
            'Content-Type': 'application/json' 
        },
        'type': 'POST',
        'url': url,
        'data': JSON.stringify(data),
        'dataType': 'text',
        'error': callback,
        'success': callbackSuccess,
        'async': false,
        'crossDomain': true,
        });
    };
        var comment = document.getElementById('comment-value-input').value;
        var commentObject = {
        Name: user,
        NetflixVideoId:  netflixVideoId,
        Content: comment
    };
    $.postJSON('https://commentflix.sokui.de/Commentflix', commentObject, function (error){ 
        alert(error.responseText);
    },
    function (){
        content.value = '';
        refreshComments();
    });
}

function refreshComments(){
    var netflixVideoId = location.pathname.split('/')[2];
    $.ajax({
        url: `https://commentflix.sokui.de/Commentflix/${netflixVideoId}`,
        txpe: 'GET',
        dataType: 'json',
        success: function(result) {
            showComments(result);
        }
    })
}

function showComments(commentList){
    commentArea.innerHTML = '';
    commentArea.appendChild(commentForm);
    commentList.reverse().forEach(function (commentObject){
        var commentDiv = document.createElement('div');
        var commentAuthor = document.createElement('p');
        commentAuthor.classList.add('comment-author');
        commentAuthor.appendChild(document.createTextNode(`${commentObject.name} - ${new Date(commentObject.timeStamp).toLocaleString()}`));
        commentDiv.appendChild(commentAuthor);
        var commentContent = document.createElement('p');
        commentContent.classList.add('comment-content');
        commentContent.appendChild(document.createTextNode(commentObject.content));
        commentDiv.appendChild(commentContent);
        commentArea.appendChild(commentDiv);
    })
}