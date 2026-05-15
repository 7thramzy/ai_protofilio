import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsAdmin } from "@/components/admin/ProjectsAdmin";
import { LeadsAdmin } from "@/components/admin/LeadsAdmin";
import { MessagesAdmin } from "@/components/admin/MessagesAdmin";
import { SiteSettingsAdmin } from "@/components/admin/SiteSettingsAdmin";
import { SkillsAdmin } from "@/components/admin/SkillsAdmin";
import { ExperienceAdmin } from "@/components/admin/ExperienceAdmin";
import { CustomSectionsAdmin } from "@/components/admin/CustomSectionsAdmin";
import { Loader2, LogOut, ArrowLeft, LayoutDashboard } from "lucide-react";

export default function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="glass-strong rounded-3xl p-8 max-w-md text-center">
          <h1 className="font-display text-2xl font-bold mb-2">Not Authorized</h1>
          <p className="text-muted-foreground mb-6">This dashboard is for the site owner only.</p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
            <Button asChild className="bg-gradient-primary"><Link to="/">Back to portfolio</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 glass sticky top-0 z-30">
        <div className="container max-w-6xl flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold leading-tight">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/"><ArrowLeft className="h-4 w-4" /> Site</Link></Button>
            <Button variant="outline" size="sm" onClick={() => signOut()}><LogOut className="h-4 w-4" /> Sign Out</Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl py-8">
        <Tabs defaultValue="site" className="w-full">
          <TabsList className="glass mb-6 flex-wrap h-auto">
            <TabsTrigger value="site">Site</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="sections">Custom Sections</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          <TabsContent value="site"><SiteSettingsAdmin /></TabsContent>
          <TabsContent value="projects"><ProjectsAdmin /></TabsContent>
          <TabsContent value="skills"><SkillsAdmin /></TabsContent>
          <TabsContent value="experience"><ExperienceAdmin /></TabsContent>
          <TabsContent value="sections"><CustomSectionsAdmin /></TabsContent>
          <TabsContent value="leads"><LeadsAdmin /></TabsContent>
          <TabsContent value="messages"><MessagesAdmin /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
