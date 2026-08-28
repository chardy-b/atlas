import { AppShell } from "@/components/app-shell"
import { EmptyState } from "@/components/empty-state"
import { ErrorState } from "@/components/error-state"
import { LoadingState } from "@/components/loading-state"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ArrowRightIcon, FolderPlusIcon, RefreshCwIcon } from "lucide-react"

export default function Home() {
  return (
    <AppShell>
      <div className="max-w-3xl">
        <p className="text-sm font-medium text-muted-foreground">
          Default application template
        </p>
        <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          A practical starting point for the next small product.
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground">
          Use this foundation for personal tools, dashboards, AI applications,
          and prototypes. It keeps the interface neutral, accessible, and ready
          for deployment.
        </p>
      </div>

      <section
        id="examples"
        aria-labelledby="controls-heading"
        className="mt-10"
      >
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="controls-heading" className="text-lg font-semibold">
            Component examples
          </h2>
          <a
            href="/api/health"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Health endpoint
          </a>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Start with a focused interaction</CardTitle>
            <CardDescription>
              Local shadcn components use semantic design tokens and work in
              both themes.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input id="project-name" placeholder="Example tool" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-type">Starting point</Label>
              <Select defaultValue="tool">
                <SelectTrigger id="project-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tool">Personal tool</SelectItem>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="prototype">Prototype</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Button>
              Continue <ArrowRightIcon aria-hidden="true" />
            </Button>
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>
                Open dialog
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Example dialog</DialogTitle>
                  <DialogDescription>
                    Use dialogs for focused decisions, not routine navigation.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter showCloseButton />
              </DialogContent>
            </Dialog>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Create a folder"
                  />
                }
              >
                <FolderPlusIcon aria-hidden="true" />
              </TooltipTrigger>
              <TooltipContent>Create a folder</TooltipContent>
            </Tooltip>
          </CardFooter>
        </Card>
      </section>

      <section aria-labelledby="states-heading" className="mt-10">
        <h2 id="states-heading" className="mb-4 text-lg font-semibold">
          Reusable states
        </h2>
        <Tabs defaultValue="loading">
          <TabsList aria-label="State examples">
            <TabsTrigger value="loading">Loading</TabsTrigger>
            <TabsTrigger value="empty">Empty</TabsTrigger>
            <TabsTrigger value="error">Error</TabsTrigger>
          </TabsList>
          <TabsContent
            value="loading"
            className="mt-4 rounded-lg border border-border p-6"
          >
            <LoadingState label="Loading example content" />
          </TabsContent>
          <TabsContent value="empty" className="mt-4">
            <EmptyState
              title="No projects yet"
              description="Create a project when you are ready to start organizing work."
              action={
                <Button variant="outline">
                  <FolderPlusIcon aria-hidden="true" /> Create project
                </Button>
              }
            />
          </TabsContent>
          <TabsContent value="error" className="mt-4">
            <ErrorState
              title="Content could not load"
              message="This is a safe, user-facing message. Internal details stay on the server."
              action={
                <Button variant="outline">
                  <RefreshCwIcon aria-hidden="true" /> Try again
                </Button>
              }
            />
          </TabsContent>
        </Tabs>
      </section>
    </AppShell>
  )
}
