import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_layout/(auth)/logout")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/(auth)/logout"!</div>
}
