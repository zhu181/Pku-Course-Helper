# Chrome Extension to Open All Links in New Window

This Chrome extension is designed to read all the links on the current webpage and open them in new tabs. It consists of several components that work together to provide a seamless user experience.

## Project Structure

```
chrome-extension
├── src
│   ├── background.js        # Background script for handling extension lifecycle events
│   ├── content.js          # Content script for reading links from the webpage
│   ├── manifest.json       # Extension configuration file
│   └── popup
│       ├── popup.html      # HTML structure for the popup interface
│       └── popup.js        # Script for handling popup interactions
├── images
│   └── icon.png            # Icon for the extension
└── README.md               # Documentation for the project
```

## Features

- **Read All Links**: The extension scans the current webpage for all anchor (`<a>`) tags and retrieves their `href` attributes.
- **Open Links in New Tabs**: Users can open all found links in new tabs with a single click from the popup interface.
- **User-Friendly Interface**: The popup provides a simple and intuitive interface for users to interact with the extension.

## Installation

1. Clone the repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click on "Load unpacked" and select the `chrome-extension` directory.
5. The extension should now be installed and ready to use.

## Usage

1. Navigate to any webpage that contains links.
2. Click on the extension icon in the Chrome toolbar.
3. In the popup, click the button to open all links in new tabs.

## Contributing

Feel free to submit issues or pull requests if you have suggestions for improvements or new features.

## License

This project is licensed under the MIT License. See the LICENSE file for details.