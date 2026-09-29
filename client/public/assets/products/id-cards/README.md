# ID Card Images Directory

This directory is for storing specific ID card type images.

## Current Status

The ID Card Landing Page currently uses existing product images as placeholders:
- Standard PVC ID Cards → `/assets/products/id_cards.jpg`
- Holographic ID Cards → `/assets/products/luxury_business_cards.jpg`
- Smart NFC ID Cards → `/assets/products/card-velvet-foil.jpg`
- RFID Proximity Cards → `/assets/products/card-painted-edge.jpg`
- Magnetic Stripe ID Cards → `/assets/products/card-soft-touch.jpg`
- Photo ID Cards → `/assets/products/basic_business_cards.jpg`
- Custom-Shaped ID Cards → `/assets/products/business-cards/bc_diecut.jpg`
- Premium Metal ID Cards → `/assets/products/luxury_business_cards_dubai.jpg`
- Eco-Friendly ID Cards → `/assets/products/business-cards/bc_textured_kraft.jpg`
- Transparent ID Cards → `/assets/products/business-cards/bc_minimalist.jpg`
- Dual-Sided ID Cards → `/assets/products/business-cards/bc_bilingual.jpg`
- Variable Data ID Cards → `/assets/products/business-cards/bc_corporate_batches.jpg`

## To Add Actual ID Card Images

1. Place your ID card images in this directory with these filenames:
   - `standard-pvc-id.jpg`
   - `holographic-id-cards.jpg`
   - `smart-nfc-id-cards.jpg`
   - `rfid-proximity-cards.jpg`
   - `magnetic-stripe-cards.jpg`
   - `photo-id-cards.jpg`
   - `custom-shaped-id-cards.jpg`
   - `metal-id-cards.jpg`
   - `eco-friendly-id-cards.jpg`
   - `transparent-id-cards.jpg`
   - `dual-sided-id-cards.jpg`
   - `variable-data-id-cards.jpg`

2. Update the image paths in `client/src/pages/public/IdCardLandingPage.jsx`:
   Change from:
   ```javascript
   image: '/assets/products/id_cards.jpg'
   ```
   To:
   ```javascript
   image: '/assets/products/id-cards/standard-pvc-id.jpg'
   ```

3. Repeat for all 12 card types.

## Image Specifications

- **Dimensions**: 1200x900px (4:3 aspect ratio)
- **Format**: JPG (for photos) or PNG (for graphics with transparency)
- **File Size**: Under 200KB each
- **Quality**: High resolution for professional appearance

## Placeholder Note

Until actual ID card images are added, the page will display the placeholder images. The page is fully functional and ready to use.
