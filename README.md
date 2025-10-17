# 🎨 Serverless QR Code Generator

> Modern, production-ready QR code generator built with Next.js, AWS Lambda, and Terraform

![Demo](screenshot-placeholder.png)

🔗 **Live Demo:** https://your-vercel-url.vercel.app

---

## ✨ Features

- ⚡ **Instant QR Generation** - Generate QR codes in milliseconds
- 🎨 **Customizable** - Adjust size (200-500px) and error correction level
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- 💾 **Automatic Storage** - QR codes saved to AWS S3 with public URLs
- 📥 **Download & Share** - Download PNG or copy direct image URL
- 🌐 **Serverless** - Zero maintenance, infinite scalability

---

## 🏗️ Architecture

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

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Component library
- **Lucide React** - Icon system

### Backend
- **AWS Lambda** - Serverless compute (Node.js 20.x)
- **API Gateway** - RESTful API endpoint
- **S3** - Object storage for QR images
- **qrcode** - QR code generation library

### Infrastructure
- **Terraform** - Infrastructure as Code
- **GitHub** - Version control
- **Vercel** - Frontend hosting

---

## 📋 Prerequisites

- **AWS Account** - Free tier eligible
- **Terraform** >= 1.5
- **Node.js** >= 20.x
- **Git**
- **Vercel Account** (optional, for frontend hosting)

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/joobadam/lambda_qr.git
cd lambda_qr
```

### 2. Backend Deployment (AWS)

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

### 3. Frontend Setup

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

---

## 🌐 Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://your-api-id.execute-api.eu-central-1.amazonaws.com/prod
```

**Note:** `.env.local` is gitignored. Copy from `.env.example` and add your API URL.

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
- **Lambda:** 1M requests/month free
- **API Gateway:** 1M API calls/month free (first 12 months)
- **S3:** 5GB storage + 20k GET requests free

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

**Warning:** This will delete the S3 bucket and all QR codes stored in it.

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

- **IAM Roles:** Lambda has minimal S3 permissions (PutObject only)
- **CORS:** Configured for frontend origin
- **Environment Variables:** Sensitive data in `.env.local` (gitignored)
- **Public S3 Access:** Only for QR images (read-only via bucket policy)

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

MIT License - See [LICENSE](LICENSE) file for details

---

## 👤 Author

**Adam Juhasz**
- GitHub: [@joobadam](https://github.com/joobadam)
- Portfolio: [adamjuhasz.com](https://www.adamjuhasz.com)

---

## 🙏 Acknowledgments

Built with modern tools and AWS services as a portfolio project demonstrating full-stack serverless development and DevOps practices.

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**
