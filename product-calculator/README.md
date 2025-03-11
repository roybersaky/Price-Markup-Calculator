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
   - Change the markup percentage, and the app will update prices dynamically.
5. **View Final Prices**
   - All calculated prices appear in a table for easy review.

## Limitations
- The OCR feature only works with invoices following the required format.
- It does not use complex AI models, making it lightweight but limited in text recognition accuracy.

## Future Improvements
- Expand OCR capabilities to handle more invoice formats.
- Improve regex-based text parsing for better accuracy.
- Add backend support for saving invoices and calculations.

## Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/invoice-markup-calculator.git
   cd invoice-markup-calculator
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the app:
   ```bash
   npm start
   ```

## License
This project is open-source and available for modification and distribution.

## Contact
For inquiries or contributions, feel free to open an issue or submit a pull request on GitHub.

