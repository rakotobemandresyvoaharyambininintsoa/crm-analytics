This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



# CRM PRO AI

## Intelligent Customer Relationship Management System powered by Artificial Intelligence

---

# Table of Contents

* Introduction
* Project Overview
* Problem Statement
* Proposed Solution
* Project Objectives
* Key Features
* Technologies Used
* Software Architecture
* Artificial Intelligence Architecture

---

# Introduction

CRM PRO AI is a next-generation Customer Relationship Management (CRM) platform designed to centralize customer management, sales opportunities, invoicing, inventory management, business analytics, and artificial intelligence within a single application.

Unlike traditional CRMs that simply store information, CRM PRO AI transforms operational data into actionable business intelligence. The platform assists organizations in making informed decisions by continuously analyzing customer behavior, sales performance, inventory movements, and financial activities.

The project has been developed using modern web technologies with Artificial Intelligence integrated from the beginning of the development process rather than being added as an isolated feature.

---

# Project Overview

CRM PRO AI was created to address one of the most common challenges faced by small and medium-sized businesses:

* Customer information scattered across multiple systems
* Manual follow-up of sales opportunities
* Limited visibility into business performance
* Difficulty identifying customer risks
* Lack of intelligent business recommendations
* Time-consuming inventory management
* Manual reporting and analysis

The platform centralizes these operations while providing intelligent insights generated through AI.

---

# Problem Statement

Many organizations still rely on spreadsheets or disconnected software solutions to manage customers, inventory, invoices, and business activities.

This often leads to:

* Duplicate customer records
* Missed sales opportunities
* Delayed customer follow-up
* Poor inventory visibility
* Manual reporting
* Slow decision-making
* Limited predictive capabilities

Managers frequently spend significant time collecting data instead of analyzing it.

CRM PRO AI addresses these challenges by combining operational management with intelligent decision support.

---

# Proposed Solution

CRM PRO AI provides a unified SaaS platform capable of managing the complete customer lifecycle while integrating Artificial Intelligence into everyday business workflows.

The system combines:

* Customer Relationship Management
* Sales Opportunity Management
* Product Management
* Inventory Management
* Invoice Management
* Business Analytics
* AI-powered Decision Support

The objective is not only to record business data but also to continuously analyze it to improve operational efficiency and strategic decision-making.

---

# Project Objectives

The primary objectives of CRM PRO AI are:

* Centralize all customer information.
* Improve customer relationship management.
* Optimize sales opportunity tracking.
* Monitor business performance in real time.
* Automate business analysis.
* Detect operational anomalies.
* Generate intelligent recommendations.
* Improve inventory control.
* Reduce manual administrative tasks.
* Support business growth using Artificial Intelligence.

---

# Key Features

## Customer Management

* Customer registration
* Customer profiles
* Customer scoring
* Contact information
* Business information
* Customer notes
* Customer history

---

## Opportunity Management

* Sales pipeline
* Opportunity tracking
* Revenue estimation
* Probability management
* Opportunity status monitoring

---

## Invoice Management

* Invoice creation
* Invoice tracking
* Payment status
* Due dates
* Tax management
* Discount management

---

## Inventory Management

* Product management
* Categories
* Suppliers
* Stock quantities
* Inventory movements
* Inventory sessions
* Stock adjustments
* Audit logs

---

## Analytics Dashboard

The Analytics module transforms operational data into business intelligence through interactive dashboards.

It provides:

* Revenue KPIs
* Customer statistics
* Opportunity analysis
* Invoice statistics
* Inventory indicators
* Product performance
* Business trends
* Visual charts

---

## AI Command Center

The AI Command Center is the intelligent core of the platform.

It continuously analyzes CRM data to provide:

* Daily business summaries
* Customer diagnostics
* Opportunity analysis
* Business recommendations
* Operational alerts
* Decision support
* Risk detection
* AI-generated insights

This module enables managers to quickly understand the current state of their business without manually reviewing hundreds of records.

---

# Technologies Used

## Frontend

* Next.js 16
* React 19
* TypeScript
* App Router
* Tailwind CSS
* Recharts
* Framer Motion

---

## Backend

* Next.js Route Handlers
* Prisma ORM
* SQLite
* Better SQLite3 Adapter

---

## Artificial Intelligence

* Fireworks AI
* Gemma
* Prompt Engineering

The platform currently uses Fireworks API for production inference while maintaining compatibility with AMD GPU infrastructure.

---

