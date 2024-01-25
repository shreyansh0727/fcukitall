function login() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
  
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function(user) {
        console.log('Login successful');
      })
      .catch(function(error) {
        console.error('Login failed', error.message);
      });
  }
  
  function signup() {
    var email = document.getElementById('signup-email').value;
    var password = document.getElementById('signup-password').value;
  
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(user) {
        console.log('Sign up successful');
      })
      .catch(function(error) {
        console.error('Sign up failed', error.message);
      });
  }

  function logout() {
    firebase.auth().signOut()
      .then(function () {
        // Sign-out successful.
        console.log('User logged out');
      })
      .catch(function (error) {
        // An error happened.
        console.error('Logout failed', error);
      });
  }
  
  // Add this code after the existing code in app.js

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in
      document.getElementById('app').style.display = 'block';
      document.getElementById('auth-container').style.display = 'none';
      document.getElementById('notes-container').style.display = 'block';
      loadNotes();
    } else {
      // No user is signed in
      document.getElementById('app').style.display = 'block';
      document.getElementById('auth-container').style.display = 'flex';
      document.getElementById('notes-container').style.display = 'none';
    }
  });
  

  function addNote() {
    var noteInput = document.getElementById('note-input');
    var noteText = noteInput.value.trim();
  
    if (noteText !== '') {
      var user = firebase.auth().currentUser;
  
      if (user) {
        var userId = user.uid;
  
        // Add the note to Firestore
        firebase.firestore().collection('notes').doc(userId).collection('userNotes').add({
          text: noteText,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
          .then(function (docRef) {
            console.log('Note added with ID: ', docRef.id);
            noteInput.value = '';
            loadNotes(); // Reload notes after adding a new one
          })
          .catch(function (error) {
            console.error('Error adding note: ', error);
          });
      }
    }
  }
  
  function loadNotes() {
    var user = firebase.auth().currentUser;
  
    if (user) {
      var userId = user.uid;
      var notesList = document.getElementById('notes-list');
  
      // Get user's notes from Firestore
      firebase.firestore().collection('notes').doc(userId).collection('userNotes')
        .orderBy('timestamp', 'desc') // Order notes by timestamp in descending order
        .get()
        .then(function (querySnapshot) {
          notesList.innerHTML = ''; // Clear previous notes
  
          querySnapshot.forEach(function (doc) {
            var note = doc.data();
            var li = document.createElement('li');
            li.textContent = note.text;
            notesList.appendChild(li);
          });
        })
        .catch(function (error) {
          console.error('Error loading notes: ', error);
        });
    }
  }
  