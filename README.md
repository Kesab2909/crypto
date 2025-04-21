CryptoTracker
CryptoTracker is a modern, React-based web application that provides real-time cryptocurrency market data using the CoinGecko API. It features a sleek, dark-themed UI, allowing users to browse cryptocurrencies, view detailed coin information, and track price trends with interactive charts. Key features include currency switching (USD, EUR, INR), search functionality, user login, and seamless navigation between the homepage and individual coin pages.
Features

Real-Time Data: Fetches live crypto market data via CoinGecko API.
Interactive Charts: Displays price trends using react-google-charts.
Currency Support: Switch between USD, EUR, and INR for pricing.
Search & Filter: Easily find cryptocurrencies by name.
User Authentication: Simple login system with form validation.
Responsive Design: Optimized for mobile and desktop with Tailwind CSS.
Routing: Navigate between home and coin pages using React Router.

Tech Stack

Frontend: React, React Router, React Context
Styling: Tailwind CSS
API: CoinGecko API
Icons: Lucide React
Charts: react-google-charts
Build Tool: Vite

Installation

Clone the Repository:
git clone https://github.com/your-username/cryptotracker.git
cd cryptotracker


Install Dependencies:
npm install


Set Up Environment:

Ensure you have a valid CoinGecko API key. The app uses a demo key (CG-6ft4mo3VygFVj8pvXWc7rr4V), but you may need your own for production.
Update the API key in CryptoContext.jsx, CoinPage.jsx, or create a .env file if needed.


Run the Development Server:
npm run dev

Open http://localhost:5173 in your browser.


Usage

Homepage: View a list of top cryptocurrencies with market cap, price, and 24h price change.
Coin Page: Click a coin to see detailed info, including price charts, market stats, and social links.
Currency Switch: Select USD, EUR, or INR from the dropdown in the coin list.
Search: Use the navbar search bar to filter coins by name.
Login: Access the login form via the navbar to simulate user authentication.

Project Structure
cryptotracker/
├── src/
│   ├── components/         # Reusable components (Navbar, Footer, AreaChart, etc.)
│   ├── context/            # React Context for state management
│   ├── pages/              # Page components (Home, Crypto)
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # Entry point
│   ├── index.css           # Global styles with Tailwind
│   └── ...
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # Project documentation

Dependencies

react, react-dom
react-router-dom
lucide-react
react-google-charts
tailwindcss
@vitejs/plugin-react

Contributing

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make changes and commit (git commit -m 'Add your feature').
Push to the branch (git push origin feature/your-feature).
Open a Pull Request.

License
This project is licensed under the MIT License.
Acknowledgments

CoinGecko: For providing the cryptocurrency market data API.
Tailwind CSS: For the utility-first CSS framework.
Lucide: For the beautiful icon set.

