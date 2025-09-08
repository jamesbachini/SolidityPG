# Solidity Playground (SolidityPG)

An AI-assisted smart contract development environment built with React + Vite + Tailwind CSS.

## 🚀 Features

- **Dark Mode IDE Interface**: Modern, developer-focused UI with resizable panels
- **Monaco Editor**: Full-featured code editor with Solidity syntax highlighting (planned)
- **Workflow-Based Development**: Guided stages from specification to deployment
- **AI-Assisted Development**: Chat interface for getting development guidance (planned)
- **Security-First Approach**: Built-in security checklist and best practices
- **Mobile Responsive**: Works on desktop and mobile devices

## 🏗️ Project Structure

```
src/
├── layout/              # Shell components (header, sidebar, navigation)
├── pages/              # Route pages for each workflow stage
├── components/         # Reusable UI components
├── config/            # Configuration files (prompts, constants)
├── utils/             # Utility functions and routing
└── styles/            # Global styles and Tailwind setup
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Monaco Editor** - Code editor component
- **Lucide React** - Icon library

### Future Dependencies (Planned)
- **jszip** - Project import/export functionality
- **file-saver** - File download utilities  
- **solc** - Solidity compiler integration

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/SolidityPG.git
cd SolidityPG
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📖 Workflow Stages

### 1. **Spec** - Contract Specification
- Define contract requirements and interfaces
- Specify user roles and permissions
- Identify security considerations
- Plan contract architecture

### 2. **Build** - Implementation
- Code contract functions with security patterns
- Implement access controls and guards
- Add comprehensive documentation
- Follow best practices for gas optimization

### 3. **Test** - Testing & Security
- Write comprehensive unit tests
- Perform security testing and audits
- Use property-based testing for invariants
- Follow the built-in security checklist

### 4. **Deploy** - Deployment
- Test on local networks first
- Deploy to testnets for validation
- Verify contracts on block explorers
- Set up monitoring and alerts

### 5. **Integrate** - Frontend Integration
- Generate TypeScript bindings
- Implement wallet connectivity
- Create contract interaction interfaces
- Build user-friendly frontends

## 🔧 Development Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🚀 Deployment to GitHub Pages

### Method 1: Manual Deployment

1. Build the project:
```bash
npm run build
```

2. The build output will be in the `dist/` folder.

3. Deploy the `dist/` folder to GitHub Pages:
   - Create a `gh-pages` branch
   - Copy the contents of `dist/` to the root of the `gh-pages` branch
   - Push the `gh-pages` branch to GitHub
   - Enable GitHub Pages in repository settings, using the `gh-pages` branch

### Method 2: GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Setup Pages
      uses: actions/configure-pages@v3
    
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: './dist'
    
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2
```

### GitHub Pages Configuration

1. Go to your repository settings
2. Navigate to **Pages** section
3. Set **Source** to "GitHub Actions"
4. Your site will be available at `https://yourusername.github.io/SolidityPG/`

## 🔮 Planned Features

### Core Functionality
- [ ] **Local Storage**: Persist projects and settings
- [ ] **AI Integration**: Connect with OpenAI/Anthropic APIs (BYO keys)
- [ ] **Solidity Compiler**: Integrate solc-js for compilation
- [ ] **File Management**: Import/export projects as ZIP files
- [ ] **Git Integration**: Initialize repositories and version control

### Advanced Features
- [ ] **Multi-file Projects**: Support for libraries and dependencies
- [ ] **Testing Framework**: Integrate Foundry-style testing
- [ ] **Deployment Tools**: Connect to Web3 wallets and deploy contracts
- [ ] **Template System**: Pre-built contract templates
- [ ] **Plugin System**: Extensible architecture for additional tools

### UI/UX Enhancements
- [ ] **Solidity Language Server**: Full IntelliSense support
- [ ] **Syntax Validation**: Real-time error checking
- [ ] **Themes**: Multiple editor themes and customization
- [ ] **Keyboard Shortcuts**: VS Code-style shortcuts

## 🤝 Contributing

This is currently a skeleton implementation. Contributions are welcome for:

1. **Core Features**: Implementing the planned functionality
2. **UI/UX**: Improving the interface and user experience
3. **Security**: Enhancing security patterns and checklists
4. **Documentation**: Improving guides and examples
5. **Testing**: Adding comprehensive tests

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Powerful code editor
- [OpenZeppelin](https://openzeppelin.com/) - Smart contract security patterns
- [Foundry](https://book.getfoundry.sh/) - Ethereum development toolkit inspiration
- [Vite](https://vitejs.dev/) - Lightning fast build tool

---

**Note**: This is a skeleton implementation focused on UI and workflow design. Core functionality like AI integration, compilation, and deployment are planned for future development.