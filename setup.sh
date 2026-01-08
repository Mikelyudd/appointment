#!/bin/bash

# 创建主要目录结构
mkdir -p frontend/src/{app/booking/{services,resource,time,confirm},components/{booking,ui},lib,types}
cd frontend

# 创建 app 目录下的文件
cat > src/app/layout.tsx << 'EOF'
import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'New Bliss Beauty - Appointment',
  description: 'Book your beauty services online',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
EOF

cat > src/app/page.tsx << 'EOF'
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/booking/services');
}
EOF

cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 173 80.4% 40%;
    --primary-foreground: 210 40% 98%;
  }

  body {
    @apply bg-background text-foreground;
  }
}

@layer components {
  .card {
    @apply bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow;
  }
}
EOF

# 创建预约相关页面
for page in services resource time confirm; do
  cat > src/app/booking/$page/page.tsx << EOF
'use client';

import { ${page^}Selection } from '@/components/booking/${page}-selection';

export default function ${page^}Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <${page^}Selection />
    </main>
  );
}
EOF
done

# 创建组件文件
cat > src/components/booking/service-card.tsx << 'EOF'
import type { Service } from '@/types';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onSelect: (service: Service) => void;
}

export function ServiceCard({ service, selected, onSelect }: ServiceCardProps) {
  return (
    <div
      className={cn(
        'card p-4 cursor-pointer',
        selected && 'border-primary'
      )}
      onClick={() => onSelect(service)}
    >
      <h3 className="font-medium">{service.name}</h3>
      <p className="text-sm text-gray-500">{service.duration}</p>
      <p className="mt-2 text-sm">{service.description}</p>
    </div>
  );
}
EOF

cat > src/components/booking/specialist-card.tsx << 'EOF'
import type { Specialist } from '@/types';
import { cn } from '@/lib/utils';

interface SpecialistCardProps {
  specialist: Specialist;
  selected?: boolean;
  onSelect: (specialist: Specialist) => void;
}

export function SpecialistCard({ specialist, selected, onSelect }: SpecialistCardProps) {
  return (
    <div
      className={cn(
        'card p-4 cursor-pointer',
        selected && 'border-primary'
      )}
      onClick={() => onSelect(specialist)}
    >
      <h3 className="font-medium">{specialist.name}</h3>
      <p className="text-sm text-gray-500">Code: {specialist.code}</p>
    </div>
  );
}
EOF

# 创建工具函数
cat > src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
EOF

cat > src/lib/api.ts << 'EOF'
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
});

export default api;
EOF

# 创建类型定义
cat > src/types/index.ts << 'EOF'
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  category: string;
}

export interface Specialist {
  id: string;
  code: string;
  name: string;
  avatar?: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  isAvailable: boolean;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
}

export interface BookingState {
  service: Service | null;
  specialist: Specialist | null;
  date: string | null;
  timeSlot: TimeSlot | null;
}
EOF

# 创建配置文件
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
EOF

cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
      },
    },
  },
  plugins: [],
}

export default config
EOF

cat > package.json << 'EOF'
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "axios": "^1.6.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.309.0",
    "next": "14.0.4",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwind-merge": "^2.2.0",
    "typescript": "^5.0.0",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.0.0"
  }
}
EOF

# 创建 TypeScript 配置
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# 创建 gitignore
cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOF
