# Contributing to Moltchain

Thank you for your interest in contributing to Moltchain! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)

### Suggesting Features

We welcome feature suggestions! Please:
- Check if the feature has already been suggested
- Clearly describe the feature and its benefits
- Explain how it aligns with Moltchain's mission

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- Foundry (for smart contract development)
- Git

### Installation

```bash
git clone https://github.com/moltchain/moltchain-core
cd moltchain-core
npm install
```

### Running Tests

```bash
# Smart contract tests
forge test

# SDK tests
npm run test:sdk

# All tests
npm test
```

### Code Style

- **Solidity**: Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- **TypeScript**: Use Prettier with our config
- **Commits**: Use conventional commit messages

### Testing

- Write tests for all new features
- Ensure all tests pass before submitting PR
- Aim for >80% code coverage

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions

### Unacceptable Behavior

- Harassment of any kind
- Discriminatory language or actions
- Personal attacks
- Publishing others' private information

## Getting Help

- **Technical Questions**: [GitHub Discussions](https://github.com/moltchain/moltchain-core/discussions)
- **General Chat**: [@molt_chain on Twitter](https://x.com/molt_chain)
- **Security Issues**: security@moltchain.xyz (do not open public issues)

## Recognition

Contributors will be:
- Listed in our Contributors section
- Eligible for community rewards
- Considered for core team roles

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for being part of Moltchain! 🦞
