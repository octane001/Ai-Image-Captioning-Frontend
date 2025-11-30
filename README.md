# AI Image Captioning Frontend 🖼️♿

An accessible, transformer-based image captioning system designed to assist visually impaired individuals by generating natural language descriptions of images using AI.

![React](https://img.shields.io/badge/React-19.0+-61DAFB?style=flat&logo=react&logoColor=white)
![Accessibility](https://img.shields.io/badge/WCAG-2.1-blue?style=flat)

## ✨ Features

- 🎯 **AI-Powered Captions** - Uses BLIP transformer model for accurate image descriptions
- ♿ **Fully Accessible** - WCAG compliant with screen reader support
- 🔊 **Text-to-Speech** - Automatic caption narration for visually impaired users
- ⌨️ **Keyboard Shortcuts** - Complete hands-free navigation
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **High Contrast UI** - Black and white design for better visibility
- ⚡ **Real-time Processing** - Fast caption generation

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- Backend API running on `http://localhost:8000` ([Setup Backend](https://github.com/octane001/Ai-Image-Captioning-Backend))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-image-captioning-frontend.git
cd ai-image-captioning-frontend

# Install dependencies
npm install

# Start development server
npm start
```

Visit `http://localhost:3000` to use the application.

## 🎮 Usage

### Basic Workflow
1. **Upload Image** - Click "Upload Image" or press `Ctrl+U`
2. **Generate Caption** - Click "Generate Caption" or press `Ctrl+Enter`
3. **Listen** - Caption is automatically spoken (if auto-speak enabled)

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+U` | Upload image |
| `Ctrl+Enter` | Generate caption |
| `Ctrl+S` | Speak caption |
| `Esc` | Stop speaking |

### Options
- **Detailed Description** - Generate more comprehensive captions
- **Auto-speak Caption** - Automatically narrate captions when generated

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **UI Components**: Lucide React Icons
- **Styling**: Tailwind CSS
- **API Communication**: Fetch API
- **Text-to-Speech**: Web Speech API
- **Accessibility**: ARIA labels, semantic HTML

## 📁 Project Structure

```
src/
├── App.jsx              # Main application component
├── index.html            # Entry point
├── index.css           # Global styles + Tailwind
└── components/         # (Future: Component breakdown)
```

## 🌐 API Integration

This frontend connects to a FastAPI backend that serves the BLIP model:

**Endpoint**: `POST http://localhost:8000/caption`

**Request**:
```javascript
FormData: {
  file: ImageFile,
  detailed: boolean
}
```

**Response**:
```json
{
  "success": true,
  "caption": "a dog sitting on grass",
  "alternative_captions": ["..."],
  "image_size": "1920x1080"
}
```

## ♿ Accessibility Features

- **Screen Reader Compatible** - All elements properly labeled
- **Keyboard Navigation** - Full functionality without mouse
- **High Contrast** - Black and white color scheme
- **Focus Indicators** - Clear visual focus states
- **ARIA Live Regions** - Real-time status announcements
- **Semantic HTML** - Proper heading hierarchy

## 🎨 Customization

### Change API Endpoint

In `App.js`, update the fetch URL:
```javascript
const response = await fetch('YOUR_API_URL/caption', {
  method: 'POST',
  body: formData,
});
```

### Adjust Speech Settings

Modify text-to-speech parameters in the `speak()` function:
```javascript
utterance.rate = 1.0;   // Speed (0.1 to 10)
utterance.pitch = 1.0;  // Pitch (0 to 2)
utterance.volume = 1.0; // Volume (0 to 1)
```

## 🐛 Troubleshooting

### "Failed to generate caption"
- Ensure backend is running on `http://localhost:8000`
- Check browser console for CORS errors
- Verify image file format (JPG, PNG supported)

### Speech not working
- Check browser compatibility (Chrome/Edge recommended)
- Enable browser audio permissions
- Ensure device volume is up

### Layout issues on mobile
- Clear browser cache
- Update to latest React version
- Check responsive breakpoints

## 📦 Build for Production

```bash
# Create optimized production build
npm run build

# Serve locally to test
npx serve -s build
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [BLIP Model](https://github.com/salesforce/BLIP) by Salesforce Research
- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- Web Accessibility Initiative (WAI) for WCAG guidelines

## 📞 Support

For issues or questions:
- Open an [Issue](https://github.com/yourusername/ai-image-captioning-frontend/issues)
- Contact: your.email@example.com

---

**Made with ❤️ for accessibility**
