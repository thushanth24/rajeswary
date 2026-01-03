import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

const StatCard = ({ title, value, icon: Icon, color, bgColor, trend, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="card-traditional overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{title}</p>
              <motion.p 
                className="text-3xl font-bold mt-1"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: delay + 0.1 }}
              >
                {value.toLocaleString()}
              </motion.p>
              {trend && (
                <p className={`text-xs mt-1 ${trend.isPositive ? 'text-green-600' : 'text-destructive'}`}>
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
                </p>
              )}
            </div>
            <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface RealTimeStatsProps {
  stats: {
    title: string;
    value: number;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    trend?: {
      value: number;
      isPositive: boolean;
    };
  }[];
}

const RealTimeStats = ({ stats }: RealTimeStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.title} {...stat} delay={index * 0.1} />
      ))}
    </div>
  );
};

export default RealTimeStats;
