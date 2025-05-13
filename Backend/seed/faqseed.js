// seed/faqSeed.js
import mongoose from 'mongoose';
import FAQ from '../models/faq.js'; // Adjust path if needed

// Connect to your MongoDB database
mongoose.connect('mongodb+srv://tlouthabo07:tlouthabo@employment.sg91j.mongodb.net/TechStore?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const faqData = [
  {
    question: "What are your working hours?",
    answer: "Our support team is available Monday to Friday, from 9:00 AM to 5:00 PM."
  },
  {
    question: "Where are you located?",
    answer: "We are located in Maseru, Lesotho. Our full address is available on our Contact page."
  },
  {
    question: "Do you offer home delivery?",
    answer: "Yes, we offer delivery services within Maseru and surrounding areas."
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery usually takes 1 to 3 working days depending on your location."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept cash, mobile money (Mpesa, Ecocash), and EFT (bank transfers)."
  },
  {
    question: "Do you repair laptops?",
    answer: "Yes, we offer laptop repair services including screen replacement, software updates, and diagnostics."
  },
  {
    question: "Can I return a product I bought?",
    answer: "Yes, returns are accepted within 7 days if the item is unused and in its original packaging."
  },
  {
    question: "Do you recycle old electronics?",
    answer: "Yes, we recycle used laptops, RAM sticks, hard drives, and other electronic components."
  },
  {
    question: "How can I track my query?",
    answer: "After submission, you’ll receive an email with your query ID. You can use that to follow up."
  },
  {
    question: "How do I contact customer support?",
    answer: "You can contact our support team at support@example.com or call +266 1234 5678."
  }
];

// Insert into DB
async function seedFAQs() {
  try {
    await FAQ.deleteMany(); // Optional: Clear existing FAQs
    await FAQ.insertMany(faqData);
    console.log('✅ FAQs seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error seeding FAQs:', err);
    mongoose.connection.close();
  }
}

seedFAQs();