## Authentication

* bcryptjs
* Secure password hashing

---

## Database

The application uses Prisma ORM with SQLite.

The database contains modules dedicated to:

* Customers
* Products
* Suppliers
* Categories
* Opportunities
* Activities
* Invoices
* Invoice Lines
* Users
* Inventory Sessions
* Inventory Counts
* Inventory Adjustments
* Inventory Audits
* Inventory Parameters

---

# Software Architecture

The application follows the Next.js App Router architecture with a clear separation between public authentication routes and protected business modules.

```text
frontend/
│
├── app/
│
├── (auth)/
│   ├── login/
│   │   ├── page.tsx
│   │   └── layout.tsx
│
├── (dashboard)/
│   ├── layout.tsx
│   ├── dashboard/
│   ├── ai-command-center/
│   ├── analytics/
│   ├── clients/
│   ├── factures/
│   ├── inventaire/
│   ├── opportunites/
│   ├── parametres/
│   ├── rapports/
│   └── stock/
│
├── api/
├── components/
├── generated/
├── lib/
├── prisma/
├── public/
└── package.json
```

The project architecture separates authentication, business logic, API routes, database access, reusable UI components, and AI services, resulting in a scalable and maintainable codebase.

---

# Artificial Intelligence Architecture

Artificial Intelligence is integrated as a core component of CRM PRO AI.

The AI workflow follows this architecture:

```text
Business Data
        │
        ▼
 Prisma ORM
        │
        ▼
Data Preparation
        │
        ▼
Prompt Generation
        │
        ▼
Fireworks API
        │
        ▼
Gemma Model
        │
        ▼
AI Analysis
        │
        ▼
AI Command Center
```

Rather than replacing business logic, the AI layer enhances the platform by interpreting operational data and generating meaningful recommendations for business users.

The system is designed so that Artificial Intelligence becomes a daily decision-support assistant capable of analyzing customer activity, opportunities, financial performance, and inventory data.


# Installation Guide

## System Requirements

Before installing CRM PRO AI, ensure that the following software is available on your machine.

### Required Software

* Node.js 22 or later
* npm
* Git
* Docker Desktop (optional)
* Visual Studio Code (recommended)

---

# Clone the Repository

```bash
git clone https://github.com/your-username/crm-pro-ai.git

cd crm-pro-ai/frontend
```

---

# Install Dependencies

Install all project dependencies.

```bash
npm install
```

The installation includes all required packages such as:

* Next.js
* React
* TypeScript
* Prisma ORM
* SQLite Adapter
* Faker.js
* bcryptjs
* Recharts
* Framer Motion
* Lucide React

---

# Project Configuration

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL="file:./prisma/crm.db"

JWT_SECRET="your-secret-key"

FIREWORKS_API_KEY="your-fireworks-api-key"

FIREWORKS_MODE="mock"
```

The project can run in two AI modes:

* **Mock Mode** for local development and testing.
* **Production Mode** using Fireworks API for AI inference.

---

# Database

CRM PRO AI uses SQLite together with Prisma ORM.

Database schema:

```
prisma/
│
├── schema.prisma
├── seed.ts
└── crm.db
```

Prisma is responsible for:

* Database schema
* Migrations
* Type-safe queries
* Relationship management
* Data validation

---

# Generate Prisma Client

Generate the Prisma Client after installing dependencies.

```bash
npx prisma generate
```

---

# Apply Database Migrations

Create or update the database schema.

```bash
npx prisma migrate dev
```

If the database already exists:

```bash
npx prisma migrate deploy
```

---

# Seed the Database

CRM PRO AI includes a complete seed script that automatically generates realistic demonstration data.

The seed process creates:

* Administrator account
* Product categories
* Suppliers
* Products
* Customers
* Sales opportunities
* Invoices
* Invoice lines
* Inventory sessions
* Inventory movements
* Business analytics data

The project uses **@faker-js/faker** to generate realistic business information for demonstration purposes.

This allows evaluators and users to explore the platform with populated dashboards instead of an empty database.

Run the seed using:

```bash
npx prisma db seed
```

The seed script is located in:

```
prisma/seed.ts
```

It automatically creates coherent relationships between customers, products, invoices, inventory, and business analytics, providing a realistic demonstration environment.

---

# Running the Application

Start the development server.

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

# Authentication

The seed script automatically creates an administrator account.

Example:

```
Email:
admin@crm.com

