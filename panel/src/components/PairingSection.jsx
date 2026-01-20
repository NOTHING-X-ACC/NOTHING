import { useState } from "react";
import { Smartphone, Zap, Server, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PairingSection = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pairingCode, setPairingCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateCode = () => {
    if (!phoneNumber) return;
    setIsGenerating(true);
    // Simulate code generation
    setTimeout(() => {
      setPairingCode("ABC1-DEF2");
      setIsGenerating(false);
    }, 1500);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(pairingCode);
    setCopied(true);
    toast({
      title: "✅ Code Copied!",
      description: "Pairing code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="mb-8">
      <div className="card-cyber border-glow-strong max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold text-primary">WhatsApp Pairing</h3>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded border border-border bg-muted/50">
            <Server className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Server Alpha</span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">Generate your link code</p>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">
              Phone Number (with country code)
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="923XXXXXXXXX"
              className="w-full bg-muted/50 border border-border rounded px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          
          <button
            onClick={generateCode}
            disabled={!phoneNumber || isGenerating}
            className="w-full btn-cyber flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-4 h-4" />
            {isGenerating ? "Generating..." : "Get Pairing Code"}
          </button>

          {pairingCode && (
            <div className="mt-4 p-4 bg-primary/10 border border-primary rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Pairing Code:</p>
              <p className="text-2xl font-display font-bold text-primary text-glow tracking-widest">
                {pairingCode}
              </p>
              <button
                onClick={copyCode}
                className="mt-3 text-sm text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                {copied ? <Check className="w-4 h-4" /> : "📋"} 
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PairingSection;
