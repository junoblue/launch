# Launch Infrastructure Template

A comprehensive infrastructure template for deploying modern web applications on AWS.

## Project Structure

```
.
├── .github/workflows/    # GitHub Actions workflows
├── aws/infrastructure/   # AWS CDK infrastructure code
├── frontend/            # Frontend application code
├── backend/             # Backend application code
└── scripts/             # Utility scripts
```

## Prerequisites

- Node.js (v18 or later)
- AWS CDK CLI
- AWS CLI configured with appropriate credentials
- Docker (for containerized deployments)

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/your-org/launch-infrastructure-template.git
   cd launch-infrastructure-template
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure AWS credentials:
   ```bash
   aws configure
   ```

4. Deploy the infrastructure:
   ```bash
   cd aws/infrastructure
   cdk deploy
   ```

## Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
npm install
npm run dev
```

## Deployment

The infrastructure is deployed using AWS CDK. The deployment process is automated through GitHub Actions.

### Manual Deployment

To deploy manually:

```bash
cd aws/infrastructure
cdk deploy
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 