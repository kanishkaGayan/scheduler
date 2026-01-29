# Building TimeKeeper for Linux

## Build Instructions

### Build Linux Application

```bash
# Build for Linux (AppImage, .deb, and .rpm)
npm run electron:build
```

The built files will be in the `release/` directory:
- `TimeKeeper-1.0.0.AppImage` - Universal Linux package
- `timekeeper_1.0.0_amd64.deb` - Debian/Ubuntu package
- `timekeeper-1.0.0.x86_64.rpm` - Fedora/RedHat package

### Installation

#### AppImage (Universal)
```bash
# Make it executable
chmod +x TimeKeeper-1.0.0.AppImage

# Run it
./TimeKeeper-1.0.0.AppImage
```

#### Debian/Ubuntu (.deb)
```bash
sudo dpkg -i timekeeper_1.0.0_amd64.deb
```

#### Fedora/RedHat (.rpm)
```bash
sudo rpm -i timekeeper-1.0.0.x86_64.rpm
```

### Development Mode

Run the app in development mode with hot reload:

```bash
npm run electron:dev
```

This will:
1. Start the Vite dev server
2. Wait for it to be ready
3. Launch Electron with the dev server

### Build for All Platforms

To build for Linux, Windows, and macOS:

```bash
npm run electron:build:all
```

Note: Building for macOS requires a Mac, building for Windows is possible on Linux.

### Distribution

The built packages are ready to distribute:
- Share the `.AppImage` for universal Linux compatibility
- Upload `.deb` for Debian/Ubuntu users
- Upload `.rpm` for Fedora/RedHat users

### Continuous Builds

You can set up GitHub Actions to automatically build releases when you tag a version:

1. Create `.github/workflows/release.yml`
2. Tag your release: `git tag v1.0.0`
3. Push the tag: `git push --tags`
4. GitHub will build and create a release with all packages

### File Sizes (Approximate)

- AppImage: ~100-150 MB
- .deb: ~100-150 MB
- .rpm: ~100-150 MB

The packages include Electron runtime, so they work standalone without dependencies.
