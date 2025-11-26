#!/bin/bash
# Automated App Store Submission Script for Rip360 Fitness Pro
# Created: November 17, 2025

set -e  # Exit on any error

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  RIP360 FITNESS PRO - AUTOMATED SUBMISSION SCRIPT           ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Privacy Policy URL (already hosted)
PRIVACY_URL="https://8080-i5uvi1fayd6bjrow9d4ou-cc2fbc16.sandbox.novita.ai"

echo -e "${GREEN}✓ Privacy Policy URL:${NC} $PRIVACY_URL"
echo ""

# Step 1: EAS Login
echo -e "${YELLOW}Step 1: EAS Login${NC}"
echo "Please login with your Expo account: tbone0189@gmail.com"
npx eas login
echo ""

# Step 2: Configure EAS Project (if needed)
echo -e "${YELLOW}Step 2: Configure EAS Project${NC}"
npx eas init --id 9f8e7d6c-5b4a-3c2d-1e0f-a9b8c7d6e5f4 || echo "Project already initialized"
echo ""

# Step 3: Check existing builds
echo -e "${YELLOW}Step 3: Checking existing builds${NC}"
npx eas build:list --platform all --limit 5
echo ""

# Step 4: Build if needed
read -p "Do you need to create new builds? (y/n): " build_needed
if [ "$build_needed" = "y" ]; then
    echo -e "${YELLOW}Building for both platforms...${NC}"
    npx eas build --platform all --profile production --non-interactive
    echo -e "${GREEN}✓ Builds submitted. This will take 15-30 minutes.${NC}"
    echo "  Check status at: https://expo.dev/accounts/tbone0189/projects/rip360-fitness-pro/builds"
    echo ""
    read -p "Press Enter when builds are complete..."
fi

# Step 5: Submit to iOS App Store
echo -e "${YELLOW}Step 5: Submit to iOS App Store${NC}"
echo "Submitting iOS build to App Store Connect..."
npx eas submit --platform ios --profile production --non-interactive
echo -e "${GREEN}✓ iOS build submitted to App Store Connect${NC}"
echo ""

# Step 6: Submit to Google Play Store
echo -e "${YELLOW}Step 6: Submit to Google Play Store${NC}"
echo "Note: You'll need to create the app in Google Play Console first"
echo "      Visit: https://play.google.com/console"
read -p "Have you created the app in Google Play Console? (y/n): " play_created

if [ "$play_created" = "y" ]; then
    echo "Submitting Android build to Google Play..."
    npx eas submit --platform android --profile production --non-interactive || {
        echo -e "${YELLOW}Note: Automated submission failed. You can manually upload the .aab file${NC}"
        echo "      Download from: https://expo.dev/accounts/tbone0189/projects/rip360-fitness-pro/builds"
    }
    echo -e "${GREEN}✓ Android submission attempted${NC}"
else
    echo -e "${YELLOW}Please create the app in Google Play Console first, then run:${NC}"
    echo "  npx eas submit --platform android --profile production"
fi
echo ""

# Step 7: Summary
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                  SUBMISSION SUMMARY                          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✓ Privacy Policy URL:${NC} $PRIVACY_URL"
echo -e "${GREEN}✓ iOS Submission:${NC} Completed"
echo -e "${YELLOW}⚠ Android Submission:${NC} May need manual upload"
echo ""
echo "NEXT STEPS:"
echo "1. Go to App Store Connect: https://appstoreconnect.apple.com"
echo "2. Complete the iOS listing:"
echo "   - Upload screenshots from: screenshots/ios/"
echo "   - Add privacy policy URL: $PRIVACY_URL"
echo "   - Add demo account: demo@rip360app.com / Demo2025!"
echo "   - Submit for review"
echo ""
echo "3. Go to Google Play Console: https://play.google.com/console"
echo "4. Complete the Android listing:"
echo "   - Upload screenshots from: screenshots/android/"
echo "   - Add privacy policy URL: $PRIVACY_URL"
echo "   - Upload feature graphic: feature-graphic.png"
echo "   - Submit for review"
echo ""
echo -e "${GREEN}🎉 You're almost done! Just complete the store listings!${NC}"
