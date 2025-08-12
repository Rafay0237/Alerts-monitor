"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Copy, RefreshCw, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { ProjectDetailsProps } from "@/app/types/project";
import {
  regenerateAlertKey,
  reportCrash,
  deleteAlert,
  updateAlert,
} from "@/lib/api";
import { toast } from "sonner";

export function ProjectDetails({
  project,
  onProjectUpdated,
  onProjectDeleted,
}: ProjectDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const [form, setForm] = useState({
    projectName: project.projectName,
    email: project.email,
    limit: project.limit.toString(),
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRegeneratingKey, setIsRegeneratingKey] = useState(false);
  const [copiedState, setCopiedState] = useState<{ [key: string]: boolean }>(
    {}
  );

  const isChanged = useMemo(() => {
    return (
      form.projectName !== project.projectName ||
      form.email !== project.email ||
      form.limit !== project.limit.toString()
    );
  }, [form, project]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!isChanged) return;

    setIsLoading(true);
    setError("");
    try {
      const updatedProject = await updateAlert(project._id, {
        projectName: form.projectName,
        email: form.email,
        limit: Number(form.limit),
      });
      setIsEditing(false);
      onProjectUpdated?.(updatedProject.alert);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update project.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError("");
    try {
      await deleteAlert(project._id);
      onProjectDeleted?.();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete project.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateKey = async () => {
    setIsRegeneratingKey(true);
    setError("");
    try {
      const updatedProject = await regenerateAlertKey(project._id);
      onProjectUpdated?.(updatedProject.alert);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to regenerate key.");
    } finally {
      setIsRegeneratingKey(false);
    }
  };

  const copyToClipboard = (label: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState((prev) => ({ ...prev, [label]: true }));
    setTimeout(() => {
      setCopiedState((prev) => ({ ...prev, [label]: false }));
    }, 2000);
  };

  const handleTestAlert = async () => {
    try {
      await reportCrash(project.key);
      toast.success("Test alert sent!");
      onProjectUpdated?.({ ...project, count: project.count + 1 });
    } catch {
      toast.error("Failed to send test alert.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{project.projectName}</h1>
          <p className="text-muted-foreground">
            Created {formatDistanceToNow(new Date(project.createdAt))} ago
          </p>
        </div>

        {/* Actions */}
        {activeTab === "details" && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={!isChanged || isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Project
                </Button>
                <Dialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Project</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isLoading}
                      >
                        {isLoading ? "Deleting..." : "Delete Project"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Project Details</TabsTrigger>
          <TabsTrigger value="api">API Integration</TabsTrigger>
        </TabsList>

        {/* Project Details */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>
                View and edit your project details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["projectName", "email", "limit"].map((field) => (
                <div key={field} className="grid gap-2">
                  <Label htmlFor={field}>
                    {field === "projectName"
                      ? "Project Name"
                      : field === "email"
                      ? "Alert Email"
                      : "Alert Limit"}
                  </Label>
                  {isEditing ? (
                    <Input
                      id={field}
                      type={
                        field === "limit"
                          ? "number"
                          : field === "email"
                          ? "email"
                          : "text"
                      }
                      value={(form as any)[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      required
                      min={field === "limit" ? 1 : undefined}
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-muted/50">
                      {(form as any)[field]}
                    </div>
                  )}
                </div>
              ))}

              {/* Alert Count */}
              <div className="grid gap-2">
                <Label>Alert Count</Label>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      project.count >= project.limit ? "destructive" : "outline"
                    }
                  >
                    {project.count}/{project.limit}
                  </Badge>
                  {project.count >= project.limit && (
                    <span className="text-sm text-destructive">
                      Alerts Exceeded limit
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Integration */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Key</CardTitle>
              <CardDescription>
                Use this key to authenticate API requests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* API Key */}
              <div className="grid gap-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex">
                  <Input
                    id="apiKey"
                    value={project.key}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => copyToClipboard("apiKey", project.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {copiedState.apiKey && (
                  <p className="text-sm text-green-500">Copied!</p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={handleRegenerateKey}
                  disabled={isRegeneratingKey}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {isRegeneratingKey ? "Regenerating..." : "Regenerate Key"}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Warning: Regenerating will invalidate the old key.
                </p>
              </div>

              {/* Test Alert */}
              <div className="mt-6">
                <Button onClick={handleTestAlert} variant="outline">
                  Send Test Alert
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Triggers a test alert and increments your count.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start">
              <h3 className="text-sm font-medium mb-2">API Usage Example</h3>
              <div className="flex items-center gap-2 w-full">
                <pre className="bg-muted p-4 py-3 rounded-md text-sm overflow-x-auto w-full">
                  {`curl -X POST https://monitoring-alerts.vercel.app/alerts/report/${project.key}`}
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={() =>
                    copyToClipboard(
                      "curlCommand",
                      `curl -X POST https://monitoring-alerts.vercel.app/alerts/report/${project.key}`
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
                {copiedState.curlCommand && (
                  <p className="text-sm text-green-500 p-0.5 py-2">Copied!</p>
                )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
