import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ArrowLeft } from "lucide-react";

export default function Auth() {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/admin", { replace: true });
  }, [user, loading, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const fn = mode === "signin" ? signIn : signUp;
    const { error } = await fn(email, password);
    setBusy(false);
    if (error) {
      toast.error(error);
    } else if (mode === "signup") {
      toast.success("Account created. Check your email to verify, then sign in.");
      setMode("signin");
    } else {
      toast.success("Welcome back");
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-background">
      <div className="w-full max-w-md glass-strong rounded-3xl p-8 shadow-elegant animate-fade-up">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to portfolio
        </Link>
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary shadow-glow mb-4">
          <ShieldCheck className="h-7 w-7 text-white" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-1">Admin {mode === "signin" ? "Sign In" : "Sign Up"}</h1>
        <p className="text-sm text-muted-foreground mb-6">Manage projects, leads, and messages.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" disabled={busy} className="w-full bg-gradient-primary hover:opacity-90">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
