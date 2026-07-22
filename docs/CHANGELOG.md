# Changelog

## 2026-07-22

### Added

- Final VPS deployment integration based on the current `main` branch.
- Favorite vehicle controller support.
- Shared frontend map style module for Goong/MapLibre map rendering.
- Electronic contract flow updates for DocuSeal renter/owner signing.
- Customer booking status and owner booking management improvements.

### Changed

- Updated `deploy.sh` to clone and pull the official group repository.
- Updated Docker Compose defaults to use `https://luxeway.io.vn` for production frontend URLs.
- Removed Firebase Hosting and ngrok deployment assumptions from production deploy configuration.
- Improved frontend booking model mapping to retain owner data from booking or vehicle payloads.
- Updated backend vehicle filtering call sites to match the repository method signature.

### Fixed

- TypeScript errors in booking detail owner display and backend test page API typing.
- Backend Java compile error in `VehicleService`.
- Missing required audit documentation files for GitHub Actions.

### Verification

- `npm run type-check`
- `npm run build`
- `./gradlew.bat compileJava`
- Conflict marker scan for unresolved merge markers
