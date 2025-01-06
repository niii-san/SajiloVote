import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="min-h-[800px]">Hello "/signup"!</div>
}
