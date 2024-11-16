$(document).ready(() => {
  const $body = $('body');
  $body.html(''); // Clear the body before rendering new content

  // Add the Fright Space logo
  const $logo = $('<h1 id="logo">Fright Space</h1>');
  $body.append($logo);

  // Add the tweet input container
  const $usernameInputContainer = $('<div id="usernameInputContainer"></div>');
  const $usernameInput = $('<input id="usernameInput" type="text" placeholder="Ghost Name" />');
  const $usernameSubmitButton = $('<button id="usernameSubmitButton">Join the FEAR!</button>');
  $usernameInputContainer.append($usernameInput).append($usernameSubmitButton);
  $body.append($usernameInputContainer);

  // Add tweet input and button
  const $tweetInput = $('<textarea id="tweetInput" placeholder="What Scares You?" rows="3" disabled></textarea>');
  const $tweetButton = $('<button id="tweetButton" disabled>Press Play...If You Dare!</button>');
  $body.append($tweetInput);
  $body.append($tweetButton);

  // Add the tweet container for displaying tweets
  const $tweetContainer = $('<div id="tweetContainer"></div>');
  $body.append($tweetContainer);

  // Add the "Back to Home" button
  const $backButton = $('<button id="backButton" style="display: none;">Unravel the curse...Rewind</button>');
  $body.append($backButton);

  // Original tweets data
  const streams = {
    home: [
      { user: 'shawndrost', message: 'the president delegated a new form of potato #burningman', timestamp: moment() },
      { user: 'shawndrost', message: 'just downloaded the pony', timestamp: moment() },
      { user: 'mracus', message: 'completely built my security system #forreal', timestamp: moment() },
      { user: 'douglascalhoun', message: 'engineered an entire cat #magic', timestamp: moment() },
      { user: 'mracus', message: 'completely built a pony #magic', timestamp: moment() },
      { user: 'douglascalhoun', message: 'efficiently automated the money', timestamp: moment() },
      { user: 'douglascalhoun', message: 'efficiently deployed the life', timestamp: moment() },
      { user: 'mracus', message: 'that wizard built the worm #forreal', timestamp: moment() },
      { user: 'shawndrost', message: 'invented my koolaid #ballin', timestamp: moment() },
      { user: 'shawndrost', message: 'a ninja automated my way of life', timestamp: moment() },
      { user: 'mracus', message: 'last night i overhauled an entire life', timestamp: moment() }
    ],
    users: {}  // Store user timelines here
  };

  // Track current view
  let currentView = 'home'; // Can be 'home', 'user', or 'hashtag'
  let currentUser = null;   // Track the current user for user timelines
  let currentHashtag = null; // Track the current hashtag filter

  // Function to format tweet timestamps as relative time (e.g., "a few seconds ago")
  function formatTimestamp(timestamp) {
    const timeAgo = moment(timestamp).fromNow();  // Use Moment.js to get relative time
    const exactTime = moment(timestamp).format('MMMM Do YYYY, h:mm:ss a');  // Exact date & time
    return `${timeAgo} (${exactTime})`;
  }

  // Function to handle hashtag clicks
  function handleHashtagClick(hashtag) {
    currentView = 'hashtag';
    currentHashtag = hashtag;
    displayTweets(); // Re-display tweets with the hashtag filter
  }

  // Function to handle user clicks
  function handleUserClick(user) {
    currentView = 'user';
    currentUser = user;
    displayTweets(); // Re-display tweets from the user
  }

  // Function to format the message and make hashtags clickable
  function formatTweetMessageWithHashtags(message) {
    return message.replace(/#\w+/g, (hashtag) => {
      return `<a href="#" class="hashtag">${hashtag}</a>`;  // Make hashtag clickable
    });
  }

  // Create and format tweets
  function displayTweets() {
    let tweetsToDisplay;

    if (currentView === 'home') {
      tweetsToDisplay = streams.home;
    } else if (currentView === 'user' && currentUser) {
      tweetsToDisplay = streams.users[currentUser] || [];
    } else if (currentView === 'hashtag' && currentHashtag) {
      tweetsToDisplay = streams.home.filter(tweet => tweet.message.includes(currentHashtag));
    }

    const $tweets = tweetsToDisplay.map((tweet) => {
      const $tweet = $('<div class="tweet"></div>');

      // Add username, message, and timestamp
      const $username = $(`<a href="#" class="username glitch">@${tweet.user}</a>`);
      const $message = $('<p></p>').html(formatTweetMessageWithHashtags(tweet.message));  // Use formatted message with clickable hashtags
      const $timestamp = $(`<small class="timestamp">${formatTimestamp(tweet.timestamp)}</small>`); // Add timestamp

      // Handle clicking on a hashtag
      $message.find('.hashtag').click(function (e) {
        e.preventDefault(); // Prevent page refresh
        const hashtag = $(this).text();
        handleHashtagClick(hashtag);  // Show tweets with that hashtag
      });

      // Handle clicking on a user
      $username.click(function (e) {
        e.preventDefault(); // Prevent page refresh
        const user = $(this).text().slice(1); // Remove "@" symbol
        handleUserClick(user);  // Show tweets from that user
      });

      // Append everything to the tweet
      $tweet.append($username);
      $tweet.append($message);
      $tweet.append($timestamp);  // Append timestamp to tweet

      return $tweet;
    });

    $tweetContainer.html($tweets);  // Replace old tweets with new ones

    // Show the "Back to Home" button if we're not in the home timeline
    if (currentView !== 'home') {
      $backButton.show();
      $backButton.click(() => {
        currentView = 'home';
        currentUser = null;
        currentHashtag = null;
        displayTweets();  // Show home timeline
        $backButton.hide();
      });
    } else {
      $backButton.hide();
    }
  }

  // Function to generate random tweets
  function generateRandomTweet() {
    const users = ['shawndrost', 'sharksforcheap', 'mracus', 'douglascalhoun'];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomMessage = generateRandomMessage();  // Use the same structure as the original tweets
    const newTweet = {
      user: randomUser,
      message: randomMessage,
      timestamp: moment()  // Timestamp when the tweet was created
    };
    
    // Add the new tweet to the streams
    streams.home.unshift(newTweet);  // Add to the front to show at the top
    streams.users[randomUser] = streams.users[randomUser] || [];
    streams.users[randomUser].unshift(newTweet);  // Add to the user's timeline
    displayTweets();  // Update the tweet container to show the new tweet
  }

  // Generate random tweet message
  function generateRandomMessage() {
    const openings = ['just', 'completely', 'last night I', 'that wizard', 'a ninja'];
    const verbs = ['downloaded', 'built', 'engineered', 'aided', 'automated'];
    const objects = ['my', 'your', 'the', 'this', 'that'];
    const nouns = ['cat', 'system', 'potato', 'life', 'cloud'];
    const tags = ['#techlife', '#burningman', '#yolo', '#magic', '#ballin'];

    const opening = openings[Math.floor(Math.random() * openings.length)];
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    const object = objects[Math.floor(Math.random() * objects.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const tag = tags[Math.floor(Math.random() * tags.length)];

    return `${opening} ${verb} ${object} ${noun} ${tag}`;
  }

  // Schedule random tweet generation every 5 seconds
  setInterval(generateRandomTweet, 5000);

  // Button actions
  let currentUsername = null;

  // Handle username submission
  $usernameSubmitButton.click(() => {
    const username = $usernameInput.val().trim();
    if (username) {
      currentUsername = username;  // Store the username
      streams.users[currentUsername] = [];  // Initialize the user's timeline
      $('#tweetInput').prop('disabled', false);
      $('#tweetButton').prop('disabled', false);
      $('#usernameInput').prop('disabled', true);
      $('#usernameSubmitButton').prop('disabled', true);
      displayTweets();  // Update the tweet feed
    }
  });

  // Submit tweet action (Stab button)
  $tweetButton.click(() => {
    const tweetMessage = $tweetInput.val().trim();
    if (tweetMessage) {
      const newTweet = {
        user: currentUsername,
        message: tweetMessage,
        timestamp: moment()  // Add timestamp
      };
      streams.home.unshift(newTweet);  // Add the new tweet to the home timeline
      streams.users[currentUsername].unshift(newTweet);  // Add it to the user's timeline
      $tweetInput.val('');  // Clear input
      displayTweets();  // Refresh the tweet container
    }
  });

  // Initially show the home timeline
  displayTweets();

  // Inject the CSS directly into the JS for spooky theme
  const css = `
    body {
      justify-content: center;
      align-items: center;
      background-color: #111;
      color: #fff;
      font-family: 'Georgia', serif;
      text-align: center;
      padding: 20px;
      margin: 0;
      position: relative;
      min-height: 100vh;
      background-image: url('https://64.media.tumblr.com/d137d8465d4bee833718679e863eaa63/9c4c4fc78e52ed19-d5/s400x600/0d8f4a67d06179dd90ca4c7189f3a20f8d8e7aaa.gifv');
      background-size: cover;
      background-attachment: fixed;
      font-size: 18px;
    }

    #logo {
      color: crimson;
      font-size: 4rem;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 5px;
      text-shadow: 0 0 15px red, 0 0 30px darkred, 0 0 50px crimson;
      animation: bloodDrip 2s infinite alternate;
      font-family: 'Press Start 2P', cursive;
    }

    @keyframes bloodDrip {
      0% { box-shadow: 0 0 30px red, 0 0 40px darkred, 0 0 60px crimson; }
      100% { box-shadow: 0 0 50px red, 0 0 80px darkred, 0 0 100px crimson; }
    }

    .tweet {
      width: 75%;
      border: 2px solid crimson;
      background-color: #222;
      padding: 20px;
      margin: 75px 0;
      border-radius: 15px;
      box-shadow: 0 0 30px 5px red;
      text-align: center;
      color: black;
      position: center;
      z-index: 1;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      font-family: 'Press Start 2P', cursive;
      background: url('https://ia801800.us.archive.org/5/items/SmokesVHSTape2742/1.%202742%20spine.jpg') no-repeat center center;
      background-size: cover;
      text-shadow: 0 0 5px black;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .tweet:hover {
      transform: scale(1.05);
      box-shadow: 0 0 40px 10px #ff0033;
    }

    .username {
      color: crimson;
      font-size: 1.4em;
      text-decoration: none;
      font-weight: bold;
    }

    .username:hover {
      text-decoration: underline;
    }

    .hashtag {
      color: #ff4500;
      text-decoration: none;
    }

    .hashtag:hover {
      text-decoration: underline;
    }

    #tweetInput {
      width: 100%;
      padding: 15px;
      background-color: #333;
      border: 1px solid #444;
      color: white;
      margin-bottom: 15px;
      border-radius: 10px;
      font-size: 1.1em;
      font-family: 'Press Start 2P', cursive;
    }

    button {
      background-color: crimson;
      border: none;
      padding: 20px 40px;
      color: white;
      border-radius: 15px;
      cursor: pointer;
      font-size: 20px;
      box-shadow: 0 0 15px 5px red;
      text-shadow: 0 0 10px black, 0 0 20px crimson;
      font-family: 'Press Start 2P', cursive;
    }

    button:hover {
      background-color: darkred;
      box-shadow: 0 0 25px 10px red;
    }

    #backButton {
      background-color: darkgray;
      border: none;
      padding: 10px 20px;
      color: white;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }

    #backButton:hover {
      background-color: gray;
    }

    /* Pixelated glitch effect */
    .glitch {
      font-family: 'Press Start 2P', cursive;
      color: crimson;
      text-shadow: 0 0 10px #ff0033, 0 0 20px red, 0 0 30px darkred;
      animation: glitch 1.5s infinite alternate-reverse;
      transform: scale(1.1);
    }

    @keyframes glitch {
      0% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      50% { transform: translateX(4px); }
      75% { transform: translateX(-4px); }
      100% { transform: translateX(0); }
    }
  `;
  
  // Inject the CSS into the head of the document
  const $style = $('<style></style>').text(css);
  $('head').append($style);
});
