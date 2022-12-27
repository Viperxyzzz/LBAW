function addEventListeners() {
  let answerCreator = document.querySelector('#add-answer-button');
  if (answerCreator != null)
    answerCreator.addEventListener('click', sendCreateAnswerRequest);

  let commentDelete = document.querySelectorAll('.delete-comment');
  if (commentDelete != null) {
    commentDelete.forEach(
      btn => btn.addEventListener('click', sendDeleteCommentRequest)
    );
  }

  let enterInputAnswerCreator = document.getElementById('answer');
  if(enterInputAnswerCreator != null)
    enterInputAnswerCreator.addEventListener('keypress', function(event) {
      if (event.key === 'Enter')
      {
        event.preventDefault();
        sendCreateAnswerRequest(event);
      }
    });

  let filterOptions = document.querySelectorAll('.filter-option');
  if (filterOptions != null) {
    filterOptions.forEach((btn) => {
      if (btn.querySelector('input').checked) btn.classList.toggle('active');
      btn.addEventListener(
      'click', (event) => event.target.classList.toggle('active'));
    }
    )
  }

  let commentFormCreator = document.querySelectorAll('.add-comment-answer-form-button');
  if (commentFormCreator != null) {
    commentFormCreator.forEach(button =>{
      button.addEventListener('click', answerCommentForm);
  });
  }

  let commentQuestionFormCreator = document.querySelectorAll('.add-comment-question-form-button');
  if (commentQuestionFormCreator != null)
      commentQuestionFormCreator[0].addEventListener('click', questionCommentForm);

  let enterInputEditUserFullName = document.querySelector('#edit-full-name');
  if(enterInputEditUserFullName != null)
    enterInputEditUserFullName.addEventListener('keypress', function(event) {
      if (event.key === 'Enter'){
        document.getElementById("edit-username").focus();
      }
  });

  let enterInputEditUserUsername = document.querySelector('#edit-username');
  if(enterInputEditUserUsername != null)
    enterInputEditUserUsername.addEventListener('keypress', function(event) {
      if (event.key === 'Enter'){
        document.getElementById("edit-email").focus();
      }
  });

  let enterInputEditUserEmail = document.querySelector('#edit-email');
  if(enterInputEditUserEmail != null)
    enterInputEditUserEmail.addEventListener('keypress', function(event) {
      if (event.key === 'Enter'){
        document.getElementById("save-settings").focus();
      }
  });

  let userSearch = document.querySelector('#user-search');
  if (userSearch != null) {
    userSearch.addEventListener('input', sendSearchUsersRequest);
  }

  let tagsSearch = document.querySelector('#tags-search');
  if (tagsSearch != null) {
    tagsSearch.addEventListener('input', sendSearchTagsRequest);
  }

  let tagsFilter = document.querySelectorAll('.topic-check');
  if (tagsFilter != null) {
    tagsFilter.forEach(
      check => check.addEventListener('input', sendSearchTagsRequest)
    );
  }

  let orderUserRadio = document.querySelectorAll('input[name=order-users]');
  if (orderUserRadio != null) {
    orderUserRadio.forEach(orderUserButton => {
      orderUserButton.addEventListener('change', sendSearchUsersRequest);
    });
  }

  let directionUsersRadio = document.querySelectorAll('input[name=direction-users]');
  if (directionUsersRadio != null) {
    directionUsersRadio.forEach(directionUsersButton => {
      directionUsersButton.addEventListener('change', sendSearchUsersRequest);
    });
  }

  let answerEdit = document.querySelectorAll('.edit_answer');
  if (answerEdit != null) {
    answerEdit.forEach(
      btn => btn.addEventListener('click', editAnswer)
      );
  }

  let answerDelete = document.querySelectorAll('.delete-answer');
  if (answerDelete != null) {
    answerDelete.forEach(
      btn => btn.addEventListener('click', sendDeleteAnswerRequest)
      );
  }

  let reportDelete = document.querySelectorAll('.delete-report');
  if (reportDelete != null) {
    reportDelete.forEach(
      btn => btn.addEventListener('click', sendDeleteReportRequest)
      );
  }

  let orderQuestionsRadio = document.querySelectorAll('input[name=order-questions]');
  if (orderQuestionsRadio != null) {
    orderQuestionsRadio.forEach(orderQuestionsButton => {
      orderQuestionsButton.addEventListener('change', sendOrderQuestionsRequest);
    });
  }

  let directionQuestionsRadio = document.querySelectorAll('input[name=direction-questions]');
  if (directionQuestionsRadio != null) {
    directionQuestionsRadio.forEach(directionQuestionsButton => {
      directionQuestionsButton.addEventListener('change', sendOrderQuestionsRequest);
    });
  }

  let profileTabs = document.querySelectorAll('.profile-nav')
  profileTabs.forEach(
    button => {
      button.addEventListener('click', function(){
        toggleProfileTab(button.id + '-tab')
        button.classList.add('active');
      })
    }
  )

  let followTag = document.querySelectorAll('.follow-tag')
  followTag.forEach(
    button => {
      button.addEventListener('click', sendFollowTagRequest)
    }
  )

  let unFollowTag = document.querySelectorAll('.unFollow-tag')
  unFollowTag.forEach(
    button => {
      button.addEventListener('click', sendUnFollowTagRequest)
    }
  )
}

