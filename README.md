# Pankart - E-Commerce Frontend

A modern Next.js frontend for the Pankart e-commerce platform with user authentication, product browsing, shopping cart functionality, and secure payment processing via Stripe.

**Live Demo:** [https://pankart.vercel.app/](https://pankart.vercel.app/)

## Features

- **User Authentication**

  - Role-based access control (Admin, User)
  - Secure login and registration

- **Product Management**

  - Browse products with search and filter options
  - View detailed product information

- **Shopping Experience**

  - Add items to cart
  - Modify quantities
  - Complete checkout process

- **Payment Processing**

  - Secure payment integration with Stripe
  - Order history tracking

- **Admin Dashboard**
  - Manage products (add, delete)
  - Monitor inventory

## Technology Stack

- **Next.js** - React framework for building the user interface
- **Redux** - For state management
- **React Query** - For efficient data fetching and caching
- **Tailwind CSS** - For responsive and modern UI design
- **Shadcn/UI** - For ready-made UI components
- **Stripe Elements** - For secure payment UI components

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Stripe account for API keys

### Installation

1. Clone the repository

```
git clone https://github.com/lucky7xx/pankart.git
cd pankart
```

2. Install dependencies

```
npm install
```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Start the development server

```
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
├───app                     # Next.js app router
│   ├───admin               # Admin section
│   │   ├───dashboard       # Admin dashboard
│   │   └───products        # Product management
│   │       └───add         # Add new products
│   ├───api                 # API routes
│   │   └───logout          # Logout endpoint
│   ├───cart                # Shopping cart page
│   ├───checkout            # Checkout process
│   │   └───success         # Successful checkout page
│   ├───components          # Page-specific components
│   │   ├───auth            # Authentication components
│   │   ├───navbar          # Navigation components
│   │   └───products        # Product-related components
│   ├───context             # React context providers
│   ├───login               # Login page
│   ├───products            # Product browsing
│   │   └───[id]            # Product detail page
│   ├───profile             # User profile
│   │   └───orders          # Order history
│   └───register            # Registration page
├───components              # Shared components
│   └───ui                  # UI components (Shadcn)
├───lib                     # Utility functions
└───redux                   # Redux state management
    └───slices              # Redux slices for features
```

## Key Features Implementation

### Authentication

- Uses JWT for authentication
- Protected routes for authenticated users
- Role-based access control

### Product Browsing

- Server-side rendering for initial product load
- Client-side searching and filtering
- Optimized with React Query for caching

### Shopping Cart

- Redux-based state management
- Real-time quantity updates
- Stock validation

### Checkout Process

- Multi-step checkout form
- Address validation
- Secure Stripe payment integration

## Deployment

The application is deployed on Vercel and can be accessed at:
[https://pankart.vercel.app/](https://pankart.vercel.app/)

### Deployment Configuration

- **Platform:** Vercel
- **Production Branch:** main
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Environment Variables:** Configured in Vercel dashboard

## Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Stripe Documentation](https://stripe.com/docs)
