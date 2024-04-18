# Disclaimer 
I thought Ace was the lowest ranking card because it has 1 of the suit symbol, realized after submitting. 
# TeenPatti
This is a multiplayer online TeenPatti (Indian Poker) game implemented using Socket.io for real-time communication, React for the front-end UI, and Node.js for the back-end server.

# Features
Multiplayer TeenPatti game
Real-time communication using Socket.io
Real-time game updates and messages
Responsive and user-friendly UI using React

# Technologies Used
React: A popular JavaScript library for building user interfaces.
Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine that allows running JavaScript on the server-side.
Express: A fast and minimalist web application framework for Node.js used for building the back-end server.
Socket.io: A JavaScript library for real-time, bidirectional communication between the client and server.

# Rules (from what i understand)
● Initially, each player is given 3 face down cards and 3 face up cards.
● Apart from that each player is given 3 cards in their hand.
● The rest of the deck is kept aside.
● Every player must throw the card of the same value or higher than the topmost card.
● If the player has no valid card then they can use a power card:
  2 is a refreshing card. You can throw another card with it and the game restarts from that card. 2's can be stacked.
  7 is a low card. When a player throws a 7, the next player must throw a 7 or lower to continue.
  8 is an invisible card. The game continues from the card that was below 8.
  10 burns the pile. The pile is set aside.
● If the player has no valid card to play and no power card, then they must pick up the whole pile and add it to their hand. This is done manually and the server does not allow a player to pick up the pile if they have a valid card (not power card).
● Once the player runs out of cards in their hand and there are no cards left in the set-aside deck, the 3 face-up cards come into play. The players select either one of them to play.
● Once the 3 face-up cards are used, the 3 face-down cards come into play. The players select the one they want to play.
● The winner is the player who has no cards in hand, no face-up cards and no face-down cards. 

LUMS CS300 
