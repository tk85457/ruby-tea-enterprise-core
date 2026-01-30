interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const StatsCard = ({ title, value, icon, trend, trendUp }: StatsCardProps) => {
  return (
    <div className="bg-[var(--bg-card)] p-6 rounded-xl shadow-md border border-[var(--border-color)] flex items-center space-x-4 backdrop-blur-md transition-colors duration-500">
      <div className={`p-4 rounded-full ${trendUp ? 'bg-green-100/10 text-green-500' : 'bg-amber-100/10 text-amber-500'}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-[var(--text-body)]/60 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-[var(--text-heading)]">{value}</p>
        {trend && (
          <p className={`text-xs font-medium mt-1 ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