Password:
admin123
```

These values can also be configured through environment variables before running the seed process.

For security reasons, production deployments should replace the default administrator credentials.

---

# Artificial Intelligence Configuration

The AI module supports two execution modes.

## Development Mode

```env
FIREWORKS_MODE="mock"
```

This mode generates simulated AI responses, allowing the complete CRM workflow to be tested without consuming API credits.

---

## Production Mode

```env
FIREWORKS_API_KEY="your_api_key"
```

When configured with a valid API key, the AI Command Center sends requests to Fireworks AI, which performs inference using Gemma models hosted on AMD GPU infrastructure.

---

# Docker Support

The project is designed to be containerized using Docker.

Main Docker files include:

```
Dockerfile

docker-compose.yml

.dockerignore
```

Once Docker is configured, the application can be built using:

```bash
docker compose build
```

and started with:

```bash
docker compose up
```

Docker ensures a reproducible development and deployment environment across different operating systems.

---

# Project Structure

```
frontend/
│
├── app/
├── components/
├── generated/
├── lib/
├── prisma/
├── public/
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

Each folder is organized according to the Next.js App Router architecture, ensuring modularity, maintainability, and scalability.

---

# Development Workflow

A typical development workflow follows these steps:

```text
Clone Repository
        │
        ▼
Install Dependencies
        │
        ▼
Generate Prisma Client
        │
        ▼
Run Database Migrations
        │
        ▼
Seed Database
        │
        ▼
Start Development Server
        │
        ▼
Open CRM PRO AI
        │
        ▼
Explore Analytics
        │
        ▼
Use AI Command Center
```

This workflow enables developers to reproduce the entire project locally with minimal configuration.



# Application Modules

CRM PRO AI is organized into multiple business modules. Each module is responsible for a specific business process while remaining fully integrated with the rest of the platform.

The objective is to provide a complete business management solution where every module contributes to a centralized data ecosystem.

---

# Authentication Module

Location:

```text
app/(auth)/
```

The authentication module controls access to the platform.

Main features include:

* Secure login
* Password hashing using bcryptjs
* User authentication
* Protected dashboard access
* Session management
* Role-based access preparation

Only authenticated users can access the business modules.

---

# Dashboard Module

Location:

```text
app/(dashboard)/dashboard/
```

The Dashboard serves as the application's main control center.

It provides an overview of the organization's operational status through business indicators.

Displayed information includes:

* Total customers
* Active customers
* Sales opportunities
* Revenue indicators
* Invoice statistics
* Product inventory
* Stock value
* Business summaries

The dashboard allows managers to monitor business performance without navigating through multiple modules.

---

# Customer Management Module

Location:

```text
app/(dashboard)/clients/
```

This module centralizes all customer-related information.

Main features:

* Customer registration
* Company information
* Contact information
* Customer scoring
* Business sector
* Geographic information
* Customer status
* Notes management
* Customer search
* Customer updates

Each customer is linked to activities, opportunities, and invoices.

This relationship provides a complete customer history within a single interface.

---

# Opportunity Management Module

Location:

```text
app/(dashboard)/opportunites/
```

The opportunity module manages the entire sales pipeline.

Main features:

* Opportunity creation
* Estimated revenue
* Success probability
* Sales status
* Customer association
* Pipeline monitoring

This module enables sales teams to monitor commercial activities and forecast future revenue.

---

# Invoice Management Module

Location:

```text
app/(dashboard)/factures/
```

The invoicing module manages financial transactions.

Features include:

* Invoice generation
* Invoice numbering
* Customer association
* Opportunity association
* Product line management
* VAT calculation
* Discount management
* Due date management
* Invoice status tracking

Invoices are directly connected to products and customers, ensuring financial consistency across the platform.

---

# Product Management Module

Location:

```text
app/(dashboard)/stock/
```

This module manages the company's products.

Each product contains:

* Reference
* Barcode
* Product name
* Category
* Supplier
* Brand
* Purchase price
* Selling price
* Current stock
* Alert threshold
* Storage location

The module also maintains stock movement history.

---

# Inventory Management Module

Location:

```text
app/(dashboard)/inventaire/
```

Inventory management is one of the platform's most advanced modules.

It allows organizations to perform structured inventory operations.

Features include:

* Inventory sessions
* Inventory counting
* Double counting support
* Inventory validation
* Stock comparison
* Inventory adjustments
* Inventory audits
* Inventory reports
* Responsible user assignment

The objective is to improve inventory accuracy while ensuring complete traceability.

