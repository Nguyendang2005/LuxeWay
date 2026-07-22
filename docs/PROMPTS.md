# Prompts

This document summarizes the AI-assisted development prompts and decisions used for the LuxeWay final release.

## Final integration scope

- Compare the final local LuxeWay implementation with the latest `main` branch.
- Keep the group's final deployment target on VPS instead of Firebase Hosting.
- Merge the repaired application flow into `main` without losing the VPS deployment workflow.
- Preserve the final demo-critical features: authentication, booking, PayOS payment, electronic contract, owner booking management, cancellation review, map, and test accounts.

## Issue-fix prompts covered

- Diagnose and fix Google OAuth redirect and backend account completion errors.
- Restore booking visibility for customers and owners.
- Repair cancellation request and owner approval/rejection flow.
- Integrate DocuSeal electronic rental contracts with separate renter and owner signing states.
- Allow customers to continue to payment after renter signature.
- Improve map display and Goong/MapLibre configuration.
- Clean dirty generated files before final Git push.
- Validate frontend and backend build before pushing to `main`.

## Deployment prompt

- Use the VPS deployment pipeline from `main`.
- Remove Firebase Hosting deployment assumptions from production deployment config.
- Ensure `deploy.sh` pulls the correct group repository before running Docker Compose.