function closeProfileTabs() {
  let buttons = document.querySelectorAll('.profile-nav');
  buttons.forEach(button => button.classList.remove('active'))
  let tabs = document.querySelectorAll('.profile-tab');
  tabs.forEach(tab => {tab.classList.remove('profile-tab-open')});
}

function toggleProfileTab(tab) {
  closeProfileTabs();
  let open = document.getElementById(tab);
  if (open != null)
    open.classList.add('profile-tab-open');
}

function encodeForAjax(data) {
  if (data == null) return null;
  return Object.keys(data).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
  }).join('&');
}

function sendAjaxRequest(method, url, data, handler) {
  let request = new XMLHttpRequest();

  request.open(method, url, true);
  request.setRequestHeader('X-CSRF-TOKEN', document.querySelector('meta[name="csrf-token"]').content);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.addEventListener('load', handler);
  request.send(encodeForAjax(data));
}

/*********** create an answer ***********/

function sendCreateAnswerRequest(event) {
  console.log("create request function")
  let question_id = document.querySelector('#question_id').value;
  console.log(question_id)
  let answer = document.querySelector('#answer').value;
  console.log(answer)

  if (answer != '')
    sendAjaxRequest('put', '/api/answer/' + question_id, { answer: answer }, answerAddedHandler);

  event.preventDefault();
}

function answerAddedHandler() {
  if (this.status != 200) window.location = '/login';
  let answer = JSON.parse(this.responseText);

  document.querySelector('#answer').value = "";

  // Create the new answer
  let new_answer = createAnswer(answer);

  // Insert the new answer
  let answers = document.querySelector('#answers');
  answers.prepend(new_answer);
}

function createAnswer(answer) {
  console.log(answer)
  let new_answer = document.createElement('div');
  new_answer.className = 'card'
  new_answer.classList.add('mt-5')
  new_answer.classList.add('answer')
  new_answer.id = 'answer_' + answer.answer_id;
  new_answer.innerHTML = ` 
  <div class="modal fade" id="answerModal_${answer.answer_id}" tabindex="-1" aria-labelledby="answerModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title" id="answerModalLabel">Delete answer</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <i class="material-symbols-outlined">close</i>
          </button>
        </div>
        <div class="modal-body">
          Are you sure you want to delete this answer?
        </div>
        <div class="modal-footer border-0">
          <input type="hidden" name="answer_id" value="${answer.answer_id}">
          <button type="button" class="button-outline" data-dismiss="modal">Close</button>
          <button type="button" onclick=sendDeleteAnswerRequest(event) class="button delete-answer" data-dismiss="modal">Confirm</button>
        </div>
      </div>
    </div>
  </div>
  <div class="card-body d-flex justify-content-between">
      <div class="flex-fill">
          <p class="m-0">
              <img src="/storage/${answer.author.picture_path}.jpeg" class="img-fluid rounded-circle" alt="user image" width="25px">
              <a class="font-weight-bold" href="/users/${answer.user_id}"> ${answer.author.name}</a>
          </p>
          <div class="answer-full-text">
              <p class="card-text pb-5 pt-2">${answer.full_text}</p>
          </div>
      </div>
      <div class="ml-5 d-flex">
          <aside class="question-stats">
          </aside>
              <div class="dropdown">
                  <button class="btn" type="button" data-toggle="dropdown" aria-haspopup="true"">
                      <i class="material-symbols-outlined">more_vert</i>
                  </button>
                  <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                          <data class="answer_id" hidden>${answer.answer_id}</data>
                          <button class="dropdown-item edit_answer" type="button" onclick=editAnswer(event)>
                              <i width="16" height="16" class="material-symbols-outlined ">edit</i>
                              Edit
                          </button>
                      <input type="hidden" name="answer_id" value="${answer.answer_id}">
                      <button class="dropdown-item" type="button"  data-toggle="modal" data-target="#answerModal_${answer.answer_id}">
                          <i width="16" height="16" class="material-symbols-outlined ">delete</i>
                          Delete
                      </button>
                  </div>
              </div>
      </div>
  </div>
  <div class="card-footer d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-start mt-2">
          <button class="button-clear m-0 px-1" type="button">
              <i width="16" height="16" class="material-symbols-outlined ">arrow_upward</i>
          </button>
          <p class="m-0 px-1 pt-1">${answer.num_votes}</p>
          <button class="button-clear d-block m-0 px-1" type="button">
              <i width="16" height="16" class="material-symbols-outlined ">arrow_downward</i>
          </button>
          <button class="button-clear m-0 px-1" type="button">
              <i width="12" height="12" class="material-symbols-outlined ">chat_bubble</i>
          </button>
      </div>
      <p class="m-0">${answer.date}</p>
  </div>
  <div class="answer-comments">
  </div>`;

  return new_answer;
}

