# SMRI Shop - Full-Stack E-Commerce Website

SMRI Shop is a modern, full-stack e-commerce platform designed to provide a seamless shopping experience for users, robust management tools for sellers, and advanced controls for admins. With a sleek UI/UX, secure payments, and real-time interactions, this platform is optimized for SEO-friendly performance and scalability.
## 🚀 Key Features

### 🛍️ For Users::
- **🛒 Order Without Login : ** - Users can place orders without creating an account.
- **🔐 Secure Payments :** Integrated Stripe payment gateway for secure transactions.
- **💬 Real-Time Chat :** Chat functionality between users and admins for support and inquiries.
- **🔑 JWT Authentication:** Secure user authentication and authorization.
- **📱 Responsive Design :** Optimized for all devices using Tailwind CSS and Material-UI.
  

### 🛠️ For Admins:
- **📊 Admin Dashboard** Centralized admin dashboard to manage users, sellers, and orders.
- **✅ Seller Management:** Admins can approve, manage, and monitor seller accounts.
- **📦 Order Processing :** Confirm, track, and manage orders efficiently.
- **📈 Advanced Analytics :** Static charts and reports using MongoDB aggregation pipelines.

### 🏪 For Sellers:
- **📊 Seller Dashboard :** Sellers can manage their products, orders, and performance.
- **📦 Order Management:** Sellers can confirm and update order statuses.
- **📝 Product Management:** Add, update, and delete products with ease.

## ⚙️ Technologies Used

- **Frontend:** React, Vite, Tailwind CSS, Material-UI, Framer Motion , Daisy UI
- **Database:** Firebase Firestore
- **State Management:** TanStack Query (React Query)
- **Authentication:** Firebase Authentication, JWT
- **API Handling:** Axios
- **Payment Processing:** Stripe
- **State Management:** React Query
- **Charts & Analytics:** Recharts
- **SEO Optimization**:Meta Tags, Open Graph , react async helmet

## 🛠️ Installation & Setup

### 📌 Prerequisites :
Ensure you have the following installed:
- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **Firebase CLI** (for deployment)

### 🔻 Clone the Repository
```sh
git clone https://github.com/your-repo/smri-shop.git
cd smri-shop
```

### 📦 Install Dependencies
```sh
npm install
# or
yarn install
```

### 🔑 Setup Environment Variables
Create a `.env` file in the root directory and add the following values:
```env
VITE_LIVE_LINK=https://smri-server.vercel.app
VITE_API_KEY=your_api_key_here
VITE_AUTH_DOMAIN=your_auth_domain_here
VITE_PROJECT_ID=your_project_id_here
VITE_STORAGE_BUCKET=your_storage_bucket_here
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_APP_ID=your_app_id_here
VITE_BBIMAGE_API=your_bbimage_api_key_here
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
```

### ▶️ Run the Development Server
```sh
npm run dev
# or
yarn dev
```
This will start the development server at `http://localhost:5173/`.

### 🏗️ Build for Production
```sh
npm run build
# or
yarn build
```
This command generates the production-ready files in the `dist/` folder.

### 👀 Preview the Build
```sh
npm run preview
# or
yarn preview
```

## 🚀 Deployment

### ☁️ Deploy to Firebase
Ensure you have Firebase CLI installed and logged in.

```sh
firebase deploy
```
## 📂 Git Ignore File
Ensure sensitive files and unnecessary logs are ignored by adding the following to `.gitignore`:
```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules
dist
dist-ssr
*.local
.env.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

##👥 Contributors
- [Md Sabbir Mridha](https://github.com/S8374)

## 📧 Contact
For support or inquiries, contact us at `sabbirmridha880@gmail.com`.

---

Now you're all set to run, develop, and deploy SMRI Shop! 🚀
