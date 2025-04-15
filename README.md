# Launch Application

A modern web application infrastructure template.

## Project Structure

```
.
├── frontend/          # Frontend application (React + TypeScript)
├── backend/          # Backend application (Python + FastAPI)
├── infrastructure/   # AWS infrastructure definitions
└── docs/            # Project documentation
```

## Prerequisites

- Node.js (v18 or later)
- Python 3.9+
- AWS CDK CLI
- AWS CLI

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd backend
   pip install -r requirements.txt
   ```

3. Configure AWS credentials
4. Deploy infrastructure:
   ```bash
   cd infrastructure
   cdk deploy
   ```

## Development

- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:8000`

## License

MIT 