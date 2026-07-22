# Reflection

## What changed

The final integration combines the current `main` branch's VPS deployment work with the local final application fixes developed during demo testing.

The deployment direction was changed from Firebase Hosting/ngrok testing to VPS production deployment through GitHub Actions and Docker Compose. The deployment script now uses the correct group repository URL and defaults production frontend URLs to `https://luxeway.io.vn`.

## Main risks addressed

- Google OAuth previously reached the backend but failed during account completion. The authentication flow now handles missing profile data and redirects through the production frontend URL.
- Booking and cancellation states were previously inconsistent between customer and owner views. The UI and backend state model now expose payment, cancellation review, and booking tracking more clearly.
- Digital contracts previously behaved like both sides were signed automatically. The contract flow now distinguishes renter and owner signing states while still allowing the customer to proceed to payment after renter signing.
- Map configuration previously mixed Firebase/ngrok testing assumptions and inconsistent map implementations. The final version keeps the Goong/MapLibre direction.

## Verification performed

- Frontend TypeScript check completed successfully.
- Frontend production build completed successfully.
- Backend Java compilation completed successfully.
- Merge conflict markers were checked and none were found.
- Generated build output was cleaned before final commit.

## Remaining operational note

Docker was not available on the local Windows environment, so Docker Compose validation must be observed on the VPS or in GitHub Actions.
