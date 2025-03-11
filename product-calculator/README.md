# Invoice Markup Calculator

## Overview
The Invoice Markup Calculator is a React.js application designed to simplify the process of calculating the percentage markup of products after shipment. Users can enter product details, apply extra fees, and calculate the final prices with an adjustable markup percentage. The app also includes an OCR feature that extracts product data from invoice images, making data entry more efficient.

## Features
- **Product Entry:** Users can manually enter the product name, quantity, and unit price.
- **Automatic Total Calculation:** The app sums up the total cost of all products.
- **Extra Fees:** Additional costs such as shipping, transport, and insurance can be added.
- **Markup Percentage Adjustment:** The user can set or adjust the percentage markup, which automatically updates product prices.
- **Invoice Image OCR:** Users can upload an invoice image, and the app extracts product details using Tesseract OCR.
- **Regex-Based Parsing:** The OCR follows a specific format (Name, Quantity, Unit Price) to extract data correctly.
- **Table Display:** The final prices are displayed in a clear, structured table.
- **Export CSV:** The products table with the new prices can be exported as a CSV.
- **No External AI APIs:** The app is fully frontend-based, keeping it simple and free to use.
- **Future Updates:** The OCR will be improved over time to handle more invoice formats.

## Technologies Used
- **Frontend:** React.js
- **OCR:** Tesseract.js
- **Regex Parsing:** Used to ensure extracted text is correctly formatted.

## Usage Instructions
1. **Enter Products Manually**
   - Add product details (Name, Quantity, Unit Price) and get the total calculation.
2. **Upload Invoice Image (Optional)**
   - Upload an invoice image formatted as "Name, Quantity, Unit Price" for automatic extraction.
3. **Add Extra Fees**
   - Include shipping, transport, insurance, or other costs.
4. **Adjust Markup Percentage**
   - Calculate and update the markup percentage, and the app will update prices dynamically.
5. **View Final Prices**
   - All calculated prices appear in a table for easy review.
6. **Export Table**
     - Export table as CSV

## Limitations
- The OCR feature only works with invoices following a specific format.
- It does not use complex AI models, making it lightweight but limited in text recognition accuracy.

## Future Improvements
- Expand OCR capabilities to handle more invoice formats.
- Improve regex-based text parsing for better accuracy.

# Product Calculator

## 🚀 Overview
This ReactJS application helps users calculate the percentage markup of products after shipment. Users can:
- Enter product details (name, quantity, unit price).
- Add extra costs like shipping, transport, and insurance.
- Get the grand total and see the percentage increase.
- Adjust the percentage to update product prices dynamically.
- Upload an invoice image for automatic product entry using OCR.

The OCR feature relies on **Tesseract.js** and follows a specific format (Name, Quantity, Price per Unit) to extract details.

The app is built using **ReactJS**, **Vite**, and **Tesseract.js** and is hosted for free on **Netlify**.

---

## 📦 Installation & Setup

### 1️⃣ Prerequisites
Ensure you have installed:
- [Node.js (LTS)](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 2️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/product-calculator.git
cd product-calculator
```

### 3️⃣ Install Dependencies
```sh
npm install
```

### 4️⃣ Run the Development Server
```sh
npm run dev
```
This starts the app locally with **Vite**.

### 5️⃣ Build for Production
```sh
npm run build
```
This generates an optimized build in the **`dist/`** folder.

### 6️⃣ Preview the Production Build
```sh
npm run preview
```
Runs the built project locally.

---


## License
This project is open-source and available for modification and distribution.

