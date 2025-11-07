# 🎨 Serverless QR Code Generator

> Modern, production-ready QR code generator built with Next.js, AWS Lambda, and Terraform

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![Terraform](https://img.shields.io/badge/terraform-%235835CC.svg?style=for-the-badge&logo=terraform&logoColor=white)](https://www.terraform.io/)
[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

🔗 **Live Demo:** [https://lambda-qr.vercel.app](https://lambda-qr.vercel.app)

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
  - [Features](#-features)
  - [Architecture](#-architecture)
  - [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#-prerequisites)
  - [Quick Start](#-quick-start)
  - [Environment Variables](#-environment-variables)
- [Testing](#-testing)
- [Cost Estimation](#-cost-estimation)
- [Cleanup](#-cleanup)
- [Project Structure](#-project-structure)
- [What This Project Demonstrates](#-what-this-project-demonstrates)
- [Security](#-security)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)
- [Author](#-author)

---

## 🎯 About The Project

Modern, production-ready QR code generator built with Next.js, AWS Lambda, and Terraform. This serverless application demonstrates full-stack development with cloud infrastructure, providing instant QR code generation with automatic storage and sharing capabilities.

### ✨ Features

- ⚡ **Instant QR Generation** - Generate QR codes in milliseconds
- 🎨 **Customizable** - Adjust size (200-500px) and error correction level
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- 💾 **Automatic Storage** - QR codes saved to AWS S3 with public URLs
- 📥 **Download & Share** - Download PNG or copy direct image URL
- 🌐 **Serverless** - Zero maintenance, infinite scalability

### 🏗️ Architecture

```
User/Browser
    ↓
Next.js Frontend (Vercel)
    ↓
API Gateway (HTTPS)
    ↓
Lambda Function (Node.js 20.x)
    ↓
S3 Bucket (QR Images)
```

### 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| 🎨 **Frontend** | Next.js 15, React 19, Tailwind CSS v4, shadcn/ui, Lucide React |
| ⚡ **Backend** | AWS Lambda (Node.js 20.x), API Gateway, S3, qrcode library |
| 🏗️ **Infrastructure** | Terraform, GitHub, Vercel |

**Frontend:**
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Component library
- **Lucide React** - Icon system

**Backend:**
- **AWS Lambda** - Serverless compute (Node.js 20.x)
- **API Gateway** - RESTful API endpoint
- **S3** - Object storage for QR images
- **qrcode** - QR code generation library

**Infrastructure:**
- **Terraform** - Infrastructure as Code
- **GitHub** - Version control
- **Vercel** - Frontend hosting

---

## 🚀 Getting Started

### 📦 Prerequisites

Before you begin, ensure you have the following:

- ☁️ **AWS Account** - Free tier eligible
- 🛠️ **Terraform** >= 1.5
- 📦 **Node.js** >= 20.x
- 🔀 **Git**
- 🌐 **Vercel Account** (optional, for frontend hosting)

### 🚀 Quick Start

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/joobadam/lambda_qr.git
cd lambda_qr
```

#### 2️⃣ Backend Deployment (AWS)

```bash
# Install backend dependencies
cd backend
npm install
cd ..

# Deploy infrastructure with Terraform
cd terraform
terraform init
terraform plan
terraform apply

# Copy API endpoint from output
# Example: https://xxxxx.execute-api.eu-central-1.amazonaws.com/prod
```

#### 3️⃣ Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=<your-api-gateway-url>" > .env.local

# Development
npm run dev

# Production build
npm run build
npm start
```

Open http://localhost:3000

### 🌐 Environment Variables

**Frontend (`.env.local`):**

```env
NEXT_PUBLIC_API_URL=https://your-api-id.execute-api.eu-central-1.amazonaws.com/prod
```

> 💡 **Note**: `.env.local` is gitignored. Copy from `.env.example` and add your API URL.

---

## 🧪 Testing

### Test Backend API

```bash
curl -X POST https://your-api-gateway-url/prod/generate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "https://example.com",
    "size": 300,
    "errorCorrectionLevel": "M"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "qrCodeUrl": "https://qr-generator-xxxxx.s3.eu-central-1.amazonaws.com/qr-xxxxx.png",
  "text": "https://example.com",
  "size": 300,
  "errorCorrectionLevel": "M",
  "timestamp": "2025-10-17T20:00:00.000Z"
}
```

### Test Frontend

1. Open the application in browser
2. Enter any URL or text (max 2000 characters)
3. Select size and error correction level
4. Click "Generate QR Code"
5. Download or copy the QR image URL

---

## 💰 Cost Estimation

**AWS Free Tier:**
- ⚡ **Lambda:** 1M requests/month free
- 🌐 **API Gateway:** 1M API calls/month free (first 12 months)
- 🪣 **S3:** 5GB storage + 20k GET requests free

**Expected Monthly Cost:**
- Within free tier limits: **$0/month**
- After free tier (light usage): **~$0.50-$1/month**

**Vercel:**
- Free tier includes unlimited deployments

---

## 🧹 Cleanup

To remove all AWS infrastructure:

```bash
cd terraform
terraform destroy
```

> ⚠️ **Warning**: This will delete the S3 bucket and all QR codes stored in it.

---

## 📁 Project Structure

```
lambda_qr/
├── backend/
│   ├── handlers/
│   │   └── generateQR.js      # Lambda function handler
│   ├── utils/
│   │   └── s3.js              # S3 upload utility
│   └── package.json           # Backend dependencies
├── frontend/
│   ├── app/                   # Next.js App Router
│   ├── components/
│   │   ├── QRForm.jsx         # QR generation form
│   │   ├── QRDisplay.jsx      # QR display component
│   │   └── ui/                # shadcn/ui components
│   └── package.json           # Frontend dependencies
├── terraform/
│   ├── main.tf                # AWS infrastructure
│   ├── variables.tf           # Configuration variables
│   └── outputs.tf             # Output values
└── README.md
```

---

## 🎓 What This Project Demonstrates

### DevOps Skills

- ✅ **Infrastructure as Code** - Terraform for reproducible infrastructure
- ✅ **Serverless Architecture** - AWS Lambda, API Gateway, S3
- ✅ **Cloud Services** - AWS resource provisioning and management
- ✅ **CI/CD Ready** - Automated frontend deployment via Vercel
- ✅ **Security Best Practices** - IAM roles, least privilege, CORS configuration

### Development Skills

- ✅ **Modern Frontend** - Next.js 15 with App Router
- ✅ **API Integration** - RESTful API consumption
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Error Handling** - User-friendly error messages
- ✅ **State Management** - React hooks and modern patterns

---

## 🔒 Security

This project implements several security best practices:

- ✅ **IAM Roles** - Lambda has minimal S3 permissions (PutObject only)
- ✅ **CORS** - Configured for frontend origin
- ✅ **Environment Variables** - Sensitive data in `.env.local` (gitignored)
- ✅ **Public S3 Access** - Only for QR images (read-only via bucket policy)

---

## 🚧 Future Enhancements

- [ ] Custom domains for short URLs
- [ ] QR code analytics (scan tracking)
- [ ] Multiple color schemes
- [ ] Logo embedding in QR codes
- [ ] Bulk QR generation
- [ ] User authentication and history

---

## 📄 License

Distributed under the MIT License. See `LICENSE` file for more information.

---

## 👤 Author

**Adam Juhasz**
- 🐙 GitHub: [@joobadam](https://github.com/joobadam)
- 🌐 Portfolio: [adamjuhasz.com](https://www.adamjuhasz.com)

---

## 🙏 Acknowledgments

Built with modern tools and AWS services as a portfolio project demonstrating full-stack serverless development and DevOps practices.

---

<p align="right">(<a href="#-serverless-qr-code-generator">back to top</a>)</p>

**⭐ If you find this project useful, please consider giving it a star on GitHub!**