/*********** search for users ***********/

function sendSearchUsersRequest(event) {
  let order = document.querySelector('input[name="order-users"]:checked').id;
  let direction = document.querySelector('input[name="direction-users"]:checked').id;
  let search = document.querySelector('#user-search').value;

  sendAjaxRequest('get', `/api/users/?search=${search}&order=${order}&direction=${direction}`, {}, userSearchHandler);

  event.preventDefault();
}

function userSearchHandler() {
  //if (this.status != 201) window.location = '/';
  let users = JSON.parse(this.responseText);


  // Create the new users
  let new_element = createUsers(users);

  // Insert the new answer
  let old_users = document.getElementById('users-list');
  let parent = old_users.parentElement;

  old_users.remove()
  parent.appendChild(new_element);
}

function createUsers(users) {
  let new_users = document.createElement('div');
  new_users.className = 'd-flex'
  new_users.classList.add('flex-wrap')
  new_users.id = "users-list"
  if (users.length == 0) {
    new_users.innerHTML = '<p>No results match the criteria.</p>'
  }
  Object.values(users).forEach(user => {
    new_users.appendChild(createUser(user))
  });
  return new_users;
}

function createUser(user) {
  let new_user = document.createElement('div');
  //new_users.className = 'col-lg-10'
  //new_users.id = "users-list"
  new_user.innerHTML = `
  <div class="card d-flex flex-row m-3 p-2 bg-light" style="width: 250px;">
      <div class="align-self-center">
        <img src="/storage/${user.picture_path}.jpeg" class="img-fluid rounded-circle" alt="user image" width="60px">
      </div>
      <div class="card-body mx-2 p-2">
          <h4 class="card-title m-0 p-0">
              <a href="/users/${user.user_id}">${user.username}</a>
          </h4>
          <p class="card-body m-0 p-0">${user.name}</p>
          <p class="card-body m-0 p-0">${user.score} points</p>
      </div>
  </div>`;
  return new_user;
}

/*********** search for tags ***********/

function sendSearchTagsRequest(event) {
  let search = document.querySelector('#tags-search').value;
  let topics = document.querySelectorAll('.topic-check');
  let topicsStr = '';
  topics.forEach(
    topic => {
      topicsStr += (topic.checked) ? `&topics[]=${topic.value}` : '';
    }
  )

  sendAjaxRequest('get', `/api/tags/?search=${search}${topicsStr}`, {}, tagsSearchHandler);

  event.preventDefault();
}

function tagsSearchHandler() {
  //if (this.status != 201) window.location = '/';
  let tags = JSON.parse(this.responseText);


  // Create the new tags
  let new_element = createTags(tags);

  // Insert the new tags
  let old_element = document.getElementById('tags-list');
  let parent = old_element.parentElement;

  old_element.remove()
  parent.appendChild(new_element);
}

function createTags(tags) {
  let new_tags = document.createElement('div');
  new_tags.className = 'd-flex'
  new_tags.classList.add('flex-wrap')
  new_tags.id = "tags-list"
  if (tags.length == 0) {
    new_tags.innerHTML = '<p>No results match the criteria.</p>'
  }
  Object.values(tags).forEach(tag => {
    new_tags.appendChild(createTag(tag))
  });
  return new_tags;
}

