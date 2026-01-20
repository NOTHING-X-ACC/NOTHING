
import { Terminal } from "lucide-react";
import { Terminal, Monitor, Users } from "lucide-react";

const Header = () => {
return (
<header className="text-center py-8 relative">
<div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-primary/50 bg-primary/10 mb-4">
<span className="status-online"></span>
<span className="text-sm text-primary">SYSTEM ONLINE</span>
</div>

<div className="flex items-center justify-center gap-3 mb-2">  
    <Terminal className="w-8 h-8 text-primary" />  
    <span className="text-3xl text-primary">&gt;_</span>  
    <h1 className="text-3xl md:text-4xl font-display font-bold text-primary text-glow-strong tracking-wider">  
      BANDAHEALI-MINI  
    </h1>  
  </div>  
    
  <p className="text-muted-foreground text-sm tracking-widest mb-6">  
    WHATSAPP MULTI-DEVICE LINKER V2.0  
  </p>  
    
  <div className="flex items-center justify-center gap-4 flex-wrap">  
    <StatBadge icon="👥" value="33" label="TOTAL" />  
    <StatBadge icon="🖥️" value="0" label="ALPHA" />  
    <StatBadge icon="🖥️" value="23" label="BETA" highlight />  
    <StatBadge icon="🖥️" value="10" label="GAMMA" />  
    <StatBadge icon={<Users className="w-4 h-4 text-primary" />} value="33" label="TOTAL" />  
    <StatBadge icon={<Monitor className="w-4 h-4 text-muted-foreground" />} value="0" label="ALPHA" />  
    <StatBadge icon={<Monitor className="w-4 h-4 text-secondary" />} value="23" label="BETA" highlight />  
    <StatBadge icon={<Monitor className="w-4 h-4 text-muted-foreground" />} value="10" label="GAMMA" />  
  </div>  

  {/* Dots indicator */}  
  <div className="flex items-center justify-center gap-2 mt-4">  
    <span className="w-2 h-2 rounded-full bg-primary"></span>  
    <span className="w-2 h-2 rounded-full bg-muted-foreground/50"></span>  
  </div>  
</header>

);
};

const StatBadge = ({ icon, value, label, highlight = false }: { icon: string; value: string; label: string; highlight?: boolean }) => (
const StatBadge = ({ icon, value, label, highlight = false }: { icon: React.ReactNode; value: string; label: string; highlight?: boolean }) => (

  <div className={`flex items-center gap-2 px-3 py-1.5 rounded border ${highlight ? 'border-secondary bg-secondary/10' : 'border-border bg-muted/30'}`}>  
    <span>{icon}</span>  
    {icon}  
    <span className={`font-bold ${highlight ? 'text-secondary' : 'text-primary'}`}>{value}</span>  
    <span className="text-muted-foreground text-xs">{label}</span>  
  </div>  
);  export default Header;
