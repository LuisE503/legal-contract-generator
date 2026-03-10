# Contributing to Legal Contract Generator

Thank you for considering contributing! 🎉

## How to Contribute

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create a branch** for your feature: `git checkout -b feature/my-feature`
4. **Make your changes** and test them
5. **Commit** with clear messages: `git commit -m "Add: new contract template for X"`
6. **Push** to your fork: `git push origin feature/my-feature`
7. **Open a Pull Request** against the `main` branch

## Adding New Templates

To add a new contract template:

1. Open `js/templates.js`
2. Add your template object following the existing pattern
3. Add translations for all 6 languages in `lang/*.json`
4. Test the template renders correctly in all languages

## Adding New Languages

1. Create a new `lang/{code}.json` file
2. Translate all keys from `lang/en.json`
3. Add the language option in `js/i18n.js`
4. Update `index.html` with the new `hreflang` link

## Code Style

- Use vanilla JavaScript (ES6+)
- Use CSS custom properties for theming
- Follow semantic HTML5 practices
- Ensure accessibility (ARIA labels, keyboard navigation)

## Reporting Bugs

Open an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS info
- Screenshots if applicable

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
