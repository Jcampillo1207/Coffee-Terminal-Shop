# CoffeeShell - CLI Coffee Ordering App

CoffeeShell is a command-line interface (CLI) application that allows users to order coffee directly from the terminal. The app integrates Supabase for user authentication and Stripe for payment processing. This project serves as a template for creating CLI applications with user authentication and payment functionalities.

## Features

- **User Authentication:** Users can create accounts and log in using Supabase Auth.
- **Coffee Ordering:** Customize your coffee order with options for sugar, milk, and whipped cream.
- **Payment Integration:** Generate a Stripe payment link and complete transactions securely.
- **Order Management:** Save orders to a Supabase database for tracking and analytics.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- A Supabase account with a project set up.
- A Stripe account for payment processing.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/coffeeshell.git
   cd coffeeshell
   Install dependencies:
   ```

```bash
npm install
```
Set up environment variables:

Create a .env file in the root directory and populate it with your Supabase and Stripe credentials.


SUPABASE_URL=https://your_supabase_url.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
Build the project:

Although this project does not require a specific build process, you can define one in the build script if needed.

```bash
npm run build
```

## Usage
Run the application:


To start the application and interact with it via the terminal, execute:

```bash
node ./src/orderCoffee.js
```

Create an account or log in:

Follow the on-screen prompts to either create a new account or log in with existing credentials.

Order coffee:

Customize your coffee order by selecting options for coffee type, sugar, milk, and whipped cream.

Complete payment:

After confirming your order, a Stripe payment link will be generated. Use this link to complete the payment.

```
coffeeshell/
├── bin/
│ └── coffeeshell.js # Entry point for the CLI command
├── src/
│ └── orderCoffee.js # Main application logic
├── .env.template # Template for environment variables
├── .gitignore # Git ignore configuration
├── .npmignore # npm ignore configuration
└── package.json # Project metadata and scripts
```

## Customization

Add New Features: Modify orderCoffee.js to implement additional features such as new coffee options or a loyalty program.
Integrate Other APIs: Extend functionality by integrating other APIs or services (e.g., notifications or delivery tracking).
Contributing

If you want to contribute to this project, please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature-branch).
Make your changes and commit them (git commit -m 'Add new feature').
Push to the branch (git push origin feature-branch).
Open a pull request.


## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For any inquiries, please contact José Campillo. """