---

# Analytics Module

Location:

```text
app/(dashboard)/analytics/
```

The Analytics module transforms operational data into visual business intelligence.

It continuously aggregates information from the entire CRM.

Business indicators include:

* Total customers
* Active customers
* Customer growth
* Revenue
* Sales opportunities
* Product performance
* Inventory value
* Paid invoices
* Unpaid invoices
* Monthly trends
* Business evolution

Interactive charts allow decision makers to quickly identify trends and anomalies.

The Analytics module provides a comprehensive view of organizational performance.

---

# AI Command Center

Location:

```text
app/(dashboard)/ai-command-center/
```

The AI Command Center is the platform's intelligent decision-support system.

Rather than simply displaying business data, it interprets information and generates recommendations.

The AI analyzes:

* Customer activity
* Customer inactivity
* Sales opportunities
* Revenue trends
* Invoice status
* Inventory data
* Business performance indicators

The AI generates:

* Daily summaries
* Operational diagnostics
* Customer recommendations
* Commercial insights
* Business alerts
* Strategic suggestions

The AI Command Center allows managers to understand the current state of the company without manually analyzing hundreds of records.

---

# Reports Module

Location:

```text
app/(dashboard)/rapports/
```

The reporting module consolidates business information into structured reports.

It is designed to support operational monitoring and executive decision-making.

Reports can summarize:

* Sales performance
* Customer activity
* Revenue
* Inventory
* Business indicators
* Financial information

This module complements the Analytics dashboard by providing organized business summaries.

---

# Settings Module

Location:

```text
app/(dashboard)/parametres/
```

The Settings module centralizes application configuration.

Current configuration includes:

* Inventory settings
* System parameters
* Business preferences
* Application options

The architecture allows future expansion without affecting the core application.

---

# Database Design

CRM PRO AI uses Prisma ORM to model business entities.

The database includes interconnected models such as:

* User
* Client
* Produit
* Categorie
* Fournisseur
* Opportunite
* Facture
* FactureLigne
* Mouvement
* InventaireSession
* InventaireLigne
* InventaireComptage
* InventaireAjustement
* InventaireAudit
* InventaireParametres

These relationships ensure data consistency while simplifying business operations.

---

# API Architecture

The application uses Next.js Route Handlers to expose server-side functionality.

The API layer is responsible for:

* Database access
* Business logic
* CRUD operations
* Data validation
* AI communication
* Analytics computation

Prisma acts as the abstraction layer between the application and the SQLite database.

---

# Application Workflow

The overall application workflow follows the sequence below:

```text
User
    │
    ▼
Authentication
    │
    ▼
Dashboard
    │
    ├───────────────┐
    ▼               ▼
CRM Modules     Analytics
    │               │
    └──────┬────────┘
           ▼
      Prisma ORM
           │
           ▼
      SQLite Database
           │
           ▼
 AI Command Center
           │
           ▼
 Fireworks AI
           │
           ▼
 Gemma Model
           │
           ▼
 AI Recommendations
```

This architecture ensures that operational data, analytics, and artificial intelligence remain fully connected while preserving a modular and maintainable system design.

---

# Design Philosophy

CRM PRO AI has been designed around three complementary layers:

**Operational Layer**

Responsible for managing business operations such as customers, invoices, products, inventory, and opportunities.

**Analytical Layer**

Responsible for transforming raw business data into dashboards, KPIs, and performance indicators.

**Intelligence Layer**

Responsible for interpreting business information using Artificial Intelligence in order to generate recommendations, diagnostics, and strategic insights.

By combining these three layers into a unified platform, CRM PRO AI provides a complete business management solution that goes beyond traditional CRM systems and demonstrates how Artificial Intelligence can be integrated into everyday enterprise workflows.





# Deployment

CRM PRO AI has been designed to be easily deployed in both development and production environments.

The project supports containerization through Docker, allowing a reproducible and portable execution environment.

A typical deployment workflow includes:

1. Clone the repository.
2. Install project dependencies.
3. Configure environment variables.
4. Generate the Prisma Client.
5. Apply database migrations.
6. Populate the database using the seed script.
7. Build the application.
8. Start the application.

The project can be deployed on modern cloud platforms supporting Node.js applications, such as Vercel, Railway, Render, or any Docker-compatible infrastructure.

---

# Artificial Intelligence Integration

Artificial Intelligence is not an isolated feature but an integral component of CRM PRO AI.

