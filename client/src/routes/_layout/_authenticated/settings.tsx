import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/_authenticated/settings")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/_authenticated/settings"!</div>
}
