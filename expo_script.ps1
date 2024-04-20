# Remove node_modules directory
Remove-Item -Recurse -Force node_modules

# Clean Yarn cache
yarn cache clean

# Install dependencies with Yarn
yarn

# Clear watchman watch list
watchman watch-del-all

# Remove temporary files related to haste map
Remove-Item -Recurse -Force $env:LOCALAPPDATA\Temp\haste-map-*

# Remove temporary files related to Metro cache
Remove-Item -Recurse -Force $env:LOCALAPPDATA\Temp\metro-cache

# Start Expo with clearing cache
npx expo start --clear
