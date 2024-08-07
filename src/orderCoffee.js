import inquirer from "inquirer";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import qrcode from "qrcode-terminal";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeSecretKey);

const coffeeMenu = [
  { name: "Espresso", price: 2.5 },
  { name: "Latte", price: 3.5 },
  { name: "Cappuccino", price: 3.0 },
  { name: "Americano", price: 2.0 },
  { name: "Mocha", price: 4.0 },
];

const sugarOptions = [
  "No sugar",
  "One teaspoon",
  "Two teaspoons",
  "Three teaspoons",
];

const milkOptions = [
  "No milk",
  "Whole milk",
  "Skim milk",
  "Soy milk",
  "Almond milk",
];

const whippedCreamOptions = ["No whipped cream", "Add whipped cream"];

async function createAccount() {
  const { email, name, password } = await inquirer.prompt([
    { type: "input", name: "email", message: "Enter your email:" },
    { type: "input", name: "name", message: "Enter your name:" },
    { type: "password", name: "password", message: "Create a password:" },
  ]);

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("usuarios")
    .insert([{ email, nombre: name, password: hashedPassword }])
    .select();

  if (error) {
    console.error("Error creating account:", error.message);
    return null;
  }

  if (data && data.length > 0) {
    console.log("Account created successfully!");
    return data[0];
  } else {
    console.error("Unexpected error: No data returned from Supabase.");
    return null;
  }
}

async function login() {
  const { email, password } = await inquirer.prompt([
    { type: "input", name: "email", message: "Enter your email:" },
    { type: "password", name: "password", message: "Enter your password:" },
  ]);

  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) {
    console.error("Error logging in: User not found");
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, data.password);
  if (!isPasswordValid) {
    console.error("Error logging in: Incorrect password");
    return null;
  }

  console.log("Logged in successfully!");
  return data;
}

async function createPaymentLink(amount) {
  const product = await stripe.products.create({
    name: "Coffee Order",
    description: "Your personalized coffee order",
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round(amount * 100),
    currency: "usd",
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{ price: price.id, quantity: 1 }],
    mode: "payment",
    success_url: "https://your-success-url.com",
    cancel_url: "https://your-cancel-url.com",
  });

  return session.url;
}

async function orderCoffee(user) {
  try {
    console.log("Welcome to the Coffee CLI App!");

    const { coffeeChoice } = await inquirer.prompt([
      {
        type: "list",
        name: "coffeeChoice",
        message: "What coffee would you like to order?",
        choices: coffeeMenu.map((coffee) => coffee.name),
      },
    ]);

    const selectedCoffee = coffeeMenu.find(
      (coffee) => coffee.name === coffeeChoice
    );

    const { sugarChoice } = await inquirer.prompt([
      {
        type: "list",
        name: "sugarChoice",
        message: "How much sugar would you like?",
        choices: sugarOptions,
      },
    ]);

    const { milkChoice } = await inquirer.prompt([
      {
        type: "list",
        name: "milkChoice",
        message: "What type of milk would you like?",
        choices: milkOptions,
      },
    ]);

    const { whippedCreamChoice } = await inquirer.prompt([
      {
        type: "list",
        name: "whippedCreamChoice",
        message: "Would you like to add whipped cream?",
        choices: whippedCreamOptions,
      },
    ]);

    console.log("\nHere is your order summary:");
    console.log(`- Coffee: ${selectedCoffee.name}`);
    console.log(`- Sugar: ${sugarChoice}`);
    console.log(`- Milk: ${milkChoice}`);
    console.log(`- Whipped Cream: ${whippedCreamChoice}`);
    console.log(`- Total Price: $${selectedCoffee.price.toFixed(2)}\n`);

    const { confirmOrder } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmOrder",
        message: "Would you like to confirm your order?",
        default: true,
      },
    ]);

    if (!confirmOrder) {
      console.log("Order canceled.");
      return;
    }

    const paymentLink = await createPaymentLink(selectedCoffee.price);
    console.log(
      "Please complete the payment by scanning the QR code or clicking the link:"
    );
    qrcode.generate(paymentLink, { small: true });

    // Guardar el pedido en la base de datos
    const { error } = await supabase.from("pedidos").insert([
      {
        usuario_id: user.id,
        cafe: selectedCoffee.name,
        azucar: sugarChoice,
        leche: milkChoice,
        crema_batida: whippedCreamChoice,
        precio: selectedCoffee.price,
        pagado: false,
      },
    ]);

    if (error) {
      console.error("Error saving order:", error.message);
    } else {
      console.log(
        "Thank you for your order! Your coffee will be ready shortly after payment."
      );
    }
  } catch (error) {
    console.error("An error occurred while placing your order:", error);
  }
}

async function main() {
  console.log("Welcome to the Coffee CLI App!");
  console.log("Please create an account or log in to continue.\n");

  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Do you want to create an account or log in?",
      choices: ["Create Account", "Log In"],
    },
  ]);

  let user;
  if (choice === "Create Account") {
    user = await createAccount();
  } else if (choice === "Log In") {
    user = await login();
  }

  if (user) {
    await orderCoffee(user);
  }
}

main();
