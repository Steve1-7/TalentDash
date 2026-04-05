import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/authStore";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Code, Plus } from "lucide-react";

export default function SkillsPage() {
  const { toast } = useToast();
  const { user, updateProfile } = useAuthStore();
  const [skillInput, setSkillInput] = useState("");

  const skills = useMemo(() => user?.skills ?? [], [user?.skills]);

  const addSkill = () => {
    const next = skillInput.trim();
    if (!next) return;
    if (skills.some((s) => s.toLowerCase() === next.toLowerCase())) {
      toast({ title: "Already added", description: "That skill is already in your list." });
      return;
    }
    updateProfile({ skills: [...skills, next] });
    setSkillInput("");
    toast({ title: "Skill added", description: next });
  };

  const removeSkill = (skill: string) => {
    updateProfile({ skills: skills.filter((s) => s !== skill) });
    toast({ title: "Skill removed", description: skill });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skills</h1>
          <p className="text-sm text-muted-foreground mt-1">Track what you know and what you’re learning next.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              Your skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill (e.g. React, SQL, Figma)"
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
              />
              <Button variant="outline" onClick={addSkill}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {skills.length ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/10"
                    onClick={() => removeSkill(skill)}
                    title="Click to remove"
                  >
                    {skill} ×
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm font-medium">No skills yet</p>
                <p className="text-sm text-muted-foreground mt-1">Add a few skills to personalize recommendations.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