function createTag(tag) {
  let new_tag = document.createElement('div');
  new_tag.className = 'card'
  new_tag.classList.add('m-3')
  new_tag.style = "width: 250px"
  let html = `
  <div class="card-header d-flex justify-content-between">
      <p class="badge p-2 m-1">${tag.tag_name}</p>`

  if (tag['following']) {
    html +=
      `<a href="#" class="p-0">
          <i class="p-0 material-symbols-outlined">done</i>
          Following
      </a>`
  }
  else {
    html +=
      `<a href="#" class="p-0">
          <i class="p-0 material-symbols-outlined">add</i>
          Follow
      </a>`
  }
  html +=`</div>
    <div class="card-body">
        <p>${tag.tag_description}</p>
    </div>`;
  new_tag.innerHTML = html;
  return new_tag;
}

/*********** delete an answer ***********/

function sendDeleteAnswerRequest(event) {
  let answer_id = event.target.parentElement.children[0].value;

  if (answer != '')
    sendAjaxRequest('delete', '/api/answer/delete/' + answer_id, {}, answerDeletedHandler);
  event.preventDefault();
}

function answerDeletedHandler() {
  //if (this.status != 202) window.location = '/';
  let deletedAnswer = JSON.parse(this.responseText);

  document.querySelector('#answer').value="";

  let deletedAnswerElement = document.getElementById("answer_" + deletedAnswer.answer_id)
  deletedAnswerElement.remove();
}

/*********** delete a report ***********/

function sendDeleteReportRequest(event) {
  let report_id = event.target.parentElement.children[0].innerText;

  if (report_id != '')
    sendAjaxRequest('delete', '/api/report/delete/' + report_id, {}, reportDeletedHandler);
  event.preventDefault();
}

function reportDeletedHandler() {
  //if (this.status != 202) window.location = '/';
  let deletedReport = JSON.parse(this.responseText);

  let deletedReportElement = document.getElementById("report_" + deletedReport.report_id)
  deletedReportElement.remove();
}

/*********** filter questions ***********/

function sendOrderQuestionsRequest(event) {
  let order = document.querySelector('input[name="order-questions"]:checked').id;
  let direction = document.querySelector('input[name="direction-questions"]:checked').id;
  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get('searchText');

  if (order != '')
    sendAjaxRequest('get', `/api/browse/?order=${order}&direction=${direction}&searchText=${search}`, {}, orderedQuestionsHandler);
    
  event.preventDefault();
}

function orderedQuestionsHandler() {
  let questions = JSON.parse(this.responseText);

  if (questions.length > 0) {
    let newQuestions = createQuestions(questions);

    let parent = document.querySelector('#questions');
    let child = document.querySelector('#questions-list');
    parent.removeChild(child);
    parent.appendChild(newQuestions);
  }
}

function createQuestions(questions) {
  let parent = document.createElement('div');
  parent.id = "questions-list";
  Object.keys(questions).forEach(idx => {
   parent.appendChild(createQuestion(questions[idx]))
  });
  return parent;
}

function createQuestion(question) {
  let new_question = document.createElement('div');
  new_question.className = 'card'
  new_question.classList.add('my-5')

  let tags = "";
  question.tags.forEach(tag => {
    tags += `<span class="badge p-2">${tag.tag_name}</span>\n`
  })
  new_question.innerHTML =
  `
  <div class="card-body d-flex justify-content-between">
      <div>
          <a
          class="card-title font-weight-bold"
          href="question/${question.question_id}">
          ${question.title}
          </a>
          <p class="card-text">${question.full_text}</p>
          <div class="flex">
            ${tags}
          </div>
      </div>
      <div class="ml-5">
          <aside class="question-stats">
              <p class="m-0 text-nowrap">${question.num_votes} votes</p>
              <p class="m-0 text-nowrap">${question.num_views} views</p>
              <p class="m-0 text-nowrap">${question.num_answers} answers</p>
          </aside>
      </div>
  </div>
  <div class="card-footer d-flex justify-content-between">
      <p class="m-0">${question.date_distance}</p>
      <p class="m-0">
          <em>by</em>
          <a href="/users/${question.author_id}"> ${question.author_name}</a>
      </p>
  </div>`;

  return new_question;
}

