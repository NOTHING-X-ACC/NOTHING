import { Battery, Clock, Globe, MapPin } from "lucide-react";

const SystemStatus = () => {
  const formattedDate = "Mon, Jan 19, 2026,";
  const formattedTime = "12:38:18 AM";

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="status-online"></span>
        <h2 className="text-sm font-medium text-muted-foreground tracking-wider">
          SYSTEM STATUS
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatusCard
          icon={<Battery className="w-4 h-4" />}
          label="BATTERY"
          value="79%"
          subtext="⚡ Not Charging"
          color="warning"
        />
        <StatusCard
          icon={<Clock className="w-4 h-4" />}
          label="DATE & TIME"
          value={formattedDate}
          subtext={formattedTime}
          color="secondary"
        />
        <StatusCard
          icon={<Globe className="w-4 h-4" />}
          label="IP ADDRESS"
          value="59.103.220.6"
          color="secondary"
        />
        <StatusCard
          icon={<MapPin className="w-4 h-4" />}
          label="LOCATION"
          value="Permission denied"
          color="destructive"
        />
      </div>
    </section>
  );
};

const StatusCard = ({
  icon,
  label,
  value,
  subtext,
  color = "primary",
}) => {
  const colorClasses = {
    primary: "text-primary border-primary/30",
    secondary: "text-secondary border-secondary/30",
    warning: "text-warning border-warning/30",
    destructive: "text-destructive border-destructive/30",
  };

  const valueColorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    warning: "text-warning",
    destructive: "text-destructive",
  };

  return (
    <div className={`card-cyber ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        {icon}
        <span className="text-xs tracking-wider">{label}</span>
      </div>
      <p className={`font-bold text-base ${valueColorClasses[color]}`}>
        {value}
      </p>
      {subtext && (
        <p
          className={`text-xs mt-1 ${
            color === "warning"
              ? "text-warning/70"
              : "text-muted-foreground"
          }`}
        >
          {subtext}
        </p>
      )}
    </div>
  );
};

export default SystemStatus;