The AI layer continuously analyzes operational data collected throughout the platform.

The integration process follows these steps:

1. Business data is collected from CRM modules.
2. Prisma retrieves and structures the required information.
3. Context-aware prompts are generated.
4. Requests are sent to Fireworks AI.
5. Gemma processes the request.
6. AI-generated analyses are returned to the application.
7. Results are displayed in the AI Command Center.

This architecture enables the platform to provide intelligent recommendations without disrupting the existing business workflow.

---

# AMD GPU Compatibility

The project has been evaluated for execution on AMD GPU infrastructure.

The development process included:

* ROCm environment validation.
* AMD GPU compatibility testing.
* Evaluation of local Gemma execution.
* Integration with Fireworks AI infrastructure.

During experimentation, local execution of Gemma using the Transformers library encountered a low-level environment incompatibility while loading model weights.

To ensure a stable and production-ready solution, AI inference is currently performed through Fireworks AI, which hosts Gemma models on AMD GPU infrastructure.

This architecture guarantees reliable inference while remaining compatible with AMD technologies.

---

# Security

CRM PRO AI follows several security principles throughout the application.

Current security mechanisms include:

* Password hashing using bcryptjs.
* Protected authentication flow.
* Prisma ORM for safe database access.
* Type-safe database queries.
* Separation between authentication and business modules.
* Environment variable support for sensitive credentials.
* Modular architecture that simplifies future security enhancements.

Additional security features such as role-based authorization, audit improvements, and API protection can be integrated in future versions.

---

# Scalability

The platform has been designed using a modular architecture.

This allows new modules to be integrated without major modifications to the existing codebase.

Possible future extensions include:

* Marketing automation
* Email campaign management
* Customer segmentation
* Predictive sales forecasting
* AI-powered chatbot
* Financial forecasting
* Business workflow automation
* Multi-company management
* Multi-language support
* Multi-currency support
* PostgreSQL migration
* Cloud-native deployment
* Mobile application

The architecture provides a strong foundation for enterprise-scale evolution.

---

# Project Highlights

CRM PRO AI combines several business domains into a single platform:

* Customer Relationship Management
* Sales Opportunity Management
* Product Management
* Inventory Management
* Invoice Management
* Business Analytics
* Artificial Intelligence

Unlike traditional CRM systems, the platform does not simply store information.

It continuously analyzes operational data to generate business insights that support better decision-making.

The AI Command Center and Analytics modules work together to transform raw business data into meaningful recommendations and performance indicators.

---

# Future Improvements

Future development will focus on expanding the AI capabilities and strengthening enterprise features.

Planned improvements include:

* Real-time predictive analytics.
* Natural language querying of business data.
* AI-assisted report generation.
* Automated anomaly detection.
* Advanced forecasting models.
* Customer behavior prediction.
* Intelligent inventory optimization.
* AI-powered sales recommendations.
* Integration with ERP and accounting systems.
* Enhanced user management and permissions.

These improvements aim to transform CRM PRO AI into a comprehensive intelligent business management platform.

---

# Contributing

Contributions are welcome.

Developers interested in improving the project are encouraged to:

* Fork the repository.
* Create a feature branch.
* Implement improvements.
* Submit a pull request.

Bug reports, feature requests, and suggestions are also appreciated.

---

# License

This project is intended for educational, research, and demonstration purposes.

The source code may be adapted and extended according to the chosen license for the public repository.

---

# Acknowledgements

This project was developed as part of an Artificial Intelligence innovation initiative.

Special thanks to the open-source community and the technologies that made this project possible:

* Next.js
* React
* TypeScript
* Prisma ORM
* SQLite
* Tailwind CSS
* Recharts
* Framer Motion
* Fireworks AI
* Gemma
* AMD ROCm
* Faker.js

Their contributions have enabled the development of a modern, scalable, and intelligent CRM platform.

---

# Conclusion

CRM PRO AI demonstrates how Artificial Intelligence can be integrated into everyday business management rather than existing as a separate tool.

By combining CRM, inventory management, invoicing, analytics, and AI-powered decision support within a unified architecture, the platform provides organizations with a comprehensive environment for managing operations and making informed decisions.

The project illustrates the practical application of modern web technologies, data management, and generative AI to solve real business challenges.

CRM PRO AI is designed not only as a software solution but also as a foundation for future intelligent enterprise systems, where operational data, analytics, and Artificial Intelligence work together to improve productivity, efficiency, and strategic decision-making.