/***********  ***********/
function editPass(){
  let editButton = document.getElementById('edit-pass')
  editButton.setAttribute("class", "hide")

  let divPass = document.getElementById("edit-pass-div")
  divPass.setAttribute("class", "form-gorup")
  divPass.innerHTML =
  `
    <label>New Password</label>
    <input type="password" name="new_password">
  `

  let divPassConfirm = document.getElementById("edit-pass-div-conf")
  divPassConfirm.setAttribute("class", "form-gorup")
  divPassConfirm.innerHTML =
  `
    <label>Confirm Password</label>
    <input type="password" name="confirm_pass">
  `
}

function submitSettings(){
  document.getElementById("edit-user-form").submit();
}

/*********** create an edit answer card ***********/

function editAnswer(event) {
  let answer_id = event.target.parentElement.children[0].innerText;

  let answer = document.querySelector('#answer_' + answer_id);
  let text = answer.querySelector('.card-text').innerText;
  let full_text = answer.querySelector('.answer-full-text');
  full_text.insertAdjacentElement("afterend", createAnswerForm(answer_id, text));
  full_text.innerHTML = '';
}

function createAnswerForm(answer_id, text) {
  let answer_form = document.createElement('div');
  let answer = document.getElementById(answer_id);
  //answer_form.classList.add('mt-5')
  answer_form.classList.add('answer-form')
  answer_form.classList.add('w-100')
  answer_form.id = `answer_form_${answer_id}`

  answer_form.innerHTML =
    `
    <input type="hidden" name="answer_id" id="answer_id" value="${answer_id}"></input>
    <input type="hidden" name="answer" id="answer" value="${answer}"></input>
    <textarea id="full_text" rows="4" type="text" name="full_text" class="edit-text mt-2" required/>${text}</textarea>
  <div class="text-right">
      <button id="update-answer-button" onclick="answerUpdater()" type="submit" class="m-0">
          Save Changes
      </button>
  </div>
      <script>
      var input = document.getElementById("full_text");
      input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          document.getElementById("update-answer-button").click();
        }
      });
      </script>
`
  return answer_form;
}

function answerUpdater() {
  let new_text = document.querySelector('#full_text').value;
  let answer_id = document.querySelector('#answer_id').value;
  sendAjaxRequest('post', '/api/answer/update/' + answer_id, {full_text: new_text, was_edited: true }, sendCreateAnswerUpdateRequest);
}


function sendCreateAnswerUpdateRequest() {
  let answer = JSON.parse(this.responseText);

  let p = document.createElement('p');
  p.classList.add('card-text', 'pb-5', 'pt-2');
  p.innerText = answer.full_text;

  let answer_element = document.querySelector('#answer_' + answer.answer_id);
  let answer_form = answer_element.querySelector('.answer-form');
  answer_form.parentElement.querySelector('.answer-full-text').appendChild(p);
  answer_form.remove();

}

function sendFollowTagRequest(event) {
  let tag_id = event.currentTarget.querySelector('input').value;

  if (tag_id != '')
    sendAjaxRequest('post', `/api/tag/follow/${tag_id}`, {}, tagFollowHandler);
    
  event.preventDefault();
}

function tagFollowHandler() {
  let follow = JSON.parse(this.responseText);
  let tag_id = follow['tag_id'];

  let button = document.getElementById(`follow-tag-${tag_id}`)

  button.onclick = sendUnFollowTagRequest

  button.id = `unFollow-tag-${tag_id}`
  button.classList.remove('follow-tag')
  button.classList.add('unFollow-tag')
  button.querySelector('i').innerHTML = 'done'
  button.querySelector('p').innerHTML = 'Following'
}

function sendUnFollowTagRequest(event) {
  let tag_id = event.currentTarget.querySelector('input').value;

  if (tag_id != '')
    sendAjaxRequest('post', `/api/tag/unFollow/${tag_id}`, {}, tagUnFollowHandler);
    
  event.preventDefault();
}

function tagUnFollowHandler() {
  let follow = JSON.parse(this.responseText);
  let tag_id = follow['tag_id'];

  let button = document.getElementById(`unFollow-tag-${tag_id}`)

  button.onclick = sendFollowTagRequest

  button.id = `follow-tag-${tag_id}`
  button.classList.remove('unFollow-tag')
  button.classList.add('follow-tag')
  button.querySelector('i').innerHTML = 'add'
  button.querySelector('p').innerHTML = 'Follow'
}

/** Multi-select dropdown */

let options = document.querySelectorAll('option');
options.forEach(
  (option) => option.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.hasAttribute('selected')) e.target.removeAttribute('selected');
    else e.target.setAttribute('selected', '');
    return false;
  })
  )

function setInnerHTML(elm, html) {
  elm.innerHTML = html;

  Array.from(elm.querySelectorAll("script"))
    .forEach( oldScriptEl => {
      const newScriptEl = document.createElement("script");

      Array.from(oldScriptEl.attributes).forEach( attr => {
        newScriptEl.setAttribute(attr.name, attr.value)
      });
      const scriptText = document.createTextNode(oldScriptEl.innerHTML);
      newScriptEl.appendChild(scriptText);
      oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
  });
}

/*********** create answer comment ***********/
function answerCommentForm(event) {
  let answer = event.target.parentElement.parentElement.parentElement
  let answer_card_id = answer.parentElement.id;
  answer.insertAdjacentElement('afterend', createAnswerCommentForm(answer_card_id))
}

function createAnswerCommentForm(answer_card_id) {
  let answer_card_id_list = answer_card_id.split('_', 2);
  let answer_id = answer_card_id_list[1]

  let previous_comment_form = document.querySelector(`.comment-answer-${answer_id}-form`)
  console.log(previous_comment_form)
  if(previous_comment_form!=null && previous_comment_form.innerHTML!='') return previous_comment_form;

  let comment_form = document.createElement('div');
  comment_form.className = 'card';
  comment_form.className = `comment-answer-${answer_id}-form`;
  comment_form.innerHTML = `
    <form method="POST" class="card-body m-0 p-0">
        <textarea class="w-100 h-100 m-0 border-0" placeholder="Type something..." rows="3"
            id="comment" name="comment" value="{{ old('comment') }}" required></textarea>
    </form>
    <div class="card-footer text-right">
        <button id="add-comment-button" type="submit" onclick="sendCreateAnswerCommentRequest(${answer_id})" class="m-0">
            Comment
        </button>
    </div>
  `;
  return comment_form;
}

function sendCreateAnswerCommentRequest(answer_id) {
  console.log("create request function")
  let question_id = document.querySelector('#question_id').value;
  let comment = document.querySelector('#comment').value;

  if (comment != '')
    sendAjaxRequest('post', `/api/comment/` + question_id, { full_text: comment, question_id: question_id, answer_id: answer_id }, answerCommentAddedHandler);

  event.preventDefault();
}

function answerCommentAddedHandler() {
  let comment = JSON.parse(this.responseText);

  //delete comment form
  document.querySelector(`.comment-answer-${comment.answer_id}-form`).innerHTML = '';

  // Create the new comment
  let new_comment = createComment(comment);
  console.log(new_comment)

  // Insert the new comment
  let comments = document.querySelector(`.answer-${comment.answer_id}-comments`);
  console.log(comments)
  comments.prepend(new_comment);
}

function createComment(comment) {
  console.log(comment)
  let new_comment = document.createElement('div');
  new_comment.className = 'border-top'
  new_comment.classList.add('d-flex')
  new_comment.classList.add('justify-content-between')
  new_comment.innerHTML = `
  <div class="d-flex">
  <div class="d-flex align-items-center flex-column p-1">
      <button class="button-clear p-0 m-0 mr-2" type="button">
          <i class="material-symbols-outlined">keyboard_arrow_up</i>
      </button>
      <p class="m-0 pr-2 text-nowrap">${comment.num_votes}</p>
      <button class="button-clear d-block p-0 m-0 mr-2" type="button">
          <i class="material-symbols-outlined ">keyboard_arrow_down</i>
      </button>
  </div>
  <div class="pt-3">
      <p class="m-0">
          <img src="/storage/${comment.author.picture_path}.jpeg" class="img-fluid rounded-circle" alt="user image" width="25px">
          <a href="url("/users/${comment.user_id}")">${comment.author.name}</a>
          ${comment.date}
      </p>
  <p class="card-text py-2">${comment.full_text}</p>
  </div>
</div>
  `;
  return new_comment;
}

/*********** create question comment ***********/

function questionCommentForm(event) {
  let question = event.target.parentElement.parentElement.parentElement
  console.log(question)

  let question_id = document.querySelector('#question_id').value;
  console.log(question_id)

  //remove answer form
  document.querySelector('#add-answer-card').innerHTML = '';

  question.insertAdjacentElement('afterend', createQuestionCommentForm(question_id))

}

