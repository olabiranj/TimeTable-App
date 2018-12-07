function dashboardControls() {
  let deletebtns = document.querySelectorAll('a.delete-trigger');
  deletebtns.forEach((element) => {
    element.addEventListener('click', () => {
      element.nextElementSibling.classList = 'in-view';
    });
  });

  let closebtns = document.querySelectorAll('button.form-close');
  closebtns.forEach((element) => {
    element.addEventListener('click', () => {
      element.parentElement.classList = 'hidden';
    });
  });
}

function login() {
  if (document.getElementById('email').value == '') {
    alert('Please input your school email');
  } else if (document.getElementById('pwd').value == '') {
    alert('Please input your password');
  }
}

function reg() {
  if (
    document.getElementById('schemail').value == '' ||
    document.getElementById('add').value == '' ||
    document.getElementById('schname').value == '' ||
    document.getElementById('name').value == '' ||
    document.getElementById('pwdd').value == ''
  ) {
    alert('Incomplete details!');
  }
}

function comment() {
  if (document.getElementById('comments').value == '') {
    alert('No comment yet!');
  }
}

function editCell(field) {

    $("#subjectValue").val(field);
    $('#myModal').modal('show');

    // $('#myModal').on('show.bs.modal', function(e) {

        //get data-id attribute of the clicked element
        // var cellId = $(e.relatedTarget).data(field);

        //populate the textbox
        // $(e.currentTarget).find('input[name="bookId"]').val(bookId);
    // });

//   let a = document.getElementById('sel1').value;
//   document.getElementById(field).innerHTML = a;
}

function handleSubjectSelect(selectObject) {
  let subjectValue = selectObject.value;
  let inputId = document.getElementById("subjectValue").value;
  document.getElementById(inputId).innerHTML = subjectValue;
  document.getElementById('input-'+ inputId).value = subjectValue;
  $('#myModal').modal('hide');

}


function getSelect(selectObject) {
  let value = selectObject.value;
  console.log(value);
  addSchName(value);
}


