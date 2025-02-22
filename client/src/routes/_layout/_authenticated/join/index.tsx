import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/_authenticated/join/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/_authenticated/join/"!</div>
}