function createQuestionCommentForm(question_id) {
  //prevent duplicated comment form
  let previous_comment_form = document.querySelector('.comment-form')
  console.log(previous_comment_form)
  if(previous_comment_form!=null && previous_comment_form.innerHTML!='') return previous_comment_form;
  if(previous_comment_form!=null) previous_comment_form.remove()

  let comment_form = document.createElement('div')
  comment_form.className = 'card'
  comment_form.classList.add('comment-form')
  comment_form.innerHTML = `
    <input type="hidden" name="question_id" id="question_id" value="${question_id}"></input>
    <form method="POST" class="card-body m-0 p-0">
        <textarea class="w-100 h-100 m-0 border-0" placeholder="Type something..." rows="5"
            id="comment" name="comment" value="{{ old('comment') }}" required></textarea>
    </form>
    <div class=" card-footer">
    <div class = "row justify-content-between" style="padding: 0.75rem 0.75rem;">
        <button class="cancel-add-comment button-clear px-2 pr-3 pb-2 d-flex" style="margin: 0;" onclick="cancelCreateComment()">
            <input type="hidden" value="{{ $tag->tag_id }}">
            <p class="pb-2">Cancel</p>
        </button>
        <button id="add-comment-button" type="submit" style="margin: 0;" onclick="sendCreateQuestionCommentRequest()" class="m-0">
            Comment
        </button>
        </div>
    </div>
  `;
  return comment_form;
}

function sendCreateQuestionCommentRequest() {
  console.log("create request function")
  let question_id = document.querySelector('#question_id').value;
  console.log(question_id);
  let comment = document.querySelector('#comment').value;
  console.log(comment)

  if (comment != '')
    sendAjaxRequest('post', `/api/comment/` + question_id, { full_text: comment, question_id: question_id}, questionCommentAddedHandler);

  event.preventDefault();
}

function  questionCommentAddedHandler() {
  let comment = JSON.parse(this.responseText);

  let question_id = document.querySelector('#question_id').value;

  //delete comment form
  document.querySelector('.comment-form').remove()

  // Create the new comment
  let new_comment = createComment(comment);
  console.log(new_comment)

  // Insert the new comment
  let comments = document.querySelector(`.question-comments`);
  console.log(comments)
  comments.prepend(new_comment);

  // Insert answer form back
  let add_answer_card = document.querySelector('#add-answer-card');
  add_answer_card.innerHTML = `
  <form method="POST" class="card-body m-0 p-0">
    <input type="hidden" name="question_id" id="question_id" value="${question_id}"></input>
    <textarea class="w-100 h-100 m-0 border-0" placeholder="Type something..." rows="5"
      id="answer" name="answer" value="{{ old('answer') }}" required></textarea>
  </form>
<div class="card-footer text-right">
  <button id="add-answer-button" type="submit" onclick="sendCreateAnswerRequest(event)" class="m-0">
      Answer
  </button>
</div>
  `
}

function cancelCreateComment(){
  let question_id = document.querySelector('#question_id').value;

  let commentForm = document.querySelector('.comment-form')
  console.log(commentForm)
  commentForm.remove()

    // Insert answer form back
    let add_answer_card = document.querySelector('#add-answer-card');
    add_answer_card.innerHTML = `
    <form method="POST" class="card-body m-0 p-0">
      <input type="hidden" name="question_id" id="question_id" value="${question_id}"></input>
      <textarea class="w-100 h-100 m-0 border-0" placeholder="Type something..." rows="5"
        id="answer" name="answer" value="{{ old('answer') }}" required></textarea>
    </form>
  <div class="card-footer text-right">
    <button id="add-answer-button" type="submit" onclick="sendCreateAnswerRequest(event)" class="m-0">
        Answer
    </button>
  </div>
    `
}

/*********** delete an comment ***********/

function sendDeleteCommentRequest(event) {
  let comment_id = event.target.parentElement.children[0].value;
  console.log(comment_id)

  sendAjaxRequest('delete', '/api/comment/delete/' + comment_id, {}, commentDeletedHandler);
  event.preventDefault();
}

function commentDeletedHandler() {
  console.log("comment_handler")
  
  let deletedComment = JSON.parse(this.responseText);

  let deletedCommentElement = document.getElementById("comment_" + deletedComment.comment_id)
  deletedCommentElement.remove();
}

addEventListeners();