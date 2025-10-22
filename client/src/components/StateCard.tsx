import React from 'react';
import type { LucideIcon } from 'lucide-react';
import Card from './ui/Card';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  trend?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
}) => {
  return (
    <div>
      <Card hover className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            {trend && (
              <p className="text-sm text-green-600 mt-1">{trend}</p>
            )}
          </div>
          <div className={`p-4 rounded-xl ${color}`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatCard;