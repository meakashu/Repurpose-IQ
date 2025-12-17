# 🤝 Contributing to RepurposeIQ

Thank you for your interest in contributing to RepurposeIQ! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing Guidelines](#testing-guidelines)
8. [Documentation](#documentation)
9. [Community](#community)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. We pledge to:

- **Be respectful** of differing viewpoints and experiences
- **Accept constructive criticism** gracefully
- **Focus on what is best** for the community
- **Show empathy** towards other community members

### Our Standards

**Examples of behavior that contributes to a positive environment:**

✅ Using welcoming and inclusive language  
✅ Being respectful of differing viewpoints  
✅ Gracefully accepting constructive criticism  
✅ Focusing on what is best for the community  
✅ Showing empathy towards other community members  

**Examples of unacceptable behavior:**

❌ Trolling, insulting/derogatory comments, and personal attacks  
❌ Public or private harassment  
❌ Publishing others' private information without permission  
❌ Other conduct which could reasonably be considered inappropriate  

### Enforcement

Violations of the Code of Conduct will not be tolerated. Please report any concerns to: conduct@repurposeiq.com

---

## Getting Started

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/RepurposeIQ.git
   cd RepurposeIQ
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/RepurposeIQ.git
   ```

### Set Up Development Environment

Follow the [Installation Guide](../README.md#installation-guide) to set up your local environment.

```bash
# Install dependencies
npm run install-all
cd python-service && pip install -r requirements.txt && cd ..

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start development servers
npm run dev
```

### Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b docs/your-documentation-update
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or modifying tests
- `chore/` - Maintenance tasks

---

## Development Process

### 1. Find an Issue

- Browse [open issues](https://github.com/yourusername/RepurposeIQ/issues)
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to let others know you're working on it

### 2. Discuss Before Large Changes

For major changes:
1. Open an issue to discuss your proposal
2. Wait for feedback from maintainers
3. Get approval before starting work

### 3. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add tests for new features
- Update documentation as needed

### 4. Test Thoroughly

```bash
# Run all tests
npm run test-all-features

# Run specific test suites
npm test                    # Frontend tests
npm run test:backend        # Backend tests
pytest python-service/      # Python tests

# Test manually
npm run dev
```

### 5. Commit Your Changes

Follow our [commit guidelines](#commit-guidelines)

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## Coding Standards

### JavaScript/Node.js (Frontend & Backend)

**Style Guide**: We follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

**ESLint Configuration**:
```bash
# Run linter
npm run lint

# Auto-fix issues
npm run lint:fix
```

**Key Rules**:
- Use `const` and `let`, never `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Use destructuring when possible
- Use async/await instead of callbacks

**Example**:
```javascript
// ❌ Bad
var userName = user.name;
var userEmail = user.email;

// ✅ Good
const { name: userName, email: userEmail } = user;

// ❌ Bad
function fetchData(callback) {
  axios.get('/api/data')
    .then(res => callback(null, res.data))
    .catch(err => callback(err));
}

// ✅ Good
async function fetchData() {
  try {
    const response = await axios.get('/api/data');
    return response.data;
  } catch (error) {
    throw error;
  }
}
```

### Python (AI Agents)

**Style Guide**: We follow [PEP 8](https://peps.python.org/pep-0008/)

**Linting**:
```bash
# Install linters
pip install black flake8 mypy

# Format code
black python-service/

# Check style
flake8 python-service/

# Type checking
mypy python-service/
```

**Key Rules**:
- 4 spaces for indentation (no tabs)
- Max line length: 100 characters
- Use type hints
- Use docstrings for functions and classes
- Use snake_case for variables and functions

**Example**:
```python
# ❌ Bad
def fetchData(drugName):
    data=requests.get(f"/api/{drugName}")
    return data.json()

# ✅ Good
def fetch_data(drug_name: str) -> dict:
    """
    Fetch drug data from API.
    
    Args:
        drug_name: Name of the drug to query
        
    Returns:
        Dictionary containing drug data
        
    Raises:
        HTTPError: If API request fails
    """
    response = requests.get(f"/api/{drug_name}")
    response.raise_for_status()
    return response.json()
```

### React Components

**File Structure**:
```
components/
  ComponentName/
    ComponentName.jsx      # Component logic
    ComponentName.css      # Styles (if not using Tailwind)
    index.js              # Export
    ComponentName.test.jsx # Tests
```

**Component Template**:
```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * ComponentName - Brief description
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Title text
 */
const ComponentName = ({ title }) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Effect logic
  }, []);
  
  return (
    <div className="component-name">
      <h1>{title}</h1>
    </div>
  );
};

ComponentName.propTypes = {
  title: PropTypes.string.isRequired
};

ComponentName.defaultProps = {
  title: 'Default Title'
};

export default ComponentName;
```

---

## Commit Guidelines

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

**Examples**:

```bash
# Feature
git commit -m "feat(agents): add EXIM supply chain agent"

# Bug fix
git commit -m "fix(auth): resolve JWT token expiration issue"

# Documentation
git commit -m "docs(api): update API endpoint documentation"

# Multi-line with body
git commit -m "feat(dashboard): add real-time agent status visualization

- Add WebSocket connection for live updates
- Implement agent status cards
- Add loading states and error handling

Closes #123"
```

### Commit Best Practices

✅ **Do**:
- Write clear, concise commit messages
- Make atomic commits (one logical change per commit)
- Reference issue numbers when applicable

❌ **Don't**:
- Commit commented-out code
- Commit TODO comments without creating an issue
- Make commits with generic messages like "fix bugs" or "update code"

---

## Pull Request Process

### Before Submitting

1. **Sync with upstream**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all tests**:
   ```bash
   npm run test-all-features
   ```

3. **Update documentation**:
   - Update README.md if adding features
   - Add JSDoc/docstrings to functions
   - Update API.md if changing endpoints

4. **Self-review**:
   - Check for console.log() statements
   - Remove unnecessary comments
   - Verify code formatting

### PR Template

When creating a PR, use this template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #<issue_number>

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] All tests pass
- [ ] Added new tests for new features
- [ ] Manually tested in browser/terminal

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex sections
- [ ] Updated documentation
- [ ] No new warnings
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linters
2. **Code Review**: At least one maintainer reviews your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, a maintainer will merge your PR

### Addressing Review Feedback

```bash
# Make changes based on feedback
git add .
git commit -m "fix: address PR feedback"

# Push updates
git push origin feature/your-feature-name
```

---

## Testing Guidelines

### Writing Tests

#### Frontend (Jest + React Testing Library)

```javascript
// ComponentName.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('renders component with title', () => {
    render(<ComponentName title="Test Title" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
  
  it('handles button click', () => {
    const handleClick = jest.fn();
    render(<ComponentName onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Backend (Jest)

```javascript
// agentController.test.js
const request = require('supertest');
const app = require('../app');

describe('POST /api/agents/analyze', () => {
  it('should analyze drug query', async () => {
    const response = await request(app)
      .post('/api/agents/analyze')
      .send({ query: 'Analyze Metformin' })
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('analysisId');
  });
  
  it('should reject invalid query', async () => {
    const response = await request(app)
      .post('/api/agents/analyze')
      .send({ query: '' })
      .expect(400);
    
    expect(response.body.success).toBe(false);
  });
});
```

#### Python (pytest)

```python
# test_iqvia_agent.py
import pytest
from agents.iqvia_agent import IQVIAAgent

@pytest.fixture
def agent():
    return IQVIAAgent()

def test_iqvia_agent_execute(agent):
    state = {
        'drug_name': 'Metformin',
        'query': 'Analyze market trends'
    }
    
    result = await agent.execute(state)
    
    assert 'raw_data' in result
    assert 'insights' in result
    assert result['insights']['growth_signal'] in ['High', 'Medium', 'Low']

def test_iqvia_agent_error_handling(agent):
    state = {'drug_name': 'InvalidDrug'}
    
    with pytest.raises(ValueError):
        await agent.execute(state)
```

### Test Coverage

Aim for:
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Key user flows
- **E2E Tests**: Critical business workflows

```bash
# Check coverage
npm run test:coverage
pytest --cov=python-service/
```

---

## Documentation

### Code Documentation

**JavaScript (JSDoc)**:
```javascript
/**
 * Analyze drug repurposing opportunities
 * 
 * @param {string} drugName - Name of drug to analyze
 * @param {Object} options - Analysis options
 * @param {string} options.depth - Analysis depth (quick|standard|comprehensive)
 * @returns {Promise<Object>} Analysis results
 * @throws {ValidationError} If drugName is invalid
 * 
 * @example
 * const result = await analyzeDrug('Metformin', { depth: 'comprehensive' });
 */
async function analyzeDrug(drugName, options = {}) {
  // Implementation
}
```

**Python (Docstrings)**:
```python
def analyze_drug(drug_name: str, depth: str = 'standard') -> dict:
    """
    Analyze drug repurposing opportunities.
    
    Args:
        drug_name: Name of drug to analyze
        depth: Analysis depth - 'quick', 'standard', or 'comprehensive'
        
    Returns:
        Dictionary containing analysis results with keys:
        - 'insights': List of findings
        - 'recommendations': Next steps
        - 'confidence_score': 0-1 float
        
    Raises:
        ValueError: If drug_name is empty or invalid
        
    Example:
        >>> result = analyze_drug('Metformin', depth='comprehensive')
        >>> print(result['insights'])
    """
    pass
```

### README Documentation

When adding features, update:
- Main README.md (feature list)
- docs/API.md (if adding endpoints)
- docs/AGENTS.md (if adding agents)
- Installation guide (if adding dependencies)

---

## Community

### Get Help

- 💬 **Discord**: [Join our server](https://discord.gg/repurposeiq)
- 📧 **Email**: dev@repurposeiq.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/RepurposeIQ/issues)

### Stay Updated

- ⭐ Star the repository
- 👀 Watch for updates
- 📰 Follow our [blog](https://blog.repurposeiq.com)

### Recognition

Contributors are recognized in:
- [Contributors page](https://github.com/yourusername/RepurposeIQ/graphs/contributors)
- Release notes
- Project README

---

## License

By contributing to RepurposeIQ, you agree that your contributions will be licensed under the [MIT License](../LICENSE).

---

## Questions?

If you have any questions about contributing, feel free to:
- Open a [discussion](https://github.com/yourusername/RepurposeIQ/discussions)
- Ask in our Discord server
- Email the maintainers

**Thank you for contributing to RepurposeIQ! 🎉**
