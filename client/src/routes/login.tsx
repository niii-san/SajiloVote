import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/login")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="min-h-[800px]">Hello from login!</div>
}
