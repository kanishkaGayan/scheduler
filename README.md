# TimeKeeper - Personal Task Scheduler

A modern React + TypeScript + Tailwind CSS task scheduling application built with Vite.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Vite** - Build Tool
- **Lucide React** - Icons (ready to use)

## Project Structure
```
src/
├── components/
│   ├── TimeBadge.tsx      # Deadline status indicator
│   └── TaskCard.tsx       # Task display card
├── types.ts               # TypeScript interfaces
├── App.tsx               # Main app component
├── main.tsx              # Entry point
└── index.css             # Tailwind styles
```

## Features
- **Task Cards** - Display tasks with priority and deadline
- **Time Badges** - Visual indicators for task urgency
  - Red + Pulse: < 24 hours
  - Orange: < 3 days
  - Green: > 3 days
  - Dark Red: Overdue
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Mock Data** - Pre-populated with sample tasks for UI testing

## Development
The app uses mock data for UI development. Database integration can be added later.
